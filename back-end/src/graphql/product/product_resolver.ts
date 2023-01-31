import Product from "../../models/product";
import validator from "validator";
import { ProductInput } from "./product_types";
import ProductController from "../../controllers/product-controller";

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
    createProduct: async (_root: any, args: { productInput: ProductInput }) => {
      console.log("productInput: ", args);
      const productInput = args.productInput;
      const error = [];
      if(validator.isEmpty(productInput.title)){
        error.push({message: 'Title is invalid.'});
      }
      return ProductController.createProduct(productInput);
    }
  }
};

export default productResolver;
