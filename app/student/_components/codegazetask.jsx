
import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { useUser } from "@clerk/nextjs";
import CodeFeedback from "./codefeedback";
import { Input } from "@/components/ui/input";

export default function CodegazeTask({ taskData }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [webgazerActive, setWebgazerActive] = useState(false);
  const [webgazerLoading, setWebgazerLoading] = useState(true);
  const [gazeData, setGazeData] = useState([]);
  const [objectid, setObjectid] = useState("");
  const [allCodeGazeData, setAllCodeGazeData] = useState({});
  const [showResults, setShowResults] = useState(false);
  const lastGazeTimeRef = useRef(null);
  const currentElementRef = useRef(null);
  
  // Updated feedback state to store array of feedback for each content
  const [allFeedbackData, setAllFeedbackData] = useState([]);
  const [currentFeedback, setCurrentFeedback] = useState({
    examlevel: "",
    easyconcept: "",
    hardconcept: "",
  });
  const [student_answer, setstudent_answer] = useState({});
  const [currentStudentAnswer, setCurrentStudentAnswer] = useState("");
  const [displayfeedback, setDisplayfeedback] = useState(false);
  const [feedbackLoading, setFeedbackLoading] = useState(false);
  
  const taskContent = taskData.task_content;
  const currentTask = taskContent[currentIndex];
  const { user } = useUser();

  const recordGazeDuration = (element, timestamp, x, y) => {
    const currentTime = Date.now();
    const lastGazeTime = lastGazeTimeRef.current;
    const elementId = element.id || "no-id";

    const textContent = element.textContent?.trim() || "";

    const duration = lastGazeTime
      ? Math.min(currentTime - lastGazeTime, 1000)
      : 0;

    if (elementId !== currentElementRef.current || duration > 500) {
      setGazeData((prev) => [
        ...prev,
        {
          elementType: "pre", 
          id: elementId, 
          duration: duration,
          x_coordinate: x,
          y_coordinate: y,
          textContent: textContent,
          timestamp: new Date().toISOString(),
        },
      ]);

      lastGazeTimeRef.current = currentTime;
      currentElementRef.current = elementId;
    }
  };

  useEffect(() => {
    if (!webgazerActive) return;

    const style = document.createElement("style");
    style.textContent = `
      #webgazerVideoContainer, 
      #webgazerVideoFeed,
      #webgazerFaceOverlay,
      #webgazerFaceFeedbackBox {
        display: none !important;
      }
    `;
    document.head.appendChild(style);

    // Check if webgazer script is already loaded
    let webgazerScript;
    const existingScript = document.querySelector(
      // 'script[src="https://webgazer.cs.brown.edu/webgazer.js"]'
            'script[src="/webgazer/webgazer.js"]'

    );

    const initializeWebgazer = () => {
      console.log("Initializing webgazer...");

      if (window.webgazer) {
        window.webgazer
          .showVideo(false)
          .showFaceOverlay(false)
          .showFaceFeedbackBox(false)
          .setGazeListener((data, timestamp) => {
            if (!data) return;

            const element = document.elementFromPoint(data.x, data.y);
            if (!element) return;

            // Track code elements specifically
            if (element.classList.contains("code-tracking")) {
              recordGazeDuration(element, timestamp, data.x, data.y);
            }
          })
          .begin()
          .then(() => {
            console.log("Webgazer initialized successfully");
            setWebgazerLoading(false);
          })
          .catch((error) => {
            console.error("Error initializing webgazer:", error);
            setWebgazerLoading(false);
          });
      } else {
        console.error("Webgazer not available");
        setWebgazerLoading(false);
      }
    };

    if (existingScript) {
      initializeWebgazer();
    } else {
      webgazerScript = document.createElement("script");
      // webgazerScript.src = "https://webgazer.cs.brown.edu/webgazer.js";
      webgazerScript.src = "/webgazer/webgazer.js";
      webgazerScript.defer = true;
      document.head.appendChild(webgazerScript);

      webgazerScript.onload = initializeWebgazer;

      webgazerScript.onerror = () => {
        console.error("Failed to load webgazer script");
        setWebgazerLoading(false);
      };
    }

    return () => {
      if (window.webgazer) {
        console.log("Cleaning up webgazer");
        window.webgazer.end();
      }
    };
  }, [webgazerActive]);

  useEffect(() => {
    setWebgazerActive(true);
  }, []);

  const restartWebgazer = () => {
    if (window.webgazer) {
      window.webgazer.end();
    }

    setWebgazerActive(false);
    setWebgazerLoading(true);

    setTimeout(() => {
      setWebgazerActive(true);
    }, 500);
  };

  const stopWebgazer = () => {
    if (window.webgazer) {
      console.log("Stopping webgazer for feedback");
      window.webgazer.end();
    }
    setWebgazerActive(false);
  };

  useEffect(() => {
    if (currentIndex > 0) {
      setAllCodeGazeData((prev) => ({
        ...prev,
        [currentIndex - 1]: [...gazeData],
      }));

      setGazeData([]);

      currentElementRef.current = null;
      lastGazeTimeRef.current = null;
    }
  }, [currentIndex]);

  const handleNext = () => {
    // Store current student answer
    setstudent_answer((prev) => ({
      ...prev,
      [currentIndex]: currentStudentAnswer,
    }));

    setAllCodeGazeData((prev) => ({
      ...prev,
      [currentIndex]: [...gazeData],
    }));
    
    // Stop webgazer before showing feedback
    stopWebgazer();
    alert("you can not go back once you submit ");
    setDisplayfeedback(true);
  };

  const handleFeedbackSubmit = async () => {
    setFeedbackLoading(true);
    
    // Create feedback object with content info and timestamp
    const feedbackWithMetadata = {
      contentIndex: currentIndex,
      contentTitle: currentTask?.question || currentTask?.title || `Content ${currentIndex + 1}`,
      examlevel: currentFeedback.examlevel,
      easyconcept: currentFeedback.easyconcept,
      hardconcept: currentFeedback.hardconcept,
      timestamp: new Date().toISOString(),
      submittedAt: new Date().toLocaleString()
    };

    // Add to all feedback data
    setAllFeedbackData((prev) => [...prev, feedbackWithMetadata]);
    
    // Reset current feedback and answer
    setCurrentFeedback({
      examlevel: "",
      easyconcept: "",
      hardconcept: "",
    });
    setCurrentStudentAnswer("");
    
    setDisplayfeedback(false);
    setFeedbackLoading(false);

    // Move to next content or show results
    if (currentIndex < taskContent.length - 1) {
      restartWebgazer();
      setTimeout(() => {
        setCurrentIndex(currentIndex + 1);
      }, 300);
    } else {
      // This was the last content, submit everything
      handleFinalSubmit(feedbackWithMetadata);
    }
  };

  // Handle final submission (when all content is completed)
  const handleFinalSubmit = async (lastFeedback = null) => {
    // Include last feedback if provided
    const finalFeedbackData = lastFeedback 
      ? [...allFeedbackData, lastFeedback]
      : allFeedbackData;

    setAllCodeGazeData((prev) => ({
      ...prev,
      [currentIndex]: [...gazeData],
    }));

    if (window.webgazer) {
      window.webgazer.end();
    }

    setWebgazerLoading(true);
    await uploadAnalysis(finalFeedbackData);
    setTimeout(() => {
      setWebgazerActive(false);
      setWebgazerLoading(false);
      setShowResults(true);
    }, 1000);
  };

  const uploadAnalysis = async (finalFeedbackData) => {
    const finalAnalysisData = {
      ...allCodeGazeData,
      [currentIndex]: [...gazeData],
    };

    console.log(
      "Analysis Data:",
      taskData._id,
      user.fullName,
      user.emailAddresses[0]?.emailAddress,
      finalAnalysisData,
      "Feedback Data:",
      finalFeedbackData,
      "Student Answers:",
      student_answer
    );

    try {
      const response = await axios.post("/api/analysis", {
        task_id: taskData._id,
        student_name: user.fullName,
        student_email: user.emailAddresses[0]?.emailAddress,
        student_feedback: finalFeedbackData, 
        student_answer: student_answer,
        analysis_data: finalAnalysisData,
      });

      setObjectid(response.data.analysis._id);
      if (response.data.status === "success") {
        toast.success("Submitted successfully");
      }
    } catch (error) {
      console.log("Something went wrong ", error);
      toast.error("Failed to submit analysis");
    }
  };

  const renderCodeContent = (codeTask) => {
    if (!codeTask || !codeTask.code_content) return null;

    const codeLines = codeTask.code_content.split("\n");

    return (
      <div className="bg-gray-50 rounded-lg p-4 shadow-inner">
        <pre className="text-gray-800 text-lg">
          {codeLines.map((line, index) => (
            <div
              key={`code-line-${index}`}
              id={`code-line-${index}`}
              className="code-tracking py-1 hover:bg-gray-200 transition-colors"
            >
              {line}
            </div>
          ))}
        </pre>
      </div>
    );
  };

  const renderCodeFromJson = (codeTask) => {
    if (!codeTask || !codeTask.codelines) return null;

    try {
      const codeData = codeTask.codelines;

      const getIndentLevel = (key) => {
        if (
          key.includes("for_loop") ||
          key.includes("if_") ||
          key.includes("function_definition")
        ) {
          return 0;
        } else if (
          key.includes("return") ||
          key.includes("hashmap_update") ||
          key.includes("check_")
        ) {
          return 2;
        } else {
          return 1;
        }
      };

      return (
        <>
        <div className="bg-gray-50 rounded-lg p-4 shadow-inner">
          <h3 className="text-xl font-semibold mb-4">{codeData.question}</h3>
          <pre className="text-gray-800 text-lg font-mono leading-relaxed">
            {Object.entries(codeData.code).map(([key, line], index) => {
              const indentLevel = getIndentLevel(key);
              const indentation = "    ".repeat(indentLevel); // 4 spaces per indent level

              return (
                <div
                  key={key}
                  id={key}
                  className="code-tracking py-1 hover:bg-gray-200 transition-colors"
                  style={{ whiteSpace: 'pre' }}
                >
                  {indentation}{line}
                </div>
              );
            })}
          </pre>
        </div>
        <div className="mt-4">
          <h1>OUTPUT</h1>
          <Input 
            placeholder="Enter your answer"
            value={currentStudentAnswer}
            onChange={(e) => setCurrentStudentAnswer(e.target.value)}
            className="w-full"
            />
        </div>
        </>
      );
    } catch (error) {
      console.error("Error parsing code JSON:", error);
      return <div>Error parsing code data</div>;
    }
  };

  const renderContentInFeedback = (task) => {
    if (!task || !task.codelines) return null;

    try {
      const codeData = task.codelines;

      const getIndentLevel = (key) => {
        if (
          key.includes("for_loop") ||
          key.includes("if_") ||
          key.includes("function_definition")
        ) {
          return 0;
        } else if (
          key.includes("return") ||
          key.includes("hashmap_update") ||
          key.includes("check_")
        ) {
          return 2;
        } else {
          return 1;
        }
      };

      return (
        <div className="bg-gray-100 rounded-lg p-4 m-6 overflow-y-auto">
          <h4 className="text-lg font-semibold mb-3 text-gray-800">{codeData.question}</h4>
          <pre className="text-gray-700 text-sm font-mono leading-relaxed">
            {Object.entries(codeData.code).map(([key, line], index) => {
              const indentLevel = getIndentLevel(key);
              const indentation = "    ".repeat(indentLevel); // 4 spaces per indent level

              return (
                <div
                  key={key}
                  className="py-0.5"
                  style={{ whiteSpace: 'pre' }}
                >
                  {indentation}{line}
                </div>
              );
            })}
          </pre>
          <div className="mt-3 p-2 bg-blue-50 rounded border-l-4 border-blue-400">
            <strong className="text-blue-800">Your Answer:</strong> 
            <span className="ml-2 text-gray-700">
              {student_answer[currentIndex] || currentStudentAnswer || "No answer provided"}
            </span>
          </div>
        </div>
      );
    } catch (error) {
      console.error("Error parsing code JSON:", error);
      return <div>Error parsing code data</div>;
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <div>
        <h1 className="text-3xl font-bold m-4">{taskData.task_title}</h1>
      </div>

      {webgazerLoading && !showResults && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-xl font-semibold text-blue-600">
                Loading WebGazer Eye Tracking...
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Please look directly at the screen and ensure your face is
                clearly visible
              </p>
            </div>
          </div>
        </div>
      )}

      {displayfeedback && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="max-w-8xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden p-8 max-h-[90vh] overflow-y-auto">
            <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">
              Student Feedback Form
            </h1>
            <div className="flex gap-4 ">
            
            {/* Display the content during feedback */}
            <div className="m-8">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Content Review:</h3>
              {renderContentInFeedback(currentTask)}
            </div>
            <div>

            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-700 mb-3">
                Select the level of difficulty for this content
              </h2>
              <div className="flex items-center justify-center space-x-6">
                {["easy", "medium", "hard"].map((level) => (
                  <label
                    key={level}
                    className="flex items-center space-x-2 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="level"
                      value={level}
                      checked={currentFeedback.examlevel === level}
                      onChange={(e) =>
                        setCurrentFeedback({
                          ...currentFeedback,
                          examlevel: e.target.value,
                        })
                      }
                      className="form-radio text-blue-600"
                    />
                    <span className="text-gray-700 capitalize">{level}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-700 mb-3">
                Which concepts were easy to understand in this content?
              </h2>
              <textarea
                placeholder="Enter your feedback about easy concepts..."
                value={currentFeedback.easyconcept}
                onChange={(e) =>
                  setCurrentFeedback({
                    ...currentFeedback,
                    easyconcept: e.target.value,
                  })
                }
                className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 min-h-[100px]"
              />
            </div>

            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-700 mb-3">
                Which concepts are you struggling with in this content?
              </h2>
              <textarea
                placeholder="Enter your feedback about difficult concepts..."
                value={currentFeedback.hardconcept}
                onChange={(e) =>
                  setCurrentFeedback({
                    ...currentFeedback,
                    hardconcept: e.target.value,
                  })
                }
                className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 min-h-[100px]"
              />
            </div>

            <div className="flex justify-center space-x-4">
              {/* <button
                onClick={() => setDisplayfeedback(false)}
                className="px-6 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
                disabled={feedbackLoading}
              >
                Cancel
              </button> */}
              <button
                onClick={handleFeedbackSubmit}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                disabled={feedbackLoading || !currentFeedback.examlevel}
              >
                {feedbackLoading ? "Submitting..." : "Submit Feedback"}
              </button>
            </div>
            </div>
            </div>
          </div>
        </div>
      )}

      {!showResults ? (
        <>
          <div className="mx-10 px-4 py-8 border-2 rounded shadow border-gray-200">
            <div className="mb-4">
              <h2 className="flex justify-center text-2xl font-bold text-blue-600 mb-6">
                {currentTask?.question || currentTask?.title || "Code Exercise"}
              </h2>
              <div className="mt-6 p-4 text-gray-700 max-w-4xl mx-auto">
                {currentTask.codelines && renderCodeFromJson(currentTask)}
              </div>
            </div>
          </div>
          <div className="m-10 mx-20 text-right">
            <div className="mb-4 text-sm text-gray-600">
              Content {currentIndex + 1} of {taskContent.length}
            </div>
            {currentIndex < taskContent.length - 1 ? (
              <button
                onClick={handleNext}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded"
                disabled={webgazerLoading}
              >
                Next → (Get Feedback)
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded"
                disabled={webgazerLoading}
              >
                Submit (Final Feedback)
              </button>
            )}
          </div>
        </>
      ) : (
        <div className="mx-20 ">
          <CodeFeedback
            objectid={objectid}
            taskData={taskData}
            student_answer={student_answer}
            analysisData={allCodeGazeData}
            feedbackData={allFeedbackData}
          />
        </div>
      )}
    </div>
  );
}