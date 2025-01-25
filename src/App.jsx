import { BrowserRouter as Router,Routes,Route } from "react-router-dom"
import './tailwind.css';
import React from 'react';
import Landing from "./components/Auth/Landing";
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Mhome from "./components/Auth/Mhome"
import Ehome from "./components/Auth/Ehome"
import { ToastContainer } from "react-toastify";
import AppliedLeave from "./components/employee/AppliedLeave";
import Leaves from "./components/manager/Leaves";
import PendingLeave from "./components/manager/PendingLeave";
import AuthHOC from "./components/AuthHOC";


const App = () => {
  const restrictedPaths = [
    "/ehome",
    "/mhome",
    "/appliedleave",
    "/leaves/:employee_name",
    "/pending-leaves",
  ]
  return (
    <>
    <ToastContainer position="top-center" autoClose={2000} />
    <Router>
      <Routes>
      <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/ehome" element={
          <AuthHOC restrictedPaths={restrictedPaths}>
          <Ehome />
          </AuthHOC>
        } />
        <Route path="/mhome" element={
          <AuthHOC restrictedPaths={restrictedPaths}>
          <Mhome />
          </AuthHOC>
          } />
        <Route path="/appliedleave" element={
          <AuthHOC restrictedPaths={restrictedPaths}>
          <AppliedLeave />
          </AuthHOC>
          } />
        <Route path="/leaves/:employee_name" element={
          <AuthHOC restrictedPaths={restrictedPaths}>
          <Leaves />
          </AuthHOC>
          } />
        <Route path="/pending-leaves" element={
          <AuthHOC restrictedPaths={restrictedPaths}>
          <PendingLeave />
          </AuthHOC>
          } />
        </Routes>
        </Router>
        </>
      );
};

export default App;