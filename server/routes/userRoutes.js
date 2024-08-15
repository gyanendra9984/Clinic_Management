const express = require("express");
const router = express.Router();
const {
  signupController,
  loginController,
  authController,
  applydoctorController,
  getallnotificationController,
  deleteallnotificationController,
  getalldoctorController,
  bookappointmentController,
  bookavailabilityController,
  userappointmentsController,
} = require("../controllers/userControllers");
const authmiddleware = require("../middleware/authmiddleware");

router.post("/signup", signupController);
router.post("/login", loginController);
router.post("/getUserData", authmiddleware, authController);
router.post("/applydoctor", authmiddleware, applydoctorController);
router.post(
  "/getallnotification",
  authmiddleware,
  getallnotificationController
);
router.post(
  "/deleteallnotification",
  authmiddleware,
  deleteallnotificationController
);
router.get("/getalldoctor", authmiddleware, getalldoctorController);

router.post("/bookappointment", authmiddleware, bookappointmentController);
router.post("/bookavailability", authmiddleware, bookavailabilityController);
router.get("/userappointments", authmiddleware, userappointmentsController);

module.exports = router;
