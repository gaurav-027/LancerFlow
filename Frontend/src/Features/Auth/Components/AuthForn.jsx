import React, { useState } from 'react'
import { MailIcon } from '../../../components/ui/mail-icon.jsx';
import {UserRoundIcon} from '../../../components/ui/user-round-icon.jsx';
import { LockIcon } from '../../../components/ui/lock-icon.jsx';
import { EyeClosedIcon } from '../../../components/ui/eye-closed-icon.jsx';
import { EyeIcon } from '../../../components/ui/eye-icon.jsx';
import { useAuth } from '../AuthApi/useAuth.jsx';
import { useNavigate } from "react-router-dom";
import toast from 'react-hot-toast';
export default function AuthForm() {

  const [formState,setFormState]=useState("login");
  const [showPassword,setShowPassword] = useState(false);
  const [username,setUsername] = useState("");
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const navigate = useNavigate();

  const {loading,handleRegister, handleLogin} = useAuth()

  const handleSubmit = async (event)=>{
    event.preventDefault();

    if(formState == "login"){
      const res = await handleLogin({email,password});
      if(res?.status === 200){
        toast.success(res.data?.message || "Logged in successfully");
        navigate('/dashboard')
      } else {
        toast.error(res?.data?.message || "Login failed. Please try again.");
      }
    }else{
      const res = await handleRegister({username,email,password});
      if(res?.status === 201){
        toast.success(res.data?.message || "Account created successfully");
        navigate('/dashboard')
      } else {
        toast.error(res?.data?.message || "Signup failed. Please try again.");
      }
    }
  }

  const towardSignup=()=>{
    setFormState("signup")
  }

  const towardLogin=()=>{
    setFormState("login")
  }

  // if(loading){
  //   return <div className='w-115 h-150 rounded-4xl bg-white/10 backdrop-blur-[12px] border border-white/10 shadow-[0_6px_32px_0_rgba(31,38,130,0.37)] py-10 px-10 flex flex-col justify-center items-center gap-5'>
  //     <p className='text-xl'>Loading...</p>
  //   </div>
  // }

  return (
    <form onSubmit={handleSubmit} className='relative flex min-h-[560px] w-full max-w-[460px] flex-col items-center justify-center gap-5 rounded-4xl border border-white/10 bg-white/10 px-5 py-8 shadow-[0_6px_32px_0_rgba(31,38,130,0.37)] backdrop-blur-[12px] sm:px-10'>
      {formState=="login"?<div  className='text-center'>
        <h1 className='text-3xl sm:text-4xl'>Welcome Back</h1>
        <p className='text-sm text-white/60 sm:text-base'>Experience the future of productivity</p>
      </div>:<>
      <div  className='text-center'>
        <h1 className='text-3xl sm:text-4xl'>Create Account</h1>
        <p className='text-sm text-white/60 sm:text-base'>Join the future of AI-driven productivity</p>
      </div>

      <div className='flex w-full max-w-80 flex-col gap-2'>
          <p className='px-5'>Username</p>
          <div className='flex w-full items-center gap-4 rounded-4xl bg-white/10 px-3 py-3'>
            <UserRoundIcon size={30} />
            <input 
            className='min-w-0 flex-1 bg-transparent outline-none'
            type="text"
            id="username"
            name="username"
            value={username}
            onChange={(e)=>{setUsername(e.target.value)}}
            placeholder="Enter your Username"
            required
          />
        </div>
        </div></> }

        <div className='flex w-full max-w-80 flex-col gap-2'>
          <p className='px-5'>Email</p>
          <div className='flex w-full items-center gap-4 rounded-4xl bg-white/10 px-3 py-3'>
            <MailIcon size={30} />
            <input 
            className='min-w-0 flex-1 bg-transparent outline-none'
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={(e)=>{setEmail(e.target.value)}}
            placeholder="Enter your Email"
            required
            />
          </div>
        </div>

        <div className='flex w-full max-w-80 flex-col gap-2'>
          <p className='px-5'>Password</p>
          <div className='flex w-full items-center gap-4 rounded-4xl bg-white/10 px-3 py-3'>
            <LockIcon size={30} />
            <input className='min-w-0 flex-1 bg-transparent outline-none'
            type={showPassword ? "text" : "password"}
            id="password"
            name="password"
            value={password}
            onChange={(e)=>{setPassword(e.target.value)}}
            placeholder="Enter your Password"
            required
          />
          {showPassword ? <EyeClosedIcon size={30} className='cursor-pointer' onClick={()=>setShowPassword(false)}/> : <EyeIcon size={30} className='cursor-pointer' onClick={()=>setShowPassword(true)}/>}
          </div>
        </div>

        <button type="submit" disabled={loading} className='w-full max-w-80 cursor-pointer rounded-4xl bg-[#ff0071] py-3 text-center text-xl disabled:cursor-not-allowed disabled:opacity-60'>
          {loading ? "Please wait..." : formState=="login" ? "Sign In" : "Create Account"}
        </button>
       <div className='w-full border m-3 border-white/10'></div>
        <div className='text-center text-sm sm:text-base'>
          {formState=="login"?
          <p>New to work LancerFlow ? &nbsp; <span className='cursor-pointer' onClick={towardSignup}>Create Account</span></p>
          :<p>Already have an Account ! &nbsp; <span className='cursor-pointer' onClick={towardLogin}>Sign In</span></p>}
        </div>
      </form>
    
  )
}
