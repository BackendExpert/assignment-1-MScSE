const User = require("../models/user.model")
const Role = require("../models/role.model")
const UserOTP = require("../models/userotp.model")

const bcrypt = require("bcrypt")
const crypto = require('crypto')

const { BCRYPT_SALT, FRONTEND_URL } = require('../config/env');
const sendEmail = require("../utils/email/emailTransporter")
const tokens = require("../utils/tokens/generateToken")
const {
    RegistationResDTO,
    VerifyOTPResDTO,
    SetupTotpResDTO,
    verifyTOTPLoginResDTO
} = require("../dto/auth.dto")
const {
    createTOTPSecret,
    verifyTOTP
} = require("../utils/otps/totp")

class AuthService {
    static async Registaion(username, email, password, req) {
        const existUser = await User.findOne({ email: email });
        if (existUser) throw new Error('User Already Exist');

        // hash password

        const hashedpass = await bcrypt.hash(password, BCRYPT_SALT)

        const userrole = await Role.findOne({ name: 'user' })
        const createNewUser = new User({
            username: username,
            email: email,
            password: hashedpass,
            role: userrole._id
        })

        const resultcreateuser = await createNewUser.save()

        const otp = crypto.randomBytes(4).toString('hex');
        const hashedOtp = await bcrypt.hash(otp, 10);
        const otpModel = new UserOTP({ email: newUser.email, otp: hashedOtp });
        await otpModel.save();

        await sendEmail({
            to: email,
            subject: "Welcome to CareerAI Helper",
            html: `
            <div style="font-family: 'Segoe UI', Arial, sans-serif; background-color: #f7f7f7; padding: 40px 0;">
                <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 14px; overflow: hidden; box-shadow: 0 10px 35px rgba(0,0,0,0.08);">

                    <!-- Header -->
                    <div style="
                        background: linear-gradient(to right, #34d399, #22d3ee);
                        padding: 25px; 
                        text-align: center;
                    ">
                        <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 800;">
                            Welcome to CareerAI Helper
                        </h1>
                        <p style="color: #e6fdfa; margin: 6px 0 0; font-size: 15px;">
                            Smarter Path to Your Career Growth
                        </p>
                    </div>

                    <!-- Body -->
                    <div style="padding: 35px; color: #333;">
                        <h2 style="font-size: 22px; margin-bottom: 12px; color: #374151;">Hello ${username},</h2>

                        <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px; color: #4b5563;">
                            Thank you for signing up with <strong>CareerAI Helper</strong>!  
                            To complete your registration, please verify your email using the OTP below:
                        </p>

                        <!-- OTP Box -->
                        <div style="
                            font-size: 32px;
                            font-weight: 800;
                            letter-spacing: 6px;
                            color: #ffffff;
                            background: linear-gradient(to right, #34d399, #22d3ee);
                            padding: 18px;
                            text-align: center;
                            border-radius: 12px;
                            margin: 35px 0;
                        ">
                            ${otp}
                        </div>

                        <p style="font-size: 15px; color: #6b7280;">
                            ⏳ This code is valid for <strong>10 minutes</strong>.  
                            Please do not share your OTP with anyone.
                        </p>

                        <p style="font-size: 15px; color: #6b7280;">
                            If you didn’t create an account, just ignore this email.
                        </p>

                        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;"/>

                        <p style="font-size: 15px; color: #475569;">
                            🎯 After verification, you can log in and start building your career profile using AI-powered tools.
                        </p>
                    </div>

                    <!-- Footer -->
                    <div style="background-color: #f9fafb; padding: 20px; text-align: center; font-size: 13px; color: #9ca3af;">
                        <p style="margin: 5px 0;">© ${new Date().getFullYear()} Simple Draud Detection System </p>
                        <p style="margin: 0;">Empowering Your Future with AI</p>
                    </div>
                </div>
            </div>
            `,
        });

        // for verify email address
        const token = tokens.sign({ email: newUser.email }, '15m');

        if (req) {
            const metadata = {
                ipAddress: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
                userAgent: req.headers['user-agent'],
                timestamp: new Date(),
            };
            await logUserAction(req, "register", `${email} registered`, metadata, resultcreateuser._id);
        }

        return RegistationResDTO(token)
    }

    static async verifyEmail(token, otp, req) {
        const decoded = tokens.verify(token);
        const email = decoded.email;
        const user = await User.findOne({ email });
        if (!user) throw new Error('User not found');

        // find recode
        const record = await UserOTP.findOne({ email })
        if (!record) throw new Error("OTP not found or expired");

        const match = await bcrypt.compare(otp, record.otp);

        if (!match) {
            const metadata = {
                ipAddress: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
                userAgent: req.headers['user-agent'],
                timestamp: new Date(),
            };
            await logUserAction(req, "OTP_faild", `${email} Add Wrong OTP when Verifying Email Address`, metadata, user._id);
        }

        user.isEmailVerified = true;
        await user.save();
        await UserOTP.deleteOne({ email });

        if (req) {
            const metadata = {
                ipAddress: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
                userAgent: req.headers['user-agent'],
                timestamp: new Date(),
            };
            await logUserAction(req, "OTP_Verified", `${email} OTP verification Success`, metadata, user._id);
        }

        return VerifyOTPResDTO()
    }

    static async setupTOTP(token, req) {
        const decoded = tokens.verify(token);
        const user = await User.findOne({ email: decoded.email });

        if (!user) throw new Error('User not found');
        if (user.totpSecret) throw new Error('TOTP already set up');

        const { secret, qrCode } = await createTOTPSecret(user.email);
        user.totpSecret = secret;

        await user.save();
        if (req) {
            const metadata = {
                ipAddress: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
                userAgent: req.headers['user-agent'],
                timestamp: new Date(),
            };
            await logUserAction(req, "Setup_TOTP", `${email} Successfully Setup TOTP`, metadata, user._id);
        }
        // return { success: true, qrCode };
        return SetupTotpResDTO(qrCode)
    }

    static async verifyTOTPLogin(email, totpToken, req) {
        const user = await User.findOne({ email });
        if (!user) throw new Error('User not found');
        if (!user.totpSecret) throw new Error('TOTP not configured');

        const valid = verifyTOTP(user.totpSecret, totpToken);
        if (!valid) throw new Error('Invalid TOTP token');

        const token = tokens.sign({ id: user._id, email: user.email }, '1d');

        if (req) {
            const metadata = {
                ipAddress: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
                userAgent: req.headers['user-agent'],
                timestamp: new Date(),
            };
            await logUserAction(req, "verifyTOTPLogin", `${email} Successfully Verify TOTP Login`, metadata, user._id);
        }
        // return { success: true, token: jwt };
        return verifyTOTPLoginResDTO(token)
    }

    static async login(email, password, req) {
        const user = await User.findOne({ email });
        if (!user) throw new Error('User not found');

        const ok = await bcrypt.compare(password, user.password);
        if (!ok) throw new Error('Invalid credentials');

        if (!user.isEmailVerified) throw new Error('Email not verified');

        if (user.totpSecret) {
            const shortToken = tokens.sign({ email: user.email }, '10m');

            return {
                success: true,
                requiresTOTP: true,
                token: shortToken,
                message: "TOTP verification required"
            };
        }

        // const jwt = tokens.sign({ id: user._id, email: user.email }, '1d');
        // return { success: true, token: jwt, user: { id: user._id, email: user.email } };

        const jwt = tokens.sign(
            { id: user._id, email: user.email, role: user.role },
            '1d'
        );

        return LoginResDTO(jwt, user);
    }
}

module.exports = AuthService