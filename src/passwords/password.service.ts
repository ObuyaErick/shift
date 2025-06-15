import * as bcrypt from 'bcrypt';

export class PasswordService {
  static hashedPassword(token: string): string {
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(token, salt);
  }

  static verifyPassword(password: string, hash: string): boolean {
    return bcrypt.compareSync(password, hash);
  }
}
