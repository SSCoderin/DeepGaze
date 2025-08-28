import { useState, useEffect } from "react";
import { ArrowRight } from "lucide-react";
import axios from "axios";
export default function CodeAnalysisDetail({ student_answer,code, gaze }) {
  const [gazeData, setGazeData] = useState(gaze);

  const [codeData, setCodeData] = useState(code);
  const [analysisResults, setAnalysisResults] = useState({
    totalDuration: 0,
    readIds: [],
    unreadIds: [],
    leastReadId: "",
    mostReadId: "",
    readPattern: [],
    idDurations: {},
  });

  useEffect(() => {
    if (gazeData && codeData) {
      analyzeGazeData();
    }
  }, [gazeData, codeData]);

 
  const analyzeGazeData = () => {
    if (!gazeData || !codeData || !codeData[0] || !codeData[0].code) return;
    const allCodeIds = Object.keys(codeData[0].code);
    const filteredGazeData = gazeData.filter((entry) => entry.id !== "no-id");
    const totalDuration = filteredGazeData.reduce(
      (sum, entry) => sum + entry.duration,
      0
    );

    const idDurations = {};
    filteredGazeData.forEach((entry) => {
      if (entry.id in idDurations) {
        idDurations[entry.id] += entry.duration;
      } else {
        idDurations[entry.id] = entry.duration;
      }
    });

    const readIds = Object.keys(idDurations);
    const unreadIds = allCodeIds.filter((id) => !readIds.includes(id));

    let leastReadId = "";
    let mostReadId = "";

    if (readIds.length > 0) {
      leastReadId = readIds.reduce(
        (min, id) => (idDurations[id] < idDurations[min] ? id : min),
        readIds[0]
      );

      mostReadId = readIds.reduce(
        (max, id) => (idDurations[id] > idDurations[max] ? id : max),
        readIds[0]
      );
    }

    const readPattern = gazeData
      .filter((entry) => entry.id !== "no-id")
      .map((entry) => entry.id);

    setAnalysisResults({
      totalDuration,
      readIds,
      unreadIds,
      leastReadId,
      mostReadId,
      readPattern,
      idDurations,
    });
  };

  const formatTime = (ms) => {
    const seconds = (ms / 1000).toFixed(2);
    return `${seconds}s`;
  };

  const getCodeContent = (id) => {
    if (!codeData || !codeData[0] || !codeData[0].code) return "";
    return codeData[0].code[id] || "";
  };

  const calculatePercentage = (duration) => {
    const maxDuration = Object.values(analysisResults.idDurations).reduce(
      (max, duration) => Math.max(max, duration),
      0
    );
    return maxDuration > 0 ? (duration / maxDuration) * 100 : 0;
  };

  return (
    <div>
      <div className="p-6 bg-gray-50 rounded-lg shadow-md w-full mt-10">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          Code Reading Analysis
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-700">
              Total Reading Time
            </h3>
            <p className="text-3xl font-bold text-blue-600">
              {formatTime(analysisResults.totalDuration)}
            </p>
          </div>

          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-700">
              Code Coverage
            </h3>
            <p className="text-3xl font-bold text-blue-600">
              {Math.round(
                (analysisResults.readIds.length /
                  (analysisResults.readIds.length +
                    analysisResults.unreadIds.length)) *
                  100
              )}
              %
            </p>
            <p className="text-sm text-gray-500">
              {analysisResults.readIds.length} read,{" "}
              {analysisResults.unreadIds.length} unread
            </p>
          </div>

          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-700">
              Reading Pattern
            </h3>
            <p className="text-sm text-gray-500">
              Viewed {new Set(analysisResults.readPattern).size} unique sections
              in {analysisResults.readPattern.length} glances
            </p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow mb-8">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            Time Spent on Each Section
          </h3>

          {Object.entries(analysisResults.idDurations).length > 0 ? (
            <div className="space-y-3">
              {Object.entries(analysisResults.idDurations)
                .sort((a, b) => b[1] - a[1])
                .map(([id, duration]) => (
                  <div key={id} className="relative">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700">
                        {id}
                      </span>
                      <span className="text-sm font-medium text-gray-500">
                        {formatTime(duration)}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${calculatePercentage(duration)}%` }}
                      />
                    </div>
                    <div className="mt-1 text-xs text-gray-500">
                      {getCodeContent(id)}
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <p className="text-gray-500">
              No code section reading data available
            </p>
          )}
        </div>

        <div className="bg-white p-4 rounded-lg shadow mb-8">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            Reading Pattern Flow
          </h3>

          {analysisResults.readPattern.length > 0 ? (
            <div className="flex flex-wrap items-center">
              {analysisResults.readPattern.map((id, index) => (
                <div key={index} className="flex items-center">
                  <div className="bg-blue-100 border border-blue-200 rounded p-2 mb-2">
                    <div className="font-medium text-sm text-blue-800">
                      {id}
                    </div>
                    <div className="text-xs text-gray-500 truncate max-w-xs">
                      {getCodeContent(id)}
                    </div>
                  </div>
                  {index < analysisResults.readPattern.length - 1 && (
                    <ArrowRight className="mx-2 text-gray-400" size={16} />
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No reading pattern data available</p>
          )}
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            Unread Code Sections
          </h3>

          {analysisResults.unreadIds.length > 0 ? (
            <div className="space-y-2">
              {analysisResults.unreadIds.map((id) => (
                <div
                  key={id}
                  className="p-2 bg-red-50 border border-red-100 rounded"
                >
                  <div className="font-medium text-sm text-red-800">{id}</div>
                  <div className="text-xs text-gray-700">
                    {getCodeContent(id)}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-green-600 font-medium">
              All code sections were viewed!
             
            </p>
          )}
          
        </div>
        <div className="bg-green-50 p-4 rounded-lg shadow mt-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-indigo-600 uppercase mb-1">Student Response : </h3>
                <p className="text-lg text-gray-800 font-bold">
                  {student_answer ? student_answer : "No response provided"}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-bold text-indigo-600  uppercase mb-1">Actual Result : </h3>
                <p className="text-lg text-gray-800 font-bold">
                  {codeData[0].result}
                </p>
              </div>
            </div>
          </div>
      </div>

      
    </div>
  );
}
