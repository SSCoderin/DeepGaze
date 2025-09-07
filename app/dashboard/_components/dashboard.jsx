"use client";
import { Button } from "@/components/ui/button";
import { PlusCircle, FileText, Code, BookOpen, ListChecks } from "lucide-react";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import Loading from "@/app/components/Loading";

export default function DashboardPage() {
  const { user } = useUser();
  return (
    <>
      {!user ? (
        <Loading />
      ) : (
        <>
          <div className=" mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
            <Button
              onClick={() =>
                (window.location.href = "/dashboard/new-activity/null")
              }
              className="flex bg-green-600 hover:bg-green-700 cursor-pointer ml-auto"
            >
              <PlusCircle className="mr-2 h-4 w-4" /> Create New Activity
            </Button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden border border-gray-100">
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-800">
                        Create Paragraph Task
                      </h2>
                      <p className="mt-2 text-gray-600">
                        Add descriptive or explanatory text content.
                      </p>
                    </div>
                    <FileText className="text-blue-500 h-8 w-8" />
                  </div>
                  <div className="flex flex-row sm:flex-col lg:flex-row gap-4 mt-6 w-full">
                    <Link
                      href={"/dashboard/upload-paragraph"}
                      className="cursor-pointer w-full sm:w-auto"
                    >
                      <Button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 cursor-pointer">
                        <PlusCircle className="mr-2 h-4 w-4" /> Create Paragraph
                        Task
                      </Button>
                    </Link>
                    <Link
                      href={"/dashboard/new-activity/Paragraph"}
                      className="cursor-pointer w-full sm:w-auto"
                    >
                      <Button className="w-full sm:w-auto bg-green-600 hover:bg-green-700 cursor-pointer">
                        <PlusCircle className="mr-2 h-4 w-4" /> Create Paragraph
                        Activity
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden border border-gray-100">
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-800">
                        Create Code Task
                      </h2>
                      <p className="mt-2 text-gray-600">
                        Paste or upload code samples or programming-related
                        notes.
                      </p>
                    </div>
                    <Code className="text-blue-500 h-8 w-8" />
                  </div>
                  <div className="flex flex-row sm:flex-col lg:flex-row gap-4 mt-6 w-full">
                    <Link
                      href={"/dashboard/upload-code"}
                      className="cursor-pointer w-full sm:w-auto"
                    >
                      <Button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 cursor-pointer">
                        <PlusCircle className="mr-2 h-4 w-4" /> Create Code Task
                      </Button>
                    </Link>
                    <Link
                      href={"/dashboard/new-activity/Code"}
                      className="cursor-pointer w-full sm:w-auto"
                    >
                      <Button className="w-full sm:w-auto bg-green-600 hover:bg-green-700 cursor-pointer">
                        <PlusCircle className="mr-2 h-4 w-4" /> Create Code
                        Activity
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden border border-gray-100">
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-800">
                        Create Theory Questions task
                      </h2>
                      <p className="mt-2 text-gray-600">
                        "Enter questions or answers related to theoretical
                        concepts
                      </p>
                    </div>
                    <BookOpen className="text-blue-500 h-8 w-8" />
                  </div>
                  <Button className="mt-6 bg-blue-600 hover:bg-blue-700">
                    <PlusCircle className="mr-2 h-4 w-4" /> Create Theory
                    Questions task
                  </Button>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden border border-gray-100">
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-800">
                        Create MCQ Question Task
                      </h2>
                      <p className="mt-2 text-gray-600">
                        Enter a multiple choice question along with its options
                        and correct answer.
                      </p>
                    </div>
                    <ListChecks className="text-blue-500 h-8 w-8" />
                  </div>
                  <Button className="mt-6 bg-blue-600 hover:bg-blue-700">
                    <PlusCircle className="mr-2 h-4 w-4" /> Create MCQ Question
                    Task
                  </Button>
                </div>
              </div>
            </div>

            {/* <div className="mt-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Previously Created Task
        </h2>

        <div className="bg-gray-50 rounded-xl border border-gray-200  flex flex-col ">
         <DisplayTask/>
         
        </div>
      </div>
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          All Task Activities
        </h2>
        <div className="bg-gray-50 rounded-xl border border-gray-200  flex flex-col ">
        <DisplayActivity type={"null"} />
        </div>

      
      </div> */}
          </div>
        </>
      )}
    </>
  );
}
