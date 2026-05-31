import React from 'react'
import AuthForm from '../Components/AuthForn';
import { WindIcon } from '../../../components/ui/wind';

export default function Auth() {
  return (
    <>
      <div className="relative min-h-screen w-full overflow-hidden bg-black">
        <div className="absolute left-[-120px] top-[-120px] h-[420px] w-[420px] bg-blue-500 opacity-20 blur-[100px] sm:h-[600px] sm:w-[600px]" />
        <div className="relative flex w-full items-center px-5 py-4 text-[26px] sm:px-10 sm:text-[30px]">LancerFlow<WindIcon size={40}/></div>
        <div className="center relative z-10 flex w-full justify-center px-4 pb-10 pt-4 sm:px-10 sm:pt-10">
          <AuthForm/>
        </div>
        <div className="absolute bottom-[-120px] right-[-120px] h-[420px] w-[420px] bg-purple-500 opacity-20 blur-[100px] sm:h-[600px] sm:w-[600px]" />
      </div>
    </>
  )
}
