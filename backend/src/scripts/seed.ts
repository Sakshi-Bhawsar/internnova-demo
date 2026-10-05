/**
 * DEVELOPMENT SEED ONLY — clears demo-tagged data and re-seeds fictional programs.
 * Run: npm run seed (from backend/)
 */
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import { connectDB } from '../config/db';
import { env } from '../config/env';
import {
  Application,
  Assessment,
  Certificate,
  ContactInquiry,
  Evaluation,
  Internship,
  InternshipProgress,
  MentorProfile,
  Notification,
  Payment,
  Project,
  ProjectSubmission,
  Question,
  StudentProfile,
  Task,
  TaskSubmission,
  User,
} from '../models';
import { nextCertificateId } from '../models/CertificateCounter';
import {
  ApplicationStatus,
  CertificateStatus,
  InquiryType,
  InternshipLevel,
  InternshipMode,
  InternshipStage,
  InternshipStatus,
  MentorStatus,
  PaymentStatus,
  ProjectSubmissionStatus,
  TaskSubmissionStatus,
  UserRole,
} from '../types/enums';
import { slugify } from '../utils/slugify';

const DEMO_PASSWORD = 'Demo@Internova123';
const SALT_ROUNDS = 12;

async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, SALT_ROUNDS);
}

async function resetDatabase(): Promise<void> {
  if (!mongoose.connection.db) {
    throw new Error('Database connection not ready');
  }
  await mongoose.connection.db.dropDatabase();
}

async function seedUsers(passwordHash: string) {
  const admin = await User.create({
    email: 'admin@demo.internova',
    passwordHash,
    fullName: 'Demo Admin',
    phone: '9000000001',
    role: UserRole.ADMIN,
    isActive: true,
    isDemoSeed: true,
  });

  const mentorApproved = await User.create({
    email: 'mentor@demo.internova',
    passwordHash,
    fullName: 'Demo Mentor (Approved)',
    phone: '9000000002',
    role: UserRole.MENTOR,
    isActive: true,
    mentorStatus: MentorStatus.APPROVED,
    isDemoSeed: true,
  });

  const mentorPending = await User.create({
    email: 'mentor.pending@demo.internova',
    passwordHash,
    fullName: 'Demo Mentor (Pending)',
    role: UserRole.MENTOR,
    isActive: false,
    mentorStatus: MentorStatus.PENDING,
    isDemoSeed: true,
  });

  const studentA = await User.create({
    email: 'student@demo.internova',
    passwordHash,
    fullName: 'Aarav Sharma',
    phone: '9000000010',
    role: UserRole.STUDENT,
    education: 'B.Tech Computer Science',
    college: 'Demo Institute of Technology',
    graduationYear: 2026,
    isActive: true,
    isDemoSeed: true,
  });

  const studentB = await User.create({
    email: 'student2@demo.internova',
    passwordHash,
    fullName: 'Priya Nair',
    phone: '9000000011',
    role: UserRole.STUDENT,
    education: 'BCA',
    college: 'Demo City College',
    graduationYear: 2025,
    isActive: true,
    isDemoSeed: true,
  });

  await StudentProfile.create([
    {
      user: studentA._id,
      degree: 'B.Tech CS',
      location: 'Bengaluru, India',
      skills: ['JavaScript', 'Node.js', 'MongoDB'],
      github: 'https://github.com/demo-aarav',
      completionPercentage: 75,
    },
    {
      user: studentB._id,
      degree: 'BCA',
      location: 'Pune, India',
      skills: ['HTML', 'CSS', 'React'],
      completionPercentage: 45,
    },
  ]);

  await MentorProfile.create({
    user: mentorApproved._id,
    expertise: ['Backend Development', 'REST APIs', 'MongoDB'],
    bio: 'Demo mentor profile for development and testing only.',
    yearsOfExperience: 5,
    assignedInternships: [],
  });

  return { admin, mentorApproved, mentorPending, studentA, studentB };
}

function defaultStages() {
  return Object.values(InternshipStage);
}

async function seedInternships(mentorId: mongoose.Types.ObjectId) {
  const deadline = new Date();
  deadline.setMonth(deadline.getMonth() + 2);

  const programs = [
    {
      title: 'Backend Development Internship',
      category: 'Backend & APIs',
      technologies: ['Node.js', 'MongoDB', 'REST API', 'Express'],
      durationWeeks: 8,
      mode: InternshipMode.REMOTE,
      level: InternshipLevel.BEGINNER,
      featured: true,
      description:
        'Hands-on backend internship focused on building REST APIs, data modeling, and authentication patterns using Node.js and MongoDB.',
    },
    {
      title: 'Full Stack Web Internship',
      category: 'Web Development',
      technologies: ['React', 'Next.js', 'Node.js', 'TypeScript'],
      durationWeeks: 10,
      mode: InternshipMode.HYBRID,
      level: InternshipLevel.INTERMEDIATE,
      featured: true,
      description:
        'End-to-end web development program covering frontend interfaces, API integration, and deployment basics.',
    },
    {
      title: 'Data Analytics Foundations',
      category: 'Data & Analytics',
      technologies: ['Python', 'SQL', 'Pandas', 'Visualization'],
      durationWeeks: 6,
      mode: InternshipMode.REMOTE,
      level: InternshipLevel.BEGINNER,
      featured: false,
      description:
        'Structured introduction to data cleaning, analysis, and presenting insights with practical datasets.',
    },
    {
      title: 'UI/UX Design Internship',
      category: 'UI/UX Design',
      technologies: ['Figma', 'Wireframing', 'Prototyping'],
      durationWeeks: 8,
      mode: InternshipMode.REMOTE,
      level: InternshipLevel.BEGINNER,
      featured: false,
      description:
        'Learn user research, wireframes, and high-fidelity prototypes with mentor feedback on real briefs.',
    },
  ];

  const created = [];
  for (const p of programs) {
    const slug = slugify(p.title);
    const doc = await Internship.create({
      ...p,
      slug,
      isPaid: false,
      price: 0,
      status: InternshipStatus.PUBLISHED,
      applicationDeadline: deadline,
      whatYouLearn: [
        'Industry-relevant tools and workflows',
        'Structured task submissions with review',
        'Capstone project for your portfolio',
      ],
      skillsRequired: p.technologies.slice(0, 3),
      eligibility: 'Open to students and recent graduates in India.',
      weeklyCurriculum: [
        { week: 1, title: 'Orientation & setup', topics: ['Tools', 'Repo setup', 'Goals'] },
        { week: 2, title: 'Core skills', topics: p.technologies.slice(0, 2) },
      ],
      projectInfo: 'Build and submit a capstone project with GitHub and documentation.',
      assessmentInfo: 'MCQ assessment covering fundamentals; passing score applies.',
      mentorshipInfo: 'Mentor feedback on tasks and project milestones.',
      faqs: [
        {
          question: 'Is a job guaranteed?',
          answer: 'No. This program focuses on skills and proof of work, not guaranteed placement.',
        },
      ],
      assignedMentors: [mentorId],
      stages: defaultStages(),
      isDemoSeed: true,
    });
    created.push(doc);
  }

  return created;
}

async function seedBackendProgramDetails(
  internshipId: mongoose.Types.ObjectId,
  studentId: mongoose.Types.ObjectId,
  mentorId: mongoose.Types.ObjectId
) {
  const tasks = await Task.insertMany([
    {
      internship: internshipId,
      title: 'Design REST API schema',
      description: 'Define resources and endpoints for a simple internship task tracker API.',
      instructions: 'Submit an OpenAPI-style outline or markdown spec in the submission.',
      difficulty: InternshipLevel.BEGINNER,
      technologies: ['REST', 'OpenAPI'],
      order: 1,
      isRequired: true,
    },
    {
      internship: internshipId,
      title: 'Implement CRUD endpoints',
      description: 'Build Express routes with validation and consistent JSON responses.',
      instructions: 'Share GitHub repo link with README setup steps.',
      difficulty: InternshipLevel.INTERMEDIATE,
      technologies: ['Express', 'MongoDB'],
      order: 2,
      isRequired: true,
    },
    {
      internship: internshipId,
      title: 'Add JWT authentication',
      description: 'Secure selected routes with JWT and role checks.',
      instructions: 'Document test users and example curl commands.',
      difficulty: InternshipLevel.INTERMEDIATE,
      technologies: ['JWT', 'bcrypt'],
      order: 3,
      isRequired: true,
    },
  ]);

  const project = await Project.create({
    internship: internshipId,
    title: 'Internship Task Tracker API',
    description: 'Capstone backend project combining auth, tasks, and submissions.',
    requirements: [
      'REST API with MongoDB',
      'JWT authentication',
      'Input validation',
      'README with setup instructions',
    ],
    technologies: ['Node.js', 'Express', 'MongoDB'],
    deliverables: ['GitHub repository', 'API documentation', 'Postman collection export'],
    submissionDeadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
  });

  const assessment = await Assessment.create({
    internship: internshipId,
    title: 'Backend Fundamentals MCQ',
    description: 'Demo assessment for seed data — HTTP, REST, and MongoDB basics.',
    passingScore: 70,
    durationMinutes: 20,
    maxAttempts: 2,
    isActive: true,
  });

  await Question.insertMany([
    {
      assessment: assessment._id,
      questionText: 'Which HTTP method is typically used to create a resource in REST?',
      options: ['GET', 'POST', 'DELETE', 'OPTIONS'],
      correctOptionIndex: 1,
      order: 1,
      points: 1,
    },
    {
      assessment: assessment._id,
      questionText: 'What does JWT commonly stand for in authentication?',
      options: [
        'Java Web Token',
        'JSON Web Token',
        'Joint Web Transfer',
        'JavaScript Web Toolkit',
      ],
      correctOptionIndex: 1,
      order: 2,
      points: 1,
    },
    {
      assessment: assessment._id,
      questionText: 'MongoDB stores data in which format?',
      options: ['Relational tables', 'BSON documents', 'CSV files', 'XML nodes'],
      correctOptionIndex: 1,
      order: 3,
      points: 1,
    },
  ]);

  const application = await Application.create({
    student: studentId,
    internship: internshipId,
    status: ApplicationStatus.ACCEPTED,
    appliedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
    reviewedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    reviewedBy: mentorId,
  });

  await InternshipProgress.create({
    application: application._id,
    student: studentId,
    internship: internshipId,
    currentStage: InternshipStage.TASKS,
    stageProgress: [
      { stage: InternshipStage.ORIENTATION, completedAt: new Date() },
      { stage: InternshipStage.LEARNING, completedAt: new Date() },
    ],
    overallProgress: 35,
  });

  await TaskSubmission.create({
    task: tasks[0]._id,
    student: studentId,
    internship: internshipId,
    githubUrl: 'https://github.com/demo-aarav/api-spec-demo',
    status: TaskSubmissionStatus.APPROVED,
    reviewedBy: mentorId,
    reviewedAt: new Date(),
    feedback: 'Clear structure — demo seed feedback.',
  });

  await TaskSubmission.create({
    task: tasks[1]._id,
    student: studentId,
    internship: internshipId,
    status: TaskSubmissionStatus.IN_PROGRESS,
  });

  await ProjectSubmission.create({
    project: project._id,
    student: studentId,
    status: ProjectSubmissionStatus.IN_PROGRESS,
  });

  return { application, assessment, project };
}

async function seedCertificateAndEvaluation(
  studentId: mongoose.Types.ObjectId,
  internship: { _id: mongoose.Types.ObjectId; title: string; technologies: string[] },
  mentorId: mongoose.Types.ObjectId,
  studentName: string
) {
  const evaluation = await Evaluation.create({
    student: studentId,
    internship: internship._id,
    evaluator: mentorId,
    criteria: {
      technicalSkills: 8,
      taskCompletion: 9,
      projectQuality: 8,
      communication: 8,
      problemSolving: 8,
      professionalism: 9,
    },
    overallScore: 82,
    comments: 'Demo evaluation for certificate verification testing.',
  });

  const certId = await nextCertificateId();
  const issuedAt = new Date();
  const startDate = new Date(issuedAt);
  startDate.setMonth(startDate.getMonth() - 2);

  await Certificate.create({
    certificateId: certId,
    student: studentId,
    internship: internship._id,
    evaluation: evaluation._id,
    studentName,
    programName: internship.title,
    startDate,
    endDate: issuedAt,
    skills: internship.technologies,
    projectTitle: 'Internship Task Tracker API',
    overallScore: 82,
    status: CertificateStatus.VALID,
    issuedAt,
    verificationUrl: `${env.FRONTEND_URL}/verify/${certId}`,
    isDemoSeed: true,
  });

  return certId;
}

async function seedMisc(
  adminId: mongoose.Types.ObjectId,
  studentId: mongoose.Types.ObjectId,
  internshipId: mongoose.Types.ObjectId
) {
  await ContactInquiry.create({
    type: InquiryType.CONTACT,
    name: 'Demo Visitor',
    email: 'visitor@example.com',
    subject: 'Seed inquiry',
    message: 'This is demo contact data created by the seed script.',
    isResolved: false,
  });

  await ContactInquiry.create({
    type: InquiryType.COMPANY_INTEREST,
    name: 'Demo HR',
    email: 'hr@example-company.test',
    subject: 'Employer interest',
    message: 'Interested in future employer features.',
    companyName: 'Example Company (Fictional)',
    isResolved: false,
  });

  await Payment.create({
    user: studentId,
    internship: internshipId,
    amount: 0,
    currency: 'INR',
    status: PaymentStatus.CREATED,
    metadata: { note: 'Placeholder payment record for architecture demo' },
  });

  await Notification.create({
    user: studentId,
    type: 'APPLICATION_ACCEPTED',
    title: 'Application accepted (demo)',
    message: 'Your demo application to Backend Development Internship was accepted.',
    isRead: false,
    link: '/dashboard/applications',
  });

  void adminId;
}

async function main(): Promise<void> {
  if (env.NODE_ENV === 'production') {
    console.error('❌ Refusing to seed in production.');
    process.exit(1);
  }

  console.log('🌱 Internova development seed starting…');
  console.log('⚠️  This DROPS the entire MongoDB database for this connection (development only).');

  await connectDB();
  await resetDatabase();

  const passwordHash = await hashPassword(DEMO_PASSWORD);
  const { admin, mentorApproved, studentA, studentB } = await seedUsers(passwordHash);
  const internships = await seedInternships(mentorApproved._id);

  const backend = internships[0]!;
  await MentorProfile.updateOne(
    { user: mentorApproved._id },
    { $set: { assignedInternships: [backend._id] } }
  );

  await seedBackendProgramDetails(backend._id, studentA._id, mentorApproved._id);

  const certId = await seedCertificateAndEvaluation(
    studentB._id,
    backend,
    mentorApproved._id,
    studentB.fullName
  );

  await seedMisc(admin._id, studentA._id, backend._id);

  console.log('\n✅ Seed completed successfully.\n');
  console.log('── Demo accounts (password for all):', DEMO_PASSWORD);
  console.log('  Admin:    admin@demo.internova');
  console.log('  Mentor:   mentor@demo.internova (APPROVED)');
  console.log('  Mentor:   mentor.pending@demo.internova (PENDING)');
  console.log('  Student:  student@demo.internova (active internship)');
  console.log('  Student:  student2@demo.internova (sample certificate)');
  console.log('\n── Sample certificate ID:', certId);
  console.log('  Verify URL:', `${env.FRONTEND_URL}/verify/${certId}`);
  console.log('\n── Published internships:', internships.length);
  console.log('  Example slug:', backend.slug);
  console.log('\n⚠️  All seeded data is fictional and marked isDemoSeed where applicable.\n');

  await mongoose.disconnect();
}

main().catch(async (err) => {
  console.error('Seed failed:', err);
  await mongoose.disconnect();
  process.exit(1);
});
