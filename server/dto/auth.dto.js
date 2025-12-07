// DTOs

function RegistationDTO(username, email, password) {
    if (!username || !email || !password) throw new Error("Missing Input Fields");
    return { username: String(username), email: String(email).toLocaleLowerCase(), password: String(password) }
}

function loginDTO(email, password) {
    if (!email || !password) throw new Error("Missing Input Fields");
    return { email: String(email).toLocaleLowerCase(), password: String(password) }
}

function ForgetPasswordDTO(email) {
    if(!email) throw new Error ("Missing Input Fields");
    return { email: String(email) }
}

function VerifyEmailDTO(token, otp) {
    if (!token || !otp) throw new Error("Missing Inputs");
    return { token: String(token), otp: String(otp) }
}

function UpdatePasswordDTO(token, newpassword) {
    if(!token || !newpassword) throw new Error("Missing Inputs");
    return { token: String(token), newpassword: String(newpassword) }
}


// Response DTOs

function RegistationResDTO(token, message = "Registation Successfull") {
    return {
        success: true,
        token,
        message
    }
}

function EmailVerifyResDTO(message = "Email Verification Succcess") {
    return {
        success: true,
        message
    };
}

function LoginResDTO(token, user, message = "Login Success") {
    return {
        success: true,
        token,
        user: { id: user._id, email: user.email, username: user.username, role: user.role },
        message
    }
}

function ErrorResDTO(msg) {
    return {
        success: false, 
        message: msg
    };
}

function SetupTotpResDTO (qrCode, message="QR code send Success") {
    return {
        success: true,
        qrCode,
        message
    }
}

function ForgetPasswordResDTO (token, message="OTP send to your email, Please check the Email") {
    return {
        success: true,
        token,
        message
    }
}

function VerifyOTPResDTO (message="OTP Verify Success") {
    return {
        success: true,
        message
    }; 
}

function UpdatePasswordResDTO (message="Password Updated Successfully") {
    return {
        success: ture,
        message,
    }
}

module.exports = {
    RegistationDTO, loginDTO, ForgetPasswordDTO, VerifyEmailDTO, UpdatePasswordDTO,
    SetupTotpResDTO,
    RegistationResDTO, LoginResDTO, ForgetPasswordResDTO, VerifyOTPResDTO, UpdatePasswordResDTO, EmailVerifyResDTO,
    ErrorResDTO
}