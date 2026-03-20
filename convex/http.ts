import { httpRouter } from "convex/server";
import { authComponent, createAuth } from "./auth";

const http = httpRouter();

// Needed for browser clients calling Better Auth through convex.site.
authComponent.registerRoutes(http, createAuth, { cors: true });

export default http;
