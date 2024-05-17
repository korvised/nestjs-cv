import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  Session,
  UseGuards,
} from "@nestjs/common";
import { User } from "./user.entity";
import { CreateUserDto } from "./dtos/create-user.dto";
import { UpdateUserDto } from "./dtos/update-user.dto";
import { UserDto } from "./dtos/user.dto";
import { AuthService } from "./auth.service";
import { UsersService } from "./users.service";
import { Serialize } from "../interceptors/serialize.interceptor";
import { CurrentUser } from "./decorators/current-user.decorator";
import { AuthGuard } from "../guards/auth.guard";

@Controller("auth")
@Serialize(UserDto)
export class UsersController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  @Get("/profile")
  @UseGuards(AuthGuard)
  whoAmI(@CurrentUser() user: User) {
    return user;
  }

  @Post("/signout")
  signout(@Session() session: any) {
    session.userId = null;
  }

  @Post("/signup")
  async signup(@Body() body: CreateUserDto, @Session() session: any) {
    const user = await this.authService.signup(body.email, body.password);
    session.userId = user.id;

    return user;
  }

  @Post("/signin")
  async signin(@Body() body: CreateUserDto, @Session() session: any) {
    const user = await this.authService.signin(body.email, body.password);
    session.userId = user.id;

    return user;
  }

  @Get("/:id")
  async findUser(@Param("id") id: string) {
    const user = await this.usersService.findOne(parseInt(id, 10));
    if (!user) {
      throw new NotFoundException("User not found");
    }

    return user;
  }

  @Get()
  findAllUsers(@Query("email") email: string) {
    return this.usersService.find(email);
  }

  @Patch("/:id")
  updateUser(@Param("id") id: string, @Body() body: UpdateUserDto) {
    return this.usersService.update(parseInt(id, 10), body);
  }

  @Delete("/:id")
  async removeUser(@Param("id") id: string) {
    await this.usersService.remove(parseInt(id, 10));
  }
}
