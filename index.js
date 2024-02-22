const express = require("express");
const {connection} = require("./connections/db");
const userRouter = require("./routes/user.route");
const voiceRouter = require("./routes/voice.route");
const adminRouter = require("./routes/admin.route");
const {auth} = require("./middlewares/auth");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

require("dotenv").config();

app.get("/",(req,res)=>{
    res.send("Hello World")
})

app.use("/voicebank/user", userRouter);
app.use("/voicebank/admin",auth, adminRouter);
app.use("/voicebank/voice",voiceRouter);


app.listen(process.env.PORT, async()=>{
    try {
        await connection;
        console.log(`Database is connected`);
    } catch (error) {
        console.log(`Unable to connect db!`);
        console.log(error.message);
    }
    console.log(`Server is running at port ${process.env.PORT}`);
})