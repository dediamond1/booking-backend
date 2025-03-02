"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyEmail = void 0;
const user_model_1 = __importDefault(require("../models/user.model"));
const error_1 = require("../utils/error"); // Assuming you have a utils/error.ts file
const verifyEmail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { token } = req.query;
        if (!token || typeof token !== 'string') {
            res.status(400).send({ message: 'Verification token is missing or invalid' });
            return;
        }
        const user = yield user_model_1.default.findOne({ verificationToken: token });
        if (!user) {
            res.status(404).send({ message: 'Invalid verification token' });
            return;
        }
        if (user.isVerified) {
            res.status(400).send({ message: 'Email address already verified' });
            return;
        }
        user.isVerified = true;
        user.verificationToken = undefined; // Clear the verification token after successful verification
        yield user.save();
        res.send({ message: 'Email address verified successfully' });
    }
    catch (error) {
        res.status(500).send({ message: 'Error verifying email', error: (0, error_1.getErrorMessage)(error) });
    }
});
exports.verifyEmail = verifyEmail;
//# sourceMappingURL=verification.controller.js.map