const { ErrorResDTO, RegistationDTO, VerifyEmailDTO, LoginResDTO, } = require("../dto/auth.dto");
const AuthService = require("../services/auth.service");

const AuthController = {
    registation: async (req, res) => {
        try {
            const {
                username,
                email,
                password,
            } = req.body

            const dtp = RegistationDTO(username, email, password)

            const result = await AuthService.Registaion(
                dto.username,
                dto.email,
                dto.password,
                req
            )
            res.status(200).json(result)
        }
        catch (err) {
            const errorDTO = ErrorResDTO(err.message || "Something went wrong");
            return res.status(400).json(errorDTO);
        }
    },

    verifyEmail: async (req, res) => {
        try {
            const token = req.header('Authorization')?.replace('Bearer ', '');
            const { otp } = req.body;
            if (!token) return res.status(401).json({ message: 'No token' });

            const dto = VerifyEmailDTO(token, otp)

            const result = await AuthService.verifyEmail(
                dto.token,
                dto.otp,
                req
            )

            res.status(200).json(result)
        }
        catch (err) {
            const errorDTO = ErrorResDTO(err.message || "Something went wrong");
            return res.status(400).json(errorDTO);
        }
    },

    setupTOTP: async (req, res) => {
        try {
            const token = req.header('Authorization')?.replace('Bearer ', '');
            if (!token) return res.status(401).json({ message: 'No token' });

            const result = await AuthService.setupTOTP(token, req);
            res.status(200).json(result);

        } catch (err) {
            const errorDTO = ErrorResDTO(err.message || "Something went wrong");
            return res.status(400).json(errorDTO);
        }
    },

    verifyTOTPLogin: async (req, res) => {
        try {
            const { email, totp } = req.body;
            const result = await AuthService.verifyTOTPLogin(email, totp)

            res.status(200).json(result)
        }
        catch (err) {
            const errorDTO = ErrorResDTO(err.message || "Something went wrong");
            return res.status(400).json(errorDTO);
        }
    },

    login: async (req, res) => {
        try {
            const {
                email,
                password
            } = req.body

            const dto = LoginResDTO(email, password)

            const result = await AuthService.login(
                dto.email,
                dto.password,
                req
            )
            
            res.status(200).json(result)
        }
        catch (err) {
            const errorDTO = ErrorResDTO(err.message || "Something went wrong");
            return res.status(400).json(errorDTO);
        }
    }
};

module.exports = AuthController;