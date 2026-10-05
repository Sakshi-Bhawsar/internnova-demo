import { FilterQuery } from 'mongoose';
import { AppError } from '../middleware/error.middleware';
import { Internship, type IInternship } from '../models';
import { InternshipStatus } from '../types/enums';
import { slugify } from '../utils/slugify';
import type {
  CreateInternshipInput,
  InternshipQuery,
  UpdateInternshipInput,
} from '../validators/internship.validator';

async function uniqueSlug(base: string, excludeId?: string): Promise<string> {
  let slug = slugify(base);
  let suffix = 0;
  while (true) {
    const candidate = suffix === 0 ? slug : `${slug}-${suffix}`;
    const existing = await Internship.findOne({ slug: candidate });
    if (!existing || existing._id.toString() === excludeId) return candidate;
    suffix++;
  }
}

export async function createInternship(input: CreateInternshipInput): Promise<IInternship> {
  const slug = await uniqueSlug(input.title);
  return Internship.create({ ...input, slug, status: InternshipStatus.DRAFT });
}

export async function updateInternship(
  id: string,
  input: UpdateInternshipInput
): Promise<IInternship> {
  const internship = await Internship.findById(id);
  if (!internship) throw new AppError('Internship not found', 404, 'NOT_FOUND');

  if (input.title && input.title !== internship.title) {
    internship.slug = await uniqueSlug(input.title, id);
  }

  Object.assign(internship, input);
  return internship.save();
}

export async function deleteInternship(id: string): Promise<void> {
  const result = await Internship.findByIdAndDelete(id);
  if (!result) throw new AppError('Internship not found', 404, 'NOT_FOUND');
}

export async function patchInternshipStatus(
  id: string,
  status: InternshipStatus
): Promise<IInternship> {
  const internship = await Internship.findByIdAndUpdate(
    id,
    { status },
    { new: true, runValidators: true }
  );
  if (!internship) throw new AppError('Internship not found', 404, 'NOT_FOUND');
  return internship;
}

export async function listPublicInternships(query: InternshipQuery) {
  const { page, limit, search, category, tech, mode, level, paid, duration, sort, featured } =
    query;

  const filter: FilterQuery<IInternship> = { status: InternshipStatus.PUBLISHED };

  if (search) {
    const re = new RegExp(search, 'i');
    filter.$or = [{ title: re }, { description: re }, { category: re }, { technologies: re }];
  }
  if (category) filter.category = new RegExp(`^${category}$`, 'i');
  if (tech) filter.technologies = new RegExp(tech, 'i');
  if (mode) filter.mode = mode;
  if (level) filter.level = level;
  if (paid === 'true') filter.isPaid = true;
  if (paid === 'false') filter.isPaid = false;
  if (duration) filter.durationWeeks = duration;
  if (featured === 'true') filter.featured = true;

  const sortMap: Record<string, Record<string, 1 | -1>> = {
    newest: { createdAt: -1 },
    oldest: { createdAt: 1 },
    deadline: { applicationDeadline: 1 },
  };

  const skip = (page - 1) * limit;
  const [data, total] = await Promise.all([
    Internship.find(filter)
      .sort(sortMap[sort] ?? { createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select('-weeklyCurriculum -faqs -certificateCriteria -stages -isDemoSeed')
      .lean(),
    Internship.countDocuments(filter),
  ]);

  return {
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function getInternshipBySlugOrId(slugOrId: string): Promise<IInternship> {
  const isId = /^[a-f\d]{24}$/i.test(slugOrId);
  const internship = await Internship.findOne(
    isId ? { _id: slugOrId } : { slug: slugOrId }
  ).populate('assignedMentors', 'fullName avatarUrl');

  if (!internship) throw new AppError('Internship not found', 404, 'NOT_FOUND');
  return internship;
}

export async function getInternshipByIdAdmin(id: string): Promise<IInternship> {
  const internship = await Internship.findById(id);
  if (!internship) throw new AppError('Internship not found', 404, 'NOT_FOUND');
  return internship;
}
