import { Test } from "@nestjs/testing";
import { AuthService } from "./auth.service";
import { UsersService } from "./users.service";
import { User } from "./entities/user.entity";
import { BadRequestException } from "@nestjs/common";

describe("AuthService", () => {
  let service: AuthService;
  let fakeUserService: Partial<UsersService>;

  beforeEach(async () => {
    // Create a fake copy of the user service
    const users: User[] = [];
    fakeUserService = {
      find: (email: string) => {
        const filteredUsers = users.filter(user => user.email === email);
        return Promise.resolve(filteredUsers);
      },
      create: (email: string, password: string) => {
        const user = {
          id: Math.floor(Math.random() * 99999),
          email,
          password,
        } as User;
        users.push(user);
        return Promise.resolve(user);
      },
    };

    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: fakeUserService },
      ],
    }).compile();

    service = module.get(AuthService);
  });

  it("can create an instance of auth service", async () => {
    expect(service).toBeDefined();
  });

  it("creates a new user with a salted and hashed password", async () => {
    const user = await service.signup("test@mail.com", "1234");
    expect(user.password).not.toEqual("1234");
    const [salt, hash] = user.password.split(".");
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });

  it("throws an error if user signs up with email that is in use", async () => {
    await service.signup("test@gmail.com", "1234");

    await expect(service.signup("test@gmail.com", "1234")).rejects.toThrow(
      BadRequestException,
    );
  });

  it("throws if signin is called with an unused email", async () => {
    await expect(service.signin("a@mail.com", "1234")).rejects.toThrow(
      BadRequestException,
    );
  });

  it("throws if an invalid password is provided", async () => {
    await service.signup("test@mail.com", "1234");

    await expect(service.signin("test@mail.com", "invalid")).rejects.toThrow(
      BadRequestException,
    );
  });

  it("Return a user if correct password is provided", async () => {
    await service.signup("test@mail.com", "1234");

    const user = await service.signin("test@mail.com", "1234");
    expect(user).toBeDefined();
  });
});
