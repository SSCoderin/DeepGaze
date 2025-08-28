import React from "react";

export default function DisplayIndividualContent({ analysisData }) {
  const [expandedContentIndex, setExpandedContentIndex] = React.useState(null);

  if (
    !analysisData ||
    !analysisData.success ||
    !analysisData.task ||
    !analysisData.analysis
  ) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
        <div className="bg-white p-6 rounded-lg shadow-md text-red-600 text-lg">
          Error: Invalid analysis data provided.
        </div>
      </div>
    );
  }

  const { task, analysis } = analysisData;

  const calculateOverallCompletionTime = (contentIndex) => {
    let totalDurations = [];

    analysis.forEach((studentAnalysis) => {
      const studentContentData = studentAnalysis.analysis_data[contentIndex];
      if (studentContentData && studentContentData.length > 0) {
        const timestamps = studentContentData.map((item) =>
          new Date(item.timestamp).getTime()
        );
        if (timestamps.length > 0) {
          const minTimestamp = Math.min(...timestamps);
          const maxTimestamp = Math.max(...timestamps);
          const duration = maxTimestamp - minTimestamp;
          totalDurations.push(duration);
        }
      }
    });

    if (totalDurations.length === 0) {
      return "N/A";
    }

    const averageMs =
      totalDurations.reduce((sum, d) => sum + d, 0) / totalDurations.length;
    return `${(averageMs / 1000).toFixed(2)} seconds`;
  };

  const calculateAverageSectionReadTime = (contentIndex) => {
    const sectionDurations = new Map();
    analysis.forEach((studentAnalysis) => {
      const studentContentData = studentAnalysis.analysis_data[contentIndex];
      if (studentContentData) {
        studentContentData.forEach((item) => {
          if (item.id && item.duration !== undefined) {
            if (!sectionDurations.has(item.id)) {
              sectionDurations.set(item.id, []);
            }
            sectionDurations.get(item.id).push(item.duration);
          }
        });
      }
    });

    const averageSectionTimes = {};
    let maxAvgDurationMs = 0;

    sectionDurations.forEach((durations, id) => {
      if (durations.length > 0) {
        const averageMs =
          durations.reduce((sum, d) => sum + d, 0) / durations.length;
        averageSectionTimes[id] = {
          timeString: `${(averageMs / 1000).toFixed(3)} seconds`,
          timeMs: averageMs,
        };
        if (averageMs > maxAvgDurationMs) {
          maxAvgDurationMs = averageMs;
        }
      } else {
        averageSectionTimes[id] = {
          timeString: "N/A",
          timeMs: 0,
        };
      }
    });

    return { averageSectionTimes, maxAvgDurationMs };
  };

  const contentAnalysisResults = task.task_content.map((content, index) => {
    const overallTime = calculateOverallCompletionTime(index.toString());
    const { averageSectionTimes, maxAvgDurationMs } =
      calculateAverageSectionReadTime(index.toString());

    return {
      contentTitle: content.question || `Content ${index + 1}`,
      overallCompletionTime: overallTime,
      sectionReadTimes: averageSectionTimes,
      codeLines: content.codelines?.code || {},
      maxAvgSectionDurationMs: maxAvgDurationMs,
    };
  });

  return (
    <div className=" bg-gray-100 p-8 font-inter">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        <div className="bg-blue-50 p-6 rounded-lg shadow-md border border-blue-200">
          <h3 className="text-xl font-semibold text-blue-800 mb-2">
            Total Students Analyzed
          </h3>
          <p className="text-3xl font-bold text-blue-600">{analysis.length}</p>
        </div>
        <div className="bg-green-50 p-6 rounded-lg shadow-md border border-green-200">
          <h3 className="text-xl font-semibold text-green-800 mb-2">
            Total Task Contents
          </h3>
          <p className="text-3xl font-bold text-green-600">
            {task.task_content.length}
          </p>
        </div>
      </div>
      <div className=" mx-auto bg-white shadow-xl rounded-2xl overflow-hidden">
        <div className="p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b-2 border-blue-300 pb-2">
            Content Overview (Click to view details)
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {contentAnalysisResults.map((contentItem, idx) => (
              <div
                key={idx}
                className="bg-white p-6 rounded-lg shadow-md border border-gray-200 cursor-pointer hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1"
                onClick={() =>
                  setExpandedContentIndex(
                    idx === expandedContentIndex ? null : idx
                  )
                }
              >
                <h3 className="text-3xl font-bold text-blue-600  mb-2">
                  {contentItem.contentTitle}
                </h3>
                <p className="text-gray-600">
                  Avg. Completion Time:{" "}
                  <span className="font-bold text-blue-600">
                    {contentItem.overallCompletionTime}
                  </span>
                </p>
                <div className="mt-4 text-sm text-blue-500 font-medium flex items-center">
                  {expandedContentIndex === idx ? (
                    <>
                      Hide Details
                      <svg
                        className="w-4 h-4 ml-1 transform rotate-180"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 9l-7 7-7-7"
                        ></path>
                      </svg>
                    </>
                  ) : (
                    <>
                      View Details
                      <svg
                        className="w-4 h-4 ml-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 9l-7 7-7-7"
                        ></path>
                      </svg>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>

          {expandedContentIndex !== null && (
            <div className="bg-white p-8 mb-8 rounded-xl shadow-lg border border-gray-200">
              <h3 className="text-3xl font-bold text-indigo-700 mb-4 flex items-center">
                <svg
                  className="w-8 h-8 mr-3 text-indigo-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  ></path>
                </svg>
                {contentAnalysisResults[expandedContentIndex].contentTitle}{" "}
                Detailed Analysis
              </h3>

              <div className="bg-blue-50 p-4 rounded-lg mb-6 shadow-sm border border-blue-200">
                <p className="text-lg text-blue-800 font-semibold">
                  Average Overall Completion Time:{" "}
                  <span className="font-bold text-blue-600">
                    {
                      contentAnalysisResults[expandedContentIndex]
                        .overallCompletionTime
                    }
                  </span>
                </p>
              </div>

              <h4 className="text-xl font-semibold text-gray-700 mb-4 mt-6 border-b border-gray-300 pb-2">
                Average Time Spent Per Code Section
              </h4>

              {Object.keys(
                contentAnalysisResults[expandedContentIndex].codeLines
              ).length > 0 ? (
                <div className="overflow-x-auto rounded-lg shadow-md border border-gray-200">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider rounded-tl-lg"
                        >
                          Code Section ID
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Code Snippet (Example)
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Average Read Time
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider rounded-tr-lg"
                        >
                          Visual Read Time
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {Object.keys(
                        contentAnalysisResults[expandedContentIndex].codeLines
                      ).map((id) => {
                        const sectionData =
                          contentAnalysisResults[expandedContentIndex]
                            .sectionReadTimes[id];
                        const timeString = sectionData
                          ? sectionData.timeString
                          : "N/A";
                        const timeMs = sectionData ? sectionData.timeMs : 0;

                        const barWidthPercentage =
                          contentAnalysisResults[expandedContentIndex]
                            .maxAvgSectionDurationMs > 0
                            ? Math.max(
                                5,
                                (timeMs /
                                  contentAnalysisResults[expandedContentIndex]
                                    .maxAvgSectionDurationMs) *
                                  100
                              )
                            : 0;

                        return (
                          <tr key={id} className="hover:bg-gray-50">
                            <td className="px-6 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                              {id.replace(/_/g, " ")}{" "}
                            </td>
                            <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-700">
                              <pre className="bg-gray-100 p-2 rounded-md text-xs overflow-x-auto max-w-md">
                                {contentAnalysisResults[expandedContentIndex]
                                  .codeLines[id] || "Snippet not available"}
                              </pre>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-semibold">
                              {timeString}
                            </td>
                            <td className="px-6 py-4">
                              {timeString !== "N/A" ? (
                                <div className="w-full bg-gray-200 rounded-full h-2.5">
                                  <div
                                    className="bg-blue-500 h-2.5 rounded-full"
                                    style={{ width: `${barWidthPercentage}%` }}
                                    title={`${timeString}`}
                                  ></div>
                                </div>
                              ) : (
                                <span className="text-gray-500">N/A</span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-gray-600 text-center py-4">
                  No detailed section analysis available for this content.
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
