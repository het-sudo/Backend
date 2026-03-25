import { Router } from "express";
import type { IRoute } from "./common/interface/route.interface.js";
import { AuthRoutes } from "./modules/auth/auth.routes.js";

const rootRouter: Router = Router();

const moduleRoutes: IRoute[] = [AuthRoutes];

moduleRoutes.forEach((route) => {
  rootRouter.use(route.path, route.router);
});

export default rootRouter;
