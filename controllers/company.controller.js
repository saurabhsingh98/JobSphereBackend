import { Company } from "../models/company.model.js";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";
import mongoose from "mongoose"; // Add this import for mongoose

// Register company
export const registerCompany = async (req, res) => {
    try {
        const { companyName } = req.body;

        if (!companyName) {
            return res.status(400).json({
                message: "Company name is required",
                success: false
            });
        }

        let company = await Company.findOne({ companyName });

        if (company) {
            return res.status(400).json({
                message: "Company already exists",
                success: false
            });
        }

        company = await Company.create({
            companyName,
            userId: req.id
        });

        return res.status(201).json({
            message: "Company registered successfully",
            success: true,
            company
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "An error occurred while registering the company",
            success: false
        });
    }
};

// Get all companies of the current user
export const getCompany = async (req, res) => {
    try {
        const userId = req.id;   // logged-in user
        // console.log(userId)
        const companies = await Company.find({ userId });

        if (!companies ) {
            return res.status(404).json({
                message: "No companies found",
                success: false
            });
        }

        return res.status(200).json({
            companies,
            success: true
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "An error occurred while fetching companies",
            success: false
        });
    }
};

// Get company by ID
export const getCompanyById = async (req, res) => {
    try {
        const { id: companyId } = req.params;

        // Validate if the provided id is a valid MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(companyId)) {
            return res.status(400).json({
                message: "Invalid company ID",
                success: false,
            });
        }

        // Fetch the company by ID
        const company = await Company.findById(companyId);

        if (!company) {
            return res.status(404).json({
                message: "Company not found",
                success: false,
            });
        }

        // Respond with the found company data
        return res.status(200).json({
            success: true,
            company,
        });

    } catch (error) {
        console.error("Error fetching company by ID:", error); // Detailed error logging
        res.status(500).json({
            message: "An error occurred while fetching the company",
            success: false,
        });
    }
};

// Update company
export const updateCompany = async (req, res) => {
    try {
        const { companyName, description, website, location } = req.body;

        // Validate required fields
        if (!companyName) {
            return res.status(400).json({
                message: "Company name is required",
                success: false
            });
        }

        const updateData = { companyName, description, website, location };

        // Check if a file was uploaded
        if (req.file) {
            const file = req.file;
            const fileUri = getDataUri(file);
            const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
            
            if (cloudResponse) {
                updateData.logo = cloudResponse.secure_url; // Add the logo URL if the upload was successful
            }
        }

        const company = await Company.findByIdAndUpdate(req.params.id, updateData, { new: true });

        if (!company) {
            return res.status(404).json({
                message: "Company not found",
                success: false
            });
        }

        return res.status(200).json({
            message: "Company information updated",
            company,
            success: true
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "An error occurred while updating the company",
            success: false
        });
    }
};
