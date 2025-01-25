// Ehome.jsx
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { fetchLeaveRequests, submitLeaveRequest } from '../../features/employee/leaveSlice';
import { useNavigate } from 'react-router-dom';
import { logoutUser } from '../../features/auth/authApi';


const Ehome = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();  
  const user = useSelector((state) => state.auth.user); // Assuming auth state stores user info
  const userName = user?.first_name || user?.email || 'User';
  const { status, error, leaveRequests } = useSelector((state) => state.leave);
  const [formData, setFormData] = useState({
    leave_type: '',
    start_date: '',
    end_date: '',
    reason: '',
    attachment: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, attachment: e.target.files[0] });
  };

  // Fetch leave requests on component mount
  useEffect(() => {
    dispatch(fetchLeaveRequests());
  }, [dispatch]);

 

  const handleLogout = () => {
    dispatch(logoutUser()); // Dispatch the logout action
    navigate('/login'); // Redirect to the login page after logout
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('leave_type', formData.leave_type);
    data.append('start_date', formData.start_date);
    data.append('end_date', formData.end_date);
    data.append('reason', formData.reason);
    if (formData.attachment) {
      data.append('attachment', formData.attachment);
    }
    dispatch(submitLeaveRequest(data))
    .then(() => {
      toast.success('Leave applied successfully'); // Dispatch the FormData object
    });
  };

  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Top Bar */}

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
        className="text-white px-4 py-2 rounded-lg transition cursor-pointer"
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



      

      {/* Form Container */}
      <div className="flex items-center justify-center mt-10">
        <div className="w-full bg-white p-8 shadow-lg rounded-lg">
          <h2 className="text-3xl font-bold text-center text-gray-700 mb-6">Leave Request Form</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Leave Type */}
            <div>
              <label htmlFor="leave_type" className="block text-sm font-medium text-gray-600">
                Leave Type
              </label>
              <select
                name="leave_type"
                id="leave_type"
                value={formData.leave_type}
                onChange={handleChange}
                required
                className="w-9/12 px-4 py-2 mt-1 border rounded-lg focus:ring focus:ring-indigo-300 mx-auto"
              >
                <option value="" disabled>Select Leave Type</option>
                <option value="annual">Annual Leave</option>
                <option value="sick">Sick Leave</option>
                <option value="casual">Casual Leave</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Start Date */}
            <div>
              <label htmlFor="start_date" className="block text-sm font-medium text-gray-600">
                Start Date
              </label>
              <input
                type="date"
                name="start_date"
                id="start_date"
                value={formData.start_date}
                onChange={handleChange}
                required
                className="w-9/12 px-4 py-2 mt-1 border rounded-lg focus:ring focus:ring-indigo-300"
              />
            </div>

            {/* End Date */}
            <div>
              <label htmlFor="end_date" className="block text-sm font-medium text-gray-600">
                End Date
              </label>
              <input
                type="date"
                name="end_date"
                id="end_date"
                value={formData.end_date}
                onChange={handleChange}
                required
                className="w-9/12 px-4 py-2 mt-1 border rounded-lg focus:ring focus:ring-indigo-300"
              />
            </div>

            {/* Reason */}
            <div>
              <label htmlFor="reason" className="block text-sm font-medium text-gray-600">
                Reason
              </label>
              <textarea
                name="reason"
                id="reason"
                value={formData.reason}
                onChange={handleChange}
                required
                className="w-9/12 px-4 py-2 mt-1 border rounded-lg focus:ring focus:ring-indigo-300"
              />
            </div>

            {/* Attachment */}
            <div>
              <label htmlFor="attachment" className="block text-sm font-medium text-gray-600">
                Attachment
              </label>
              <input
                type="file"
                name="attachment"
                id="attachment"
                onChange={handleFileChange}
                className="w-9/12 px-4 py-2 mt-1 border rounded-lg focus:ring focus:ring-indigo-300"
              />
            </div>


            {/* Submit Button */}
            <button
              type="submit"
              className=" px-4 py-2 text-white bg-indigo-600 rounded-lg hover:bg-indigo-500 focus:outline-none focus:ring focus:ring-indigo-300"
            >
              {status === 'loading' ? 'Submitting...' : 'Submit Request'}
            </button>
          </form>

          {/* Status/Error Messages */}
          
          {status === 'failed' && <p className="text-red-500">{error || 'Failed to submit leave request.'}</p>}
        </div>
      </div>
    </div>
  );
};

export default Ehome;
