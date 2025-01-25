import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchLeaveRequests} from '../../features/employee/leaveSlice';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import { logoutUser } from '../../features/auth/authApi';

const Mhome = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { leaveRequests, status, error } = useSelector((state) => state.leave);

  useEffect(() => {
    dispatch(fetchLeaveRequests());
  }, [dispatch]);

  const handleRowClick = (employee_name) => {
    navigate(`/leaves/${employee_name}`);
  };


  const handleLogout = () => {
      dispatch(logoutUser()); // Dispatch the logout action
      navigate('/login'); // Redirect to the login page after logout
    };

  
  
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center">
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

      {/* Content */}
      <div className="mt-6 w-11/12 bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Leave Requests</h2>

        {status === 'loading' && <p className="text-gray-500">Loading leave requests...</p>}
        {status === 'failed' && <p className="text-red-500">{error || 'Failed to fetch leave requests.'}</p>}

        {status === 'succeeded' && leaveRequests.length === 0 && (
          <p className="text-gray-500">No leave requests available.</p>
        )}

        {status === 'succeeded' && leaveRequests.length > 0 && (
          <table className="table-auto w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-200 text-gray-600">
                <th className="px-4 py-2">Employee Name</th>
              </tr>
            </thead>
            <tbody>
            {[...new Set(leaveRequests.map(request => request.employee_name))].map((employee_name, index) => (
        <tr key={index} className="border-b hover:bg-gray-100"
          onClick={() => handleRowClick(employee_name)}
        >
          <td className='px-4 py-2 text-blue-500 underline'>{employee_name || 'N/A'}</td>
        </tr>
      ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Mhome;
