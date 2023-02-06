import express from "express";
import { ApolloServer } from 'apollo-server-express';
import { mergeResolvers } from '@graphql-tools/merge';
import path from 'path';
import bodyParser from 'body-parser';
import multer from 'multer';

import sequelize from "./util/database";
import productResolver from "./graphql/product/product_resolver";
import { productTypeDefs } from "./graphql/product/product_schema";


const app = express();

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'images');
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString() + '-' + file.originalname);
  }
});

const fileFilter = (req: express.Request, file: Express.Multer.File, cb:Function) => {
  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg'
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

app.use(bodyParser.json()); // application/json
app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).array('images', 12)
);

app.use('/images', express.static(path.join(__dirname, 'images')));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'OPTIONS, GET, POST, PUT, PATCH, DELETE'
  );
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

app.put('/post-image', (req, res, next) => {
  // if (!req.isAuth) {
  //   throw new Error('Not authenticated!');
  // }
  if (!req.file) {
    return res.status(200).json({ message: 'No file provided!' });
  }
  // if (req.body.oldPath) {
  //   clearImage(req.body.oldPath);
  // }
  return res
    .status(201)
    .json({ message: 'File stored.', filePath: req.file.path });
});

const resolvers = mergeResolvers([productResolver]);

const server = new ApolloServer({
  typeDefs: [productTypeDefs],
  resolvers
});

sequelize.sync();

server.start().then(() => {
  server.applyMiddleware({ app });
  
  app.listen(8989, () => {
    console.log("Server running on port 3000");
  });
});

