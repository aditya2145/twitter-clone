import React from "react";

const Loader = () => {
  return (
    <div className="flex bg-black justify-center items-center h-full w-full">
      <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
};

export default Loader;
