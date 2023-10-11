const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");  // Moved cors import up

const userRoute = require("./routes/user");
const adminRoute = require("./routes/admin");
const orderRoute = require("./routes/order");
const productRoute = require("./routes/product");
const paymentRoute= require("./routes/payment")


const Razorpay = require('razorpay');


dotenv.config();

app.use(cors()); // CORS middleware

app.use(express.json())

mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log("Db connection successful!"))
    .catch((err) => {
        console.log(err);
    });

app.get("/home", (req, res) => {
    res.send("This is homepage")
});

app.use("/home", userRoute);
app.use("/home", adminRoute);
app.use("/home", orderRoute);
app.use("/home", productRoute.router);
app.use("/home/payment/",paymentRoute);


app.listen(process.env.PORT || 5000, () => {
    console.log("Backend server is running");
});
