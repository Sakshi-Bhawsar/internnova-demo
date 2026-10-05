import bcrypt from 'bcryptjs';
import { AppError } from '../middleware/error.middleware';
import { MentorProfile, StudentProfile, User } from '../models';
import { MentorStatus, UserRole } from '../types/enums';
import { signAccessToken } from '../utils/jwt';
import type { LoginInput, RegisterInput } from '../validators/auth.validator';

const SALT_ROUNDS = 12;

export interface PublicUser {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  phone?: string;
  education?: string;
  college?: string;
  graduationYear?: number;
  isActive: boolean;
  mentorStatus?: MentorStatus;
  avatarUrl?: string;
}

export interface AuthResult {
  user: PublicUser;
  token: string;
}

function toPublicUser(user: {
  _id: { toString(): string };
  email: string;
  fullName: string;
  role: UserRole;
  phone?: string;
  education?: string;
  college?: string;
  graduationYear?: number;
  isActive: boolean;
  mentorStatus?: MentorStatus;
  avatarUrl?: string;
}): PublicUser {
  return {
    id: user._id.toString(),
    email: user.email,
    fullName: user.fullName,
    role: user.role,
    phone: user.phone,
    education: user.education,
    college: user.college,
    graduationYear: user.graduationYear,
    isActive: user.isActive,
    mentorStatus: user.mentorStatus,
    avatarUrl: user.avatarUrl,
  };
}

export async function registerUser(input: RegisterInput): Promise<AuthResult> {
  if ((input.role as string) === UserRole.ADMIN || (input.role as string) === UserRole.COMPANY) {
    throw new AppError('Invalid role for registration', 403, 'FORBIDDEN');
  }

  const existing = await User.findOne({ email: input.email.toLowerCase() });
  if (existing) {
    throw new AppError('Email is already registered', 409, 'DUPLICATE_EMAIL');
  }

  const passwordHash = await bcrypt.hash(input.password, SALT_ROUNDS);

  const isMentor = input.role === UserRole.MENTOR;

  const user = await User.create({
    email: input.email.toLowerCase(),
    passwordHash,
    fullName: input.fullName,
    phone: input.phone,
    role: input.role,
    education: input.education,
    college: input.college,
    graduationYear: input.graduationYear,
    isActive: !isMentor,
    mentorStatus: isMentor ? MentorStatus.PENDING : undefined,
  });

  if (input.role === UserRole.STUDENT) {
    await StudentProfile.create({ user: user._id });
  } else {
    await MentorProfile.create({ user: user._id, expertise: [] });
  }

  const publicUser = toPublicUser(user);
  const token = signAccessToken({
    userId: publicUser.id,
    email: publicUser.email,
    role: publicUser.role,
  });

  return { user: publicUser, token };
}

export async function loginUser(input: LoginInput): Promise<AuthResult> {
  const user = await User.findOne({ email: input.email.toLowerCase() }).select(
    '+passwordHash'
  );

  if (!user) {
    throw new AppError('Invalid email or password', 401, 'INVALID_CREDENTIALS');
  }

  const valid = await bcrypt.compare(input.password, user.passwordHash);
  if (!valid) {
    throw new AppError('Invalid email or password', 401, 'INVALID_CREDENTIALS');
  }

  if (!user.isActive) {
    if (
      user.role === UserRole.MENTOR &&
      user.mentorStatus === MentorStatus.PENDING
    ) {
      // Allow login to view pending approval page
    } else if (
      user.role === UserRole.MENTOR &&
      user.mentorStatus === MentorStatus.REJECTED
    ) {
      throw new AppError(
        'Your mentor application was not approved',
        403,
        'MENTOR_REJECTED'
      );
    } else {
      throw new AppError('Your account is inactive', 403, 'ACCOUNT_INACTIVE');
    }
  }

  const publicUser = toPublicUser(user);
  const token = signAccessToken({
    userId: publicUser.id,
    email: publicUser.email,
    role: publicUser.role,
  });

  return { user: publicUser, token };
}

export async function getCurrentUser(userId: string): Promise<PublicUser> {
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError('User not found', 404, 'NOT_FOUND');
  }
  return toPublicUser(user);
}
