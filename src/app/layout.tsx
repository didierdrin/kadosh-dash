import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
// hooks
import { AuthProvider } from "../components/authprovider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Kadosh - Dashboard",
  description: "Inventory, Delivery, and Customer management web platform for Kadosh ecommerce website.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
        {children}
        </AuthProvider>
        </body>
    </html>
  );
}
