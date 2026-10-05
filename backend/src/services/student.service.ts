import path from 'path';
import fs from 'fs';
import { AppError } from '../middleware/error.middleware';
import { StudentProfile, User } from '../models';
import type { IStudentProfile } from '../models/StudentProfile';
import type { IUser } from '../models/User';
import { env } from '../config/env';
import type { UpdateStudentProfileInput } from '../validators/student.validator';

export interface StudentProfileResponse {
  profile: IStudentProfile;
  user: Pick<IUser, 'fullName' | 'email' | 'phone' | 'college' | 'education' | 'graduationYear' | 'avatarUrl'>;
  completionPercentage: number;
}

function calcCompletion(
  profile: IStudentProfile,
  user: IUser
): number {
  const checks = [
    !!user.fullName,
    !!user.phone,
    !!user.college,
    !!user.education,
    !!user.graduationYear,
    !!profile.degree,
    !!profile.location,
    profile.skills.length > 0,
    !!profile.bio,
    !!profile.github,
    !!profile.linkedin,
    !!profile.resumeUrl,
  ];
  const filled = checks.filter(Boolean).length;
  return Math.round((filled / checks.length) * 100);
}

export async function getStudentProfile(userId: string): Promise<StudentProfileResponse> {
  const [profile, user] = await Promise.all([
    StudentProfile.findOne({ user: userId }),
    User.findById(userId),
  ]);

  if (!user) throw new AppError('User not found', 404, 'NOT_FOUND');
  if (!profile) throw new AppError('Profile not found', 404, 'NOT_FOUND');

  const completionPercentage = calcCompletion(profile, user);
  if (profile.completionPercentage !== completionPercentage) {
    profile.completionPercentage = completionPercentage;
    await profile.save();
  }

  return {
    profile,
    user: {
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      college: user.college,
      education: user.education,
      graduationYear: user.graduationYear,
      avatarUrl: user.avatarUrl,
    },
    completionPercentage,
  };
}

export async function updateStudentProfile(
  userId: string,
  input: UpdateStudentProfileInput
): Promise<StudentProfileResponse> {
  const [profile, user] = await Promise.all([
    StudentProfile.findOne({ user: userId }),
    User.findById(userId),
  ]);

  if (!user) throw new AppError('User not found', 404, 'NOT_FOUND');
  if (!profile) throw new AppError('Profile not found', 404, 'NOT_FOUND');

  // Split fields between User and StudentProfile
  const { fullName, phone, college, education, graduationYear, ...profileFields } = input;

  const userUpdates: Partial<IUser> = {};
  if (fullName !== undefined) userUpdates.fullName = fullName;
  if (phone !== undefined) userUpdates.phone = phone || undefined;
  if (college !== undefined) userUpdates.college = college;
  if (education !== undefined) userUpdates.education = education;
  if (graduationYear !== undefined) userUpdates.graduationYear = graduationYear;

  if (Object.keys(userUpdates).length > 0) {
    Object.assign(user, userUpdates);
    await user.save();
  }

  // Clean empty strings to undefined for URL fields
  const cleaned = { ...profileFields };
  (['github', 'linkedin', 'portfolio'] as const).forEach((k) => {
    if (cleaned[k] === '') cleaned[k] = undefined;
  });

  Object.assign(profile, cleaned);
  profile.completionPercentage = calcCompletion(profile, user);
  await profile.save();

  return {
    profile,
    user: {
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      college: user.college,
      education: user.education,
      graduationYear: user.graduationYear,
      avatarUrl: user.avatarUrl,
    },
    completionPercentage: profile.completionPercentage,
  };
}

export async function uploadResume(
  userId: string,
  file: Express.Multer.File
): Promise<{ resumeUrl: string; completionPercentage: number }> {
  const profile = await StudentProfile.findOne({ user: userId });
  if (!profile) throw new AppError('Profile not found', 404, 'NOT_FOUND');

  // Delete old resume file if it exists
  if (profile.resumeUrl) {
    const oldPath = path.join(process.cwd(), env.UPLOAD_DIR, path.basename(profile.resumeUrl));
    if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
  }

  const resumeUrl = `/uploads/${file.filename}`;
  profile.resumeUrl = resumeUrl;

  const user = await User.findById(userId);
  if (user) {
    profile.completionPercentage = calcCompletion(profile, user);
  }
  await profile.save();

  return { resumeUrl, completionPercentage: profile.completionPercentage };
}
