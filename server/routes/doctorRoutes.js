const express = require("express");
const router = express.Router();

const authmiddleware = require("../middleware/authmiddleware");
const {
  getdoctorinfoController,
  updateprofileController,
  getdoctorbyidController,
  doctorappointmentsController,
  updatestatusController,
} = require("../controllers/doctorControllers");

router.post("/getdoctorinfo", authmiddleware, getdoctorinfoController);
router.post("/updateprofile", authmiddleware, updateprofileController);
router.post("/getdoctorbyid", authmiddleware, getdoctorbyidController);
router.get(
  "/doctorappointments",
  authmiddleware,
  doctorappointmentsController
);
router.post("/updatestatus", authmiddleware, updatestatusController);


module.exports = router;
