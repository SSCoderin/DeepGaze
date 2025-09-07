"use client";
import axios from "axios";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import StudentAnalysis from "../../_components/student_analysis";
import Code from "../../../images/code.png";
import Loading from "@/app/components/Loading";
import Para from "../../../images/para.webp";
import Image from "next/image";
import DisplayIndividualContent from "../../_components/display_individual_content";

export default function DisplayAnalysis() {
  const [analysisData, setAnalysisData] = useState(null);
  const [view, setView] = useState(false);
  const [displayindivisual, setDisplayindivisual] = useState(true);
  const [handelStudent, setHandelStudent] = useState(null);
  const params = useParams();
  const id = params.id;

  useEffect(() => {
    getAnalysisData();
  }, [id]);

  const getAnalysisData = async () => {
    try {
      const response = await axios.get(`/api/analysis?taskId=${id}`);
      setAnalysisData(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  if (!analysisData) {
    return (
      <div>
        <Loading />
      </div>
    );
  }

  return (
    <>
      {view ? (
        <>
          <div className="flex flex-row gap-4 mt-8">
            <p
              onClick={() => setView(false)}
              className="text-3xl font-bold text-black cursor-pointer"
            >
              ←
            </p>
            <h1 className="text-3xl font-bold text-black">
              Student Analysis ({analysisData.task.task_content[0].type})
            </h1>
          </div>
          <StudentAnalysis
            student_analysis={handelStudent}
            taskContent={analysisData.task.task_content}
          />
        </>
      ) : (
        <>
          <div className="mb-20 mt-8">
            <h1 className="text-3xl font-bold text-blue-600 mb-6">
              {analysisData.task.task_title}{" "}
              <span className="text-gray-600">({analysisData.task.type})</span>
            </h1>

            {analysisData.task.type == "Paragraph" && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6 mb-10">
                  {analysisData.task.task_content.map((items, index) => (
                    <div
                      key={index}
                      className={`border-2 border-gray-300 rounded-2xl flex flex-row cursor-pointer `}
                    >
                      <Image src={Para} alt="image" width={100} height={50} />
                      <div className="mt-4 m-2">
                        <h1
                          className="font-bold text-gray-800 mb-2 text-2xl"
                          title={items.title}
                        >
                          {items.title.split(" ").slice(0, 10).join(" ")}..
                        </h1>
                        <p
                          className="text-gray-600"
                          title={items.content
                            .split(" ")
                            .slice(0, 30)
                            .join(" ")}
                        >
                          {items.content.split(" ").slice(0, 8).join(" ")}...
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
            {analysisData.task.type == "Code" && (
              <>
                {displayindivisual ? (
                  <>
                    <DisplayIndividualContent analysisData={analysisData} />
                  </>
                ) : (
                  <>""</>
                )}
              </>
            )}
            <h1 className="text-xl font-bold text-green-600 mb-6">
              Student Submited The Task
            </h1>
            <div>
              {analysisData.analysis.map((analysis_item, index) => (
                <div
                  key={index}
                  className=" flex flex-row items-center justify-between p-4 border-2 border-gray-200  shadow-md m-2 rounded-2xl"
                >
                  <div>
                    <h1>{analysis_item._id}</h1>
                    <h2 className="text-2xl font-bold text-blue-600">
                      {analysis_item.student_name}
                    </h2>
                    <p className="text-gray-600">
                      {analysis_item.student_email}
                    </p>
                  </div>
                  <div
                    onClick={() => {
                      setView(true);
                      setHandelStudent(analysis_item);
                    }}
                  >
                    <p className="text-3xl mr-10 text-green-600 text-bold cursor-pointer hover:text-blue-700">
                      →
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </>
  );
}
