"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function Calibration() {
  const [isLoading, setIsLoading] = useState(true);
  const [currentDotIndex, setCurrentDotIndex] = useState(0);
  const [currentClickCount, setCurrentClickCount] = useState(0);
  const [isCalibrationComplete, setIsCalibrationComplete] = useState(false);
  const [webgazerLoaded, setWebgazerLoaded] = useState(false);

  // Define calibration dot positions
  const dotPositions = [
    // Corners
    { top: "5%", left: "5%", label: "Top Left" },
    { top: "5%", left: "95%", label: "Top Right" },
    { top: "95%", left: "5%", label: "Bottom Left" },
    { top: "95%", left: "95%", label: "Bottom Right" },

    // Center
    { top: "50%", left: "50%", label: "Center" },

    // Edges - Top and Bottom
    { top: "5%", left: "50%", label: "Top Center" },
    { top: "95%", left: "50%", label: "Bottom Center" },

    // Edges - Left and Right
    { top: "50%", left: "5%", label: "Left Center" },
    { top: "50%", left: "95%", label: "Right Center" },

    // Between edges and center
    { top: "25%", left: "25%", label: "Top Left Quarter" },
    { top: "25%", left: "75%", label: "Top Right Quarter" },
    { top: "75%", left: "25%", label: "Bottom Left Quarter" },
    { top: "75%", left: "75%", label: "Bottom Right Quarter" },

    { top: "5%", left: "5%", label: "Top Left" },
    { top: "5%", left: "95%", label: "Top Right" },
    { top: "95%", left: "5%", label: "Bottom Left" },
    { top: "95%", left: "95%", label: "Bottom Right" },

    // Center
    { top: "50%", left: "50%", label: "Center" },

    // Edges - Top and Bottom
    { top: "5%", left: "50%", label: "Top Center" },
    { top: "95%", left: "50%", label: "Bottom Center" },

    // Edges - Left and Right
    { top: "50%", left: "5%", label: "Left Center" },
    { top: "50%", left: "95%", label: "Right Center" },

    // Additional positions
    { top: "25%", left: "50%", label: "Top Quarter Center" },
    { top: "75%", left: "50%", label: "Bottom Quarter Center" },
    { top: "50%", left: "25%", label: "Left Quarter Center" },
    { top: "50%", left: "75%", label: "Right Quarter Center" },
     { top: "5%", left: "5%", label: "Top Left" },
    { top: "5%", left: "95%", label: "Top Right" },
    { top: "95%", left: "5%", label: "Bottom Left" },
    { top: "95%", left: "95%", label: "Bottom Right" },
  ];

  const webgazerstart = () => {
    try {
      console.log("webgazer started");
      const loadwebgazer = () => {
        const script = document.createElement("script");
        script.src = "/webgazer/Webgazer.js";
        script.defer = true;
        document.head.appendChild(script);
        script.onload = () => {
          console.log("WebGazer loaded successfully!");
          setWebgazerLoaded(true);
          window.webgazer.setRegression("ridge");
          window.webgazer.showVideo(false);
          window.webgazer.showFaceOverlay(false);
          window.webgazer.showFaceFeedbackBox(false);
          window.webgazer.begin();
        };
        script.onerror = (e) => {
          console.error("Failed to load webgazer.js:", e);
          setIsLoading(false);
        };
      };
      loadwebgazer();

      return () => {
        if (window.webgazer) {
          window.webgazer.end();
        }
      };
    } catch (error) {
      console.error("Error loading WebGazer:", error);
    } finally {
      setTimeout(() => {
        setIsLoading(false);
      }, 5000);
    }
  };

  const getDotColor = (clickCount) => {
    switch (clickCount) {
      case 0:
        return "bg-red-500";
      case 1:
        return "bg-orange-500";
      case 2:
        return "bg-yellow-500";
      case 3:
        return "bg-green-500";
      default:
        return "bg-red-500";
    }
  };

  const handleDotClick = () => {
    if (currentClickCount < 3) {
      setCurrentClickCount(currentClickCount + 1);

      if (currentClickCount + 1 === 3) {
        setTimeout(() => {
          if (currentDotIndex < dotPositions.length - 1) {
            setCurrentDotIndex(currentDotIndex + 1);
            setCurrentClickCount(0);
          } else {
            setIsCalibrationComplete(true);
            setTimeout(() => {
              window.location.reload();
              if (window.webgazer) {
                window.webgazer.end();
              }
            }, 2000);
          }
        }, 500);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="h-screen bg-black flex items-center justify-center">
        <div className="text-center text-white max-w-2xl">
          <div className="mb-8">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-red-500 mx-auto mb-6"></div>
            <h2 className="text-2xl font-bold mb-4">
              Eye Tracking Calibration Setup
            </h2>
          </div>
          <div className="text-lg leading-relaxed space-y-4 border-2 border-green-500 text-black p-8 bg-white">
            <p>
              <strong>
                Click each dot 3 times to calibrate your eye tracking.
              </strong>
            </p>
            <p>
              <strong className="text-red-500">
                Look directly at each dot as you click it for proper
                calibration.
              </strong>
            </p>
            <p>
              <strong>
                Dots will change color: Red → Orange → Yellow → Green
              </strong>
            </p>
            <Button
              onClick={webgazerstart}
              className={"bg-green-600 cursor-pointer hover:bg-green-700"}
            >
              {webgazerLoaded
                ? "Loading...."
                : "Start Eye Tracking Calibration"}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (isCalibrationComplete) {
    return (
      <div className="h-screen bg-black flex items-center justify-center">
        <div className="text-center text-white">
          <div className="text-6xl mb-4">✅</div>
          <h2 className="text-3xl font-bold mb-4 text-green-400">
            Calibration Complete!
          </h2>
          <p className="text-lg">Redirecting to content...</p>
        </div>
      </div>
    );
  }

  const currentDot = dotPositions[currentDotIndex];

  return (
    <div className="h-screen bg-black relative overflow-hidden">
      {/* Only the calibration dot - no other UI elements */}
      <div
        className={`absolute w-8 h-8 rounded-full cursor-pointer transform hover:scale-110 transition-all duration-200 ${getDotColor(
          currentClickCount
        )}`}
        style={{
          top: currentDot.top,
          left: currentDot.left,
          transform: "translate(-50%, -50%)",
        }}
        onClick={handleDotClick}
      ></div>
    </div>
  );
}
