import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import {
  ApolloServerPluginLandingPageGraphQLPlayground,
  ApolloServerPluginLandingPageProductionDefault,
} from "apollo-server-core";
import pkg from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import "reflect-metadata";
import { buildSchema } from "type-graphql";
import { resolvers } from "./resolvers";
import { User } from "./schema/user.schema";
import authChecker from "./utils/authChecker";
import { connectDB } from "./utils/db";
import { verifyJwt } from "./utils/jwt";

dotenv.config();
const { json } = pkg;

async function bootstrap() {
  //schema
  const schema = await buildSchema({
    resolvers,
    authChecker,
  });

  const app = express();
  app.use(cookieParser());

  //apollo server
  const server = new ApolloServer({
    schema,
    plugins: [
      process.env.NODE_ENV === "production"
        ? ApolloServerPluginLandingPageProductionDefault()
        : ApolloServerPluginLandingPageGraphQLPlayground(),
    ],
  });

  await server.start();

  //apply middleware to server
  app.use(
    "/",
    cors<cors.CorsRequest>(),
    json(),
    expressMiddleware(server, {
      context: async ({ req, res }) => {
        let ctx = {
          req,
          res,
          user: {},
        };

        if (req.cookies.accessToken) {
          const user = verifyJwt<User>(req.cookies.accessToken) as User;
          ctx.user = user;
        }
        return ctx;
      },
    })
  );
  app.listen({ port: 4000 }, () => {
    console.log("App is listening on http://localhost:4000");
  });
  connectDB();
}
bootstrap();
