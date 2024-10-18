import bcrypt from "bcrypt";

const bcryptPassword = async (password: string) => { 
  const hashedPassword = await bcrypt.hash(password, 12);
  return hashedPassword;
};

export default bcryptPassword;