import React from "react";
import { Link } from "react-router-dom";

const Unauthorized = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold mb-4">403 - Unauthorized</h1>
      <p className="text-xl mb-8">
        You don't have permission to access this page.
      </p>
      <Link
        to="/"
        className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
      >
        Go to Home
      </Link>
    </div>
  );
};

export default Unauthorized;
