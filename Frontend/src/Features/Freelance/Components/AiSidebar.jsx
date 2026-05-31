import React from 'react'
import {MailIcon} from '../../../components/ui/mail-icon.jsx'
import {SquarePenIcon} from '../../../components/ui/square-pen.jsx'
import {HeartHandshakeIcon} from '../../../components/ui/heart-handshake.jsx'
import {FileStackIcon} from '../../../components/ui/file-stack.jsx'
import { useState } from 'react'
import { useLocation,useNavigate } from 'react-router-dom'

export default function AiSidebar() {
    const [hovered, setHovered] = useState(null);
    const route = useNavigate();
    const location = useLocation();

    const menuItems = [
            { name: "Email" , icon: <MailIcon size={30}/> , path:"/ai/email"},
            { name: "Proposal" , icon: <HeartHandshakeIcon size={30}/>,path : "/ai/proposal"},
            { name: "Contract" , icon: <FileStackIcon size={30}/>, path:"/ai/contract"},
            { name: "Invoice" , icon: <SquarePenIcon size={30}/>, path:"/ai/invoice"}
        ];
  return (
    <div className='sticky top-24 h-fit rounded-4xl border-1 border-white/10 flex flex-col justify-center items-center relative'>
        {menuItems.map((item, index) => (
        <div key={item.name}
          onMouseEnter={() => setHovered(index)}
          onMouseLeave={() => setHovered(null)}
          onClick={()=>{route(item.path)}}

          className={`cursor-pointer transition-all duration-400 p-5 
            ${
              location.pathname === item.path ? "text-white scale-120" : "text-white/50"
            }
            ${
              hovered === index
                ? "scale-120"
                : null
            } `}
            >
            {hovered === index && (
              <div className="absolute left-25 z-20 -translate-x-1/2">
                <div className="bg-white/10 backdrop-blur-xl text-white text-sm px-4 py-1 rounded-full shadow-lg border border-white/20">
                  {item.name}
                </div>
              </div>
            )}
          {item.icon}
        </div>
      ))}
    </div>
  )
}
