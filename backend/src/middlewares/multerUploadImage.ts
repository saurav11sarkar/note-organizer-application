import multer from "multer";

const uploadImage = (fileName: string) => {
  return multer({ storage: multer.memoryStorage() }).single(fileName);
};

export default uploadImage;
