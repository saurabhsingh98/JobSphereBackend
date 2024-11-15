import { v2 as cloudinary } from 'cloudinary';
// todo: check for dot env
import dotenv from 'dotenv';
dotenv.config();

cloudinary.config({ 
    cloud_name: process.env.CLOUD_NAME, 
    api_key: process.env.API_KEY, 
    api_secret: process.env.API_SECRET // Click 'View API Keys' above to copy your API secret
});

console.log(process.env.CLOUD_NAME)


export default cloudinary;

// const uploadOnCloudinary= async (localfilepath)=>{
//         try {
//             if(!localfilepath) return null;

//             const response= await cloudinary.uploader.upload(localfilepath, {resource_type:'auto'});

//             console.log('File has been uploaded successfully', response.url)

//             fs.unlinkSync(localfilepath);
//             return response;
//         } catch (error) {
//             fs.unlinkSync(localfilepath)    //remove file from server

//             return null;
//         }
// }

// export default uploadOnCloudinary;