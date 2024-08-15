const doctorModel = require("../models/doctorModel");
const userModel = require("../models/userModel");

const getallusersController = async (req, res) => {
  try {
    const users = await userModel.find({});

    res.status(200).send({
      success: true,
      message: "All users fetched successfully",
      data: users,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).send({
      success: false,
      message: "Error fetching users",
    });
  }
};
const getalldoctorsController = async (req, res) => {
  try {
    const doctors = await doctorModel.find({});
    res.status(200).send({
      success: true,
      message: "All doctors fetched successfully",
      data: doctors,
    });
  } catch (error) {
    console.error("Error fetching doctors:", error);
    res.status(500).send({
      success: false,
      message: "Error fetching doctors",
    });
  }
};

const changestatusController = async (req, res) => {
  try {
    const { doctorId, status } = req.body;
    const doctor = await doctorModel.findByIdAndUpdate(doctorId, { status });
    const user = await userModel.findOne({ _id: doctor.userId });
    const Notification = user.Notification;
    Notification.push({
      type: "doctor account request updated",
      message: `your doctor acount has status ${status}`,
      onClickPath: "/notification",
    });
    user.IsDoctor = status === "Approved" ? true : false;
    await user.save();
    res.status(200).send({
      success: true,
      message: "Account status updated",
      data: doctor,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in account status",
    });
  }
};
module.exports = {
  getallusersController,
  getalldoctorsController,
  changestatusController,
};
