import { BadRequestException, Injectable } from "@nestjs/common";
import { randomBytes, scrypt as _scrypt } from "crypto";
import { promisify } from "util";
import { UsersService } from "./users.service";

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async signup(email: string, password: string) {
    // See if email is in use
    const existingUser = await this.usersService.find(email);
    if (existingUser.length) {
      throw new BadRequestException("Email in use");
    }

    // Hash the password
    // Generate a salt
    const salt = randomBytes(8).toString("hex");

    // Hash the password with the salt
    const hash = (await scrypt(password, salt, 32)) as Buffer;

    // Join the salt and the hashed password
    const result = salt + "." + hash.toString("hex");

    // Create a new user and save it to the database
    return await this.usersService.create(email, result);
  }

  async signin(email: string, password: string) {
    const [user] = await this.usersService.find(email);
    if (!user) {
      throw new BadRequestException("Invalid credentials");
    }

    const [salt, storedHash] = user.password.split(".");
    const hash = (await scrypt(password, salt, 32)) as Buffer;

    if (storedHash !== hash.toString("hex")) {
      throw new BadRequestException("Invalid credentials");
    }

    return user;
  }
}
