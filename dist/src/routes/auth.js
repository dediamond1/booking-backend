"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("../controllers/user.controller");
const verification_controller_1 = require("../controllers/verification.controller");
const router = express_1.default.Router();
// User registration route with validation middleware
router.post('/register', user_controller_1.createUserHandler);
router.post('/login', user_controller_1.loginUserHandler); // Login route
router.get('/verify-email', verification_controller_1.verifyEmail); // Moved verification route here
exports.default = router;
//# sourceMappingURL=auth.js.map