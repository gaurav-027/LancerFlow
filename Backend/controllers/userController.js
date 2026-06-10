import httpStatus from "http-status";
import user from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import "dotenv/config";
import nodemailer from "nodemailer";

const createVerificationCode = () => Math.floor(100000 + Math.random() * 900000).toString();

async function sendVerificationEmail({ to, username, code }) {
    const {
        SMTP_HOST,
        SMTP_PORT ,
        SMTP_USER,
        SMTP_PASS,
        SMTP_FROM,
    } = process.env;

    if(!SMTP_HOST || !SMTP_USER || !SMTP_PASS){
        return { sent: false, reason: "missing_config" };
    }

    try {
        const transporter = nodemailer.createTransport({
            host: SMTP_HOST,
            port : Number(SMTP_PORT),
            secure:false,
            auth: {
                user: SMTP_USER,
                pass: SMTP_PASS
            }
        });

        transporter.verify((error, success) => {
            if (error) {
                console.error("Email transporter verification failed:", error.message);
            } else {
                console.log("Email transporter is ready to send messages");
            }
        });

        await transporter.sendMail({
            from: SMTP_USER,
            to,
            subject: "Verify your LancerFlow email",
            text: `Hi ${username || "there"}, your LancerFlow email verification code is ${code}. This code expires in 10 minutes.`,
            html: `
                <div style="font-family: Arial, sans-serif; line-height: 1.5;">
                    <h2>Verify your LancerFlow email</h2>
                    <p>Hi ${username || "there"},</p>
                    <p>Your email verification code is:</p>
                    <p style="font-size: 28px; font-weight: 700; letter-spacing: 4px;">${code}</p>
                    <p>This code expires in 10 minutes.</p>
                </div>
            `
        });

        return { sent: true };
    } catch (error) {
        console.error("Email verification send failed:", error.message);
        return { sent: false, reason: "send_failed" };
    }
}

export async function register(req,res){

    let {username,email,password} = req.body;
    email = email?.trim().toLowerCase();
    username = username?.trim();

    if(!username || !email || !password){
        return res.status(httpStatus.BAD_REQUEST).json({message:"Please Provide Details"})
    }

    try {
        let existingUser = await user.findOne({email})
        if(existingUser){
            return res.status(httpStatus.CONFLICT).json({message:"User Already Exists"})
        }

        const hashedPassword = await bcrypt.hash(password,10);
        const newUser = new user({
            username:username,
            email:email,
            password:hashedPassword
        })
        await newUser.save();

        const token = jwt.sign(
            {id: newUser._id },
            process.env.JWT_SECRET,
            {expiresIn:"1d"}
        )

        res.cookie("token",token,{
                httpOnly : true,
                secure : false,
                sameSite : "lax"
            })

        return res.status(httpStatus.CREATED).json({message:"New User Created",token:token});
    } catch (error) {
        return res.status(500).json({message:`Something Went Wrong ${error}`})
    }
}

export async function login(req,res){
    
    let {email,password} = req.body;
    email = email?.trim().toLowerCase();

    if(!email || !password){
        return res.status(400).json({message:"Please Provide Details"})
    }

    try {
        const userDetails = await user.findOne({email});
        if(!userDetails){
            return res.status(httpStatus.NOT_FOUND).json({message:"User Not Found"})
        }
        if(await bcrypt.compare(password,userDetails.password)){
            const token = jwt.sign(
            {id: userDetails._id },
            process.env.JWT_SECRET,
            {expiresIn:"1d"}
        )
            res.cookie("token",token,{
                httpOnly : true,
                secure : false,
                sameSite : "lax"
            })
            return res.status(httpStatus.OK).json({message:"User LoggedIn Successfully",token:token});
        }else{
            return res.status(httpStatus.NOT_ACCEPTABLE).json({message:"Invalid Password"})
        }
    } catch (error) {
        return res.status(500).json({message:`Something Went Wrong ${error}`})
    }
}

export async function logout(req,res) {
     res.clearCookie("token");

    res.status(200).json({message: "User logged out successfully"});
}

export async function getme(req,res){
    const userDetails = await user.findById(req.user.id).select("-password");

    return res.status(httpStatus.OK).json({userDetails});
}

export async function updateUser(req,res){
    const { fullName, bio } = req.body;
    const username = req.body.username?.trim();
    const email = req.body.email?.trim().toLowerCase();

    if(!username || !email){
        return res.status(httpStatus.BAD_REQUEST).json({message:"Username and email are required"})
    }

    try {
        const currentUser = await user.findById(req.user.id);
        if(!currentUser){
            return res.status(httpStatus.NOT_FOUND).json({message:"User Not Found"})
        }

        const existingUser = await user.findOne({
            email,
            _id: { $ne: req.user.id }
        });

        if(existingUser){
            return res.status(httpStatus.CONFLICT).json({message:"Email already in use"})
        }

        const updatePayload = {
                fullName,
                username,
                email,
                bio,
                isEmailVerified: currentUser.email === email ? currentUser.isEmailVerified : false
        };

        const updateQuery = currentUser.email === email
            ? { $set: updatePayload }
            : {
                $set: updatePayload,
                $unset: {
                    emailVerificationCode: "",
                    emailVerificationExpiresAt: ""
                }
            };

        const userDetails = await user.findByIdAndUpdate(
            req.user.id,
            updateQuery,
            { new: true, runValidators: true }
        ).select("-password");

        if(!userDetails){
            return res.status(httpStatus.NOT_FOUND).json({message:"User Not Found"})
        }

        return res.status(httpStatus.OK).json({message:"Profile updated successfully", userDetails});
    } catch (error) {
        return res.status(500).json({message:`Something Went Wrong ${error}`})
    }
}

export async function resetPassword(req,res){
    const { currentPassword, newPassword } = req.body;

    if(!currentPassword || !newPassword){
        return res.status(httpStatus.BAD_REQUEST).json({message:"Previous and new password are required"})
    }

    if(newPassword.length < 6){
        return res.status(httpStatus.BAD_REQUEST).json({message:"New password must be at least 6 characters"})
    }

    try {
        const userDetails = await user.findById(req.user.id);
        if(!userDetails){
            return res.status(httpStatus.NOT_FOUND).json({message:"User Not Found"})
        }

        const isPasswordValid = await bcrypt.compare(currentPassword,userDetails.password);
        if(!isPasswordValid){
            return res.status(httpStatus.UNAUTHORIZED).json({message:"Previous password is incorrect"})
        }

        userDetails.password = await bcrypt.hash(newPassword,10);
        await userDetails.save();

        return res.status(httpStatus.OK).json({message:"Password reset successfully"});
    } catch (error) {
        return res.status(500).json({message:`Something Went Wrong ${error}`})
    }
}

export async function requestEmailVerification(req,res){
    try {
        const userDetails = await user.findById(req.user.id);
        if(!userDetails){
            return res.status(httpStatus.NOT_FOUND).json({message:"User Not Found"})
        }

        if(userDetails.isEmailVerified){
            return res.status(httpStatus.OK).json({message:"Email is already verified"})
        }

        const verificationCode = createVerificationCode();
        userDetails.emailVerificationCode = verificationCode;
        userDetails.emailVerificationExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
        await userDetails.save();

        const mailResult = await sendVerificationEmail({
            to: userDetails.email,
            username: userDetails.username,
            code: verificationCode
        });

        return res.status(httpStatus.OK).json({
            message: mailResult.sent
                ? `Verification code sent to ${userDetails.email}`
                : mailResult.reason === "missing_config"
                    ? "Email sender is not configured. Use the development verification code below."
                    : "Email could not be sent. Use the development verification code below.",
            email: userDetails.email,
            sent: mailResult.sent,
            verificationCode: mailResult.sent ? undefined : verificationCode
        });
    } catch (error) {
        return res.status(500).json({message:`Something Went Wrong ${error}`})
    }
}

export async function verifyEmail(req,res){
    const code = req.body.code?.trim();

    if(!code){
        return res.status(httpStatus.BAD_REQUEST).json({message:"Verification code is required"})
    }

    try {
        const userDetails = await user.findById(req.user.id);
        if(!userDetails){
            return res.status(httpStatus.NOT_FOUND).json({message:"User Not Found"})
        }

        if(userDetails.isEmailVerified){
            const safeUser = await user.findById(req.user.id).select("-password");
            return res.status(httpStatus.OK).json({message:"Email is already verified", userDetails: safeUser})
        }

        const isExpired = !userDetails.emailVerificationExpiresAt || userDetails.emailVerificationExpiresAt < new Date();
        if(isExpired){
            return res.status(httpStatus.BAD_REQUEST).json({message:"Verification code expired"})
        }

        if(userDetails.emailVerificationCode !== code){
            return res.status(httpStatus.UNAUTHORIZED).json({message:"Invalid verification code"})
        }

        userDetails.isEmailVerified = true;
        userDetails.emailVerificationCode = undefined;
        userDetails.emailVerificationExpiresAt = undefined;
        await userDetails.save();

        const safeUser = await user.findById(req.user.id).select("-password");

        return res.status(httpStatus.OK).json({message:"Email verified successfully", userDetails: safeUser});
    } catch (error) {
        return res.status(500).json({message:`Something Went Wrong ${error}`})
    }
}
