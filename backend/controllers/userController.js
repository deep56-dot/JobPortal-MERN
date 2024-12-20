import { AsyncHandler } from "../middlewares/AsyncHandler.js";
import ErrorHandler from "../middlewares/error.js";
import { User } from "../models/user.model.js";
// import { sendToken } from "../utils/jwtToken.js";
import {v2 as cloudinary} from "cloudinary"

export const register = AsyncHandler(async (req, res, next) => {
    try {
      const {
        name,
        email,
        phone,
        address,
        password,
        role,
        firstNiche,
        secondNiche,
        thirdNiche,
        coverLetter,
      } = req.body;
  
      if (!name || !email || !phone || !address || !password || !role) {
        return next(new ErrorHandler("All fileds are required.", 400));
      }
      if (role === "Job Seeker" && (!firstNiche || !secondNiche || !thirdNiche)) {
        return next(
          new ErrorHandler("Please provide your preferred job niches.", 400)
        );
      }
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return next(new ErrorHandler("Email is already registered.", 400));
      }
      const userData = {
        name,
        email,
        phone,
        address,
        password,
        role,
        niches: {
          firstNiche,
          secondNiche,
          thirdNiche,
        },
        coverLetter,
      };
      if (req.files && req.files.resume) {
        const { resume } = req.files;
        if (resume) {
          try {
            const cloudinaryResponse = await cloudinary.uploader.upload(
              resume.tempFilePath,
              { folder: "Job_Seekers_Resume" }
            );
            if (!cloudinaryResponse || cloudinaryResponse.error) {
              return next(
                new ErrorHandler("Failed to upload resume to cloud.", 500)
              );
            }
            userData.resume = {
              public_id: cloudinaryResponse.public_id,
              url: cloudinaryResponse.secure_url,
            };
          } catch (error) {
            return next(new ErrorHandler("Failed to upload resume", 500));
          }
        }
      }
      const user = await User.create(userData);
      const token = user.getJWTToken();
 
      const options = {
        expires: new Date(
          Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
        ),
        httpOnly: true,
        secure:true,
        sameSite: "None"
      };
    
      res.status(statusCode).cookie("token", token, options).json({
        success: true,
        user,
        message:"User Registered",
        token,
      });
      
    } catch (error) {
      next(error);
    }
  });
  
  export const login = AsyncHandler(async (req, res, next) => {
    const { role, email, password } = req.body;
    if (!role || !email || !password) {
      return next(
        new ErrorHandler("Email, password and role are required.", 400)
      );
    }
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return next(new ErrorHandler("Invalid email or password.", 400));
    }
    const isPasswordMatched = await user.comparePassword(password);
    if (!isPasswordMatched) {
      return next(new ErrorHandler("Invalid email or password.", 400));
    }
    if (user.role !== role) {
      return next(new ErrorHandler("Invalid user role.", 400));
    }
    const token = user.getJWTToken();
 
    const options = {
      expires: new Date(
        Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
      ),
      httpOnly: true,
      secure:true,
      sameSite: "None"
    };
  
    res.status(200).cookie("token", token, options).json({
      success: true,
      user,
      message:"user Log in sucessfully",
      token,
    });
  });

  export const logout = AsyncHandler( async(req,res,next)=>{
    res
    .status(200)
    .cookie("token", "", {
      expires: new Date(Date.now()),
      httpOnly: true,
      secure:true,
      sameSite: "None"
    })
    .json({
      success: true,
      message: "Logged out successfully.",
    });
  })

  export const getUser = AsyncHandler(async (req, res, next) => {
    const user = req.user;
    res.status(200).json({
      success: true,
      user,
    });
  });
  
  export const updateProfile = AsyncHandler(async (req, res, next) => {
    const newUserData = {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      address: req.body.address,
      coverLetter: req.body.coverLetter,
      niches: {
        firstNiche: req.body.firstNiche,
        secondNiche: req.body.secondNiche,
        thirdNiche: req.body.thirdNiche,
      },
    };
    const { firstNiche, secondNiche, thirdNiche } = newUserData.niches;
  
    if (
      req.user.role === "Job Seeker" &&
      (!firstNiche || !secondNiche || !thirdNiche)
    ) {
      return next(
        new ErrorHandler("Please provide your all preferred job niches.", 400)
      );
    }
    if (req.files) {
      const resume = req.files.resume;
      if (resume) {
        const currentResumeId = req.user.resume.public_id;
        if (currentResumeId) {
          await cloudinary.uploader.destroy(currentResumeId);
        }
        const newResume = await cloudinary.uploader.upload(resume.tempFilePath, {
          folder: "Job_Seekers_Resume",
        });
        newUserData.resume = {
          public_id: newResume.public_id,
          url: newResume.secure_url,
        };
      }
    }
  
    const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    });
    res.status(200).json({
      success: true,
      user,
      message: "Profile updated.",
    });
  });
  
  export const updatePassword = AsyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user.id).select("+password");
  
    const isPasswordMatched = await user.comparePassword(req.body.oldPassword);
  
    if (!isPasswordMatched) {
      return next(new ErrorHandler("Old password is incorrect.", 400));
    }
  
    if (req.body.newPassword !== req.body.confirmPassword) {
      return next(
        new ErrorHandler("New password & confirm password do not match.", 400)
      );
    }
  
    user.password = req.body.newPassword;
    await user.save();
    sendToken(user, 200, res, "Password updated successfully.");
  });