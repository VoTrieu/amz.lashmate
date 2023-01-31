import { gql } from 'apollo-server-express';
import { ProductInput } from './product_types';

export const productTypeDefs = gql`
  type Product {
    id: ID!
    title: String!
    price: Float!
    imageUrl: String!
    description: String!
  }

  input ProductInput {
    title: String!
    price: Float!
    imageUrl: String!
    description: String!
  }
  
  type Query {
    products: [Product]!
    product(id: ID!): Product!
  }

  type Mutation {
    createProduct(productInput: ProductInput): Product!
  }
  `