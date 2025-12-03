import { body } from "express-validator";

export const registerValidator = [
  body("email").isEmail().withMessage("Invalid email"),
  body("password").isLength({ min: 6 }).withMessage("Min password 6 chars"),
  body("name").notEmpty().withMessage("Name required"),
];

export const loginValidator = [
  body("email").isEmail().withMessage("Invalid email"),
  body("password").notEmpty().withMessage("Password required"),
];
