"use client";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

export default function Loading() {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="h-[200px] w-[200px] ">
        <DotLottieReact
          src="https://lottie.host/2c0c70ca-016d-442c-b8fa-2f8207125650/ITrUG1H2h4.lottie"
          loop
          autoplay
        />
      </div>
    </div>  );
}
