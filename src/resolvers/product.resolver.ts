import { Arg, Ctx, Mutation } from "type-graphql";
import Context from "../../types/context";
import { CreateProductInput, Product } from "../schema/product.schema";
import ProductService from "../service/product.service";

export default class ProductResolver {
  constructor(private productService: ProductService) {
    this.productService = new ProductService();
  }
  @Mutation(() => [Product])
  createProduct(
    @Arg("input") input: CreateProductInput,
    @Ctx() context: Context
  ) {
    const user = context.user!;
    return this.productService.createProduct({ ...input, user: user?._id });
  }
}
