import { env } from "./config/env.js";
import { createHttpServer } from "./app.js";

const { server } = createHttpServer();

server.listen(env.PORT, () => {
  console.log(`Operations Platform API listening on port ${env.PORT}`);
});
