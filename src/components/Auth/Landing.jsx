import React from 'react';
import { Link } from 'react-router-dom';

const Landing = () => {
  return (
    <div
      className="relative w-screen h-screen bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url('/kkk.jpg')` }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-black opacity-50"></div>

      {/* Top-Right Content */}
      <div className="absolute top-10 right-20 text-right z-10 px-6 py-4">
        <h1 className="text-5xl md:text-6xl font-extrabold text-white shadow-lg mb-8 animate__animated animate__fadeIn">
          Welcome...
        </h1>
        <div className="flex justify-end space-x-6">
          <Link to="/login">
            <button className="bg-gradient-to-r from-blue-500 to-blue-700 text-white py-3 px-8 rounded-lg hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-2xl transform">
              Login
            </button>
          </Link>
          <Link to="/register">
            <button className="bg-gradient-to-r from-green-500 to-green-700 text-white py-3 px-8 rounded-lg hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-2xl transform">
              Register
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Landing;
