import dotenv from "dotenv";
dotenv.config({ path: "./.env" }); // MUST be first

const accessToken = process.env.ACCESS_TOKEN_SECRET;
const accessTokenExpiry = process.env.ACCESS_TOKEN_EXPIRY;

const refreshToken = process.env.REFRESH_TOKEN_SECRET;
const refreshTokenExpiry = process.env.REFRESH_TOKEN_EXPIRY;

const cloudinary_name = process.env.CLOUDINARY_CLOUD_NAME;
const cloud_api_key = process.env.CLOUDINARY_API_KEY;
const cloud_api_secret = process.env.CLOUDINARY_API_SECRET;

const PORT = process.env.PORT || 5000;

export { accessToken, accessTokenExpiry, refreshToken, refreshTokenExpiry, cloudinary_name, cloud_api_key, cloud_api_secret, PORT };