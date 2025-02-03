// Ehome.jsx
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { fetchLeaveRequests, submitLeaveRequest } from '../../features/employee/leaveSlice';
import { useNavigate } from 'react-router-dom';
import { logoutUser } from '../../features/auth/authApi';
import { useFormik } from 'formik';
import * as Yup from 'yup';

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
  });

  const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format
  const maxFutureDate = new Date();
  maxFutureDate.setDate(maxFutureDate.getDate() + 45); // Set max future leave to 45 days from today
  const maxDateString = maxFutureDate.toISOString().split('T')[0];


  const validationSchema = Yup.object({
    leave_type: Yup.string().required('Leave type is required'),
    start_date: Yup.date().required('Start date is required')
    .min(today, 'Start date cannot be in the past'),
    end_date: Yup.date()
      .required('End date is required')
      .min(Yup.ref('start_date'), 'End date must be after start date')
      .max(maxDateString, 'Leave cannot be booked more than 45 days in advance'),
    reason: Yup.string()
      .required('Reason is required')
      .min(10, 'Reason must be at least 10 characters'),
     // Optional file validation
  });

  const formik = useFormik({
    initialValues: {
      leave_type: '',
      start_date: '',
      end_date: '',
      reason: '',
      
    },
    validationSchema,
  onSubmit: async (values, { resetForm }) => {
    try {
      const data = new FormData();
      data.append('leave_type', values.leave_type);
      data.append('start_date', values.start_date);
      data.append('end_date', values.end_date);
      data.append('reason', values.reason);

      await dispatch(submitLeaveRequest(data)).unwrap(); // Ensure successful dispatch
      toast.success('Leave applied successfully');

      resetForm(); // ✅ Reset form fields
      setTimeout(() => navigate('/appliedleave'), 1000); // ✅ Redirect after 1s delay
    } catch (error) {
      toast.error('Failed to submit leave request');
    }
  },
});


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  

  // Fetch leave requests on component mount
  useEffect(() => {
    dispatch(fetchLeaveRequests());
  }, [dispatch]);

 

  const handleLogout = () => {
    dispatch(logoutUser()); // Dispatch the logout action
    navigate('/login'); // Redirect to the login page after logout
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
          <form onSubmit={formik.handleSubmit} className="space-y-4">
            {/* Leave Type */}
            <div>
              <label htmlFor="leave_type" className="block text-sm font-medium text-gray-600">
                Leave Type
              </label>
              <select
              
                name="leave_type"
                id="leave_type"
                value={formik.leave_type}
                requiredvalue={formik.values.leave_type}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-9/12 px-4 py-2 mt-1 border rounded-lg focus:ring focus:ring-indigo-300 mx-auto"
              >
                <option value="">Select Leave Type</option>
                <option value="annual">Annual Leave</option>
                <option value="sick">Sick Leave</option>
                <option value="casual">Casual Leave</option>
                <option value="other">Other</option>
              </select>
              {formik.touched.leave_type && formik.errors.leave_type && (
                <p className="text-red-500">{formik.errors.leave_type}</p>
              )}
            </div>

            {/* Start Date */}
            <div>
              <label htmlFor="start_date" className="block text-sm font-medium text-gray-600">
                Start Date
              </label>
              <input
                type="date"
                name="start_date"
                min={today}  // Prevent past dates
                max={maxDateString}  // Restrict leave in the far future
                id="start_date"
                value={formik.values.start_date}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-9/12 px-4 py-2 mt-1 border rounded-lg focus:ring focus:ring-indigo-300"
              />
              {formik.touched.start_date && formik.errors.start_date && (
                <p className="text-red-500">{formik.errors.start_date}</p>
              )}
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
                value={formik.values.end_date}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-9/12 px-4 py-2 mt-1 border rounded-lg focus:ring focus:ring-indigo-300"
              />
              {formik.touched.end_date && formik.errors.end_date && (
                <p className="text-red-500">{formik.errors.end_date}</p>
              )}
            </div>

            {/* Reason */}
            <div>
              <label htmlFor="reason" className="block text-sm font-medium text-gray-600">
                Reason
              </label>
              <textarea
                name="reason"
                id="reason"
                value={formik.values.reason}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-9/12 px-4 py-2 mt-1 border rounded-lg focus:ring focus:ring-indigo-300"
              />
              {formik.touched.reason && formik.errors.reason && (
                <p className="text-red-500">{formik.errors.reason}</p>
              )}
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

