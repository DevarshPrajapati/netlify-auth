import bcrypt from "bcrypt";

const comparePassword = async (inputPassword: string, password: string) => {
  const pass = await bcrypt.compare(password, inputPassword);
  return pass;
};

export default comparePassword;
