import express from "express";
import validate from "express-validation";

import * as userController from "../controllers/user/controller";
import * as userValidator from "../controllers/user/validator";

import * as projectController from "../controllers/project/controller";
import * as projectValidator from "../controllers/project/validator";

import * as workLocationController from "../controllers/workLocation/controller";
import * as workLocationValidator from "../controllers/workLocation/validator";

import * as timesheetController from "../controllers/timesheet/controller";

const router = express.Router();

//= ===============================
// Admin routes
//= ===============================
router.get("/user", userController.get);
router.delete("/user/:id", userController.remove);
router.post("/user", validate(userValidator.register), userController.register);
router.get("/data-summary", timesheetController.getDataSummary);
//= ===============================
router.post(
  "/project",
  validate(projectValidator.create),
  projectController.create
);
router.delete("/project/:id", projectController.remove);
router.put("/project/:id", projectController.update);
//= ===============================
router.post(
  "/workLocation",
  validate(workLocationValidator.create),
  workLocationController.create
);
router.delete("/workLocation/:id", workLocationController.remove);
router.put("/workLocation/:id", workLocationController.update);

module.exports = router;
