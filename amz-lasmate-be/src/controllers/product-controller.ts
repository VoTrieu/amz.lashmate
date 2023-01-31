import { ProductInput } from "src/graphql/product/product_types";
import Product from "../models/product";

const ProductController = {
    createProduct: async (product: ProductInput) => {
        const newProduct = await new Product({...product}).save();
        return newProduct;
    }
}

export default ProductController;