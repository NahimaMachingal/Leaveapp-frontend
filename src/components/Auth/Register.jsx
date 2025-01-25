// src/components/Auth/Register.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Formik, Field, Form, ErrorMessage } from 'formik'
import * as Yup from 'yup';


const Register = () => {
    const [formData, setFormData] = useState({ username: "", email: "", password: "" });
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

  

  const validationSchema = Yup.object({
    email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  
    username: Yup.string()
    .required('Username is required'),
    
    first_name: Yup.string()
    .required('First name is required'),
    
    last_name: Yup.string()
    .required('Last name is required'),
    
    password: Yup.string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters'),
    
    confirm_password: Yup.string()
    .required('Confirm password is required')
    .oneOf([Yup.ref('password'), null], 'Passwords must match'),
    
    user_type: Yup.string()
    .required('User type is required'),



  })


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };



  
  const handleSubmit = async (values) => {
    try {
      // Log the values to verify what's being sent
      console.log('Form values:', values);
      
      // Remove confirm_password since backend already validates it
      const { confirm_password, ...registrationData } = values;
  
      // Add password confirmation back to match backend expectation
      registrationData.confirm_password = values.confirm_password;
      
      console.log('Data being sent:', registrationData);
  
      const response = await axios.post("https://leaveapp-backend-rhbd.onrender.com/user/register/", registrationData);
      
      if (response.status === 201) {
        alert("Registration successful! Please login.");
        navigate("/login");
      }
    } catch (err) {
      console.error('Registration error:', err.response?.data);
      if (err.response?.data?.error) {
        setErrors({ general: err.response.data.error });
      } else {
        setErrors({ general: "Registration failed. Please try again." });
      }
    }
  };

  

  return (
    <div className="flex justify-center items-center h-screen bg-gray-400">
      <div className="bg-cyan-950 text-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold text-center mb-6">Registeration</h2>

          <Formik
            initialValues={{ email: '',username: '', first_name: '', last_name: '', password: '', confirm_password: '', user_type: 'employee',}}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >

          <Form >
            <div className="mb-4">
              <Field
                type="email"
                name="email"
                className="w-full p-3 bg-cyan-950 border border-cyan-500 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Email"
                
                
                
              />
              <ErrorMessage name="email" component="p" className="text-red-500 text-sm mt-1" />
</div>
            
            <div className="mb-4">
              <Field
                type="text"
                name="username"
                className="w-full p-3 bg-cyan-950 border border-cyan-500 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Username"
                
                
                
              />
              <ErrorMessage name="username" component="p" className="text-red-500 text-sm mt-1" />

            </div>
            <div className="mb-4">
              <Field
                type="text"
                name="first_name"
                className="w-full p-3 bg-cyan-950 border border-cyan-500 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="First Name"
                
                
              />
              <ErrorMessage name="first_name" component="p" className="text-red-500 text-sm mt-1" />

            
            
            <div className="mb-4">
            </div>
              <Field
                type="text"
                name="last_name"
                className="w-full p-3 bg-cyan-950 border border-cyan-500 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Last Name"
                
                
                
              />
              <ErrorMessage name="last_name" component="p" className="text-red-500 text-sm mt-1" />
            <div className="mb-4">
              </div>
              <Field
                type="password"
                name="password"
                className="w-full p-3 bg-cyan-950 border border-cyan-500 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Password"
                
                
                
              />
              <ErrorMessage name="password" component="p" className="text-red-500 text-sm mt-1" />
            </div>
            <div className="mb-4">
              <Field
                type="password"
                name="confirm_password"
                className="w-full p-3 bg-cyan-950 border border-cyan-500 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Confirm Password"
                
                
                
              />
              <ErrorMessage name="confirm_password" component="p" className="text-red-500 text-sm mt-1" />
</div>
            
            

            <div className="mb-4">
              <Field
              as="select"
                name="user_type"
                className="w-full p-3 bg-cyan-950 border border-cyan-500 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                
                
                
              >
                <option value="manager">Manager</option>
                <option value="employee">Employee</option>
              </Field>
              <ErrorMessage name="user_type" component="p" className="text-red-500 text-sm mt-1" />
            </div>
            <button type="submit" className="w-full p-3 bg-cyan-500 hover:bg-cyan-400 rounded focus:outline-none focus:ring-2 focus:ring-blue-500">
              Register
            </button>
          </Form>
          </Formik>

          {/* Already have an account? Link */}
          <div className="mt-4 text-center">
            <p>
              Already have an account?{' '}
              <span
                
                className="text-blue-400 hover:underline cursor-pointer"
                onClick={() => navigate('/login')}
              >
                Login
              </span>
            </p>
          </div>
        </div>
        {/* Right Section - Illustration */}
        
      </div>
    
  );
};

export default Register;
