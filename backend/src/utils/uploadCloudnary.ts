import streamifier from "streamifier";
import cloudinary from "../config/cloudanary";

interface UploadResult {
  url: string;
  public_id: string;
}

const uploadCloudinary = (file: Express.Multer.File): Promise<UploadResult> => {
  return new Promise((resolve, reject) => {
    if (!file) return reject(new Error("No file provided"));

    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "Note",
        resource_type: "auto",
        transformation: {
          width: 500,
          height: 500,
          crop: "limit",
        },
        public_id: `${Date.now()}-${file.originalname}`,
      },
      (error, result) => {
        if (error || !result) {
          reject(error || new Error("Cloudinary upload failed"));
        } else {
          resolve({
            url: result.secure_url,
            public_id: result.public_id,
          });
        }
      }
    );

    streamifier.createReadStream(file.buffer).pipe(stream);
  });
};

export default uploadCloudinary;
