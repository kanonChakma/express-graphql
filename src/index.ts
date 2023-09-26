import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServer } from "apollo-server";
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
import { connectDB } from "./utils/db";
const { json } = pkg;

dotenv.config();

async function bootstrap() {
  //schema
  const schema = await buildSchema({
    resolvers,
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

  await server.listen();

  //apply middleware to server
  app.use(
    "/",
    cors<cors.CorsRequest>(),
    json(),
    expressMiddleware(server, {
      context: async ({ req }) => ({ token: req.headers.token }),
    })
  );
  //connect DB
  connectDB();
}
bootstrap();
