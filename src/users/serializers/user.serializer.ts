import { Expose } from "class-transformer";

export class UserSerializer {
  @Expose()
  id: number;

  @Expose()
  email: string;

  @Expose()
  admin: boolean;
}
