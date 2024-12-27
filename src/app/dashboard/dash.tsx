
// Homepage - dashboard/overview - Navigation guards
"use client";
import { useState } from "react";
import { FaUser, FaBell, FaBars } from "react-icons/fa";
import React from "react";
import { useAuth } from "@/components/authprovider";
// Components
import Overviewpg from "@/components/overviewpg";
import Inventorypg from "@/components/inventorypg";
import OngoingOrderpg from "@/components/ongoingorderpg";
import RecentOrderspg from "@/components/recentorderspg";
import Advertise from "@/components/advertise";
import Help from "@/components/help";
import Settings from "@/components/settings";
import ProfileCard from "./profilecard";


export default function Home() {
  const { logout } = useAuth();
  const [currentPage, setCurrentPage] = useState("overview");
  const [collapsed, setCollapsed] = useState(false); // Sidebar collapse state

  const renderPage = () => {
    switch (currentPage) {
      case "overview":
        return <Overviewpg />;
      case "ongoingOrder":
        return <OngoingOrderpg />;
      case "inventory":
        return <Inventorypg setCurrentPage={setCurrentPage} />;
      case "recentOrders":
        return <RecentOrderspg />;
      case "advertise":
        return <Advertise />;
      case "help":
        return <Help />;
      case "settings":
        return <Settings />;
      default:
        return <Overviewpg />;
    }
  };

  return (
    <main className="flex min-h-screen">
      {/* Sidebar */}
      {/* Sidebar */}
<div
  className={`flex flex-col ${
    collapsed ? "w-16 space-y-5" : "w-1/4 space-y-4"
  } min-h-screen text-gray-500 border-r border-slate-400 pt-5 pl-5 transition-width duration-300 ease-in-out`}
>
  <div className="flex items-center justify-between mb-5">
    <a
      href="/"
      className={`text-black font-bold text-2xl cursor-pointer ${
        collapsed ? "hidden" : ""
      }`}
    >
      Shamayim
    </a>
    <button
      onClick={() => setCollapsed(!collapsed)}
      className="p-2 text-gray-500 hover:text-teal-500"
    >
      <FaBars />
    </button>
  </div>

  {!collapsed && <ProfileCard />}

  <a href="/" className={`text-xs mt-3 ${collapsed ? "hidden" : ""}`}>
    MENU
  </a>

  <hr className="mx-3 mt-3 border-slate-300" />

  {/* Sidebar Links */}
  {[
    { name: "overview", label: "Overview", icon: "home" },
    { name: "inventory", label: "Manage stock", icon: "boxes" },
    { name: "ongoingOrder", label: "Current orders", icon: "shopping-bag" },
    { name: "recentOrders", label: "Recent orders", icon: "clock" },
    { name: "advertise", label: "Advertise", icon: "megaphone" },
    { name: "help", label: "Claims", icon: "help-circle" },
    { name: "settings", label: "Settings", icon: "cog" },
  ].map((section) => (
    <a
      key={section.name}
      href="#"
      onClick={() => setCurrentPage(section.name)}
      className={`flex items-center space-x-2 mt-3 px-4 py-2 rounded-md ${
        currentPage === section.name
          ? "bg-teal-500 text-white"
          : "hover:bg-teal-100 hover:text-teal-500"
      }`}
    >
      
      {!collapsed && <span>{section.label}</span>}
    </a>
  ))}

  <hr className="mx-3 mt-3 border-slate-300" />

  <a
    href="#"
    onClick={(e) => {
      e.preventDefault();
      logout();
    }}
    className="flex items-center float-end mb-3 space-x-2 hover:text-red-500"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
      />
    </svg>
    {!collapsed && <span>Logout</span>}
  </a>
</div>

     
      {/* Main window */}
      <div className={`flex flex-col ${collapsed ? "w-full" : "w-3/4"} transition-width duration-300 ease-in-out`}>
        {/* Header  */}
        <div className="flex items-center justify-between m-2">
          <div className="relative mx-8">
            <input
              type="text"
              placeholder="Search"
              className="text-slate-500 text-[20px] cursor-pointer border border-blue-200 focus:outline-none focus:ring-2 focus:ring-teal-500 rounded-sm w-[600px] py-1 px-10 pr-12"
            />
            <svg
              className="absolute cursor-pointer right-3 top-1/2 transform -translate-y-1/2 h-6 w-6 text-teal-500 hover:text-teal-800"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <div className="flex space-x-8 mr-8">
            <FaBell className="bg-white h-8 w-8 p-2 border border-black rounded-lg hover:bg-black hover:text-teal-300 cursor-pointer" />
            {/* <FaUser className="bg-white h-8 w-8 p-2 border border-black rounded-lg hover:bg-black hover:text-teal-300 cursor-pointer" /> */}
          </div>
        </div>
        {/* Content Section */}
        <div className="bg-slate-100 min-h-screen p-6">{renderPage()}</div>
      </div>
    </main>
  );
}



