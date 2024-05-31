import { promisify } from "util";
import { randomBytes, scrypt as _scrypt } from "crypto";

const scrypt = promisify(_scrypt);

export const hashPassword = async (
  planTextPassword: string,
): Promise<string> => {
  // Hash the password
  // Generate a salt
  const salt = randomBytes(8).toString("hex");

  // Hash the password with the salt
  const hash = (await scrypt(planTextPassword, salt, 32)) as Buffer;

  // Join the salt and the hashed password
  return salt + "." + hash.toString("hex");
};

export const comparePasswords = async (
  hashedPassword: string,
  planTextPassword: string,
): Promise<boolean> => {
  const [salt, storedHash] = hashedPassword.split(".");
  const hash = (await scrypt(planTextPassword, salt, 32)) as Buffer;

  return storedHash === hash.toString("hex");
};
