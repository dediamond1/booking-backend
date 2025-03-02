"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const verification_controller_1 = require("../controllers/verification.controller");
const router = express_1.default.Router();
router.get('/verify-email', verification_controller_1.verifyEmail);
exports.default = router;
//# sourceMappingURL=verification.js.map