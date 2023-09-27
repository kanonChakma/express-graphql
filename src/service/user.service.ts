import { ApolloError } from "apollo-server";
import bcrypt from "bcrypt";
import Context from "../../types/context";
import { CreateUserInput, LoginInput, UserModel } from "../schema/user.schema";
import { signJwt } from "../utils/jwt";

class UserService {
  async createUser(input: CreateUserInput) {
    return UserModel.create(input);
  }

  async login(input: LoginInput, context: Context) {
    const e = "Invalid email or password";
    const user = await UserModel.find().findByEmail(input.email).lean();

    if (!user) {
      throw new ApolloError(e);
    }
    const passwordIsValid = await bcrypt.compare(input.password, user.password);

    if (!passwordIsValid) {
      throw new ApolloError(e);
    }
    const token = signJwt(user);

    context.res.cookie("accessToken", token, {
      maxAge: 3.154e10, // 1 year
      httpOnly: true,
      domain: "localhost",
      path: "/",
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });
    return token;
  }

  async getUsers() {
    return UserModel.find();
  }
}

export default UserService;
