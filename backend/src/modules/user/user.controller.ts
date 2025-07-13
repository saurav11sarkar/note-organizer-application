import config from "../../config";
import catchAsycn from "../../utils/catchAsycn";
import sendresponse from "../../utils/sendResponse";
import { userService } from "./user.service";

const register = catchAsycn(async (req, res) => {
  const result = await userService.register(req.body);
  const { refreshToken } = result;
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: config.NODE_ENV === "production",
    sameSite: "strict",
  });
  sendresponse(res, 201, "user registered successfully", {
    accessToken: result.accessToken,
  });
});

const login = catchAsycn(async (req, res) => {
  const result = await userService.login(req.body);
  const { refreshToken } = result;
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: config.NODE_ENV === "production",
    sameSite: "strict",
  });
  sendresponse(res, 200, "user login successfully", {
    data: result.user,
    accessToken: result.accessToken,
  });
});

const refeshToken = catchAsycn(async (req, res) => {
  const { refreshToken } = req.cookies;
  const result = await userService.refreshToken(refreshToken);

  sendresponse(res, 200, "user login successfully", result);
});

const getProfile = catchAsycn(async (req, res) => {
  const result = await userService.getProfile(req.user.id);
  sendresponse(res, 200, "profile fetched successfully", result);
});

const updatedProfile = catchAsycn(async (req, res) => {
  const file = req.file as Express.Multer.File;
  const fromdata = JSON.parse(req.body.data);
  const result = await userService.updatedProfile(req.user.id, fromdata, file);
  sendresponse(res, 200, "profile updated successfully", result);
});

export const userController = {
  register,
  login,
  refeshToken,
  getProfile,
  updatedProfile,
};
