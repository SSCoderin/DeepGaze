"use client";
import React, { useEffect, useState, useRef } from "react";
import CodeDisplay from "./CodeDisplay";
import { Button } from "@/components/ui/button";
import CodeAnalysisDetail from "./CodeAnalysisDetail";
import { set } from "mongoose";

export default function CodeFlashCard() {
  const [gazeData, setGazeData] = useState([]);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [webgazerActive, setWebgazerActive] = useState(false);
  const [codeData,setCodeData] = useState([]) 


  const callcodedata =(response)=>{
    setCodeData(response)
  }
  const canvasRef = useRef(null);
  let gazeStart = {};

  const recordGazeDuration = (element, timestamp, x, y) => {
    const id = element.id || "no-id";
    const textContent = element.textContent?.trim().substring(0, 50) || "";

    if (!gazeStart[id]) {
      gazeStart[id] = timestamp;
    } else {
      const duration = timestamp - gazeStart[id];
      if (duration > 500) {
        const elementType = element.tagName.toLowerCase();
        setGazeData((prevData) => [
          ...prevData,
          {
            elementType,
            id,
            duration,
            x_coordinate: x,
            y_coordinate: y,
            textContent,
            timestamp: new Date().toISOString(),
          },
        ]);
        delete gazeStart[id];
      }
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
    ctx.fillStyle = "#3B82F6";

    ctx.beginPath();

    if (gazeData.length > 0) {
      const firstPoint = gazeData[0];
      ctx.moveTo(firstPoint.x_coordinate, firstPoint.y_coordinate);

      for (let i = 1; i < gazeData.length; i++) {
        const point = gazeData[i];
        ctx.lineTo(point.x_coordinate, point.y_coordinate);
      }

      ctx.stroke();

      gazeData.forEach((point, index) => {
        const radius = Math.min(Math.max(3, point.duration / 200), 8);

        ctx.beginPath();
        ctx.arc(point.x_coordinate, point.y_coordinate, radius, 0, Math.PI * 2);

        const intensity = Math.min(255, point.duration / 20);
        ctx.fillStyle = `rgb(${255 - intensity}, ${intensity}, ${
          255 - intensity
        })`;

        ctx.fill();

        if (point.duration > 1000) {
          ctx.fillStyle = "#000";
          ctx.font = "10px Arial";
          ctx.fillText(
            `${(point.duration / 1000).toFixed(1)}s`,
            point.x_coordinate + 10,
            point.y_coordinate - 5
          );
        }
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

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
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

          recordGazeDuration(element, timestamp, data.x, data.y);
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

  const getGazeSummary = () => {
    const summary = {};
    gazeData.forEach((data) => {
      if (data.id !== "no-id") {
        if (!summary[data.id]) {
          summary[data.id] = 0;
        }
        summary[data.id] += data.duration;
      }
    });
    return summary;
  };

  return (
    <div className="flex flex-col items-start pl-10 bg-gray-100">
      <div className="flex flex-row items-start justify-start gap-4 p-4 bg-gray-100">
        <h1 className="text-2xl font-bold">Code-Reading</h1>
        <Button className="bg-yellow-400 rounded-xl text-black">Coding</Button>
        <Button className="bg-blue-400 rounded-xl text-black">Python</Button>
        <Button className="bg-green-400 rounded-xl text-black">Medium</Button>
      </div>
      <div className="flex flex-row gap-4 p-4 bg-gray-100">
        <CodeDisplay calcodelines={callcodedata}  />

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
            {showAnalysis ? "Hide Analysis" : "View My Analysis"}
          </Button>
          <Button
            onClick={() => (window.location.href = "/demo/word")}
            className="bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white px-8 py-3 rounded-lg font-semibold text-base shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
          >
            Try Word-Reading DeepGaze
          </Button>
        </div>
      </div>
      {showAnalysis && (

        <div className="p-4 bg-white rounded shadow-lg w-full">
          <h2 className="text-xl font-bold mb-4">Gaze Analysis</h2>

          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2">
              Gaze Path Visualization
            </h3>
            <canvas
              ref={canvasRef}



              style={{
                width: '100%',
                height: '100%',
                position: 'absolute',
                top: 0,
                left: 0,
                zIndex: 9999,
                pointerEvents: 'none'
              }}
              className="bg-transparent"             
            />
            <p className="text-sm text-gray-600 mt-2">
              Points show where you focused, with size and color indicating
              duration. Lines connect your gaze path.
            </p>
          </div>

          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2">Duration Summary</h3>
            <div className="bg-gray-100 p-4 rounded">
              {Object.entries(getGazeSummary()).map(([id, duration]) => (
                <div key={id} className="mb-2">
                  <strong>{id}:</strong> {(duration / 1000).toFixed(2)}s
                </div>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2">Raw Data</h3>
            <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto max-h-96">
              {JSON.stringify(gazeData, null, 2)}
            </pre>
          </div>
        </div>
      )}
      {showAnalysis?<CodeAnalysisDetail code={codeData} gaze={gazeData} />:null }
      
    </div>
  );
}
