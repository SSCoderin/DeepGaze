
import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { toast } from "sonner";
import { useUser } from "@clerk/nextjs";

export default function DeepgazeTask({ taskData }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [webgazerActive, setWebgazerActive] = useState(false);
  const [webgazerLoading, setWebgazerLoading] = useState(true);
  const [gazeData, setGazeData] = useState([]);
  const [allParaGazeData, setAllParaGazeData] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [wordGazeData, setWordGazeData] = useState([]);
  const lastGazeTimeRef = useRef(null);
  const currentWordRef = useRef(null);
  const [ontake, setOnTake] = useState(true);
  const taskContent = taskData.task_content;
  const currentTask = taskContent[currentIndex];
  const { user } = useUser();

  const recordGazeDuration = (word, timestamp, x, y) => {
    const currentTime = Date.now();
    const lastGazeTime = lastGazeTimeRef.current;

    const duration = lastGazeTime
      ? Math.min(currentTime - lastGazeTime, 1000)
      : 0;

    if (word !== currentWordRef.current) {
      const existingWordIndex = wordGazeData.findIndex(
        (entry) => entry.word === word
      );

      if (existingWordIndex !== -1) {
        const updatedWordGazeData = [...wordGazeData];
        updatedWordGazeData[existingWordIndex] = {
          ...updatedWordGazeData[existingWordIndex],
          duration: updatedWordGazeData[existingWordIndex].duration + duration,
          x_coordinate: x,
          y_coordinate: y,
          timestamp: currentTime,
          visits: (updatedWordGazeData[existingWordIndex].visits || 0) + 1,
        };
        setWordGazeData(updatedWordGazeData);
      } else {
        setWordGazeData((prev) => [
          ...prev,
          {
            word,
            x_coordinate: x,
            y_coordinate: y,
            duration: duration,
            timestamp: currentTime,
            visits: 1,
          },
        ]);
      }

      lastGazeTimeRef.current = currentTime;
      currentWordRef.current = word;

      setGazeData((prev) => [
        ...prev,
        {
          x_coordinate: x,
          y_coordinate: y,
          duration: duration,
          timestamp: currentTime,
        },
      ]);
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

    let webgazerScript;
    const existingScript = document.querySelector(
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

            if (element.classList.contains("word-tracking")) {
              const word = element.textContent.trim();
              recordGazeDuration(word, timestamp, data.x, data.y);
            }
          })
          .begin()
          .then(() => {
            console.log("Webgazer initialized successfully");
            setWebgazerLoading(false);
            const customizeDot = () => {
              const dot = document.getElementById("webgazerGazeDot");
              if (dot) {
                dot.style.width = "25px";
                dot.style.height = "25px";
                dot.style.borderRadius = "50%";
                dot.style.backgroundColor = "rgba(255, 0, 0, 0.4)";
                dot.style.boxShadow = "0 0 10px 3px rgba(255,0,0,0.4)";
                dot.style.zIndex = "9999";
                dot.style.pointerEvents = "none"; 
              } else {
                
                requestAnimationFrame(customizeDot);
              }
            };
            customizeDot();
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
    }, 1000);
  };

  useEffect(() => {
    if (currentIndex > 0) {
      setAllParaGazeData((prev) => ({
        ...prev,
        [currentIndex - 1]: [...wordGazeData],
      }));

      setWordGazeData([]);
      currentWordRef.current = null;
      lastGazeTimeRef.current = null;
    }
  }, [currentIndex]);

  const handleNext = () => {
    if (currentIndex < taskContent.length - 1) {
      restartWebgazer();
      setTimeout(() => {
        setCurrentIndex(currentIndex + 1);
      }, 300);
    }
  };

  const handleSubmit = () => {
    const finalGazeData = {
      ...allParaGazeData,
      [currentIndex]: [...wordGazeData],
    };

    setAllParaGazeData(finalGazeData);

    if (window.webgazer) {
      window.webgazer.end();
    }

    setWebgazerLoading(true);
    
    GetUploadAnalysis(finalGazeData, false);

    setTimeout(() => {
      setWebgazerActive(false);
      setWebgazerLoading(false);
      setShowResults(true);
    }, 1000);
  };

  const GetUploadAnalysis = async (gazeDataToUpload, retry) => {
    console.log(
      "this is what i am going to upload ",
      taskData._id,
      user.fullName,
      user.emailAddresses[0]?.emailAddress,
      gazeDataToUpload 
    );
    try {
      if (ontake) {
        const response = await axios.post("/api/analysis", {
          task_id: taskData._id,
          student_name: user.fullName,
          student_email: user.emailAddresses[0]?.emailAddress,
          analysis_data: gazeDataToUpload,
        });
        if (response.data.success) {
          toast.success("submitted successfully");
          setOnTake(retry);
        }
        console.log(response.data);
      }
    } catch (error) {
      console.log("something went wrong ", error);
    }
  };

  const renderContent = (content) => {
    if (!content) return null;
    const paragraphs = content.split(/\n+/);
    return paragraphs.map((paragraph, paraIdx) => {
      const words = paragraph.trim().split(/\s+/);
      return (
        <p key={paraIdx} className="mb-4 leading-relaxed">
          {words.map((word, wordIndex) => (
            <span
              key={`${paraIdx}-${wordIndex}`}
              className="word-tracking inline-block mr-2 cursor-default leading-[3rem]"
            >
              {word}
              {wordIndex < words.length - 1 ? " " : ""}
            </span>
          ))}
        </p>
      );
    });
  };

  return (
    <div className="flex flex-col h-screen">
      <div>
        <h1 className="text-3xl font-bold m-4">
          {taskData.task_title.toUpperCase()}
        </h1>
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

      {!showResults ? (
        <>
          <div className="mx-10 px-4 py-8 ">
            <div className="mb-4">
              <h2 className="flex justify-center items-center text-4xl font-bold text-blue-600 mb-6">
                {currentTask?.title}
              </h2>
              <div className="mt-6 p-4 px-10 text-gray-700 text-4xl font-semibold whitespace-pre-line ">
                {currentTask?.content && renderContent(currentTask.content)}
              </div>
            </div>
          </div>
          <div className="m-10 mx-20 text-right">
            {currentIndex < taskContent.length - 1 ? (
              <button
                onClick={handleNext}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded"
                disabled={webgazerLoading}
              >
                Next →
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded"
                disabled={webgazerLoading}
              >
                Submit
              </button>
            )}
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center m-auto ">
          <div className=" p-8 border-2 border-gray-200 rounded-2xl shadow-md">
            <h2 className="text-2xl font-bold mb-4">Thank you for Submition</h2>
            <Button
              onClick={() => {
                window.location.reload();
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded ml-auto flex cursor-pointer"
            >
              Close
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}