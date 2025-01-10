import { User } from "../models/user.model.js";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";

// Register function
export const register = async (req, res) => {
    try {
        const { fullname, email, phoneNumber, password, role } = req.body;
        console.log("doing register")
        // Validate required fields
        if (!fullname || !email || !phoneNumber || !password || !role) {
            return res.status(400).json({
                message: "All fields are required register user",
                success: false
            });
        }


        const file= req.file;
        const fileUri= getDataUri(file);
        const cloudResponse= await cloudinary.uploader.upload(fileUri.content);
       
        

        // Check if user already exists
        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({
                message: 'User already exists with this email',
                success: false,
            });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create the new user
        await User.create({
            fullname,
            email,
            phoneNumber,
            password: hashedPassword,
            role,
            profile:{
                profilePhoto: cloudResponse.secure_url,
            }
        });

        const a= await User.findOne({email})

        return res.status(201).json({
            message: "Account created successfully",
            success: true,
            a
        });

    } catch (error) {
        console.log("Error while registering:", error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};

// Login function
export const login = async (req, res) => {
    try {
        const { email, password, role } = req.body;
        console.log("doing login")
        // Validate required fields
        if (!email || !password || !role) {
            return res.status(400).json({
                message: "All fields are required login user",
                success: false
            });
        }

        // Find user by email
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                message: 'User does not exist',
                success: false,
            });
        }

        // Compare the password
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(400).json({
                message: 'Incorrect password',
                success: false,
            });
        }

        // Check role
        if (role !== user.role) {
            return res.status(400).json({
                message: 'Role does not match',
                success: false,
            });
        }

        // Create token
        const tokenData = {
            userId: user._id,
        };
        const token = await jwt.sign(tokenData, process.env.SECRET_KEY, {
            expiresIn: '1D'
        });

        // Prepare user data for response
        user = {
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            phoneNumber: user.phoneNumber, // Fixed this line
            role: user.role,
            profile: user.profile
        };

        // Set cookie and respond
        return res.cookie("token", token, {
            maxAge: 1 * 24 * 60 * 60 * 1000, // 1 day
            httpOnly: true,
            sameSite: 'strict'
        }).status(200).json({
            message: `Welcome back ${user.fullname}`,
            success: true,
            user // Include user info in the response
        });

    } catch (error) {
        console.log("Error during login:", error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};


//logout

export const logout= async( req, res)=>{
    try {
         
        return res.status(200).cookie('token', "", {maxAge:0}).json({
            message:"Logged Out Successfully",
            success: true
        })

    } catch (error) {
        console.log(error)
    }
}


//updata profile

export const updateProfile = async (req, res) => {
    try {
        const { fullname, email, phoneNumber, bio, skills } = req.body;
        
        //file
        //  todo DOne:🟢 cloudinary
        const file = req.file;
const fileUri = getDataUri(file);

const cloudResponse = await cloudinary.uploader.upload(fileUri.content, {
    resource_type: "raw",  // Correct for non-image files
    use_filename: true,     // Keep original filename
    unique_filename: false, // Prevent renaming
});

       

        let skillsArray;
        if(skills){
            skillsArray= skills.split(",");
        }

        const userId= req.id;   //middleware authentication

        let user= await User.findById(userId);
        if(!user){
            return res.status(400).json({
                message:"User not found so no updata can be done",
                 success: false
            })
        }

        //updating user
        if(fullname) user.fullname= fullname;
        if(email) user.email= email;
        if(phoneNumber) user.phoneNumber= phoneNumber;
        if(bio) user.profile.bio= bio;
        if(skillsArray) user.profile.skills= skillsArray;

        // todo Done:🟢 resume uploading
        if(cloudResponse){
            user.profile.resume= cloudResponse.secure_url;  //save cloudinary url
            user.profile.resumeOriginalName= file.originalname //save original file name
        }

        await user.save();


        user = {
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            phoneNumber: user.phoneNumber, // Fixed this line
            role: user.role,
            profile: user.profile
        };

        return res.status(200).json({
            message: "Profile Updated Successfully",
            success: true,
            user
        })
        
    } 
    catch (error) {
        console.log("Error while updating profile:", error); // Added a message for clarity
       
    }
}
