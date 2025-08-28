
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { toast } from "sonner";

export default function CodeFeedback({
  objectid,
  taskData,
  student_answer,
  analysisData,
  feedbackData,
}) {
  const [loading, setLoading] = useState(false);
  const [AIfeedback, setAIfeedback] = useState();
  const [studentconclusion, setstudentconclusion] = useState({
    rating: 0,
    resion: "",
  });
  const [displayfeedback, setdisplayfeedback] = useState(false);
  const [filteredData, setFilteredData] = useState([]);
  const [currentContentIndex, setCurrentContentIndex] = useState(0);

  useEffect(() => {
    filterData();
  }, []);

  const filterData = () => {
    if (!analysisData) return;

    const compactData = Object.entries(analysisData).map(([index, events]) => {
      const idMap = {};

      events.forEach((ev) => {
        if (!ev.id) return;
        if (!idMap[ev.id]) {
          idMap[ev.id] = {
            id: ev.id,
            duration: 0,
            timestamp: ev.timestamp,
          };
        }

        idMap[ev.id].duration += ev.duration || 0;
      });

      const combinedElements = Object.values(idMap);

      return {
        index,
        totalEvents: events.length,
        totalDuration: combinedElements.reduce(
          (sum, ev) => sum + ev.duration,
          0
        ),
        elements: combinedElements,
      };
    });

    setFilteredData(compactData);
    console.log("Compact Combined Analysis Data:", compactData);
  };

  const HandleFeedbackSubmit = async () => {
    setLoading(true);
    try {
      console.log("Sending feedback...", taskData.task_content, filteredData);
      const AIresponse = await axios.post("/api/aifeedback", {
        taskdata: taskData.task_content,
        analysisData: filteredData,
      });
      console.log(AIresponse.data);
      setAIfeedback(
        JSON.parse(
          AIresponse.data.AIAnalysis.replace("```json\n", "")
            .replace("```\n1", "")
            .replace("```\n", "")
        )
      );
      if (AIresponse.data.success) {
        toast.success("Feedback submitted successfully");
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to submit feedback");
    } finally {
      setLoading(false);
      setdisplayfeedback(true);
    }
  };

  const handleConclusionSubmit = async () => {
    setLoading(true);
    if (studentconclusion.rating === 0 || studentconclusion.resion === "") {
      toast.error("Please fill all the fields");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post("/api/finalfeedback", {
        object_id: objectid,
        user_id: taskData.user_id,
        student_feedback: feedbackData,
        ai_feedback: AIfeedback,
        student_conclusion: studentconclusion,
      });
      console.log(response.data);
      location.reload();
    } catch (error) {
      console.log(error);
      toast.error("Failed to submit feedback");
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (currentContentIndex < taskData.task_content.length - 1) {
      setCurrentContentIndex(currentContentIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentContentIndex > 0) {
      setCurrentContentIndex(currentContentIndex - 1);
    }
  };

  const isLastContent = currentContentIndex === taskData.task_content.length - 1;
  const isFirstContent = currentContentIndex === 0;

  return (
    <div className="p-6">
      {displayfeedback ? (
        <div className="bg-white rounded-lg p-6 shadow-md min-h-screen">
          {currentContentIndex < taskData.task_content.length ? (
            <div className=" mx-auto">
       

              <div className="flex flex-row gap-6 ">
                {/* Question Section */}
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl shadow-lg border border-blue-200 max-w-2/4">
                  <h1 className="text-xl font-bold mb-4 text-blue-800">Question</h1>
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <h2 className="font-semibold mb-3 text-gray-800">
                      {taskData.task_content[currentContentIndex].question}
                    </h2>
                    <pre className="whitespace-pre-wrap font-mono bg-gray-100 p-4 rounded text-sm overflow-x-auto">
                      {taskData.task_content[currentContentIndex].code_content}
                    </pre>
                    <div>
                      <h1>your answer</h1>
                      <pre className="whitespace-pre-wrap font-mono bg-gray-100 p-4 rounded text-sm overflow-x-auto">
                        {student_answer[currentContentIndex]}
                      </pre>
                    </div>
                    <h1>Correct Answer</h1>
                    <div className=" text-green-700 bg-green-50 p-4 rounded">
                      {taskData.task_content[currentContentIndex].codelines.result}
                    </div>
                  </div>
                </div>

                {/* Student Feedback Section */}
                <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl shadow-lg border border-green-200 min-w-1/4 max-w-1/3">
                  <h1 className="text-xl font-bold mb-4 text-green-800">Student Feedback</h1>
                  {feedbackData[currentContentIndex] && (
                    <div className="bg-white p-6 rounded-lg shadow-sm">
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">
                        {feedbackData[currentContentIndex].contentTitle}
                      </h3>
                      <div className="space-y-3 text-gray-700">
                        <div>
                          <span className="font-semibold text-green-700">Exam Level:</span>
                          <p className="mt-1 text-gray-600">{feedbackData[currentContentIndex].examlevel}</p>
                        </div>
                        <div>
                          <span className="font-semibold text-green-700">Easy Concepts:</span>
                          <p className="mt-1 text-gray-600">{feedbackData[currentContentIndex].easyconcept}</p>
                        </div>
                        <div>
                          <span className="font-semibold text-green-700">Hard Concepts:</span>
                          <p className="mt-1 text-gray-600">{feedbackData[currentContentIndex].hardconcept}</p>
                        </div>
                        <div>
                          <span className="font-semibold text-green-700">Submitted:</span>
                          <p className="mt-1 text-gray-600">{feedbackData[currentContentIndex].submittedAt}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* AI Feedback Section */}
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl shadow-lg border border-purple-200 min-w-1/4 max-w-1/3">
                  <h1 className="text-xl font-bold mb-4 text-purple-800">AI Analysis</h1>
                  {AIfeedback && AIfeedback[currentContentIndex] && (
                    <div className="bg-white p-6 rounded-lg shadow-sm">
                      <h3 className="text-lg font-semibold text-gray-800 mb-3">
                        {AIfeedback[currentContentIndex].task}
                      </h3>
                      
                      <div className="mb-4 text-gray-700">
                        <span className="font-semibold text-purple-700">Analysis:</span>
                        <p className="mt-1">{AIfeedback[currentContentIndex].exam_level_analysis}</p>
                      </div>

                      <div className="mb-4">
                        <h4 className="font-semibold text-green-600 mb-2">Strengths:</h4>
                        <ul className="list-disc pl-5 space-y-1">
                          {AIfeedback[currentContentIndex].strengths.map((strength, idx) => (
                            <li key={idx} className="text-gray-700 text-sm">{strength}</li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-semibold text-orange-600 mb-2">Areas for Improvement:</h4>
                        <ul className="list-disc pl-5 space-y-1">
                          {AIfeedback[currentContentIndex].areas_for_improvement.map((area, idx) => (
                            <li key={idx} className="text-gray-700 text-sm">{area}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Navigation Buttons */}
              <div className="flex justify-between items-center mt-8">
                <Button
                  onClick={handlePrevious}
                  disabled={isFirstContent}
                  className={`px-6 py-2 rounded-lg font-medium transition-all ${
                    isFirstContent 
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                      : 'bg-gray-600 text-white hover:bg-gray-700'
                  }`}
                >
                  Previous
                </Button>
                
                <span className="text-gray-600 font-medium">
                  {currentContentIndex + 1} / {taskData.task_content.length}
                </span>

                <Button
                  onClick={handleNext}
                  disabled={isLastContent}
                  className={`px-6 py-2 rounded-lg font-medium transition-all ${
                    isLastContent 
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {isLastContent ? 'Completed' : 'Next'}
                </Button>
              </div>

              {/* Show "Go to Rating" button on last content */}
              {isLastContent && (
                <div className="flex justify-center mt-6">
                  <Button
                    onClick={() => setCurrentContentIndex(taskData.task_content.length)}
                    className="px-8 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-all"
                  >
                    Proceed to Rating
                  </Button>
                </div>
              )}
            </div>
          ) : (
            /* Rating Section - shown after all content */
            <div className="max-w-2xl mx-auto">
              <div className="bg-gradient-to-br p-8 rounded-xl shadow-lg">
                <h2 className="text-3xl font-bold text-center mb-6">
                  Feedback Rating
                </h2>

                <div className="mb-8">
                  <h3 className="text-xl text-gray-800 mb-4 text-center">
                    How helpful was this feedback?
                  </h3>
                  <div className="text-center mb-4">
                    <span className="text-4xl font-bold text-blue-600">
                      {studentconclusion.rating}/10
                    </span>
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={10}
                    value={studentconclusion.rating}
                    onChange={(e) => {
                      const newRating = parseInt(e.target.value);
                      setstudentconclusion({
                        ...studentconclusion,
                        rating: newRating,
                      });
                    }}
                    className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                  />
                  <div className="flex justify-between text-sm text-gray-500 mt-2">
                    <span>Poor (1)</span>
                    <span>Excellent (10)</span>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">
                    Please explain your rating:
                  </h3>
                  <Textarea
                    placeholder="Share your thoughts on the feedback provided..."
                    value={studentconclusion.resion}
                    onChange={(e) =>
                      setstudentconclusion({
                        ...studentconclusion,
                        resion: e.target.value,
                      })
                    }
                    className="w-full p-4 border-2 border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[120px]"
                  />
                </div>

                <div className="flex justify-center gap-4">
                  <Button
                    onClick={() => setCurrentContentIndex(taskData.task_content.length - 1)}
                    className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-all"
                  >
                    Back to Review
                  </Button>
                  <Button
                    onClick={handleConclusionSubmit}
                    disabled={loading || studentconclusion.rating === 0 || studentconclusion.resion === ""}
                    className={`px-8 py-2 rounded-lg font-semibold transition-all ${
                      loading || studentconclusion.rating === 0 || studentconclusion.resion === ""
                        ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    {loading ? "Submitting..." : "Submit Final Rating"}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Initial Student Feedback Form */
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden p-8">
          <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">
            Student Feedback Form
          </h1>

          <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-lg flex-1 shadow-md border border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {feedbackData.map((item, index) => (
                <div
                  key={index}
                  className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
                >
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">
                    {item.contentTitle}
                  </h3>
                  <div className="mb-4 text-gray-700">
                    <p>
                      <span className="font-medium">Exam Level:</span>{" "}
                      {item.examlevel}
                    </p>
                    <p>
                      <span className="font-medium">Easy Concepts:</span>{" "}
                      {item.easyconcept}
                    </p>
                    <p>
                      <span className="font-medium">Hard Concepts:</span>{" "}
                      {item.hardconcept}
                    </p>
                    <p>
                      <span className="font-medium">Submitted:</span>{" "}
                      {item.submittedAt}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-center mt-8">
            <Button
              onClick={HandleFeedbackSubmit}
              disabled={loading}
              className="cursor-pointer px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:bg-blue-400"
            >
              {loading ? "Loading..." : "Submit Feedback"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}