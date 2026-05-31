import React from 'react';
import {DashboardIcon} from '../../../components/ui/dashboard-icon.jsx';
import {UsersIcon} from '../../../components/ui/users-icon.jsx';
import {RocketIcon} from '../../../components/ui/rocket-icon.jsx';
import {BrainIcon} from '../../../components/ui/brain-icon.jsx';
import {WalletIcon} from '../../../components/ui/wallet-icon.jsx';
import {UserRoundIcon} from '../../../components/ui/user-round-icon.jsx';

import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function Dock() {

    const [hovered, setHovered] = useState(null);
    const router = useNavigate();
    const location = useLocation();

    const dockItems = [
        { name: "Dashboard", icon: <DashboardIcon size={30}/>, path: "/dashboard" },
        { name: "Client", icon: <UsersIcon size={30}/>, path: "/client" },
        { name: "Project", icon: <RocketIcon size={30}/>, path: "/project" },
        { name: "AI", icon: <BrainIcon size={30}/>, path: "/ai/email" },
        { name: "Billing", icon: <WalletIcon size={30}/>, path: "/billing" },
        { name: "Profile", icon: <UserRoundIcon size={30}/>, path: "/profile" },
    ];

    const isActive = (item) => {
      if (item.path.startsWith("/ai")) {
        return location.pathname.startsWith("/ai");
      }

      return location.pathname === item.path;
    };

  return (
    <div className='flex h-full w-full items-center justify-evenly px-2'>
      {dockItems.map((item, index) => (
        <div key={item.name}
          onMouseEnter={() => setHovered(index)}
          onMouseLeave={() => setHovered(null)}
          onClick={()=>{router(item.path)}}
          className={`relative cursor-pointer transition-all duration-300
            ${
              isActive(item) ? "scale-110 text-white sm:scale-120" : "text-white/50"
            }
            ${
              hovered === index
                ? "sm:scale-120 "
                : hovered !== null &&
                  Math.abs(hovered - index) === 1
                ? "sm:scale-110"
                : "scale-100"
            } `}
            >
            {hovered === index && (
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 flex flex-col items-center">
                <div className="bg-white/10 backdrop-blur-xl text-white text-sm px-4 py-1 rounded-full shadow-lg border border-white/20">
                  {item.name}
                </div>
                <div className="w-2 h-2 bg-white/10 backdrop-blur-xl border-r border-b border-white/20 rotate-45 -mt-1">
                </div>
              </div>
            )}
          {item.icon}
        </div>
      ))}
    </div>
  )
}
