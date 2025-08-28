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
  const [TopicData, setTopicData] = useState(null);
  const [DeepGaze, SetDeepGaze] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userTaskDone, setUserTaskDone] = useState(false);

  const userId = searchParams.get("user_id");
  const taskTitle = searchParams.get("task_title");
  const type = searchParams.get("type");
  const { user } = useUser();

  const CheckTaskDoneByuser = async (taskId) => {
    try {
      const checkResponse = await axios.get(`/api/analysis?taskId=${taskId}`);
      console.log(checkResponse.data);
      if (checkResponse.data.analysis?.some(item => item.student_email === user?.emailAddresses[0]?.emailAddress)) {
        setUserTaskDone(true);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to check task status");
    } finally {
      setLoading(false);
    }
  };
  const GetTopicData = async () => {
    try {
      const response = await axios.post("/api/selectedtask", {
        user_id: userId,
        task_title: taskTitle,
        type: type,
      });

      setTopicData(response.data.task);
      if (response.data.task?._id) {
        await CheckTaskDoneByuser(response.data.task._id);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch topic data");
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId && taskTitle && type) {
      GetTopicData();
    } else {
      setLoading(false);
    }
  }, [userId, taskTitle, type]);

  if (!user || loading) {
    return <Loading />;
  }

  if (!TopicData) {
    return <div>No topic data available</div>;
  }

  if (DeepGaze) {
    if (TopicData.type === "Paragraph") {
      return <DeepgazeTask taskData={TopicData} />;
    }
    if (TopicData.type === "Code") {
      return <CodegazeTask taskData={TopicData} />;
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
          <h1 className="text-3xl font-bold text-gray-800 mb-">
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
            {userTaskDone ? (
              ""
            ) : (
              <Button
                onClick={() => SetDeepGaze(true)}
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
