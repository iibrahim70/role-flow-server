import { USER_ROLES } from '@/app/modules/User/user.constant';
import { User } from '@/app/modules/User/user.model';
import bcrypt from 'bcrypt';
import { config } from '@/config/config';

const seedAdmin = async () => {
  const isAdminExits = await User.findOne({ role: USER_ROLES.ADMIN });

  if (!isAdminExits) {
    const hashedPassword = await bcrypt.hash(
      'admin123',
      Number(config.security.bcryptSaltRounds),
    );

    const admin = {
      email: 'admin@gmail.com',
      password: hashedPassword,
      role: USER_ROLES.ADMIN,
      invitedAt: new Date(),
    };

    await User.create(admin);
  }
};

export default seedAdmin;
