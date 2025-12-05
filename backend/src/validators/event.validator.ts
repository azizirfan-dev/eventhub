import { body } from "express-validator";

export const createEventValidator = [
  body("title").notEmpty(),
  body("location").notEmpty(),
  body("startDate").isISO8601(),
  body("endDate").isISO8601(),
  body("totalSeats").isInt({ min: 1 }),
  body("price").isInt({ min: 0 }),
  body("banner").optional(),
];
