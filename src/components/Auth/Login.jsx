// src/components/Auth/Login.jsx

import React, {  useState } from 'react';
import { useDispatch } from 'react-redux';
import { loginUser } from '../../features/auth/authApi';
import { useNavigate } from 'react-router-dom';
import { Formik, Field, Form, ErrorMessage } from 'formik'
import * as Yup from 'yup';
import { useSelector } from 'react-redux';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState('jobseeker'); // Added userType state
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false); // Loading state
  const dispatch = useDispatch();
  const navigate = useNavigate();
 
  // Access token and user info from the Redux store
  const { token, userType: storeUserType } = useSelector((state) => state.auth);

  const validationSchema = Yup.object({

    email: Yup.string()
     .email('Invalid email address')
     .required('Email is required'),
    password: Yup.string()
     .min(6, 'Password must be at least 6 characters')
     .required('Password is required'),
  })

  

  
  const handleLogin = async (values) => {
    const { email, password } = values;
    setLoading(true);
    try {
      const response = await dispatch(loginUser({ email, password})); // Include user_type in the login request
  
      const userType = response.user.user_type;
  
        if (userType === 'manager') {
          navigate('/mhome'); // Redirect to User Home
        } else if (userType === 'employee') {
          navigate('/ehome'); // Redirect to Employee Home
        }
      
    } catch (error) {
      console.error('Error during login:', error);
      setError('User is not verified');
    } finally {
      setLoading(false); // Stop loader after login attempt
    }
  };

  const handleRegisterRedirect = () => {
    navigate('/register');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-400">
      <div className="bg-gray-800 text-white p-8 rounded-md shadow-lg w-full max-w-md relative border border-cyan-500">
        <div className="absolute inset-0 rounded-md bg-gradient-to-r from-teal-900 to-cyan-800 blur-md opacity-25"></div>
        <div className="relative">
          <h1 className="text-2xl font-bold text-center mb-4">Login</h1>
          <Formik
            initialValues={{ email: '', password: '' }}
            validationSchema={validationSchema}
            onSubmit={handleLogin}
          >
          <Form>
              <div className="mb-4">
                <Field
                  type="email"
                  name="email"
                  className="w-full p-3 bg-transparent border border-cyan-500 rounded text-white focus:ring-2 focus:ring-cyan-500 outline-none"
                  placeholder="Email Address"
                />
                <ErrorMessage name="email" component="p" className="text-red-500 text-sm mt-1" />
              </div>

              <div className="mb-4">
                <Field
                  type="password"
                  name="password"
                  className="w-full p-3 bg-transparent border border-cyan-500 rounded text-white focus:ring-2 focus:ring-cyan-500 outline-none"
                  placeholder="Password"
                />
                <ErrorMessage name="password" component="p" className="text-red-500 text-sm mt-1" />
              </div>

           
            <button type="submit" className="w-full py-2 px-4 bg-cyan-500 text-white rounded hover:bg-cyan-600 transition duration-300 flex items-center justify-center"
            disabled={loading}
            
            >
              {loading ? (
                  <span className="loader animate-spin w-4 h-4 border-2 border-white rounded-full"></span>
                ) : (
                  'Login'
                )}
            </button>
          </Form>
          </Formik>
          <div className="mt-4 text-center">
            <p>
              Don't have an account?{' '}
              <span
                onClick={handleRegisterRedirect}
                className="text-cyan-500 hover:underline cursor-pointer"
              >
                Sign Up
              </span>
            </p>
          </div>
        </div>
        </div>
        </div>
        
  );
};

export default Login;
