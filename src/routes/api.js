import express from "express";
import validate from "express-validation";

import * as userController from "../controllers/user/controller";
import * as userValidator from "../controllers/user/validator";

import * as timesheetController from "../controllers/timesheet/controller";
import * as timesheetValidator from "../controllers/timesheet/validator";

const router = express.Router();

//= ===============================
// API routes
//= ===============================
router.get("/profile", userController.profile);
router.post(
  "/changePassword",
  validate(userValidator.changePassword),
  userController.changePassword
);
router.put("/profile", userController.update);
router.put("/user/:id", userController.update);

//= ===============================
router.get("/timesheet", timesheetController.get);
router.get("/timesheet/:id", timesheetController.get);
router.post(
  "/timesheet",
  validate(timesheetValidator.create),
  timesheetController.create
);
router.delete("/timesheet", timesheetController.remove);
router.delete("/timesheet/:id", timesheetController.remove);

module.exports = router;
