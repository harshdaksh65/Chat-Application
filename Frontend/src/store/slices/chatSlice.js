import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../lib/axios";

export const getUsers = createAsyncThunk("/messages/users" , async(_, thunkAPI)=>{
    try {
        const res = await axios.get('/messages/users');
        return res.data.users;

    } catch (error) {
        toast.error(error.response.data.message);
        return thunkAPI.rejectWithValue(error.response?.data?.message);
    }
})

export const getMessages = createAsyncThunk(
  "/messages/:id",
  async (userId ,thunkAPI) => {
    try {
      const res = await axios.get(`/messages/${userId}`);
      return res.data;
    } catch (error) {
      toast.error(error.response.data.message);
      return thunkAPI.rejectWithValue(error.response?.data?.message)
    }
  }
);

export const sendMessage = createAsyncThunk(
  '/messages/send/:id',
  async (formData, thunkAPI) => {
    try {
      const { chat } = thunkAPI.getState();
      const userId = chat?.selectedUser?._id;

      if (!userId) {
        throw new Error("No user selected to send message");
      }

      const res = await axios.post(
        `/messages/send/${userId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data", // ✅ REQUIRED for FormData
          },
        }
      );

      return res.data;
    } catch (error) {
      console.error("Send message error:", error);
      toast.error(error.response?.data?.message || error.message);
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);


const chatSlice = createSlice({
  name: "chat",
  initialState: {
    messages: [],
    users: [],
    selectedUser: null,
    isUsersLoading: false,
    isMessagesLoading: false,
  },
  reducers: {
    setSelectedUser: (state, action) => {
      state.selectedUser = action.payload;
    },
    pushNewMessage: (state, action) => {
      state.messages.push(action.payload);
    },
  },
  extraReducers: (builder)=>{
    builder.addCase(getUsers.pending, (state)=>{
        state.isUsersLoading = true;
    })
    .addCase(getUsers.fulfilled , (state,action)=>{
        state.users = action.payload;
        state.isUsersLoading = false;
    })
    .addCase(getUsers.rejected ,(state)=>{
        state.isUsersLoading = false;
    })
    .addCase(getMessages.pending, (state) => {
      state.isMessagesLoading = true;
    })
    .addCase(getMessages.fulfilled, (state, action) => {
      state.messages = action.payload.messages;
      state.isMessagesLoading = false;
    })
    .addCase(getMessages.rejected, (state,action)=>{
      state.isMessagesLoading = false;
    })
    .addCase(sendMessage.fulfilled ,(state,action)=>{
      state.messages.push(action.payload);
    })
  },
});

export const { setSelectedUser, pushNewMessage } = chatSlice.actions;
export default chatSlice.reducer;