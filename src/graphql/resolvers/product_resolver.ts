import Product from "../../models/product";

const productResolver = {
  Query: {
    products: async () => {
      return Product.findAll();
    },
  },
  Mutation: {
    // createUser: async (_, { name, email }) => {
    //   // code to create a new user
    // },
    // updateUser: async (_, { id, name, email }) => {
    //   // code to update a user by id
    // },
    // deleteUser: async (_, { id }) => {
    //   // code to delete a user by id
    // }
  }
};

export default productResolver;
