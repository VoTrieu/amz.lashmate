import { gql } from 'apollo-server-express';

export const productTypeDefs = gql`
  type Product {
    id: ID!
    title: String!
    price: Float!
    imageUrl: String!
    description: String!
  }
  
  type Query {
    products: [Product]!
    product(id: ID!): Product
  }

  type Mutation {
    createProduct(title: String!, description: String!): Product
  }
  `