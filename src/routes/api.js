import express from "express";
import validate from "express-validation";

import * as userController from "../controllers/user/controller";
import * as userValidator from "../controllers/user/validator";

import * as projectController from "../controllers/project/controller";
import * as projectValidator from "../controllers/project/validator";

import * as timesheetController from "../controllers/timesheet/controller";
import * as timesheetValidator from "../controllers/timesheet/validator";

const router = express.Router();

//= ===============================
// API routes
//= ===============================
router.get("/me", userController.profile);
router.post(
  "/changePassword",
  validate(userValidator.changePassword),
  userController.changePassword
);

//= ===============================
router.get("/project", projectController.get);
router.get("/project/:id", projectController.get);
router.post(
  "/project",
  validate(projectValidator.create),
  projectController.create
);
router.delete("/project/:id", projectController.remove);

//= ===============================
router.get("/timesheet", timesheetController.get);
router.post(
  "/timesheet",
  validate(timesheetValidator.create),
  timesheetController.create
);

module.exports = router;
