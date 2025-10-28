
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export class AuthService {
  static async validateCredentials(email: string, password: string) {
    const user = await User.findOne({ email });
    if (!user) {
      return null;
    }

    const isValid = await bcrypt.compare(password, user.password);
    return isValid ? user : null;
  }

  static async createUser(userData: {
    username: string;
    email: string;
    password: string;
    age?: number;
  }) {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    
    const isMinor = userData.age ? userData.age < 18 : false;
    const isUnder13 = userData.age ? userData.age < 13 : false;

    return await User.create({
      ...userData,
      password: hashedPassword,
      isMinor,
      accessRestrictions: {
        bettingAllowed: !isMinor,
        paymentsAllowed: !isUnder13
      }
    });
  }

  static async getUserById(userId: string) {
    return await User.findById(userId).select('-password');
  }

  static async updateLastActive(userId: string) {
    return await User.findByIdAndUpdate(
      userId,
      { lastActive: new Date() },
      { new: true }
    );
  }
}
