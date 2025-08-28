"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { useUser } from "@clerk/nextjs";
import Task from "../../images/task.png";
import Codetask from "../../images/codetask.png";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Loading from "@/app/components/Loading";
export default function DisplayTask() {
  const { user } = useUser();
  const [paraData, setParaData] = useState([]);
  const [loading, setloading] = useState(true);
  const [codeData, setCodeData] = useState([]);
  useEffect(() => {
    GetAllTask();
  }, []);
  const GetAllTask = async () => {
    try {
      const resp = await axios.get(`/api/task?userId=${user.id}`);
      setParaData(resp.data.tasks.filter((item) => item.type === "Paragraph"));
      setCodeData(resp.data.tasks.filter((item) => item.type === "Code"));
    } catch (error) {
      console.log("error in get all task");
    }
    finally{
      setloading(false);
    }
  };
  return (
    <>
    {loading ? (<Loading />) : (
      <><div className="p-6">
        <h2 className="text-2xl font-bold text-green-600 mb-5">
          Paragraph Tasks
        </h2>
        <div>
          {paraData.length === 0 ? (
            <div className="text-center py-10">
              <h2 className="text-xl text-gray-600">
                You have not created any tasks yet!
              </h2>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {paraData.map((item, index) => (
                <div
                  key={index}
                  className="bg-purple-100 p-4 rounded-xl shadow-sm hover:shadow-md transition duration-300 border border-gray-200"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <Image
                      src={Task}
                      height={80}
                      width={80}
                      alt="Task icon"
                      className=" object-cover"
                    />
                    <h2 className="text-xl font-bold text-gray-800 line-clamp-2">
                      {item.task_title.split(" ").slice(0, 6).join(" ")}...
                    </h2>{" "}
                  </div>
                  <div className="flex justify-between mt-4 gap-2">
                    <Button
                      onClick={() => {
                        navigator.clipboard.writeText(item.url);
                        toast.success("URL copied successfully!");
                      }}
                      variant={"outline"}
                      className="flex-1 bg-white hover:bg-gray-100 text-gray-800  text-sm px-4"
                    >
                      Copy URL
                    </Button>
                    <Button
                      onClick={() =>
                        (window.location.href = `/dashboard/display-analysis/${item._id}`)
                      }
                      className="flex-1 bg-green-600 hover:bg-green-600 text-sm px-4"
                    >
                      Analysis →
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>{" "}
      <div className="p-6">
        <h2 className="text-2xl font-bold text-green-600 mb-5">
          Code Tasks
        </h2>
        <div>
          {codeData.length === 0 ? (
            <div className="text-center py-10">
              <h2 className="text-xl text-gray-600">
                You have not created any code tasks yet!
              </h2>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {codeData.map((item, index) => (
                <div
                  key={index}
                  className="bg-yellow-50 p-4 rounded-xl shadow-sm hover:shadow-md transition duration-300 border border-gray-200"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <Image
                      src={Codetask}
                      height={90}
                      width={90}
                      alt="Task icon"
                      className="object-cover"
                    />
                    <h2 className="text-xl font-bold text-gray-800 line-clamp-2">
                      {item.task_title.split(" ").slice(0, 6).join(" ")}...
                    </h2>{" "}
                  </div>
                  <div className="flex justify-between mt-4 gap-2">
                    <Button
                      onClick={() => {
                        navigator.clipboard.writeText(item.url);
                        toast.success("URL copied successfully!");
                      }}
                      variant={"outline"}
                      className="flex-1 bg-white hover:bg-gray-100 text-gray-800  text-sm px-4 cursor-pointer"
                    >
                      Copy URL
                    </Button>
                    <Button
                      onClick={() =>
                        (window.location.href = `/dashboard/display-analysis/${item._id}`)
                      }
                      className="flex-1 bg-green-600 hover:bg-green-600 text-sm px-4 cursor-pointer"
                    >
                      Analysis →
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>{" "}</>
      
    )}
      
    </>
  );
}
