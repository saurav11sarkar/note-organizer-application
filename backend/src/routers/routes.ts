import express from "express";
import { userRouter } from "../modules/user/user.routes";
const router = express.Router();

const nodeRouter = [
    {path:"/user",name:userRouter},
];

nodeRouter.forEach((route) => {
    router.use(route.path, route.name);
})

export default router;
