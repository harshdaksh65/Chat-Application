import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from '../../lib/axios';
import { connectSocket, disconnectSocket } from '../../lib/Socket';
import { toast } from 'react-toastify';

export const getUsers = createAsyncThunk("users/me", async (_, { thunkAPI }) => {
    try {
        const res = await axios.get('/users/me');
        connectSocket(res.data.user);
        return res.data.user;
    } catch (error) {
        console.error("Error fetching user data:", error);
        return thunkAPI.rejectWithValue(error.response?.data || 'Failed to fetch user data');
    }
});

export const logout = createAsyncThunk("users/signout", async (_, thunkAPI) => {
    try {
        await axios.get('/users/signout');
        disconnectSocket();
        return null; // Return null to indicate successful logout
    } catch (error) {
        toast.error(error.response.data.message || 'Failed to log out');
        return thunkAPI.rejectWithValue(error.response.data.message || 'Failed to log out');
        
    }
})

export const login = createAsyncThunk("users/signin", async (data, thunkAPI) => {
    try {
        const res = await axios.post('/users/signin',data);
        connectSocket(res.data);
        toast.success("logged in successfully");
        return res.data;
    } catch (error) {
        toast.error(error.response.data.message || 'Failed to log in');
        return thunkAPI.rejectWithValue(error.response.data.message || 'Failed to log in');
        
    }
})

export const signup = createAsyncThunk("auth/signup" , async(data,thunkAPI) =>{
    try {
        const res = await axios.post('/users/signup',data);
        connectSocket(res.data);
        toast.success("Account created successfully!");
        return res.data;
    } catch (error) {
        toast.error(error.response.data.message || 'Failed to sign Up');
        return thunkAPI.rejectWithValue(error.response.data.message || 'Failed to sign Up');
    }
})

export const updateProfile = createAsyncThunk("/users/update-profile", async(data,thunkAPI)=>{
    try {
        const res = await axios.put("/users/update-profile" ,data);
        toast.success("profile updated successfully");
        return res.data;
    } catch (error) {
        toast.error(error.response.data.message);
        return thunkAPI.rejectWithValue(error.response.data.message);
    }
})

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        authUser: null,
        isSigningUp: false,
        isLoggingIn: false,
        isUpdatingProfile: false,
        isCheckingAuth: true,
        onlineUsers: [],
},
    reducers: {
        setOnlineUsers(state, action) {
            state.onlineUsers = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(getUsers.fulfilled, (state, action) => {
            state.authUser = action.payload;
            state.isCheckingAuth = false;
        })
        .addCase(getUsers.rejected, (state, action) => {
            state.authUser = null;
            state.isCheckingAuth = false;
        })
        .addCase(logout.fulfilled, (state) => {
            state.authUser = null;
            
        })
        .addCase(logout.rejected, (state) => {
            state.authUser = state.authUser; // Keep the user state unchanged on logout failure
        })
        .addCase(login.pending, (state)=>{
            state.isLoggingIn = true;
        })
        .addCase(login.fulfilled ,(state,action)=>{
            state.authUser = action.payload;
            state.isLoggingIn = false;
        })
        .addCase(login.rejected, (state)=>{
            state.isLoggingIn = false;
        })
        .addCase(signup.pending , (state)=>{
            state.isSigningUp = true;
        })
        .addCase(signup.fulfilled, (state, action)=>{
            state.authUser = action.payload;
            state.isSigningUp = false;
        })
        .addCase(signup.rejected, (state)=>{
            state.isSigningUp = false;
        })
        .addCase(updateProfile.pending , (state)=>{
            state.isUpdatingProfile = true;
        })
        .addCase(updateProfile.fulfilled, (state, action)=>{
            state.authUser = action.payload;
            state.isUpdatingProfile = false;
        })
        .addCase(updateProfile.rejected, (state)=>{
            state.isUpdatingProfile = false;
        })
    }
})

export const { setOnlineUsers } = authSlice.actions;

export default authSlice.reducer;