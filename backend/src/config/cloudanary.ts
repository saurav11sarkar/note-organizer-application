import { v2 as cloudinary } from "cloudinary";
import config from ".";

cloudinary.config({
  cloud_name: config.clodunary.cloude_name,
  api_key: config.clodunary.clodue_api_key,
  api_secret: config.clodunary.cloude_api_secret,
});

export default cloudinary;
