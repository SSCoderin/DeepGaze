"use client";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import DemoBot from "./DemoBot";
import { useEffect } from "react";

const CodeDisplay = ({calcodelines}) => {
  const [results, setResults] = useState({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [callbot, setCallbot] = useState(false);

    const codeLines = [
      {
        question: "Sort the array [3, 0, 2, 5, -1, 4, 1] using quick sort.",
        code: {
          function: "function quickSort(arr) {",
          condition: "    if (arr.length <= 1) return arr;",
          define_variable1: "    const pivot = arr[Math.floor(arr.length / 2)];",
          define_variable2: "    const left = arr.filter(x => x < pivot);",
          define_variable3: "    const right = arr.filter(x => x > pivot);",
          define_variable4: "    const equal = arr.filter(x => x === pivot);",
          return: "    return [...quickSort(left), ...equal, ...quickSort(right)];",
          end: "}"
        },
        result: "[-1, 0, 1, 2, 3, 4, 5]",
      },
    ];


  useEffect(()=>{
    calcodelines(codeLines)
  },[])
  

  const HandelHint = (number) => {
    setCallbot(true);
    console.log("bot is callled");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
        {codeLines.map((codeLine, index) => (
          <div key={index} className="p-8">
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-gray-800 border-b pb-4">
                {codeLine.question}
              </h3>
              
              <div className="bg-gray-50 rounded-xl p-6">
                {Object.values(codeLine.code).map((line, i) => (
                  <pre
                    key={i}
                    id={Object.keys(codeLine.code)[i]}
                    className="font-mono text-lg bg-gray-100 p-3 rounded-lg my-2 border-l-4 border-blue-500"
                  >
                    {line}
                  </pre>
                ))}
              </div>

              <div className="mt-8 space-y-4">
                <label
                  htmlFor={`answer-${index}`}
                  className="block text-lg font-medium text-gray-700"
                >
                  Your Answer
                </label>
                <textarea
                  id={`answer-${index}`}
                  className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 min-h-[120px] text-gray-700"
                  placeholder="Type your answer here..."
                />
                
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => {
                      const answer = document.getElementById(`answer-${index}`).value;
                      if (answer === codeLine.result) {
                        setResults({
                          ...results,
                          [index]: {
                            isCorrect: true,
                            message: `Correct! The answer is ${codeLine.result}`,
                          },
                        });
                      } else {
                        setResults({
                          ...results,
                          [index]: {
                            isCorrect: false,
                            message: "Try again!",
                          },
                        });
                      }
                    }}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-semibold shadow-md hover:shadow-lg"
                  >
                    Submit Answer
                  </button>
                  
                  <Button
                    variant="outline"
                    className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 font-semibold flex items-center gap-2"
                    onClick={() => {
                      setCurrentIndex(index);
                      HandelHint(index);
                    }}
                  >
                    <span className="text-xl">💡</span>
                    Get Hint
                  </Button>
                </div>

                {results[index] && (
                  <div className={`p-4 rounded-lg mt-4 ${
                    results[index].isCorrect
                      ? "bg-green-50 text-green-700 border border-green-200"
                      : "bg-red-50 text-red-700 border border-red-200"
                  }`}>
                    <p className="font-medium">
                      {results[index].message}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {callbot && (
        <div className="fixed top-4 right-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl p-4">
            <Button 
              onClick={() => setCallbot(false)}
              className="absolute top-2 right-2 p-2 hover:bg-gray-100 rounded-full"
            >
              ✕
            </Button>
            <DemoBot questiondata={codeLines[currentIndex]} />
          </div>
        </div>
      )}
    </div>
  );
};

export default CodeDisplay;
