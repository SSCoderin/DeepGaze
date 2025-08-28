"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useParams } from "next/navigation";
import axios from "axios";
import { useUser } from "@clerk/nextjs";
import DisplayActivity from "../../_components/display-activity";
import { PlusCircle } from "lucide-react";
import Link from "next/link";

export default function NewActivity() {
  const { user } = useUser();
  const [selectType, setSelectType] = useState("");
  const ActivityType = useParams().type;
  const [paraData, setParaData] = useState({
    title: "",
    content: "",
  });
  const [codeData, setCodeData] = useState({
    question: "",
    code_content: "",
  });
  const handelParaData = async () => {
    if (paraData.title == "" || paraData.content == "") {
      alert("Please fill all the fields");
      return;
    }

    try {
      const response = await axios.post("/api/paragraph", {
        user_id: user.id,
        type: selectType,
        title: paraData.title.trim(),
        content: paraData.content,
      });
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }

    setParaData({
      title: "",
      content: "",
    });
  };
  const handelCodeData = async () => {
    if (codeData.question == "" || codeData.code_content == "") {
      alert("Please fill all the fields");
      return;
    }
    try {
      const response = await axios.post("/api/code", {
        user_id: user.id,
        type: selectType,
        question: codeData.question.trim(),
        code_content: codeData.code_content,
      });
      console.log(response.data);
    } catch (error) {
      console.log(error);
      console.log(error.response.data);
    }
    setCodeData({
      question: "",
      code_content: "",
    });
    window.location.reload();
  };

  useEffect(() => {
    setSelectType(ActivityType);
  }, []);

  return (
    <>
      {!user ? (
        "loading ... "
      ) : (
        <>
          <div className="flex flex-row items-center justify-between border-b">
            <h1 className="text-4xl font-bold px-10 py-8 ">
              New {ActivityType == "null" ? "" : selectType} Activity
            </h1>
            {selectType == "Paragraph" && (
              <Link
                href={"/dashboard/upload-paragraph"}
                className="cursor-pointer"
              >
                <Button className="mt-6 bg-blue-600 hover:bg-blue-700 cursor-pointer mr-10">
                  <PlusCircle className="mr-2 h-4 w-4" /> Create Paragraph Task
                </Button>
              </Link>
            )}
            {selectType == "Code" && (
              <Link href={"/dashboard/upload-code"} className="cursor-pointer">
                <Button className="mt-6 bg-blue-600 hover:bg-blue-700 cursor-pointer mr-10">
                  <PlusCircle className="mr-2 h-4 w-4" /> Create Code Task
                </Button>
              </Link>
            )}
          </div>

          <div className="flex flex-row px-10 py-6 gap-8">
            <div className="w-2/3 flex flex-col">
              {ActivityType == "null" && (
                <>
                  <div className="mb-6">
                    <h2 className="text-2xl font-semibold text-gray-800">
                      Select Activity Type
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                      Choose the type of activity you want to create
                    </p>
                  </div>
                  <div className="mb-8">
                    <Select onValueChange={(value) => setSelectType(value)}>
                      <SelectTrigger className="w-[280px] h-11">
                        <SelectValue placeholder="Select activity type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Paragraph">Paragraph</SelectItem>
                        <SelectItem value="Code">Code</SelectItem>
                        <SelectItem value="MCQ Question">
                          MCQ Question
                        </SelectItem>
                        <SelectItem value="Theory Question">
                          Theory Question
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}

              <div className="mt-4">
                {selectType === "Paragraph" && (
                  <div className="bg-white rounded-lg shadow-md border p-8 flex flex-col">
                    <div className="mb-6">
                      <h3 className="text-xl font-semibold text-gray-800 mb-3">
                        Paragraph Title
                      </h3>
                      <Input
                        onChange={(e) =>
                          setParaData({ ...paraData, title: e.target.value })
                        }
                        value={paraData.title}
                        placeholder="Enter a descriptive title"
                        className="w-full mt-1 h-12"
                      />
                    </div>
                    <div className="mb-8">
                      <h3 className="text-xl font-semibold text-gray-800 mb-3">
                        Paragraph Content
                      </h3>
                      <Textarea
                        value={paraData.content}
                        onChange={(e) =>
                          setParaData({ ...paraData, content: e.target.value })
                        }
                        placeholder="Enter or paste your paragraph content here..."
                        className="w-full mt-1 h-[150px] resize-none p-4"
                      />
                    </div>
                    <div className="flex gap-4 mt-8">
                      <Button
                        onClick={() => {
                          handelParaData();
                          window.location.reload();
                        }}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2.5 rounded-md font-medium cursor-pointer ml-auto transition-colors duration-200"
                      >
                        Save Activity
                      </Button>
                    </div>
                  </div>
                )}
                {selectType === "Code" && (
                  <div className="bg-white rounded-lg shadow-md border p-8 flex flex-col">
                    <div className="mb-6">
                      <h3 className="text-xl font-semibold text-gray-800 mb-3">
                        Question
                      </h3>
                      <Input
                        onChange={(e) =>
                          setCodeData({ ...codeData, question: e.target.value })
                        }
                        value={codeData.question}
                        placeholder="Enter a descriptive title"
                        className="w-full mt-1 h-12"
                      />
                    </div>
                    <div className="mb-8">
                      <h3 className="text-xl font-semibold text-gray-800 mb-3">
                        Code Content
                      </h3>
                      <Textarea
                        value={codeData.code_content}
                        onChange={(e) =>
                          setCodeData({
                            ...codeData,
                            code_content: e.target.value,
                          })
                        }
                        placeholder="Enter or paste your paragraph content here..."
                        className="w-full mt-1 h-[150px] resize-none p-4"
                      />
                    </div>
                    <div className="flex gap-4 mt-8">
                      <Button
                        onClick={() => {
                          handelCodeData();
                          
                        }}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2.5 rounded-md font-medium cursor-pointer ml-auto transition-colors duration-200"
                      >
                        Save Activity
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          {selectType == "Paragraph" && (
            <>
              <div className="flex flex-row justify-between ">
                <h1 className="text-2xl font-bold text-gray-800 px-10 py-6">
                  Previously Uploaded Paragraph
                </h1>
                <Link
                  href={"/dashboard/upload-paragraph"}
                  className="cursor-pointer"
                >
                  <Button className="mt-6 bg-blue-600 hover:bg-blue-700 cursor-pointer mr-10">
                    <PlusCircle className="mr-2 h-4 w-4" /> Create Paragraph
                    Task
                  </Button>
                </Link>
              </div>
              <DisplayActivity type={ActivityType} />
            </>
          )}
          {selectType == "Code" && (
            <>
              <div className="flex flex-row justify-between ">
                <h1 className="text-2xl font-bold text-gray-800 px-10 py-6">
                  Previously Uploaded Code Activities
                </h1>
                <Link
                  href={"/dashboard/upload-code"}
                  className="cursor-pointer"
                >
                  <Button className="mt-6 bg-blue-600 hover:bg-blue-700 cursor-pointer mr-10">
                    <PlusCircle className="mr-2 h-4 w-4" /> Create Code Task
                  </Button>
                </Link>
              </div>
              <DisplayActivity type={ActivityType} />
            </>
          )}
        </>
      )}
    </>
  );
}
