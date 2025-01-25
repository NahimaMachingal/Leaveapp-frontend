//Leaves.jsx

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchLeaveRequestsByEmployee, updateLeaveStatus } from '../../features/employee/leaveSlice';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, momentLocalizer } from 'react-big-calendar'; // Import the new calendar library
import 'react-big-calendar/lib/css/react-big-calendar.css'; // Import the CSS for the calendar
import { getLeaveTileClassName, getLeaveDays } from '../utils/LeaveUtils';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import moment from 'moment'; // To handle date formatting
import { logoutUser } from '../../features/auth/authApi';
const Leaves = () => {
  const { employee_name } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { employeeLeaves, status, error } = useSelector((state) => state.leave);
  const user = useSelector((state) => state.auth.user);

  const [date, setDate] = useState(new Date());

  useEffect(() => {
    dispatch(fetchLeaveRequestsByEmployee(employee_name));
  }, [dispatch, employee_name]);

  const handleStatusChange = (leaveId, newStatus) => {
    toast.info('Status changed Successfully');
    dispatch(updateLeaveStatus({ leaveId, newStatus }));
  };

  const handleLogout = () => {
        dispatch(logoutUser()); // Dispatch the logout action
        navigate('/login'); // Redirect to the login page after logout
      };

  const leaveTypes = {
    annual: 'bg-yellow-400',
    sick: 'bg-red-500',
    casual: 'bg-green-400',
    other: 'bg-blue-500',
  };

  // Get total leave count
  const totalLeaves = employeeLeaves.length;


  const CustomToolbar = ({ onNavigate, date }) => {
    const currentMonthYear = date.toLocaleString('default', { month: 'long', year: 'numeric' });
    return (
      <div className="flex justify-between items-center mb-4">
        <div className="text-xl font-bold mb-2">{currentMonthYear}</div>
      <div className="flex justify-between items-center w-full">
        <button
          className="text-black font-bold py-2 px-4 rounded"
          onClick={() => onNavigate('PREV')}
        >
          Previous
        </button>
        <button
          className=" text-black font-bold py-2 px-4 rounded"
          onClick={() => onNavigate('TODAY')}
        >
          Today
        </button>
        <button
          className="text-black font-bold py-2 px-4 rounded"
          onClick={() => onNavigate('NEXT')}
        >
          Next
        </button>
      </div>
      </div>
    );
  };
  


  // Create a localizer for react-big-calendar
  const localizer = momentLocalizer(moment);

  // Filter the events to only include approved leaves
  const events = getLeaveDays(employeeLeaves.filter(leave => leave.status === 'approved')).map((leave) => ({
    title: `${leave.leaveType} Leave`,
    start: new Date(leave.date),
    end: new Date(leave.date),
    allDay: true,
    leaveType: leave.leaveType,
  }));

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center px-4 py-6">
      {/* Navbar */}
      <nav className="bg-blue-600 w-full p-4">
        <div className="flex justify-between items-center">
          <div className="text-white font-semibold text-xl"></div>
          <div className="space-x-4">
            <button className="text-white" onClick={() => navigate('/mhome')}>Home</button>
            <button className="text-white" onClick={() => navigate('/pending-leaves')}>Pending Leaves</button>
            <button
          className="text-white px-4 py-2 rounded-lg transition"
          onClick={handleLogout} // Handle logout on click
        >
          Logout
        </button>
          </div>
        </div>
      </nav>
      <div className="bg-white shadow-md w-full py-4 px-6 flex justify-between items-center mb-8 rounded-lg">
        <h1 className="text-xl font-semibold text-gray-700 text-center">Leave Details for {employee_name}</h1>
      </div>

      <div className="w-full md:w-10/12 lg:w-8/12 xl:w-7/12 bg-white shadow-lg rounded-lg p-6">
        {status === 'loading' && <p className="text-gray-500">Loading leave details...</p>}
        {status === 'failed' && <p className="text-red-500">{error || 'Failed to fetch leave details.'}</p>}

        {status === 'succeeded' && employeeLeaves.length === 0 && (
          <p className="text-gray-500">No leaves found for {employee_name}.</p>
        )}

        {status === 'succeeded' && employeeLeaves.length > 0 && (
          <>
          <div className="mb-4">
              <h2 className="font-bold text-lg">Total Leaves: {totalLeaves}</h2>
            </div>
            <table className="table-auto w-full text-left border-collapse mb-6">
              <thead>
                <tr className="bg-gray-200 text-gray-600">
                  <th className="px-4 py-2">Leave Type</th>
                  <th className="px-4 py-2">Attachment</th>
                  <th className="px-4 py-2">Start Date</th>
                  <th className="px-4 py-2">End Date</th>
                  <th className="px-4 py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {employeeLeaves.map((leave) => (
                  <tr key={leave.id} className="border-b hover:bg-gray-100">
                    <td className="px-4 py-2">{leave.leave_type}</td>
                    <td className="px-4 py-2">
  {leave.attachment ? (
    <a
      href={
        leave.attachment.startsWith('http')
          ? leave.attachment.replace('http://localhost:5173', 'http://localhost:8000') // Replace if it's an absolute URL
          : `http://localhost:8000${leave.attachment}` // Assume relative path otherwise
      }
      target="_blank"
      rel="noopener noreferrer"
      className="text-blue-500 hover:underline"
    >
      View Attachment
    </a>
  ) : (
    <span>No attachment</span>
  )}
</td>

                    <td className="px-4 py-2">{leave.start_date}</td>
                    <td className="px-4 py-2">{leave.end_date}</td>
                    <td className="px-4 py-2">
                      {user?.user_type === 'manager' ? (
                        <select
                          className="border border-gray-300 p-1 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
                          value={leave.status}
                          onChange={(e) => handleStatusChange(leave.id, e.target.value)}
                        >
                          <option value="pending">Pending</option>
                          <option value="approved">Approved</option>
                          <option value="rejected">Rejected</option>
                        </select>
                      ) : (
                        leave.status
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
                <br></br>
                <h2 className='font-bold text-3xl'>Calendar View</h2>
            <div className="mt-6">
              <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                style={{ height: 500 }}
                eventPropGetter={(event) => ({
                  className: leaveTypes[event.leaveType] || 'bg-gray-400',
                })}
                toolbar={true}
                components={{
                  toolbar: CustomToolbar, // Use your custom toolbar
                }}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Leaves;