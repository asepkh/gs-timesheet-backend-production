import express from "express";
import validate from "express-validation";

import * as userController from "../controllers/user/controller";
import * as userValidator from "../controllers/user/validator";

import * as projectController from "../controllers/project/controller";

const router = express.Router();

//= ===============================
// Public routes
//= ===============================

router.post("/login", validate(userValidator.login), userController.login);
router.post(
  "/register",
  validate(userValidator.register),
  userController.register
);

//= ===============================
router.get("/project", projectController.get);
router.get("/project/:id", projectController.get);

module.exports = router;
