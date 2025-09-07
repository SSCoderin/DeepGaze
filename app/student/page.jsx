"use client";
import { Button } from "@/components/ui/button";
import Header from "../components/Header";
import { useSearchParams } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import axios from "axios";
import DeepgazeTask from "./_components/deepgazetask";
import CodegazeTask from "./_components/codegazetask";
import Loading from "../components/Loading";
import { toast } from "sonner";

export default function Student() {
  const searchParams = useSearchParams();
  const [topicData, setTopicData] = useState(null);
  const [deepGaze, setDeepGaze] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userTaskDone, setUserTaskDone] = useState(false);

  const userId = searchParams.get("user_id");
  const taskTitle = searchParams.get("task_title");
  const type = searchParams.get("type");
  const { user } = useUser();

  const checkTaskDoneByUser = async (taskId) => {
    if (!user) return; 
    try {
      const userEmail = user.emailAddresses[0]?.emailAddress;
      const response = await axios.get(`/api/analysis?taskId=${taskId}`);
      
      if (response.data?.analysis) {
        const isTaskCompleted = response.data.analysis.some(
          (item) => item.student_email === userEmail
        );
        if (isTaskCompleted) {
          setUserTaskDone(true);
          setTopicData(null)
        }
      }
    } catch (error) {
      console.error("Failed to check task status:", error);
      toast.error("Could not verify task completion status.");
    }
  };

  const getTopicData = async () => {
    try {
      setLoading(true); 
      const response = await axios.post("/api/selectedtask", {
        user_id: userId,
        task_title: taskTitle,
        type: type,
      });

      const task = response.data.task;
      setTopicData(task);

      if (task?._id) {
        await checkTaskDoneByUser(task._id);
      }
    } catch (error) {
      console.error("Failed to fetch topic data:", error);
      toast.error("Failed to fetch topic data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && userId && taskTitle && type) {
      getTopicData();
    } else if (!userId || !taskTitle || !type) {
        setLoading(false);
    }
  }, [user, userId, taskTitle, type]);

  if (loading) {
    return <Loading />;
  }

  if (!userId || !taskTitle || !type) {
      return (
          <div className="flex justify-center items-center h-screen">
              <div className="text-center">
                  <h2 className="text-2xl font-bold mb-2">Missing Information</h2>
                  <p>Task details are missing from the URL. Please use a valid link.</p>
              </div>
          </div>
      );
  }



  if (deepGaze) {
    if (topicData.type === "Paragraph") {
      return <DeepgazeTask taskData={topicData} />;
    }
    if (topicData.type === "Code") {
      return <CodegazeTask taskData={topicData} />;
    }
  }

  return (
    <div className="flex flex-col h-screen">
      <Header />
      <div className="mt-20 flex flex-col justify-center items-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Topic</h1>
        <h1 className="text-4xl font-bold text-blue-800 underline">
          {taskTitle}
        </h1>
      </div>
      {userTaskDone && (
        <div className="text-lg font-semibold text-green-600 bg-green-100 px-6 py-3 rounded-lg border mt-6 mx-auto">
          ✓ You have already completed this task
        </div>
      )}
      <div className="h-full flex justify-center items-center">
        <div className="p-12 border-2 border-gray-300 shadow-md rounded-2xl">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Welcome, {user.fullName}!
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            You are currently logged in as a student.
          </p>
          <h1 className="mb-2 font-bold text-gray-800 text-xl">
            Name: <span className="text-blue-500">{user.fullName}</span>
          </h1>
          <h1 className="mb-4 font-bold text-gray-800 text-xl">
            Email:{" "}
            <span className="text-blue-500">
              {user.emailAddresses[0].emailAddress}
            </span>
          </h1>
          <div className="flex justify-end mt-6">
            {!userTaskDone && (
              <Button
                onClick={() => setDeepGaze(true)}
                className="bg-green-600 hover:bg-green-700 px-6"
              >
                Start →
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}