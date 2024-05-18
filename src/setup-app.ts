import { INestApplication, ValidationPipe } from "@nestjs/common";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const cookieSession = require("cookie-session");

export const setupApp = (app: INestApplication) => {
  app.use(
    cookieSession({
      name: "test-session",
      keys: ["cookie"],
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    }),
  );

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );
};
