import ReadingAnalysisVisualization from "@/app/demo/[flashcard]/_components/WordAnalysisDetail";
import CodeAnalysisDetail from "@/app/demo/[flashcard]/_components/CodeAnalysisDetail";
import axios from "axios";
import { useState,useEffect } from "react";
export default function StudentAnalysis({ student_analysis, taskContent }) {
    const [feedback, setFeedback] = useState();
 useEffect(() => {
    GetFeedBack();
  }, [student_analysis?._id]);
  const GetFeedBack = async () => {
    try {
      const feedbackResponse = await axios.get(
        `/api/finalfeedback?object_id=${student_analysis?._id}`
      );
      setFeedback(feedbackResponse.data.feedback);
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div className="mb-20 mt-8">

      <div className="px-10 py-4  mt-10 mb-10 rounded-2xl border-2 shadow-md border-gray-200 ">
        <h1 className="text-2xl text-blue-600 font-bold">
          {student_analysis?.student_name}
        </h1>
        <h2>{student_analysis?.student_email}</h2>
      </div>
      {taskContent[0].type === "Paragraph" && (
        <>
          {Object.keys(student_analysis?.analysis_data).map((index) => (
            <div
              key={index}
              className="px-10 py-4 mt-10 mb-10 rounded-2xl border-2 shadow-md border-gray-200 bg-orange-50"
            >
              <h2 className="text-3xl font-bold mb-6 underline text-green-500">
                {taskContent[index].title}
              </h2>
              <ReadingAnalysisVisualization
                para={taskContent[index].content}
                wordGazeData={student_analysis?.analysis_data[index]}
              />
            </div>
          ))}
        </>
      )}
      {taskContent[0].type === "Code" && (
        <>
     
          {Object.keys(student_analysis.analysis_data).map((index) => (
            <div
              key={index}
              className="px-10 py-4 mt-10 mb-10 rounded-2xl border-2 shadow-md border-gray-200 bg-orange-50"
            >
              <h2 className="text-3xl font-bold mb-6 underline text-green-500">
                {taskContent[index].question}
              </h2>
              <div className="border-2 border-gray-200 p-4 bg-gray-50 rounded-2xl flex flex-row">
                <div>
                  <h3 className="text-2xl font-bold mb-6 underline ">Code</h3>
                  {Object.entries(taskContent[index].codelines.code).map(
                    ([key, line], idx) => (
                      <div key={idx}>
                        <div>
                          <span className="font-bold pl-4">{key}</span>:{line}
                        </div>
                      </div>
                    )
                  )}
                </div>
                <div className="border-2 text-lg text-blue-500 border-gray-200 p-4 bg-white rounded-2xl ml-20 p-auto m-auto">
                  {taskContent[index].code_content
                    .split("\n")
                    .map((line, i) => (
                      <div key={i}>
                        {line.split("").map((char, j) => (
                          <span key={j}>{char === " " ? "\u00A0" : char}</span>
                        ))}
                      </div>
                    ))}
                </div>
              </div>
          
              <CodeAnalysisDetail
              student_answer={student_analysis?.student_answer[index]}
                code={[taskContent[index].codelines]}
                gaze={student_analysis.analysis_data[index]}
              />
              
            </div>
          ))}
        </>
      )}
      {taskContent[0].type === "Code" && (
        <div className="bg-white p-4 rounded-lg shadow my-8">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            Feedback Analysis
          </h3>

          <div className="grid grid-cols-1 gap-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="text-md font-semibold text-blue-800 mb-3">
                Student Feedback
              </h4>
              {feedback?.student_feedback?.map((feedback, index) => (
                <div
                  key={index}
                  className="space-y-2 border-2 border-blue-200 rounded-lg p-4 "
                >
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-gray-600 w-32">
                      Content:
                    </span>
                    <span className="text-sm text-gray-800 capitalize">
                      {feedback.contentTitle}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-gray-600 w-32">
                      Exam Level:
                    </span>
                    <span className="text-sm text-gray-800 capitalize">
                      {feedback.examlevel}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-gray-600 w-32">
                      Easy Concepts:
                    </span>
                    <span className="text-sm  bg-green-100 text-green-700 p-1">
                      {feedback.easyconcept}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-gray-600 w-32">
                      Hard Concepts:
                    </span>
                    <span className="text-sm  bg-red-100 text-red-700 p-1">
                      {feedback.hardconcept}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-gray-600 w-32">
                      Submitted:
                    </span>
                    <span className="text-sm text-gray-800">
                      {feedback.submittedAt}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="text-md font-semibold text-green-800 mb-3">
                AI Analysis
              </h4>
              {feedback?.ai_feedback.map((ai, index) => (
                <div
                  key={index}
                  className="space-y-2 border-2 border-green-200 rounded-lg p-4"
                >
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-gray-600 w-34">
                      Task:
                    </span>
                    <span className="text-sm text-gray-800">{ai.task}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-gray-600 w-34">
                      Exam Level:
                    </span>
                    <span className="text-sm text-gray-800 capitalize">
                      {ai.exam_level_analysis}
                    </span>
                  </div>
                  <div className="flex items-start">
                    <span className="text-sm font-medium text-gray-600 w-34">
                      Strengths:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {ai.strengths.map((strength, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs"
                        >
                          {strength}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-start">
                    <span className="text-sm font-medium text-gray-600 w-34">
                      need_improvement:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {ai.areas_for_improvement.map((strength, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs"
                        >
                          {strength}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-purple-50 p-4 rounded-lg">
              <h4 className="text-md font-semibold text-purple-800 mb-3">
                Student Conclusion
              </h4>
              <div className="space-y-2">
                <div className="flex items-center">
                  <span className="text-sm font-medium text-gray-600 w-32">
                    Rating:
                  </span>
                  <div className="flex items-center">
                    {[...Array(10)].map((_, idx) => (
                      <svg
                        key={idx}
                        className={`w-4 h-4 ${
                          idx < feedback?.student_conclusion.rating
                            ? "text-yellow-400"
                            : "text-gray-300"
                        }`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
                <div className="flex items-center">
                  <span className="text-sm font-medium text-gray-600 w-32">
                    Reason:
                  </span>
                  <span className="text-sm text-gray-800">
                    {feedback?.student_conclusion.resion}
                  </span>
                </div>
             
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
