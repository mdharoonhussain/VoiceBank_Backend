const {UserModel} = require("../models/user.model");
const {BlacklistModel} = require("../models/blacklist.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();


const signup = async(req,res)=>{
    try {
        const { name,email,password } = req.body;
        const isUserExists = await UserModel.findOne({email});
        if(isUserExists) return res.status(400).send({msg:"User Already Exists Please Login"});
        const hash = await bcrypt.hash(password,+(process.env.SALT_ROUNDS));
        const newUser = new UserModel({name,email,password:hash});
        await newUser.save();
        res.status(201).send({msg:"SignUp Sucessfull!"});
        
    } catch (error) {
        console.log({"/user/signup":error.message})
        res.status(500).send({msg:error.message})
    }
}

const login = async(req,res)=>{
    try {
        const { email,password } = req.body;
        const isUserExists = await UserModel.findOne({email});
        if(!isUserExists) return res.status(400).send({msg:"User Does Not Exists! Please Signup First!"});
        
        const result = await bcrypt.compare(password,isUserExists.password);

        if(result){
            const access_token = jwt.sign({userId:isUserExists._id},process.env.JWT_SECRET,{expiresIn:"7d"});
            res.status(200).send({msg:"Login SucessFull",token:access_token, user:isUserExists});
        }else{
            res.status(400).send({msg:"Wrong Credentials!"});
        }
        
    } catch (error) {
        console.log({"/user/login":error.message})
        res.status(500).send({msg:error.message})
    }
}


const logout = async(req,res)=>{
    try {
        const token = req.body.headers.authorization.split(" ")[1] || req.body.headers.authorization;
        console.log(token)
        const blacklisted = new BlacklistModel({"token":token});
        await blacklisted.save();
        res.status(200).send({msg:"Logout SucessFull"});
        
    } catch (error) {
        console.log({"/user/logout":error.message})
        res.status(500).send({msg:error.message})
    }
}

module.exports = {signup, login, logout};