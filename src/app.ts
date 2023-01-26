import express from "express";
import { ApolloServer } from 'apollo-server-express';
import { mergeResolvers } from '@graphql-tools/merge';

import productResolver from "./graphql/resolvers/product_resolver";
import { productTypeDefs } from "./graphql/schemas/product_schema";
import sequelize from "./util/database";

const app = express();

const resolvers = mergeResolvers([productResolver]);

const server = new ApolloServer({
  typeDefs: [productTypeDefs],
  resolvers
});

sequelize.sync();

server.start().then(() => {
  server.applyMiddleware({ app });
  
  app.listen(3000, () => {
    console.log("Server running on port 3000");
  });
});

