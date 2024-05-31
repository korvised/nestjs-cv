import { BadRequestException, Injectable } from "@nestjs/common";
import { UsersService } from "./users.service";
import { comparePasswords } from "../common/services/auth.service";

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async signup(email: string, password: string) {
    // See if email is in use
    const existingUser = await this.usersService.find(email);
    if (existingUser.length) {
      throw new BadRequestException("Email in use");
    }

    // Create a new user and save it to the database
    return await this.usersService.create(email, password);
  }

  async signin(email: string, password: string) {
    const [user] = await this.usersService.find(email);
    if (!user) {
      throw new BadRequestException("Invalid credentials");
    }

    // Compare passwords
    const isMatched = await comparePasswords(user.password, password);
    if (!isMatched) {
      throw new BadRequestException("Invalid credentials");
    }

    return user;
  }
}
