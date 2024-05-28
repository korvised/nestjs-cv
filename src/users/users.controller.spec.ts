import { Test, TestingModule } from "@nestjs/testing";
import { UsersController } from "./users.controller";
import { User } from "./entities/user.entity";
import { AuthService } from "./auth.service";
import { UsersService } from "./users.service";
import { NotFoundException } from "@nestjs/common";

describe("UsersController", () => {
  let controller: UsersController;
  let fakeAuthService: Partial<AuthService>;
  let fakeUsersService: Partial<UsersService>;

  beforeEach(async () => {
    const users: User[] = [];

    fakeAuthService = {
      async signup(email: string, password: string): Promise<User> {
        const user = {
          id: users.length + 1,
          email,
          password,
        } as User;
        users.push(user);
        return user;
      },
      async signin(email: string, password: string): Promise<User | null> {
        const user = users.find(user => user.email === email);
        if (user && user.password === password) {
          return Promise.resolve(user);
        }
        return Promise.resolve(null);
      },
    };

    fakeUsersService = {
      async create(email: string, password: string): Promise<User> {
        const user = {
          id: users.length + 1,
          email,
          password,
        } as User;
        users.push(user);
        return user;
      },
      async findOne(id: number): Promise<User | null> {
        const user = users.find(user => user.id === id);
        return Promise.resolve(user);
      },
      async find(email: string): Promise<User[]> {
        const filteredUsers = users.filter(user => user.email === email);
        return Promise.resolve(filteredUsers);
      },
      async update(id: number, attrs: Partial<User>): Promise<User> {
        const user = users.find(user => user.id === id);
        Object.assign(user, attrs);
        return user;
      },
      async remove(id: number): Promise<User> {
        const userIndex = users.findIndex(user => user.id === id);
        const user = users[userIndex];
        users.splice(userIndex, 1);
        return Promise.resolve(user);
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: AuthService,
          useValue: fakeAuthService,
        },
        {
          provide: UsersService,
          useValue: fakeUsersService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  it("findAllUsers returns all users with the gaven email", async () => {
    await controller.signup({ email: "test@mail.com", password: "1234" }, {});

    const users = await controller.findAllUsers("test@mail.com");
    expect(users.length).toEqual(1);
    expect(users[0].email).toEqual("test@mail.com");
  });

  it("findUser returns a single user with the gaven id", async () => {
    await controller.signup({ email: "test@mail.com", password: "1234" }, {});

    const user = await controller.findUser("1");
    expect(user).toBeDefined();
    expect(user.id).toEqual(1);
  });

  it("updateUser updates a user with the gaven id", async () => {
    await controller.signup({ email: "test@mail.com", password: "1234" }, {});

    await expect(controller.findUser("2")).rejects.toThrow(NotFoundException);
  });

  it("signin update session object and return user", async () => {
    const session = { userId: null };
    const user = await controller.signup(
      { email: "test@mail.com", password: "1234" },
      session,
    );
    expect(session.userId).toEqual(user.id);
    expect(session.userId).toEqual(1);
  });
});
