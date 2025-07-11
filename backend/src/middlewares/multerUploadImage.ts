import multer from "multer";

const uploadImage = (fieldName: string) => {
  return multer({ storage: multer.memoryStorage() }).single(fieldName);
};

export default uploadImage;
