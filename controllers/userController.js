// import { compare } from "bcrypt";
import { comparePassword, hashPassword } from "../helpers/bcrypt.js";
import User from "../models/user.js";
import JWT from "jsonwebtoken";

export const registercontroller = async (req, res) => {
  try {
    const { username, email, password, fullname, phone, address } = req.body;
    //vaildation
    if (!username || !email || !fullname || !password || !phone || !address) {
      return res.status(404).send({
        success:false,
        message: "All the fields are required"
         });
    }

    //Check user
    const existinguser = await User.findOne({ email });
    //Existing user
    if (existinguser) {
      return res.status(400).send({
        success: false,
        message: "User is Already Register please login",
      });
    }

    //register user
    const hashedPassword = await hashPassword(password);
    //save
    const user = await new User({
      username,
      email,
      fullname,
      phone,
      address,
      password: hashedPassword,
    }).save();
    res.status(201).send({
      success: true,
      message: "User Register Successfully",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Internal server error",
      error,
    });
  }
};

//POST Login
export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    //vaildation
    if (!email || !password) {
      return res.status(404).send({
        success: false,
        message: "Invalid email or password",
      });
    }
    //check user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Invalid Email",
      });
    }

    const match = await comparePassword(password, user.password);
    if (!match) {
      return res.status(400).send({
        success: false,
        message: "invalid password or email",
      });
    }

    //token
    const token = await JWT.sign({ _id: user._id }, process.env.JWT_SECERT, {
      expiresIn: "7d",
    });
    res.status(200).send({
      success: true,
      message: "login successfully",
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Internal server error",
      error,
    });
  }
};

//forgotpasswordController
export const forgotPasswordController = async (req, res) => {
  try {
    const { email,newpassword } = req.body;
    if (!email || !newpassword) {
      res.status(400).send({ message: "All fields are mandatory" });
    }
    // if (!answer) {
    //   res.status(400).send({ message: "answer is required" });
    // }

    //check
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Email is invalid",
      });
    }
    const hashed = await hashPassword(newpassword);
    await User.findByIdAndUpdate(user._id, { password: hashed });
    res.status(200).send({
      success: true,
      message: "Password Reset Successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Something went wrong",
      error,
    });
  }
};

//update profile
export const updateProfileController = async (req, res) => {
  try {
    const { name, email, address, phone } = req.body;
    const user = await usermodel.findById(req.user._id);
    
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      {
        name: name || user.name,
        phone: phone || user.phone,
        address: address || user.address,
      },
      { new: true }
    );
    res.status(200).send({
      success: true,
      message: "Profile Updated SUccessfully",
      // updatedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Something went wrong",
      error,
    });
  }
};
