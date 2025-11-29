import { ApolloServer } from "@apollo/server";

import express from "express";
import cors from "cors";
import { json } from "body-parser";
import { PrismaClient } from "@prisma/client";
import { typeDefs } from "./schema";
import { resolvers } from "./resolvers";
import { expressMiddleware } from '@as-integrations/express4';


const prisma = new PrismaClient();

async function startServer() {
  const app = express();

  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  await server.start();

  app.use(
    "/graphql",
    cors(),
    json(),
    expressMiddleware(server, {
      context: async () => ({ prisma }),
    })
  );

  app.listen(4000, () => {
    console.log("🚀 Servidor Apollo v5 corriendo en http://localhost:4000/graphql");
  });
}

startServer();
