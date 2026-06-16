import { createServer } from "http";
import { createApp } from "./app.js";
import { env } from "./env.js";
import { initRealtime } from "./realtime/io.js";

const app = createApp();
const httpServer = createServer(app);
initRealtime(httpServer);

httpServer.listen(env.PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`API on http://localhost:${env.PORT}`);
});

