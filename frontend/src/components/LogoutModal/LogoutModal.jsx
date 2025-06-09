import React from 'react';

const LogoutModal = ({ setConfirmLogout, handleLogout }) => {
  return (
    <div>
      {/* Background Overlay */}
      <div
        onClick={() => setConfirmLogout(false)}
        className="fixed inset-0 bg-black bg-opacity-60 z-30"
      ></div>

      {/* Modal */}
      <div className="fixed z-40 left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#1e1e1e] text-white w-[90%] max-w-md rounded-2xl flex flex-col gap-4 shadow-xl p-6">
        <h2 className="text-lg text-center font-semibold mb-4">Are you sure you want to log out?</h2>

        <div className="flex justify-center gap-3">
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-md transition"
          >
            Yes, Logout
          </button>
          <button
            onClick={() => setConfirmLogout(false)}
            className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-md transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogoutModal;
