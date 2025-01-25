import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPendingLeaves } from '../../features/employee/leaveSlice';
import { useNavigate } from 'react-router-dom';
import { logoutUser } from '../../features/auth/authApi';

const PendingLeave = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { pendingLeaves, status, error } = useSelector((state) => state.leave);

  useEffect(() => {
    dispatch(fetchPendingLeaves());
  }, [dispatch]);

  const handleLogout = () => {
          dispatch(logoutUser()); // Dispatch the logout action
          navigate('/login'); // Redirect to the login page after logout
        };
  const handleRowClick = (employee_name) => {
          // Navigate to the Leaves page for the corresponding employee
      navigate(`/leaves/${employee_name}`);
        };
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center">
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
      <div className="bg-white shadow-md w-full py-4 px-6 flex justify-between items-center">
        <h1 className="text-xl font-semibold text-gray-700">Pending Leave Requests</h1>
        
      </div>

      <div className="mt-6 w-11/12 bg-white shadow-lg rounded-lg p-6">
        {status === 'loading' && <p className="text-gray-500">Loading pending leave requests...</p>}
        {status === 'failed' && <p className="text-red-500">{error || 'Failed to fetch pending leaves.'}</p>}

        {status === 'succeeded' && pendingLeaves.length === 0 && (
          <p className="text-gray-500">No pending leave requests available.</p>
        )}

        {status === 'succeeded' && pendingLeaves.length > 0 && (
          <table className="table-auto w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-200 text-gray-600">
                <th className="px-4 py-2">Employee Name</th>
                <th className="px-4 py-2">Leave Type</th>
                <th className='px-4 py-2'>Attachment</th>
                <th className="px-4 py-2">Start Date</th>
                <th className="px-4 py-2">End Date</th>
              </tr>
            </thead>
            <tbody>
              {pendingLeaves.map((leave) => (
                <tr key={leave.id} className="border-b hover:bg-gray-100">
                  <td
                    className="px-4 py-2 text-blue-500 cursor-pointer"
                    onClick={() => handleRowClick(leave.employee_name)} // Navigate on click
                  >
                    {leave.employee_name}
                  </td>
                  <td className="px-4 py-2">{leave.leave_type}</td>
                  <td className="px-4 py-2">
            {leave.attachment ? (
              <a
                href={leave.attachment}
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
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default PendingLeave;
