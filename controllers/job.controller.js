
import { Job } from "../models/job.model.js";

//admin
// Post a new job
export const postJob = async (req, res) => {
    try {
        const { title, description, requirements, salary, location, jobType, position, company , experienceLevel} = req.body;

        // Validate required fields
        if (!title || !description || !salary || !location || !jobType || !position || !company || !requirements || !experienceLevel) {
            return res.status(400).json({
                message: "All required fields must be filled",
                success: false
            });
        }

        // Create a new job posting
        const job = await Job.create({
            title,
            description,
            experienceLevel,
            requirements: requirements.split(","),
            salary: Number(salary),
            location,
            jobType,
            position,
            company,
            created_by: req.id // Assuming req.user contains the logged-in user's info
        });

        return res.status(201).json({
            message: "Job posted successfully",
            success: true,
            job
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Server error while posting job",
            success: false
        });
    }
};


//student
//get all jobs

export const getAllJobs= async(req, res)=>{
    try {
        
        const keyword= req.query.keyword|| "";

        const query= {
            $or:[
                {title:{$regex:keyword , $options:"i"}},
                {description: {$regex:keyword, $options:"i"}},
            ]
        }

        const jobs = await Job.find(query).populate({
            path: "company"
        }).sort({ createdAt: -1 });

        if(!jobs){
            return res.status(404).json({
                message:"Jobs not found",
                success: false
            })
        }

        return res.status(200).json({
            jobs,
            success:true
        })

    } catch (error) {
        console.log(error);
    }
}

//student
//job by id

export const getJobById= async (req, res)=>{
    try {
        const jobId= req.params.id;
        const job = await Job.findById(jobId)
            .populate({
                path: 'company', // Populate the company details
            })
            .populate({
                path: 'applications', // Populate the applications details
            });
        if(!job){
            return res.status(404).json({
                message:"Job with id not found",
                success: false
            })
        }

        return res.status(200).json({job, success:true});

    } catch (error) {
        console.log(error)
    }
}


// admin kitne job create kiya

export const getJobCreatedByAdmin= async(req, res)=>{
    try {
        
        const adminId= req.id;
        const jobs= await Job.find({created_by: adminId}).populate({
            path:'company'
        })

        if(!jobs){
            return res.status(404).json({
                message:"No Jobs posted by admin",
                success: false
            })
        }

        return res.status(200).json({
            jobs,
            success:true
        })

    } catch (error) {
        
    }
}