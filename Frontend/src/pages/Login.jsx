import { Eye, EyeOff, Loader, Loader2, Lock, Mail, MessageSquare } from "lucide-react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AuthImagePattern from "../components/AuthImagePattern"
import { login } from "../store/slices/authSlice";
import {Link} from "react-router-dom"

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setformData] = useState({
    email: "",
    password: ""
  });
  
  const {isLoggingIn } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(login(formData));
  }
  return <>
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-white">
    {/* LEFT side - form */}
    <div className="flex items-center justify-center px-6 py-12 ">
      <div className="w-full max-w-md">
        {/* LOGO & HEADING */}
        <div className="flex flex-col items-center text-center mb-10">
          <div className="bg-blue-100 p-3 rounded-lg">
            <MessageSquare className="w-6 h-6 text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold mt-4">Welcome Back</h1>
          <p className="text-gray-600">Please login to your account</p>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <Mail className="w-5 h-5"/>
              </span>
              <input type="email" placeholder="me@gmail.com" value={formData.email} onChange={(e)=>{setformData({...formData, email: e.target.value})}} className="w-full border border-gray-300 rounded-md py -2 pl-10 pr-3 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>


          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">password</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <Lock className="w-5 h-5"/>
              </span>
              <input type={showPassword ? "text": "password" } placeholder="********" value={formData.password} onChange={(e)=>{setformData({...formData, password: e.target.value})}} className="w-full border border-gray-300 rounded-md py -2 pl-10 pr-3 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <button onClick={()=> setShowPassword(!showPassword)} type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
              {
                showPassword ? (
                  <EyeOff className="w-5 h-5" /> 
                ) : (<Eye className="w-5 h-5"/>)
              }
            </button>
            </div>
          </div>



          <button type="submit" disabled={isLoggingIn} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-md transition duration-200 flex justify-center items-center gap-2">
            {
              isLoggingIn ? (
                <>
                <Loader2 className="w-5 h-5 animate-spin"/> Loading....
                </>
              ) : ("Sign IN")
            }
          </button>
        </form> 

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Don&apos;t have and account? {" "}
            <Link to={'/register'} className="text-blue-600 hover:underline">Create account</Link>
          </p>
        </div>
      </div>
    </div>

    <AuthImagePattern
      title={"Welcome back!"}
      subtitle={"sign in to continue your conversation"}
    />

    </div>
    
  </>;
};

export default Login;
