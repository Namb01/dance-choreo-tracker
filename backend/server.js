const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const choreoRoutes = require("./routes/choreos");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/choreos", choreoRoutes);

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.log(err));

app.get("/", (req, res) => {
    res.send("API is running...");
});

const PORT = 8000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));