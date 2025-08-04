import {
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  MessageSquare,
  User,
} from "lucide-react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { signup } from "../store/slices/authSlice";
import AuthImagePattern from "../components/AuthImagePattern";

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setformData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const dispatch = useDispatch();

  const {isSigningUp} = useSelector(state => state.auth);

  const handleSubmit  = (e)=>{
    e.preventDefault();
    dispatch(signup(formData));
  }

  return <>
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-white">
      <div className="flex flex-col items-center justify-center px-6 py-12 ">
        <div className="w-full max-w-md">
        {/* logo and heading */}
        <div className="flex flex-col items-center text-center mb-10">
          <div className="bg-blue-100 p-3 rounded-lg">
            <MessageSquare className="w-6 h-6 text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold mt-4">Create Account</h1>
          <p className="text-gray-600">Get started with your free account</p>
        </div>

        {/* form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <User className="w-5 h-5"/>
              </span>
              <input type="text" placeholder="john doe" value={formData.username} onChange={(e)=>{setformData({...formData, username: e.target.value})}} className="w-full border border-gray-300 rounded-md py -2 pl-10 pr-3 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>


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



          <button type="submit" disabled={isSigningUp} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-md transition duration-200 flex justify-center items-center gap-2">
            {
              isSigningUp ? (
                <>
                <Loader2 className="w-5 h-5 animate-spin"/> Loading....
                </>
              ) : ("Create Account")
            }
          </button>
        </form> 

        {/* footer */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Already have an account? {" "}
            <Link to={'/login'} className="text-blue-600 hover:underline">Sign IN</Link>
          </p>
        </div>
        </div>
      </div> 

      <AuthImagePattern
      title={"Join Our Community!"}
      subtitle={`Connect with Friends and family.`}
    />

    </div>
  </>;
};

export default Register;
