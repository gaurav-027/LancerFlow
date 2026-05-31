import React from 'react'
import Navbar from '../Components/Navbar'
import Dock from '../Components/Dock'
import Footer from '../Components/Footer';
import ClientDetails from '../Components/ClientDetails';

export default function Client() {
  return (
    <div className='relative min-h-screen w-full overflow-hidden bg-[#101722]'>
        <div className="pointer-events-none absolute bottom-0 right-0 h-[500px] w-[500px] bg-blue-500 opacity-20 blur-[200px]"/>
        <div className="pointer-events-none absolute left-0 top-[100px] h-[400px] w-[400px] bg-blue-500 opacity-20 blur-[200px]"/>
        

        <div className='sticky top-0 z-30 h-18 w-full'>
            <Navbar show={true}/>
        </div>
        <div className='relative z-20 w-full pb-20'>
            <ClientDetails/>
        </div>
        <div className='relative z-10 h-15 w-full'>
            <Footer/>
        </div>
        <div className='fixed bottom-1 z-40 flex h-18 w-full items-end justify-center px-4'>
            <div className='h-16 w-full max-w-[560px] rounded-4xl border-1 border-white/10 bg-[#16263e]/95 backdrop-blur-md md:w-1/2 xl:w-1/3'>
                <Dock/>
            </div>
        </div>
    </div>
  )
}
