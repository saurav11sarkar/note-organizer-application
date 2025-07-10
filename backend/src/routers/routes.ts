import express from "express";
import { userRouter } from "../modules/user/user.routes";
import { categoryRouter } from "../modules/category/category.routes";
import { noteRoutes } from "../modules/note/note.routes";

const router = express.Router();

interface Route {
  path: string;
  name: express.Router;
}

const nodeRouter: Route[] = [
  { path: "/user", name: userRouter },
  { path: "/category", name: categoryRouter },
  { path: "/note", name: noteRoutes },
];

nodeRouter.forEach((route) => {
  router.use(route.path, route.name);
});

export default router;