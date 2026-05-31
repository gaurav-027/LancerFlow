import { useAuth } from "./AuthApi/useAuth";
import React from 'react'
import { Navigate } from "react-router-dom";
import {HashLoader} from "react-spinners";

export default function Protected({children}) {

    const {loading, user} = useAuth();

    if(loading){
    return <div className="py-60 px-140"><HashLoader size={300} color={"#ffffff"}/></div>
}

    if(!user){
        return <Navigate to={'/auth'}/>
    }
  return children
}
