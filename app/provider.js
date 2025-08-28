"use client";
import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import axios from "axios";
import Calibration from "./components/calibration";
import Loading from "./components/Loading";

const Provider = ({ children }) => {
  const { user } = useUser();
  const [isCalibrated, setIsCalibrated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      CheckIsNewUser();
    } else {
      setLoading(false);
    }
  }, [user]);

  const CheckIsNewUser = async () => {
    try {
      const resp = await axios.post("/api/create-user", {
        userid: user?.id,
        username: user?.fullName,
        useremail: user?.emailAddresses[0]?.emailAddress,
      });
      
      setIsCalibrated(resp.data.calibrate === true);

      setLoading(false);
    } catch (error) {
      console.error("Error checking user:", error);
      setLoading(false);
    }
  };


  return <>
    {loading ? <Loading /> : <> {isCalibrated ? <Calibration /> : children}</>}
    </>
};

export default Provider;
