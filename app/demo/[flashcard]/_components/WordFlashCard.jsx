import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import WordAnalysisDetail from "./WordAnalysisDetail";

export default function WordFlashCard() {
  const canvasRef = useRef(null);
  const [webgazerActive, setWebgazerActive] = useState(false);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [gazeData, setGazeData] = useState([]);
  const [wordGazeData, setWordGazeData] = useState([]);
  const lastGazeTimeRef = useRef(null);
  const currentWordRef = useRef(null);

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

  const drawGazeGraph = () => {
    const canvas = canvasRef.current;
    if (!canvas || gazeData.length === 0) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const ctx = canvas.getContext("2d");
    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    ctx.lineWidth = 2;
    ctx.strokeStyle = "#3B82F6";
    ctx.fillStyle = "#000000";

    ctx.beginPath();

    if (gazeData.length > 0) {
      const firstPoint = gazeData[0];
      ctx.moveTo(firstPoint.x_coordinate, firstPoint.y_coordinate);

      for (let i = 1; i < gazeData.length; i++) {
        const point = gazeData[i];
        ctx.lineTo(point.x_coordinate, point.y_coordinate);
      }

      ctx.stroke();

      gazeData.forEach((point) => {
        const radius = Math.min(Math.max(3, point.duration / 200), 8);

        ctx.beginPath();
        ctx.arc(point.x_coordinate, point.y_coordinate, radius, 0, Math.PI * 2);

        const intensity = Math.min(255, point.duration / 20);
        ctx.fillStyle = `rgb(${255 - intensity}, ${intensity}, ${
          255 - intensity
        })`;

        ctx.fill();

        ctx.fillStyle = "#000";
        ctx.font = "20px Arial";
        ctx.fillText(
          `${point.duration}ms`,
          point.x_coordinate + 10,
          point.y_coordinate - 5
        );
      });
    }
  };

  useEffect(() => {
    if (showAnalysis && canvasRef.current) {
      drawGazeGraph();
    }
  }, [showAnalysis, gazeData]);

  useEffect(() => {
    const handleResize = () => {
      if (showAnalysis && canvasRef.current) {
        drawGazeGraph();
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [showAnalysis, gazeData]);

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

    const webgazerScript = document.createElement("script");
    // webgazerScript.src = "https://webgazer.cs.brown.edu/webgazer.js";
    webgazerScript.src = "/webgazer/webgazer.js";
    webgazerScript.defer = true;
    document.head.appendChild(webgazerScript);

    webgazerScript.onload = () => {
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
        .begin();
    };

    return () => {
      if (window.webgazer) {
        window.webgazer.end();
      }
    };
  }, [webgazerActive]);

  useEffect(() => {
    setWebgazerActive(true);
  }, []);

  const handleToggleAnalysis = () => {
    if (!showAnalysis) {
      if (window.webgazer) {
        window.webgazer.end();
      }
      setWebgazerActive(false);
    } else {
      setWebgazerActive(true);
    }
    setShowAnalysis(!showAnalysis);
  };

  const ParaData = [
    {
      topic: "Animals",
      para: "Animals are living things that need food, water, and air to survive. Some animals live on land, while others live in water. Animals can be pets like cats and dogs, farm animals like cows and chickens, or wild animals like lions and elephants. Each animal is special and unique",
    },
  ];
  return (
    <div className="flex flex-col">
      <Carousel className="h-screen w-[80%] mx-auto mt-6">
        <CarouselContent>
          {ParaData.map((item, index) => {
            const words = item.para.split(/\s+/);
            return (
              <CarouselItem key={index}>
                <div className="bg-green-50 rounded-lg shadow-lg p-6 m-4">
                  <h1 className="text-3xl font-bold mb-4 text-blue-600 border-b-2 border-blue-200 py-3">
                    {item.topic}
                  </h1>
                  <p className="text-blue-400 font-semibold leading-relaxed text-6xl">
                    {words.map((word, wordIndex) => (
                      <span
                        key={wordIndex}
                        className="word-tracking inline-block mr-4 cursor-default"
                      >
                        {word}
                        {wordIndex < words.length - 1 ? " " : ""}
                      </span>
                    ))}
                  </p>
                </div>
              </CarouselItem>
            );
          })}
        </CarouselContent>
        <CarouselPrevious className="bg-blue-500 hover:bg-blue-600 text-white" />
        <CarouselNext className="bg-blue-500 hover:bg-blue-600 text-white" />
      </Carousel>

      {showAnalysis && (
        <>
          <h2 className="text-xl font-bold mb-2">Word Gaze Data</h2>
          <div className="bg-gray-100 p-4 m-4 mb-10 h-[400px] overflow-y-auto">
            <pre className="text-xs">
              {JSON.stringify(wordGazeData, null, 2)}
            </pre>
          </div>
        </>
      )}

      {showAnalysis && (
        <canvas
          ref={canvasRef}
          className="absolute top-0 left-0 w-full h-full pointer-events-none"
        />
      )}
      {showAnalysis && <WordAnalysisDetail para={ParaData[0].para} wordGazeData={wordGazeData} />}

      <div className="flex flex-row p-4 gap-4 fixed bottom-0 left-0 right-0 justify-end pr-14">
        <Button
          onClick={() => (window.location.href = "/")}
          className="bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white px-8 py-3 rounded-lg font-semibold text-base shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
        >
          Home Page
        </Button>
        <Button
          onClick={handleToggleAnalysis}
          className="bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white px-8 py-3 rounded-lg font-semibold text-base shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
        >
          {showAnalysis ? "Hide Analysis" : "View Analysis"}
        </Button>
        <Button
          onClick={() => (window.location.href = "/demo/code")}
          className="bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white px-8 py-3 rounded-lg font-semibold text-base shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
        >
          Try Code-Reading DeepGaze
        </Button>
      </div>
    </div>
  );
}
