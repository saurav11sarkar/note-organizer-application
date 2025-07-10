import streamifier from "streamifier";

import { UploadApiResponse, UploadApiErrorResponse } from "cloudinary";
import cloudinary from "../config/cloudanary";

interface UploadResult {
  url: string;
  public_id: string;
}

const uploadCloudinary = (file: Express.Multer.File): Promise<UploadResult> => {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject(new Error("No file provided"));
      return;
    }

    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "Node",
        resource_type: "auto",
        transformation: {
          width: 500,
          height: 500,
          crop: "limit",
        },
        public_id: `${Date.now()}-${file.originalname}`,
      },
      (
        error: UploadApiErrorResponse | undefined,
        result: UploadApiResponse | undefined
      ) => {
        if (error || !result) {
          reject(error || new Error("Upload failed"));
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
