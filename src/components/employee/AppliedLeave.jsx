import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchLeaveRequests } from '../../features/employee/leaveSlice';
import { logoutUser } from '../../features/auth/authApi';
import { useNavigate } from 'react-router-dom';
useNavigate
const AppliedLeave = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { leaveRequests, status, error } = useSelector((state) => state.leave);
  const user = useSelector((state) => state.auth.user);
  
  const userName = user?.first_name || user?.email || 'User';
  useEffect(() => {
    dispatch(fetchLeaveRequests());  // Fetch leave requests when the component mounts
  }, [dispatch]);

  const handleLogout = () => {
      dispatch(logoutUser()); // Dispatch the logout action
      navigate('/login'); // Redirect to the login page after logout
    };
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <nav className="bg-blue-600 w-full p-4">
  <div className="flex justify-between items-center">
    {/* Left Section: Welcome Message */}
    <div>
      <h2 className="text-lg font-semibold text-white">Welcome, {userName}</h2>
      
    </div>

    {/* Right Section: Navigation Links */}
    <div className="flex space-x-6">
      <button className="text-white" onClick={() => navigate('/ehome')}>
        Home
      </button>
      <p
        className="text-white px-4 py-2 rounded-lg  transition cursor-pointer"
        onClick={() => navigate('/appliedleave')}
      >
        Applied Leave
      </p>
      <button
        className="text-white px-4 py-2 rounded-lg transition"
        onClick={handleLogout}
      >
        Logout
      </button>
    </div>
  </div>
</nav>


      {/* Applied Leave Table */}
      <div className="h-screen flex items-center justify-center bg-gray-100">
        <div className="w-full bg-white p-8 shadow-lg rounded-lg">
          <h2 className="text-2xl font-semibold text-center text-gray-700 mb-6">Your Applied Leave Requests</h2>

          {status === 'loading' ? (
            <p>Loading...</p>
          ) : status === 'failed' ? (
            <p className="text-red-500">{error || 'Failed to load leave requests.'}</p>
          ) : (
            <>
              {/* Leave Requests Table */}
              <table className="min-w-full table-auto border-collapse">
                <thead>
                  <tr>
                    <th className="border-b px-4 py-2 text-left">Leave Type</th>
                    <th className="border-b px-4 py-2 text-left">Start Date</th>
                    <th className="border-b px-4 py-2 text-left">End Date</th>
                    <th className="border-b px-4 py-2 text-left">Status</th>
                    <th className="border-b px-4 py-2 text-left">Reason</th>
                    <th className="border-b px-4 py-2 text-left">Attachment</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.isArray(leaveRequests) && leaveRequests.length > 0  ? (
                    leaveRequests.map((leave) => (
                    <tr key={leave.id} className="border-b">
                      <td className="px-4 py-2">{leave.leave_type}</td>
                      <td className="px-4 py-2">{leave.start_date}</td>
                      <td className="px-4 py-2">{leave.end_date}</td>
                      <td className="px-4 py-2">{leave.status}</td>
                      <td className="px-4 py-2">{leave.reason}</td>
                      <td className="px-4 py-2">
  {leave.attachment ? (
    <a
      href={
        leave.attachment.startsWith('http')
          ? leave.attachment.replace('http://localhost:5173', 'https://leaveapp-backend-rhbd.onrender.com') // Replace if it's an absolute URL
          : `https://leaveapp-backend-rhbd.onrender.com${leave.attachment}` // Assume relative path otherwise
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
                    </tr>
    ))
  ) : (
    <tr>
      <td colSpan="6" className="text-center text-red-500">No leave requests found.</td>
    </tr>
  )}
                </tbody>
              </table>

              {/* Count of Requests */}
              <div className="mt-4 text-lg font-semibold">
                Total Leave Requests: {leaveRequests.length}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AppliedLeave;
