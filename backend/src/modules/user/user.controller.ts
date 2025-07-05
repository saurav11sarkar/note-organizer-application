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
  sendresponse(res, 200, "user login successfully", result.user);
});

const refeshToken = catchAsycn(async (req, res) => {
  const { refreshToken } = req.cookies;
  const result = await userService.refreshToken(refreshToken);

  sendresponse(res, 200, "user login successfully", result);
});

export const userController = {
  register,
  login,
  refeshToken,
};
