import { CreateProductInput, ProductModel } from "../schema/product.schema";
import { User } from "../schema/user.schema";

class ProductService {
  async createProduct(input: CreateProductInput & { user: User["_id"] }) {
    return ProductModel.create(input);
  }
}

export default ProductService;
