"use client"
import React from "react";
import { Button } from "@/components/ui/button";
import Word from "../images/word.png"
import Code from "../images/codeq.jpg";
import Image from "next/image";

const Demo = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-white overflow-hidden p-8 md:p-20">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-bold text-center bg-gradient-to-r from-blue-800 to-blue-600 bg-clip-text text-transparent pb-12">
          DeepGaze 
        </h1>

        <div className="grid md:grid-cols-2 gap-8 mt-8">
        <div className="bg-white/95 rounded-2xl shadow-xl p-6 transform hover:scale-105 transition-transform duration-300 border border-blue-100">
            <div className="h-48 relative overflow-hidden rounded-xl mb-4">
              <Image src={Word} alt="Word Flash Card" className="w-full h-full object-cover" />
            </div>
            <h2 className="text-2xl font-bold text-blue-800 mb-4 border-b-2 border-blue-800">
              Word-Reading
            </h2>
            <div className="space-y-3 mb-6">
              <h3 className="text-xl font-semibold text-gray-800">
                How it works
              </h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-center space-x-2">
                  <span className="text-blue-600 text-lg">•</span>
                  <span>Precise gaze tracking for each word</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="text-blue-600 text-lg">•</span>
                  <span>Word-level duration analysis</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="text-blue-600 text-lg">•</span>
                  <span>Reading pattern visualization</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="text-blue-600 text-lg">•</span>
                  <span>AI-powered word definitions</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="text-blue-600 text-lg">•</span>
                  <span>Detailed reading analysis</span>
                </li>
              </ul>
            </div>
            <div className="flex justify-end">
              <Button
              onClick={() => window.location.href = "/demo/word"}
              className="bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white px-8 py-3 rounded-lg font-semibold text-base shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                Try Word-Reading DeepGaze
              </Button>
            </div>
          </div>
          <div className="bg-white/95 rounded-2xl shadow-xl p-6 transform hover:scale-105 transition-transform duration-300 border border-blue-100">
            <div className="h-48 relative overflow-hidden rounded-xl mb-4">
              <Image src={Code} alt="Code Flash Card" className="w-full h-full object-cover" />
            </div>
            <h2 className="text-2xl font-bold text-blue-800 mb-4 border-b-2 border-blue-800">
              Code-Reading
            </h2>
            <div className="space-y-3 mb-6">
              <h3 className="text-xl font-semibold text-gray-800">
                How it works
              </h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-center space-x-2">
                  <span className="text-blue-600 text-lg">•</span>
                  <span>Eye tracking for each code line with tag elements</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="text-blue-600 text-lg">•</span>
                  <span>Duration analysis for code segment focus</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="text-blue-600 text-lg">•</span>
                  <span>Advanced data visualization</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="text-blue-600 text-lg">•</span>
                  <span>AI-powered error explanation</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="text-blue-600 text-lg">•</span>
                  <span>Comprehensive analysis summary</span>
                </li>
              </ul>
            </div>
            <div className="flex justify-end">
              <Button
              onClick={() => window.location.href = "/demo/code"} 
               className="bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white px-8 py-3 rounded-lg font-semibold text-base shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                Try Code-Reading DeepGaze
              </Button>
            </div>
          </div>

         
        </div>
      </div>
    </div>  );
};

export default Demo;