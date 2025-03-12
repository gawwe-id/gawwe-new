import { j } from "./jstack";
import { dynamic } from "jstack";

/**
 * This is your base API.
 * Here, you can handle errors, not-found responses, cors and more.
 *
 * @see https://jstack.app/docs/backend/app-router
 */
const api = j
  .router()
  .basePath("/api")
  .use(j.defaults.cors)
  .onError(j.defaults.errorHandler);

/**
 * This is the main router for your server.
 * All routers in /server/routers should be added here manually.
 */
const appRouter = j.mergeRouters(api, {
  calendars: dynamic(() => import("./routers/calendars-router")),
  classes: dynamic(() => import("./routers/classes-router")),
  classSchedules: dynamic(() => import("./routers/class-schedules-router")),
  classParticipants: dynamic(
    () => import("./routers/class-participants-router")
  ),
  educationLevels: dynamic(() => import("./routers/education-levels-router")),
  languageClasses: dynamic(() => import("./routers/language-classes-router")),
  languages: dynamic(() => import("./routers/languages-router")),
  roles: dynamic(() => import("./routers/roles-router")),
  regions: dynamic(() => import("./routers/region-router")),
  profileAgencies: dynamic(() => import("./routers/profile-agencies-router")),
  profileParticipants: dynamic(
    () => import("./routers/profile-participants-router")
  ),
  users: dynamic(() => import("./routers/users-router")),
});

export type AppRouter = typeof appRouter;

export default appRouter;
