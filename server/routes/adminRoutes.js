const express = require("express");
const router = express.Router();

const authmiddleware = require("../middleware/authmiddleware");
const { getallusersController, getalldoctorsController, changestatusController } = require("../controllers/adminControllers");

router.get("/getallusers", authmiddleware, getallusersController);
router.get(
  "/getalldoctors",
  authmiddleware,
  getalldoctorsController
);
router.post("/changestatus", authmiddleware, changestatusController);

module.exports = router;
