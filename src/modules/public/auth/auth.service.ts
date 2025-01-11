import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private mailService: MailService,
    private configService: ConfigService,
    private otpService: OtpService,
    private prisma: PrismaService,
  ) {}

  async signIn({ identity, password }: SignInDto) {
    // Attempt to find use by either username, email or phone number
    const user =
      await this.usersService.findByUsernameOrEmailOrPhoneNumber(identity);

    const authenticatedUser = new AuthenticatedUser(user);
    if (!authenticatedUser.verifyPassword(password)) {
      throw new UnauthorizedException('Wrong password');
    }

    const payload = { sub: user.id, email: user.email };

    return {
      access_token: await this.jwtService.signAsync(payload, {}),
    };
  }

  async passwordResetRequest({ identity }: PasswordResetRequestDto) {
    const user =
      await this.usersService.findByUsernameOrEmailOrPhoneNumber(identity);

    const host = this.configService.get<string>('VUE_FRONTEND');
    const path = '/reset-password';
    const url = `${host}${path}`;

    return this.prisma.$transaction(async (tx) => {
      const otp = await this.otpService.create(user.id, tx);

      // Send mail
      await this.mailService.sendPasswordResetRequestMail({
        options: {
          subject: 'Reset your password',
          to: user.email,
          template: 'password-reset',
        },
        context: {
          otp: otp.value,
          uiURL: url,
          name: user.firstName,
        },
      });

      return {
        message:
          'Please follow the instructions sent to your email to reset your password.',
      };
    });
  }

  async requestOtpPublic(otpRequest: PublicOtpRequest) {
    const user = await this.usersService.findByUsernameOrEmailOrPhoneNumber(
      otpRequest.identity,
    );

    return this.prisma.$transaction(async (tx) => {
      const otp = await this.otpService.create(user.id, tx);

      // Send otp via mail
      await this.mailService.sendOtpRequestMail({
        options: {
          subject: otpRequest.reason,
          to: user.email,
          template: 'otp-request',
        },
        context: {
          otp: otp.value,
          name: user.firstName,
        },
      });

      return {
        message: 'A one-time-password has been sent your email.',
      };
    });
  }

  async requestOtpAuthenticated(
    otpRequest: AuthenticatedOtpRequest,
    currentUser: Principal,
  ) {
    return this.prisma.$transaction(async (tx) => {
      const otp = await this.otpService.create(currentUser.id, tx);

      // Send otp via mail
      await this.mailService.sendOtpRequestMail({
        options: {
          subject: otpRequest.reason,
          to: currentUser.email,
          template: 'otp-request',
        },
        context: {
          otp: otp.value,
          name: currentUser.username,
        },
      });

      return {
        message: 'A one-time-password has been sent your email.',
      };
    });
  }

  async passwordReset({ newPassword, otp }: PasswordResetDto) {
    return this.prisma.$transaction(async (tx) => {
      const oneTimePassword = await this.otpService.verify(otp, tx);

      const user = oneTimePassword.user;

      await this.usersService.updateUser({
        where: {
          id: user.id,
        },
        data: {
          passwordDigest: PasswordService.hashedPassword(newPassword),
        },
      });

      return {
        message: 'You have successfully reset your password.',
      };
    });
  }
}
