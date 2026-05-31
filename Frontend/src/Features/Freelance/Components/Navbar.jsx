import React from 'react'
import {SearchIcon} from '../../../components/ui/search.jsx';
import {BellIcon} from "../../../components/ui/bell-icon.jsx";
import { useNavigate } from 'react-router-dom';
import { WindIcon } from '../../../components/ui/wind';
import {DateFormat} from './Date';
import {Message} from './Date';
import { useContext } from 'react';
import { AuthContext } from '../../Auth/AuthContext.jsx';

export default function Navbar(value) {

    const {user} = useContext(AuthContext);

    const router = useNavigate();
  return (
    <div className='flex h-full min-h-18 w-full items-center justify-between gap-3 border-b-2 border-white/10 bg-[#101722]/95 px-4 py-3 backdrop-blur-md sm:px-5'>
        <div className='flex min-w-0 items-center gap-3 sm:gap-5'>
            <div className='flex shrink-0 items-center text-xl sm:text-3xl'>LancerFlow<WindIcon size={36}/></div>
            <div className='hidden h-10 border-1 border-white/10 text-sm sm:block'></div>
            <div className='hidden min-w-0 text-white/50 sm:block'>
                <p className='truncate text-xl text-white/70 lg:text-2xl'>{Message()}</p>
                <p className='truncate'>Mr. {user?.username}</p>
            </div>
        </div>

        <div className='flex min-w-0 items-center justify-end gap-2'>
            <div className='hidden text-sm sm:block'>
                <DateFormat/>
            </div>
            {value.show ? <div className='hidden w-64 gap-3 rounded-4xl bg-white/10 px-4 py-2 lg:flex xl:w-100'>
                <SearchIcon/>
                <input className='min-w-0 flex-1 bg-transparent outline-none'
                    type="text"
                    id="search"
                    name="search"
                    placeholder="Search Clients, Projects.."
                    required
                />
            </div> : null}
            <div className='cursor-pointer rounded-full p-2 transition hover:bg-white/10' onClick={()=>{router('/notification')}}>
                <BellIcon size={30}/>
            </div>
        </div>
    </div>
  )
}
