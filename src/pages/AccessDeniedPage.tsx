import React from "react";
import { useNavigate } from "react-router-dom";

const AccessDeniedPage: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900">
      <div className="bg-zinc-800 p-8 rounded-lg shadow-lg text-center">
        <h1 className="text-3xl font-bold text-red-500 mb-4">Access Denied</h1>
        <p className="text-gray-200 mb-6">
          You do not have permission to view this page.
        </p>
        <button
          className="px-6 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
          onClick={() => navigate("/")}
        >
          Go to Home
        </button>
      </div>
    </div>
  );
};

export default AccessDeniedPage;
