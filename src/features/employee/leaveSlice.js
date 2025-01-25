// leaveSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'react-toastify'; 

// Base URL for API
const BASE_URL = `${import.meta.env.VITE_API_URL}`;

// Async thunk for submitting leave request
export const submitLeaveRequest = createAsyncThunk(
  'leave/submitLeaveRequest',
  async (leaveData, {getState, rejectWithValue }) => {
    try {
      const state = getState();
      const accessToken = state.auth.accessToken;
      const response = await axios.post(`${BASE_URL}/leave-requests/`, leaveData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Async thunk for fetching leave requests
export const fetchLeaveRequests = createAsyncThunk(
  'leave/fetchLeaveRequests',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const accessToken = state.auth.accessToken;
      const response = await axios.get(`${BASE_URL}/leave-requests/`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Fetch leave requests by employee
export const fetchLeaveRequestsByEmployee = createAsyncThunk(
  'leave/fetchLeaveRequestsByEmployee',
  async (employee_name, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const accessToken = state.auth.accessToken;
      const response = await axios.get(`${BASE_URL}/mleave-requests/?employee_name=${employee_name}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Fetch pending leaves
export const fetchPendingLeaves = createAsyncThunk(
  'leave/fetchPendingLeaves',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const accessToken = state.auth.accessToken;
      const response = await axios.get(`${BASE_URL}/mleave-requests/?status=pending`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Async thunk to update leave status
export const updateLeaveStatus = createAsyncThunk(
  'leave/updateLeaveStatus',
  async ({ leaveId, newStatus }, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const accessToken = state.auth.accessToken;
      const response = await axios.patch(
        `${BASE_URL}/update-status/${leaveId}/`, 
        { status: newStatus }, 
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      
      return response.data;
    } catch (error) {
      
      return rejectWithValue(error.response?.data || 'Failed to update leave status');
    }
  }
);



const leaveSlice = createSlice({
  name: 'leave',
  initialState: {
    leaveRequests: [],
    employeeLeaves: [],
    pendingLeaves: [],
    status: 'idle',
    error: null,
  },
  reducers: {
    // Optional reducers for state reset, if needed
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitLeaveRequest.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(submitLeaveRequest.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.leaveRequests = action.payload
      })
      .addCase(submitLeaveRequest.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(fetchLeaveRequests.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchLeaveRequests.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.leaveRequests = action.payload;
      })
      .addCase(fetchLeaveRequests.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(fetchLeaveRequestsByEmployee.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchLeaveRequestsByEmployee.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.employeeLeaves = action.payload;
      })
      .addCase(fetchLeaveRequestsByEmployee.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(fetchPendingLeaves.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchPendingLeaves.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.pendingLeaves = action.payload;
      })
      .addCase(fetchPendingLeaves.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(updateLeaveStatus.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateLeaveStatus.fulfilled, (state, action) => {
        state.status = 'succeeded';
        // Update the leave request in the store
        const updatedLeave = action.payload;
        state.employeeLeaves = state.employeeLeaves.map(leave =>
          leave.id === updatedLeave.id ? updatedLeave : leave
        );
      })
      .addCase(updateLeaveStatus.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export default leaveSlice.reducer;
