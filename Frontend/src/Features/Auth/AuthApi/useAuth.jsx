import { useContext, useEffect } from "react";
import { AuthContext } from "../AuthContext.jsx";
import {
    getme,
    login,
    logout,
    register,
    requestEmailVerification,
    resetPassword,
    updateUser,
    verifyEmail
} from "./AuthData.jsx";

export function useAuth(){
    const {user, setUser, loading, setLoading} = useContext(AuthContext)

    const handleRegister = async ({username,email,password})=>{
        try {
            setLoading(true)
            const response = await register({username,email,password});
            if(response?.status === 201){
                const data = await getme();
                setUser(data);
            }
            return response;
        } finally {
            setLoading(false)
        }
    }

    const handleLogin = async ({email,password})=>{
        try {
            setLoading(true);
            const response = await login({email,password});

            try {
                if(response?.status === 200){
                const data = await getme();
                setUser(data);
            }
            } catch (error) {
                console.log(error)
            }

            return response;
        } catch (error) {
            console.log(error);
            return { success: false };
        } finally {
            setLoading(false);
        }
    }   

    useEffect(()=>{
        const getUser = async () =>{
            try {
                const data = await getme();
                setUser(data)
            } catch (error) {
                console.log(error)
            }
            finally{
                setLoading(false)
            }
        }

        getUser();
    },[setUser, setLoading])


    const logOutUser = async ()=>{
        try {
            setLoading(true)
            const response = await logout();
            setUser(null);
            return response;
        } finally {
            setLoading(false);
        }
    }

    const updateCurrentUser = async (data)=>{
        try {
            setLoading(true)
            const response = await updateUser(data);
            if(response?.status === 200){
                setUser(response.data.userDetails);
            }
            return response;
        } finally {
            setLoading(false)
        }
    }

    const resetCurrentPassword = async (data)=>{
        setLoading(true)
        try {
            return await resetPassword(data);
        } finally {
            setLoading(false)
        }
    }

    const requestCurrentEmailVerification = async ()=>{
        setLoading(true)
        try {
            return await requestEmailVerification();
        } finally {
            setLoading(false)
        }
    }

    const verifyCurrentEmail = async (code)=>{
        setLoading(true)
        try {
            const response = await verifyEmail(code);
            if(response?.status === 200 && response.data?.userDetails){
                setUser(response.data.userDetails);
            }
            return response;
        } finally {
            setLoading(false)
        }
    }

    return {
        user,
        loading,
        handleRegister,
        handleLogin,
        logOutUser,
        updateCurrentUser,
        resetCurrentPassword,
        requestCurrentEmailVerification,
        verifyCurrentEmail
    }
}   
