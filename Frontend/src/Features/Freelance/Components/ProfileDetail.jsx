import React from 'react';
import {MailIcon} from '../../../components/ui/mail-icon.jsx'
import {EyeIcon} from '../../../components/ui/eye-icon.jsx'
import {EyeClosedIcon} from '../../../components/ui/eye-closed-icon.jsx'
import { useContext } from 'react';
import { AuthContext } from '../../Auth/AuthContext.jsx';
import { useAuth } from '../../Auth/AuthApi/useAuth.jsx';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function ProfileDetail() {

    const navigate = useNavigate();

    const {user} = useContext(AuthContext);
    const {
        logOutUser,
        updateCurrentUser,
        loading,
        resetCurrentPassword,
        requestCurrentEmailVerification,
        verifyCurrentEmail
    } = useAuth();

    const handleLogOut = async () =>{
        const res = await logOutUser();
        if(res?.status === 200){
            toast.success(res.data?.message || "Logged out successfully");
            navigate('/auth')
        } else {
            toast.error(res?.data?.message || "Logout failed. Please try again.");
        }
    }

    const [name, setName] = React.useState(user?.fullName || "");
    const [username, setUsername] = React.useState(user?.username || "");
    const [email, setEmail] = React.useState(user?.email || "");
    const [bio, setBio] = React.useState(user?.bio || "");
    const [editing, setEditing] = React.useState(false);
    const [currentPassword, setCurrentPassword] = React.useState("");
    const [newPassword, setNewPassword] = React.useState("");
    const [confirmNewPassword, setConfirmNewPassword] = React.useState("");
    const [showResetPasswords, setShowResetPasswords] = React.useState(false);
    const [verificationCode, setVerificationCode] = React.useState("");
    const [generatedVerificationCode, setGeneratedVerificationCode] = React.useState("");
    const [verificationMessage, setVerificationMessage] = React.useState("");

    React.useEffect(() => {
        setName(user?.fullName || "");
        setUsername(user?.username || "");
        setEmail(user?.email || "");
        setBio(user?.bio || "");
    }, [user]);

    const handleSave = async () => {
        if(!editing){
            setEditing(true);
            return;
        }

        const res = await updateCurrentUser({
            fullName: name,
            username,
            email,
            bio
        });

        if(res?.status === 200){
            toast.success(res.data?.message || "Profile updated successfully");
            setEditing(false);
        } else {
            toast.error(res?.data?.message || "Profile could not be updated.");
        }
    }

    const handleResetPassword = async () => {
        if(newPassword !== confirmNewPassword){
            toast.error("New passwords do not match.");
            return;
        }

        const res = await resetCurrentPassword({
            currentPassword,
            newPassword
        });

        if(res?.status === 200){
            toast.success(res.data?.message || "Password reset successfully");
            setCurrentPassword("");
            setNewPassword("");
            setConfirmNewPassword("");
            setShowResetPasswords(false);
        } else {
            toast.error(res?.data?.message || "Password reset failed.");
        }
    }

    const handleRequestVerification = async () => {
        const res = await requestCurrentEmailVerification();

        if(res?.status === 200){
            setGeneratedVerificationCode(res.data?.verificationCode || "");
            setVerificationMessage(res.data?.message || "");
            toast.success(res.data?.message || "Verification code generated");
        } else {
            setVerificationMessage("");
            toast.error(res?.data?.message || "Could not create verification code.");
        }
    }

    const handleVerifyEmail = async () => {
        const res = await verifyCurrentEmail(verificationCode);

        if(res?.status === 200){
            toast.success(res.data?.message || "Email verified successfully");
            setVerificationCode("");
            setGeneratedVerificationCode("");
            setVerificationMessage("");
        } else {
            toast.error(res?.data?.message || "Email verification failed.");
        }
    }

    const initials = (username || user?.email || "LF")
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((item) => item[0]?.toUpperCase())
        .join("");

  return (
    <div className='flex h-full w-full max-w-5xl flex-col gap-5 px-4 py-6 sm:px-6 lg:px-8'>
        <div className=''>
            <h1 className='text-3xl font-semibold'>Hey {user?.username}</h1>
            <p className='text-lg text-white/60 sm:text-xl'>Manage your account preferences</p>
        </div>
        <div className='flex w-full flex-col gap-8 rounded-2xl border-2 border-white/10 bg-[#171e29] px-4 py-6 sm:px-6 lg:flex-row lg:px-10 lg:py-10'>
            <div className='flex h-[120px] w-[120px] shrink-0 items-center justify-center rounded-[44px] border-2 border-white/10 bg-white/10 text-4xl font-semibold sm:h-[150px] sm:w-[150px] sm:rounded-[60px]'>{initials || "LF"}</div>
            <div className='flex min-w-0 flex-1 flex-col gap-5 border-white/10' >
                <div>
                    <h1 className='text-2xl'>Profile Information</h1>
                    <p className='text-m text-white/60'>Update the details shown across your workspace.</p>
                </div>
                    
                <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                    <div className='min-w-0'>
                        <p className='text-white/50'>Full Name</p>
                        <input className={`h-11 w-full bg-transparent text-lg outline-none ${editing ? "rounded-lg border-2 border-white/10 px-4" : ""}`} 
                        type="text" 
                        placeholder='Enter your full name'
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        disabled={editing ? false : true}
                        />
                    </div>
                    <div className='min-w-0'>
                        <p className='text-white/50'>Username</p>
                        <input className={`h-11 w-full bg-transparent text-lg outline-none ${editing ? "rounded-lg border-2 border-white/10 px-4" : ""}`}
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            disabled={editing ? false : true}
                        />
                    </div>
                </div>
                    <div>
                        <p className='text-white/50'>Email</p>
                        <input className={`h-11 w-full bg-transparent text-lg outline-none ${editing ? "rounded-lg border-2 border-white/10 px-4" : ""}`}
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={editing ? false : true}
                        />
                    </div>
                    <div>
                        <p className='text-white/50'>Bio</p>
                        <textarea 
                            className={`text-l h-24 w-full resize-none bg-transparent outline-none ${editing ? "rounded-lg border-2 border-white/10 p-3" : ""}`}
                            placeholder='Tell clients what you do best'
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            disabled={editing ? false : true}
                        />
                    </div>
                    <hr className='text-white/30' />
                    <div className='text-end'>
                        <button onClick={handleSave} disabled={loading} className='relative h-10 w-full cursor-pointer rounded-lg bg-[#0b65f2] px-4 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto'>
                            {loading ? "Saving..." : editing ? "Save Changes" : "Edit Profile"}
                        </button>
                    </div>
                </div>
            </div>
            <div className='flex w-full flex-col gap-5 rounded-2xl border-2 border-white/10 bg-[#171e29] p-4 sm:p-6 lg:p-10'>
            <p className='text-white/60 text-xl'>Additional Information</p>
            <div className='flex flex-col gap-3 rounded-2xl bg-white/10 p-4 sm:flex-row sm:items-center sm:justify-between'>
                <div className='flex min-w-0 items-center gap-4'>
                    <MailIcon/>
                    <p className='shrink-0 text-white/50'>Email : </p>
                    <p className='min-w-0 break-all'>{user?.email}</p>
                </div>
                <p className={`text-sm ${user?.isEmailVerified ? "text-emerald-300" : "text-red-300"}`}>
                    {user?.isEmailVerified ? "Verified" : "Not Verified"}
                </p>
            </div>
            <div className='flex flex-col gap-4 rounded-2xl bg-white/10 p-4'>
                <div>
                    <p className='text-white/80'>Reset Password</p>
                    <p className='text-sm text-white/45'>Enter your previous password before setting a new one.</p>
                </div>
                <div className='grid grid-cols-1 gap-3'>
                    <input
                        className='h-10 rounded-xl border border-white/10 bg-black/10 px-3 outline-none'
                        type={showResetPasswords ? "text" : "password"}
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder='Previous password'
                    />
                    <input
                        className='h-10 rounded-xl border border-white/10 bg-black/10 px-3 outline-none'
                        type={showResetPasswords ? "text" : "password"}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder='New password'
                    />
                    <input
                        className='h-10 rounded-xl border border-white/10 bg-black/10 px-3 outline-none'
                        type={showResetPasswords ? "text" : "password"}
                        value={confirmNewPassword}
                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                        placeholder='Confirm new password'
                    />
                </div>
                <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
                    <button type='button' onClick={() => setShowResetPasswords(!showResetPasswords)} className='inline-flex items-center gap-2 text-sm text-white/60'>
                        {showResetPasswords ? <EyeClosedIcon size={20}/> : <EyeIcon size={20}/>}
                        {showResetPasswords ? "Hide passwords" : "Show passwords"}
                    </button>
                    <button onClick={handleResetPassword} disabled={loading} className='h-10 rounded-lg bg-[#0b65f2] px-4 text-sm disabled:cursor-not-allowed disabled:opacity-60'>
                        Reset Password
                    </button>
                </div>
            </div>

            <div className='flex flex-col gap-4 rounded-2xl bg-white/10 p-4'>
                <div>
                    <p className='text-white/80'>Verify Email</p>
                    <p className='text-sm text-white/45'>Send a verification code to your registered email address: {user?.email}</p>
                </div>
                {!user?.isEmailVerified ? (
                    <>
                        <div className='flex flex-col gap-3 sm:flex-row'>
                            <button onClick={handleRequestVerification} disabled={loading} className='h-10 rounded-lg bg-[#0b65f2] px-4 text-sm disabled:cursor-not-allowed disabled:opacity-60'>
                                Send Code
                            </button>
                            <input
                                className='h-10 min-w-0 flex-1 rounded-xl border border-white/10 bg-black/10 px-3 outline-none'
                                value={verificationCode}
                                onChange={(e) => setVerificationCode(e.target.value)}
                                placeholder='Enter verification code'
                            />
                            <button onClick={handleVerifyEmail} disabled={loading} className='h-10 rounded-lg bg-emerald-700 px-4 text-sm disabled:cursor-not-allowed disabled:opacity-60'>
                                Verify
                            </button>
                        </div>
                        {generatedVerificationCode ? (
                            <p className='rounded-xl border border-blue-400/20 bg-blue-500/10 px-3 py-2 text-sm text-blue-100'>
                                Development code: {generatedVerificationCode}
                            </p>
                        ) : null}
                        {verificationMessage && !generatedVerificationCode ? (
                            <p className='rounded-xl border border-emerald-400/20 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-100'>
                                {verificationMessage}
                            </p>
                        ) : null}
                    </>
                ) : (
                    <p className='rounded-xl border border-emerald-400/20 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-200'>
                        This email address has been verified.
                    </p>
                )}
            </div>

            <div className='flex justify-center'>
                <button onClick={handleLogOut} className='h-10 bg-[#0b65f2] rounded-lg cursor-pointer p-4 flex items-center'>
                    LogOut Account
                </button>
            </div>
        </div>
    </div>
    
  )
}
