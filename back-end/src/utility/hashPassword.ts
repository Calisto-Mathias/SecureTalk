import bcrypt from "bcrypt";

const hashPassword = (password: string): string => {
  const salt: string = bcrypt.genSaltSync(10);
  const hashedPassword: string = bcrypt.hashSync(password, salt);
  return hashedPassword;
};

export default hashPassword;
