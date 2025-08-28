"use client";
import { Button } from "@/components/ui/button";
import Header from "./components/Header";
import {
  ArrowRight,
  Eye,
  Brain,
  Zap,
  Target,
  BookOpen,
  Glasses,
  ChartBar,
} from "lucide-react";
import Image from "next/image";
import Eyetracking from "./images/eye-tracking-demo.jpg";
import LearningPath  from "./images/learning-path.jpg";
import Analytic from "./images/analytics-dashboard.webp";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-300 to-blue-50">
      <Header />
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-[url('./images/deepgaze.png')] bg-no-repeat bg-right bg-[length:50%_auto] flex pt-40 pr-0 animate-[scaleOnce_2s_ease-out_forwards] overflow-hidden">
        <style jsx>{`
          @keyframes scaleOnce {
            0% {
              background-size: 30% auto;
              opacity: 0.8;
            }
            100% {
              background-size: 50% auto;
              opacity: 1;
            }
          }
        `}</style>
        <div className="max-w-8xl mx-auto relative z-10 w-full backdrop-blur-sm bg-white/5 rounded-3xl p-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-28">
            <div
              className="md:w-2/3 animate-item"
              style={{ "--delay": "0.1s" }}
            >
              <h1 className="text-5xl md:text-6xl lg:text-8xl font-bold bg-gradient-to-r from-blue-600 via-blue-700 to-blue-900 bg-clip-text text-transparent pb-3 mb-6 tracking-tight">
                DEEPGAZE
              </h1>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-gray-800 mb-8 leading-tight">
                <span className="block text-blue-600 font-bold mb-4 tracking-wider animate-pulse">
                  AUTOMATED EYE GAZE ANALYSIS & FEEDBACK
                </span>
                <span className="bg-gradient-to-r from-gray-800 via-gray-700 to-gray-600 bg-clip-text text-transparent">
                  Revolutionizing Learning with AI-Powered Intelligence
                </span>
              </h2>
              <p className="text-xl text-gray-700 mb-10 leading-relaxed backdrop-blur-sm bg-white/30 p-4 rounded-xl">
                Enhance educational outcomes with real-time assistance and
                data-driven personalization
              </p>
              <div className="flex flex-wrap gap-6">
                <Button
                  onClick={() => (window.location.href = "/dashboard")}
                  className="group bg-gradient-to-r cursor-pointer from-blue-700 via-blue-800 to-blue-900 text-white px-8 py-3 h-14 rounded-xl text-lg font-semibold shadow-xl hover:shadow-blue-200 hover:shadow-2xl transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105"
                >
                  Get Started
                  <ArrowRight
                    className="ml-3 group-hover:translate-x-2 transition-transform"
                    size={20}
                  />
                </Button>
                <Button
                  onClick={() => (window.location.href = "/demo")}
                  variant="outline"
                  className="group bg-white/80 backdrop-blur-sm border-2 cursor-pointer border-blue-400 text-blue-800 px-8 py-3 h-14 rounded-xl text-lg font-semibold shadow-lg hover:bg-blue-50 hover:border-blue-500 transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105"
                >
                  Demo Trial
                  <ArrowRight
                    className="ml-3 group-hover:translate-x-2 transition-transform"
                    size={20}
                  />
                </Button>
              </div>
            </div>
            <div
              className="md:w-1/3 flex justify-center animate-item"
              style={{ "--delay": "0.3s" }}
            ></div>
          </div>
        </div>
      </section>
        <section
        id="about"
        className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-100 to-yellow-50"
      >
        <div className="max-w-full mx-auto">
          <div className="animate-item" style={{ "--delay": "0.1s" }}>
            <h2 className="text-3xl font-bold text-center text-blue-600 mb-4">
              About DeepGaze
            </h2>
            <div className="w-24 h-1 bg-yellow-400 mx-auto mb-12"></div>
          </div>

          <div className="space-y-16">
            <div
              className="flex flex-col md:flex-row items-center gap-8 animate-item"
              style={{ "--delay": "0.2s" }}
            >
              <div className="md:flex-1 bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-blue-100">
                <div className="h-24 w-24 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mb-6">
                  <Eye className="text-white" size={48} />
                </div>
                <h3 className="text-2xl font-semibold text-blue-600 mb-4">
                  Advanced Eye-Tracking Intelligence
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  Our cutting-edge AI-powered eye-tracking system revolutionizes
                  learning by monitoring micro-expressions, pupil dilation, and
                  gaze patterns in real-time. This sophisticated technology can
                  detect even subtle signs of confusion or engagement, ensuring
                  no learning moment goes unnoticed.
                </p>
              </div>
              <div className="md:w-1/2">
                <Image
                  src={Eyetracking}
                  alt="Eye Tracking Demo"
                  width={500}
                  height={300}
                  className="rounded-3xl shadow-xl"
                />
              </div>
            </div>

            <div
              className="flex flex-col md:flex-row items-center gap-8 animate-item"
              style={{ "--delay": "0.3s" }}
            >
              <div className="md:w-1/2 flex justify-end">
                <Image
                  src={LearningPath}
                  alt="Learning Path"
                  width={500}
                  height={300}
                  className="rounded-3xl shadow-xl"
                />
              </div>
              <div className="md:flex-1 bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-yellow-100">
                <div className="h-24 w-24 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center mb-6">
                  <BookOpen className="text-white" size={48} />
                </div>
                <h3 className="text-2xl font-semibold text-yellow-600 mb-4">
                  Smart Learning Pathways
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  Experience personalized learning like never before with our
                  dynamic recommendation engine. It analyzes your learning
                  style, adapts to your pace, and creates custom study paths
                  enhanced with interactive multimedia content, practice
                  exercises, and real-world applications.
                </p>
              </div>
            </div>

            <div
              className="flex flex-col md:flex-row items-center gap-8 animate-item"
              style={{ "--delay": "0.4s" }}
            >
              <div className="md:flex-1 bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-blue-100">
                <div className="h-24 w-24 bg-gradient-to-r from-blue-400 to-yellow-400 rounded-full flex items-center justify-center mb-6">
                  <ChartBar className="text-white" size={48} />
                </div>
                <h3 className="text-2xl font-semibold text-blue-600 mb-4">
                  Comprehensive Analytics Suite
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  Gain deep insights into learning patterns with our advanced
                  analytics dashboard. Track progress, identify knowledge gaps,
                  and receive detailed performance metrics. Our AI continuously
                  optimizes your learning experience based on historical data
                  and learning outcomes.
                </p>
              </div>
              <div className="md:w-1/2">
                <Image
                  src={Analytic}
                  alt="Analytics Dashboard"
                  width={500}
                  height={300}
                  className="rounded-3xl shadow-xl"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        id="key"
        className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-900 to-purple-900"
      >
        <div className="max-w-6xl mx-auto">
          <div className="animate-item" style={{ "--delay": "0.1s" }}>
            <h2 className="text-3xl font-bold text-center text-cyan-400 mb-4">
              DeepGaze Features
            </h2>
            <div className="w-24 h-1 bg-cyan-500 mx-auto mb-12"></div>
          </div>

          <div className="flex flex-col space-y-8">
            <div
              className="group bg-black/30 backdrop-blur-lg rounded-full shadow-lg p-6 hover:shadow-cyan-500/20 transition-all duration-500 transform-gpu hover:scale-105 animate-item flex items-center border border-cyan-900/50"
              style={{ "--delay": "0.2s" }}
            >
              <div className="w-20 h-20 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Eye className="text-white" size={36} />
              </div>
              <div className="ml-8">
                <h3 className="text-2xl font-semibold text-cyan-400 mb-2">
                  Real-time Eye Tracking
                </h3>
                <p className="text-cyan-100">
                  {" "}
                  Continuously monitors the user's gaze to detect focus,
                  confusion, and engagement without any manual input.
                </p>
              </div>
            </div>

            <div
              className="group bg-black/30 backdrop-blur-lg rounded-full shadow-lg p-6 hover:shadow-purple-500/20 transition-all duration-500 transform-gpu hover:scale-105 animate-item flex items-center border border-purple-900/50 ml-12"
              style={{ "--delay": "0.3s" }}
            >
              <div className="w-20 h-20 rounded-full bg-gradient-to-r from-purple-600 to-pink-500 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Brain className="text-white" size={36} />
              </div>
              <div className="ml-8">
                <h3 className="text-2xl font-semibold text-purple-400 mb-2">
                  AI-Powered Suggestions
                </h3>
                <p className="text-purple-100">
                  {" "}
                  Uses intelligent algorithms to analyze user behavior and
                  provide instant explanations, hints, or additional learning
                  materials.
                </p>
              </div>
            </div>

            <div
              className="group bg-black/30 backdrop-blur-lg rounded-full shadow-lg p-6 hover:shadow-blue-500/20 transition-all duration-500 transform-gpu hover:scale-105 animate-item flex items-center border border-blue-900/50 ml-24"
              style={{ "--delay": "0.4s" }}
            >
              <div className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Zap className="text-white" size={36} />
              </div>
              <div className="ml-8">
                <h3 className="text-2xl font-semibold text-blue-400 mb-2">
                  Personalized Learning Paths{" "}
                </h3>
                <p className="text-blue-100">
                  Adapts to individual learning patterns by generating
                  customized courses and topic recommendations based on user
                  interaction.
                </p>
              </div>
            </div>

            <div
              className="group bg-black/30 backdrop-blur-lg rounded-full shadow-lg p-6 hover:shadow-indigo-500/20 transition-all duration-500 transform-gpu hover:scale-105 animate-item flex items-center border border-indigo-900/50 ml-36"
              style={{ "--delay": "0.5s" }}
            >
              <div className="w-20 h-20 rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Target className="text-white" size={36} />
              </div>
              <div className="ml-8">
                <h3 className="text-2xl font-semibold text-indigo-400 mb-2">
                  Seamless Integration
                </h3>
                <p className="text-indigo-100">
                  Easily integrates with existing digital learning platforms,
                  enhancing the learning experience without disrupting the
                  workflow.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        id="work"
        className="py-20 px-4 sm:px-6 lg:px-8 bg-white relative"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-blue-50 opacity-50"></div>
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="animate-item" style={{ "--delay": "0.1s" }}>
            <h2 className="text-3xl font-bold text-center text-blue-600 mb-4">
              How It Works
            </h2>
            <div className="w-24 h-1 bg-yellow-400 mx-auto mb-12"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="animate-item" style={{ "--delay": "0.2s" }}>
              <div className="space-y-12">
                {/* Step 1 */}
                <div className="flex items-start space-x-6 group hover:-translate-x-1 transition-transform duration-300">
                  <div className="flex-shrink-0 w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white flex items-center justify-center text-2xl font-bold shadow-lg group-hover:shadow-xl transition-shadow">
                    1
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-blue-600 mb-2 group-hover:text-blue-700 transition-colors">
                      Track
                    </h3>
                    <p className="text-gray-700 leading-relaxed">
                      As the user browses learning material, EyeGaze Assist
                      continuously monitors their eye movement using advanced
                      eye-tracking technology—no need for keyboard or mouse
                      input!
                    </p>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="flex items-start space-x-6 group hover:-translate-x-1 transition-transform duration-300">
                  <div className="flex-shrink-0 w-16 h-16 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 text-white flex items-center justify-center text-2xl font-bold shadow-lg group-hover:shadow-xl transition-shadow">
                    2
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-yellow-600 mb-2 group-hover:text-yellow-700 transition-colors">
                      Analyze
                    </h3>
                    <p className="text-gray-700 leading-relaxed">
                      The system sends real-time gaze data to an AI model, which
                      analyzes user behavior to detect if they are focused,
                      confused, or stuck on a particular section.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="animate-item" style={{ "--delay": "0.3s" }}>
              <div className="space-y-12">
                {/* Step 3 */}
                <div className="flex items-start space-x-6 group hover:-translate-x-1 transition-transform duration-300">
                  <div className="flex-shrink-0 w-16 h-16 rounded-full bg-gradient-to-r from-orange-500 to-red-500 text-white flex items-center justify-center text-2xl font-bold shadow-lg group-hover:shadow-xl transition-shadow">
                    3
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-orange-500 mb-2 group-hover:text-orange-600 transition-colors">
                      Understand
                    </h3>
                    <p className="text-gray-700 leading-relaxed">
                      AI identifies patterns such as prolonged staring, repeated
                      glances, or hesitation, signaling confusion. It then
                      summarizes the user's engagement to determine where they
                      need help.
                    </p>
                  </div>
                </div>

                {/* Step 4 */}
                <div className="flex items-start space-x-6 group hover:-translate-x-1 transition-transform duration-300">
                  <div className="flex-shrink-0 w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white flex items-center justify-center text-2xl font-bold shadow-lg group-hover:shadow-xl transition-shadow">
                    4
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-blue-600 mb-2 group-hover:text-blue-700 transition-colors">
                      Assist
                    </h3>
                    <p className="text-gray-700 leading-relaxed">
                      Without any manual input, EyeGaze Assist proactively
                      provides explanations, hints, or relevant resources to
                      guide the user toward better understanding—all in real
                      time!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div
            className="mt-20 rounded-2xl bg-white shadow-xl overflow-hidden animate-item"
            style={{ "--delay": "0.4s" }}
          >
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
              <h3 className="font-semibold text-xl">
                Learning Process Visualization
              </h3>
            </div>
            <div className="p-6 flex flex-col md:flex-row items-center justify-between">
              <div className="relative w-48 h-48 mb-8 md:mb-0">
                <div className="absolute inset-0 rounded-full border-4 border-dashed border-blue-200 animate-spin-slow"></div>
                <div className="absolute inset-4 rounded-full bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center">
                  <Glasses className="text-blue-500" size={48} />
                </div>
                <div className="absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-gradient-to-r from-yellow-400 to-orange-400 flex items-center justify-center shadow-lg pulse-animation">
                  <Eye className="text-white" size={24} />
                </div>
              </div>

              <div className="flex-1 md:pl-12 space-y-4">
                <div className="flex items-center">
                  <div className="w-4 h-4 rounded-full bg-blue-500 mr-3"></div>
                  <div className="text-gray-700 flex-1">
                    <span className="font-medium">Detection:</span> EyeGaze
                    identifies user focus points
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 rounded-full bg-yellow-500 mr-3"></div>
                  <div className="text-gray-700 flex-1">
                    <span className="font-medium">Analysis:</span> AI processes
                    patterns in real-time
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 rounded-full bg-green-500 mr-3"></div>
                  <div className="text-gray-700 flex-1">
                    <span className="font-medium">Solution:</span> Personalized
                    assistance appears instantly
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div
            className="text-center mt-16 animate-item"
            style={{ "--delay": "0.5s" }}
          >
            <div className="inline-block animate-float-slow">
              <div className="bg-gradient-to-r from-indigo-600 via-blue-500 to-cyan-400 text-white py-4 px-6 rounded-xl shadow-lg inline-block mx-auto transform transition-all duration-500 hover:scale-105 hover:shadow-xl">
                <p className="font-semibold">
                  ✨ Zero clicks, no typing—just seamless AI-driven learning! ✨
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-indigo-600 to-blue-800 text-white relative overflow-hidden">
        <div
          className="absolute inset-0 z-0 opacity-20"
          style={{
            backgroundImage:
              "radial-gradient(circle at 25% 25%, rgba(255, 255, 255, 0.2) 1px, transparent 1px), radial-gradient(circle at 75% 75%, rgba(255, 255, 255, 0.2) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
           
          }}
        ></div>

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <h2 className="text-4xl font-bold mb-6 animate-bounce-in">
            Join the Future of Learning – Get Started Today!
          </h2>
          <Button
            onClick={() => (window.location.href = "/dashboard")}
            className="bg-gradient-to-r m-4 cursor-pointer  from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-indigo-900 px-8 py-6 rounded-lg text-lg shadow-lg transition-all duration-500 hover:shadow-orange-300/30 hover:shadow-xl hover:scale-105 animate-bounce-in"
            style={{ "--delay": "0.3s" }}
          >
            Get Started <ArrowRight className="ml-2" size={20} />
          </Button>
          <Button
            onClick={() => (window.location.href = "/demo")}
            className="bg-gradient-to-r m-4  from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-indigo-900 px-8 py-6 rounded-lg text-lg shadow-lg transition-all duration-500 hover:shadow-orange-300/30 hover:shadow-xl hover:scale-105 animate-bounce-in"
          >
            Demo Trial <ArrowRight className="ml-2" size={20} />
          </Button>
        </div>
      </section>
    </div>
  );
}
