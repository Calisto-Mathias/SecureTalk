import bcrypt from "bcrypt";

const hashPassword = (password: string): string => {
  const salt: string = bcrypt.genSaltSync(10);
  const hashedPassword: string = bcrypt.hashSync(password, salt);
  return hashedPassword;
};

const comparePassword = (password: string, hash: string): boolean => {
  return bcrypt.compareSync(password, hash);
};

export { hashPassword, comparePassword };
export default hashPassword;
