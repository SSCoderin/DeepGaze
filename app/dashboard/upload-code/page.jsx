"use client";
import { Input } from "@/components/ui/input";
import DisplayActivity from "../_components/display-activity";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import Code from "../../images/code.png";
import Image from "next/image";
import axios from "axios";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"


export default function UploadCode() {
  const { user } = useUser();
  const [selectuploadActivity, setSelectUploadActivity] = useState([]);
  const [usertask, setUsertask] = useState({
    task_title: "",
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handelSelection = (Activity) => {
    if (selectuploadActivity.includes(Activity)) {
      setSelectUploadActivity(
        selectuploadActivity.filter((item) => item !== Activity)
      );
    } else {
      setSelectUploadActivity([...selectuploadActivity, Activity]);
    }
  };

  const HandelTaskSubmit = async () => {
    if (usertask.task_title == "") {
      toast.error("Please enter a task title");
      return;
    }
    
    if (selectuploadActivity.length === 0) {
      toast.error("Please select at least one paragraph");
      return;
    }
    
    try {
      const response = await axios.post("/api/task", {
        user_id: user.id,
        task_title: usertask.task_title,
        task_content: selectuploadActivity,
        type: "Code",
        url: `${window.location.origin}/student?user_id=${user.id}&task_title=${encodeURIComponent(usertask.task_title)}&type=Code`
      });
      if(response.data.success){
      toast.success("Task created successfully");

      setIsDialogOpen(true);}
      
    } catch (error) {
      console.log(error);
      toast.error("Failed to create task");
    }
  };


  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}/student?user_id=${user.id}&task_title=${encodeURIComponent(usertask.task_title)}&type=Code`);
      toast.success("URL copied to clipboard!");
    } catch (err) {
      toast.error("Failed to copy URL");
      console.error("Could not copy text: ", err);
    }
  };  
  return (
    <div>
      <div>
        <DisplayActivity
          type={"Code"}
          select={true}
          handlecallbackdata={handelSelection}
        />
      </div>

      <div className="flex flex-col bg-white rounded-2xl mx-10 p-10 mb-20">
        <div className="text-3xl font-bold text-gray-400 mb-4">
          Create Code Task
        </div>
        <div className="mb-4">
          <h1 className="text-lg font-semibold text-gray-800 mb-2">
           Code Task Title
          </h1>
          <Input
            onChange={(e) =>
              setUsertask({ ...usertask, task_title: e.target.value })
            }
            placeholder="Task Title"
            className="w-1/2 h-12 mb-10 border-2 border-gray-800"
          />
        </div>
        <div className="flex mb-6 p-5 border-1 border-blue-200 rounded-2xl justify-center text-gray-500">
          {selectuploadActivity.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {selectuploadActivity.map((items, index) => (
                  <div
                    key={index}
                    className={
                      `border-2 border-gray-300 rounded-2xl flex flex-row cursor-pointer ` +
                      (selectuploadActivity.includes(items)
                        ? "bg-green-100"
                        : "")
                    }
                  >
                    <Image src={Code} alt="image" width={100} height={50} />
                    <div className="mt-4 m-2">
                      <h1 className="font-bold text-gray-800 mb-2 text-2xl" title={items.question}>
                        {items.question.split(" ").slice(0, 4).join(" ")}
                      </h1>
                      <p className="text-gray-600" title={items.code_content.split(" ").slice(0, 30).join(" ")}>
                        {items.code_content.split(" ").slice(0, 8).join(" ")}...
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <h1>Select Code Activities To Create Task</h1>
          )}
        </div>
        <Button
          onClick={HandelTaskSubmit}
          className="bg-blue-500 hover:bg-blue-700 cursor-pointer ml-auto"
        >
          Submit & Generate URL
        </Button>
      </div>
      
      {/* URL Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Task URL Generated</DialogTitle>
            <DialogDescription>
              Your task has been created successfully. You can share this URL with others.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center space-x-2 mt-4">
            <div className="grid flex-1 gap-2">
              <Input
                className="w-full border-2 border-gray-300"
                value={`${window.location.origin}/student?user_id=${user.id}&task_title=${encodeURIComponent(usertask.task_title)}&type=Code`}
                readOnly
              />
            </div>
            <Button 
              type="button" 
              onClick={copyToClipboard}
              className="bg-blue-500 hover:bg-blue-700"
            >
              Copy
            </Button>
          </div>
          <div className="flex justify-end mt-4">
            <Button 
              type="button" 
              onClick={() => setIsDialogOpen(false) (window.location.href = "/dashboard")}
              className="bg-gray-200 text-gray-800 hover:bg-gray-300"
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}