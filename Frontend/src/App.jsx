import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { getUsers, setOnlineUsers } from './store/slices/authSlice';
import { Loader} from 'lucide-react'
import { BrowserRouter as Router ,Route,Routes, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import { connectSocket, disconnectSocket } from './lib/Socket';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import { ToastContainer } from 'react-toastify';

function App() {

  const { authUser, isCheckingAuth } = useSelector((state) => state.auth);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getUsers());
  }, [getUsers]);


  useEffect(()=>{
    if(authUser) {
      const socket = connectSocket(authUser._id);

      socket.on('getOnlineUsers', (Users) => {
        dispatch(setOnlineUsers(Users));
      });

      return () => {
        disconnectSocket();
      }
    }
  }, [authUser]);

  if (isCheckingAuth && !authUser) {
    return (
      <div className='flex items-center justify-center h-screen'>
        <Loader className='size-10 animate-spin'/>
      </div>
    )
  }

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path='/' element={authUser ? <Home/> : <Navigate to='/login' />} />
        <Route path='/register' element={!authUser ? <Register /> : <Navigate to='/' />} />
        <Route path='/login' element={!authUser ? <Login /> : <Navigate to='/' />} />
        <Route path='/profile' element={authUser ? <Profile /> : <Navigate to='/login' />} />
        <Route path='*' element={<Navigate to='/' />} />
      </Routes>
      <ToastContainer/>
    </Router>
  )
}

export default App