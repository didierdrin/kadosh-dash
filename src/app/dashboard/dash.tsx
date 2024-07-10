// Homepage - dashboard/overview - Navigation guards
"use client";
import { useState } from "react";
import { FaUser, FaBell } from "react-icons/fa";
import React from "react";
import { useAuth } from "@/components/authprovider";
// Components
import Overviewpg from "@/components/overviewpg";

// Components for each page
//const Overview = () => Overviewpg;
const OngoingOrder = () => <div>Ongoing order</div>;
const Inventory = () => <div>Inventory</div>;
const RecentOrders = () => <div>Recent orders</div>;
const Advertise = () => <div>Advertisements</div>;
const Help = () => <div>Help</div>;
const Settings = () => <div>Settings</div>;

const ProfileCard = () => {
  return (
    <div className="flex items-center mr-3 p-5 h-[60px] w-auto rounded-md border border-slate-400 hover:bg-sky-50 hover:-translate-x-1 cursor-pointer">
      <img
        src="https://res.cloudinary.com/dezvucnpl/image/upload/v1711303384/two-removebg-preview_ttc7ev.png"
        alt="Profile"
        width={40}
        height={40}
      />
      <span className="ml-2">Name Sec.</span>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="ml-auto"
      >
        <path d="M5 12h14" />
        <path d="M12 5l7 7-7 7" />
      </svg>
    </div>
  );
};

export default function Home() {
  const { logout } = useAuth();
  const [currentPage, setCurrentPage] = useState("overview");
  const renderPage = () => {
    switch (currentPage) {
      case "overview":
        return <Overviewpg />;
      case "ongoingOrder":
        return <OngoingOrder />;
      case "inventory":
        return <Inventory />;
      case "recentOrders":
        return <RecentOrders />;
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
    <main className="flex min-h-screen items-start justify-around pl-8">
      {/* sidebar */}
      <div className="flex flex-col w-1/4 min-h-screen text-gray-500 border-r border-slate-400 pt-5">
        <a
          href="/"
          className="text-black font-bold text-2xl mb-5 cursor-pointer"
        >
          Kadosh
        </a>
        <ProfileCard />
        <a href="/" className="text-xs mt-3">
          MENU
        </a>
        <hr className="mx-3 mt-3 border-slate-300" />
        <a
          href="#"
          onClick={() => setCurrentPage("overview")}
          className="flex items-center space-x-2 mt-3 hover:text-teal-300"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
            />
          </svg>
          <span>Overview</span>
        </a>

        <a
          href="#"
          onClick={() => setCurrentPage("ongoingOrder")}
          className="flex items-center mt-1 space-x-2 hover:text-teal-300"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
            />
          </svg>
          <span>Ongoing order</span>
        </a>

        <a
          href="#"
          onClick={() => setCurrentPage("inventory")}
          className="flex items-center mt-1 space-x-2 hover:text-teal-300"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
            />
          </svg>
          <span>Inventory</span>
        </a>

        <a
          href="#"
          onClick={() => setCurrentPage("recentOrders")}
          className="flex items-center mt-1 space-x-2 hover:text-teal-500"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
          <span>Recent Orders</span>
        </a>
        <a
          href="#"
          onClick={() => setCurrentPage("advertise")}
          className="flex items-center mt-1 space-x-2 hover:text-teal-300"
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
              d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"
            />
          </svg>
          <span>Advertise</span>
        </a>
        <hr className="mx-3 mt-3 border-slate-300" />
        <a href="#" className="text-xs mt-3">
          PREFERENCES
        </a>
        <a
          href="#"
          onClick={() => setCurrentPage("help")}
          className="flex items-center space-x-2 mt-3 hover:text-teal-300"
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
              d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>Help</span>
        </a>
        <a
          href="#"
          onClick={() => setCurrentPage("settings")}
          className="flex items-center mt-1 space-x-2 hover:text-teal-300"
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
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          <span>Settings</span>
        </a>
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            logout();
          }}
          className="flex items-center float-end mb-3 space-x-2 hover:text-teal-300"
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
          <span>Logout</span>
        </a>
      </div>
      {/* Main window */}
      <div className="flex flex-col w-3/4">
        {/* header  textfield */}
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
            <FaUser className="bg-white h-8 w-8 p-2 border border-black rounded-lg hover:bg-black hover:text-teal-300 cursor-pointer" />
          </div>
        </div>
        {/* content section */}
        <div className="bg-slate-100 min-h-screen p-6">{renderPage()}</div>
      </div>
    </main>
  );
}
