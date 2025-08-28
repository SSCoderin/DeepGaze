"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/nextjs";
import Header from "../components/Header";
import { FiHome, FiCalendar, FiList, FiSettings, FiPlus } from "react-icons/fi";
import Alltask from "./All-task/page";
import AllActivity from "./All-activity/page";

export default function DashboardLayout({ children }) {
  const [currentOption, setCurrentOption] = useState("Dashboard");
  const { user } = useUser();

  const sidebarOptions = [
    {
      name: "Dashboard",
      icon: <FiHome className="mr-3" size={18} />,
      active: currentOption === "Dashboard",
    },
    {
      name: "Created Task",
      icon: <FiCalendar className="mr-3" size={18} />,
      active: currentOption === "Created Task",
    },
    {
      name: "All Task Activities",
      icon: <FiList className="mr-3" size={18} />,
      active: currentOption === "All Task Activities",
    },
    {
      name: "Settings",
      icon: <FiSettings className="mr-3" size={18} />,
      active: currentOption === "Settings",
    },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="w-64 bg-gradient-to-b from-slate-900 to-slate-800 text-white flex flex-col">
        <div className="flex flex-col flex-grow p-4 ">
          <nav className="space-y-1 mt-2">
            {sidebarOptions.map((item, index) => (
              <Button
                key={index}
                variant={item.active ? "default" : "ghost"}
                className={`w-full justify-start text-sm py-2 px-3 rounded-lg mb-1 ${
                  item.active
                    ? "bg-blue-600 text-white"
                    : "text-slate-300 hover:text-white hover:bg-slate-700/50"
                }`}
                onClick={() => setCurrentOption(item.name)}
              >
                {item.icon}
                {item.name}
              </Button>
            ))}
          </nav>
        </div>
      </div>

      <div className="flex-grow overflow-auto">
        <Header />
        <main className="px-10 pt-10">
          <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
            <div className="p-6 flex items-center justify-between bg-gradient-to-r from-blue-500/10 to-purple-500/10">
              <div>
                <h3 className="text-xl font-bold text-slate-800">
                  Welcome back,{" "}
                  <span className="underline">{user?.fullName || "User"}</span>
                </h3>
                <p className="text-slate-600 mt-1">
                  AI-Powered Eye-Tracking Analysis Platform with smart content
                  analysis to help you to understand user behavior
                </p>
              </div>
            </div>
          </div>
          {currentOption === "Dashboard" && children}
          {currentOption === "Created Task" && <Alltask />}
          {currentOption === "All Task Activities" && <AllActivity />}
        </main>
      </div>
    </div>
  );
}
