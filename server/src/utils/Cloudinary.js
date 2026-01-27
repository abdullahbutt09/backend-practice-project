import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import { cloudinary_name , cloud_api_key , cloud_api_secret } from '../config/index.js'
import apiError from "./apiError.js";

cloudinary.config({
    cloud_name: cloudinary_name,
    api_key: cloud_api_key,
    api_secret: cloud_api_secret
});

// DEBUG: Make fs.unlinkSync safe (check file exists or use try/catch)
// ERROR: Preserve original Cloudinary error messages in apiError
// FIXME: Consider using async fs.promises.unlink instead of sync

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if(!localFilePath) return null;

        const response = await cloudinary.uploader.upload(localFilePath, {resource_type: "auto"})
        console.log("file uploaded successfully on cloudinary" , response.url);
        fs.unlinkSync(localFilePath);
        console.log("study this cloudinary response", response)
        return response;
    } catch (error) {
        fs.unlinkSync(localFilePath) // remove the locally saved temporary file as the upload operation got failed.
        throw new apiError(500, "Error Uploading files on cloudinary")
    }
}

const deleteFromCloudinary = async (public_id) => {
    try {
        if (!public_id) {
            throw new apiError(400, "Invalid public_id at server side of the file to be deleted!");
        }

        const response = await cloudinary.uploader.destroy(public_id);

        if (response?.result !== "ok") {
            throw new apiError(500, "Cloudinary failed to delete image");
        }

        return response; // optional, useful for logging/debug
    } catch (error) {
        if (error instanceof apiError) throw error;
        throw new apiError(500, error.message || "Error deleting file from cloudinary");
    }
};

export {
    uploadOnCloudinary,
    deleteFromCloudinary
};