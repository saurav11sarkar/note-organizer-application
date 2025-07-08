import express from "express";
import { userRouter } from "../modules/user/user.routes";
import { categoryRouter } from "../modules/category/category.routes";
const router = express.Router();

const nodeRouter = [
  { path: "/user", name: userRouter },
  { path: "/category", name: categoryRouter },
];

nodeRouter.forEach((route) => {
  router.use(route.path, route.name);
});

export default router;
