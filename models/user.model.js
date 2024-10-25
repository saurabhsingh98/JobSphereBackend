import mongoose from "mongoose";

// Define user schema
const userSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['student', 'recruiter'],
        required: true
    },
    profile: {
        bio: {
            type: String
        },
        skills: [{ 
            type: String 
        }],
        resume: {
            type: String // URL of the resume
        },
        resumeOriginalName: {
            type: String
        },
        company: {
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'Company'
        },
        profilePhoto: {
            type: String,
            default: ""
        }
    }
}, { timestamps: true });

// Export user model
export const User = mongoose.model('User', userSchema);
