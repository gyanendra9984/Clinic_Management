const express = require('express');
const colors = require('colors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cors = require('cors');

dotenv.config();

connectDB();
const app = express();

app.use(
  cors({
    origin: "http://localhost:3000", // Adjust to your frontend URL if needed
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
  })
);
app.use(express.json());

app.use('/api/users', require('./routes/userRoutes'));
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/doctor", require("./routes/doctorRoutes"));



const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`.yellow.bold);
})
    