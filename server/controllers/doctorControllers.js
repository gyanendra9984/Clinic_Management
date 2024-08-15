const doctorModel = require("../models/doctorModel");
const appointmentModel = require("../models/appointmentModel");
const userModel = require("../models/userModel");


const getdoctorinfoController = async (req, res) => {
  try {
    const doctor = await doctorModel.findOne({ userId: req.body.userId });
    if (!doctor) {
      return res.status(404).send({
        success: false,
        message: "Doctor not found",
      });
    }
    res.status(200).send({
      success: true,
      message: "Doctor information retrieved successfully",
      data: doctor,
    });
  } catch (error) {
    console.error("Error fetching doctor information:", error);
    res.status(500).send({
      success: false,
      message: "Error fetching doctor information",
    });
  }
};

const updateprofileController = async (req, res) => {
  try {
    const doctor = await doctorModel.findOneAndUpdate(
      { userId: req.body.userId },
      req.body
    );
    res.status(200).send({
      success: true,
      message: "Profile updated successfully",
      data: doctor,
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).send({
      success: false,
      message: "Error updating profile",
    });
  }
};

const getdoctorbyidController = async (req,res) => {
  try {
    const doctor = await doctorModel.findOne({ _id: req.body.doctorId });
    res.status(200).send({
      success: true,
      message: "single doc info fetched",
      data: doctor,
    });
  } catch (error) {
    console.error("Error in single doc info:", error);
    res.status(500).send({
      success: false,
      message: "Error in single doc info",
    });
  }
};

const doctorappointmentsController = async(req,res) => {
      try {
        const doctor = await doctorModel.findOne({ userId: req.body.userId });
        const appointments = await appointmentModel.find({
          doctorId: doctor._id,
        });

        res.status(200).send({
          success: true,
          message: "Doctor appointments fetched successfully",
          data: appointments,
        });
      } catch (error) {
        console.log(error);
        res.status(500).send({
          success: false,
          message: "Error fetching doctor appointments",
          error: error.message,
        });
      }
};
    
const updatestatusController = async(req,res) => {
    try {
    const { appointmentId, status } = req.body;
    const appointment = await appointmentModel.findByIdAndUpdate(
      appointmentId,
      { status },
    );
    const user = await userModel.findOne({ _id:appointment.userId});
    user.Notification.push({
      type: "status-updated",
      message: `Your appointment has been updated to ${status}`,
      onClickPath: "/doctorappointments",
    });

    await user.save();
    res.status(200).send({
      success: true,
      message: "Appointment Status Updated",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error: error.message,
      message: "Error updating appointment status",
    });
  }
}
module.exports = {
  getdoctorinfoController,
  updateprofileController,
  getdoctorbyidController,
  doctorappointmentsController,
  updatestatusController,
};
