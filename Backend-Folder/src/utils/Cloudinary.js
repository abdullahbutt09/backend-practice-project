import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import { cloudinary_name , cloud_api_key , cloud_api_secret } from '../config/index'

cloudinary.config({
    cloud_name: cloudinary_name,
    api_key: cloud_api_key,
    api_secret: cloud_api_secret
});


const uploadOnCloudinary = async (localFilePath) => {
    try {
        if(!localFilePath) return null;

        const response = await cloudinary.uploader.upload(localFilePath, {resource_type: "auto"})
        console.log("file uploaded successfully on cloudinary" , response.url);
        return response;
    } catch (error) {
        fs.unlinkSync(localFilePath) // remove the locally saved temporary file as the upload operation got failed.
    }
}

export default uploadOnCloudinary;