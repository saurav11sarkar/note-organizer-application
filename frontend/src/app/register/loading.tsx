import { Loader } from "lucide-react";
import React from "react";

const Loading = () => {
  return (
    <div className="min-h-screen flex justify-center items-center">
      <Loader className="w-10 h-10 animate-spin" />
    </div>
  );
};

export default Loading;
