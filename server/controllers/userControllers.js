const userModel = require("../models/userModel");
const appointmentModel = require("../models/appointmentModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const doctorModel = require("../models/doctorModel");
const moment = require("moment");


const signupController = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    console.log(`Name: ${name}, Email: ${email}, Password: ${password}`);

    // Validate input
    if (!name || !email || !password) {
      return res
        .status(400)
        .send({
          message: "Name, email, and password are required",
          success: false,
        });
    }

    // Check if user already exists
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .send({ message: "User Already Exists", success: false });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = new userModel({
      name,
      email,
      password: hashedPassword,
    });

    // Save user to database
    await newUser.save();

    res.status(201).send({ message: "Registered Successfully", success: true });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: `Register Controller Error: ${error.message}`,
    });
  }
};

const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(`Email: ${email}, Password: ${password}`);
    // Check if the user exists
    const user = await userModel.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .send({ message: "Invalid email or password", success: false });
    }
    // Compare password
      const isMatch = await bcrypt.compare(password, user.password);
      
    if (!isMatch) {
      return res
        .status(400)
        .send({ message: "Invalid email or password", success: false });
    }
    // Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.status(200).send({ message: "Login Success", success: true, token });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send({ message: `Error in Login Controller: ${error.message}` });
  }
};

const authController = async (req, res) => {
  try {
    const user = await userModel.findById({ _id: req.body.userId });
    user.password = undefined;
    if (!user) {
      return res.status(404).send({
        message: "User not found",
        success: false,
      });
    } else {
      return res.status(200).send({
        success: true,
        data: user
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      message: "Authentication error",
      success: false,
      error,
    });
  }
};

const applydoctorController = async(req,res) => {
  try {
    const newDoctor = await doctorModel({ ...req.body, status: "pending" });
    await newDoctor.save();
    const AdminUser = await userModel.findOne({ IsAdmin: true })
    const Notification = AdminUser.Notification;
    Notification.push({
      type: "apply-doctor-request",
      message: `${newDoctor.firstName} ${newDoctor.lastName} has applied for doctor`,
      data: {
        doctorId: newDoctor._id,
        name: `${newDoctor.firstName} ${newDoctor.lastName}`,
        onClickPath: "/admin/doctors",
      },
    });

    await userModel.findByIdAndUpdate(AdminUser._id, { Notification });
    res.status(201).send({
      success: true,
      message: "Doctor application submitted successfully",
    });
  } catch (error) {
     console.error("Error saving doctor data:", error);
     res
       .status(500)
       .send({
         success: false,
         message: "Failed to submit doctor application",
       });
  }
}


const getallnotificationController = async (req, res) => {
  try {
    const user = await userModel.findOne({ _id: req.body.userId });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }
    user.SeenNotification.push(...user.Notification);
    user.Notification = [];
    const updatedUser = await user.save();
    res.status(201).send({
      success: true,
      message: "All notifications marked as read",
      data: updatedUser,
    });
  } catch (error) {
    console.error("Error in marking notifications as read:", error);
    res.status(500).send({
      message: "Error in notification processing",
      success: false,
    });
  }
};

const deleteallnotificationController = async(req,res) => {
  try {
    const user = await userModel.findOne({ _id: req.body.userId });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }
    user.SeenNotification=[];
    user.Notification = [];
    const updatedUser = await user.save();
    res.status(201).send({
      success: true,
      message: "Notification deleted successfully",
      data: updatedUser,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      message: "unable to delete notifications",
      success: false,
    });
  }
}

const getalldoctorController = async (req, res) => {
  try {
    const doctors = await doctorModel.find({ status: "Approved" });
    console.log(doctors);
    res.status(201).send({
      success: true,
      message: "doctors lists fetched successfully",
      data: doctors,
    });
  } catch (error) {
    console.error("Error in fetching doctors:", error);
    res.status(500).send({
      message: "Error in fetching doctors",
      success: false,
    });
  }
};

const bookappointmentController = async(req,res) => {
  try {
    req.body.date = moment(req.body.date, "DD-MM-YYYY").toISOString();
    req.body.time = moment(req.body.time, "HH:mm").toISOString();

    req.body.status = "pending";
    const newAppointment = new appointmentModel(req.body);
    await newAppointment.save();

    const user = await userModel.findOne({ _id: req.body.doctorInfo.userId });
    user.Notification.push({
      type: "New-appointment-request",
      message: `A new Appointment Request from ${req.body.userInfo.name}`,
      onClickPath: "/user/appointments",
    });
    await user.save();

    res.status(200).send({
      success: true,
      message: "Appointment booked successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while booking appointment",
      error: error.message,
    });
  }
};

const bookavailabilityController = async(req,res) => {
  try {
        const date = moment(req.body.date, "DD-MM-YYYY").toISOString();
        const fromTime = moment(req.body.time, 'HH:mm').subtract(1, 'hours').toISOString();
        const toTime = moment(req.body.time, 'HH:mm').add(1, 'hours').toISOString();
        const doctorId = req.body.doctorId;

        const appointments = await appointmentModel.find({
            doctorId,
            date,
            time: {
                $gte: fromTime,
                $lte: toTime
            }
        });

        if (appointments.length > 0) {
            return res.status(200).send({
                success: true,
                message: 'Appointments not available at this time',
            });
        } else {
            return res.status(200).send({
                success: true,
                message: 'Appointment is available',
            });
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error in booking',
            error: error.message
        });
    }
};


const userappointmentsController = async(req,res) => {
  try {
    const appointments = await appointmentModel.find({
      userId: req.body.userId,
    });

    res.status(200).send({
      success: true,
      message: "User's Appointments Fetched Successfully",
      data: appointments,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in Fetching User Appointments",
      error: error.message,
    });
  }
}
module.exports = {
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
};
