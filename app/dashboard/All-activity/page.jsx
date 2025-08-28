"use client";
import DisplayActivity from "../_components/display-activity";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

export default function AllActivity() {
  return (
    <div className=" mx-auto px-4 py-8 ">
        <div className="flex items-start justify-between">
      <h1 className="text-3xl font-bold text-gray-800">All Task Activities</h1>
      <Button
        onClick={() => (window.location.href = "/dashboard/new-activity/null")}
        className="flex bg-green-600 hover:bg-green-700 cursor-pointer ml-auto"
      >
        <PlusCircle className="mr-2 h-4 w-4" /> Create New Activity
      </Button>
      </div>
      <DisplayActivity type={"null"} />
    </div>
  );
}
