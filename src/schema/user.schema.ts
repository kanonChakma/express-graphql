import { getModelForClass, pre, prop } from "@typegoose/typegoose";
import bcrypt from "bcrypt";
import { IsEmail, MaxLength, MinLength } from "class-validator";
import { Field, InputType, ObjectType } from "type-graphql";

@pre<User>("save", async function () {
  if (!this.isModified("password")) {
    return;
  }

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hashSync(this.password, salt);
  this.password = hash;
})
@ObjectType()
export class User {
  @Field(() => String) //graphql type
  _id: string; //typescript type

  @Field(() => String)
  @prop({ required: true }) //
  name: string;

  @Field(() => String)
  @prop({ required: true })
  email: string;

  @prop({ required: true })
  password: string;
}
//export const UserModel = getModelForClass<typeof User>(User);
export const UserModel = getModelForClass(User);

@InputType()
export class CreateUserInput {
  @Field(() => String)
  name: string;

  @IsEmail()
  @Field(() => String)
  email: string;

  @MinLength(6, {
    message: "password should be at least  characters long",
  })
  @MaxLength(50, {
    message: "password must not e longer than 50 character",
  })
  @Field(() => String)
  password: string;
}
