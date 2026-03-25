import { Router } from "express";

export interface IRoute {
  path: string; // The URL prefix, e.g., '/auth'
  router: Router; // The Express Router instance
}
