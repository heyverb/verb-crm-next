import { Client, Account, Databases, Storage, Avatars } from "appwrite";

export const client = new Client();

export const appwriteConfig = {
  endpoint: process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT,
  projectId: process.env.NEXT_PUBLIC_VERB_APPWRITE_PROJECT_ID,
  databaseId: process.env.NEXT_PUBLIC_VERB_APPWRITE_DATABASE_ID,
  admissionCollection:
    process.env.NEXT_PUBLIC_VERB_APPWRITE_ADMISSION_COLLECTION_ID,
  examCollection: process.env.NEXT_PUBLIC_VERB_APPWRITE_EXAM_COLLECTION_ID,
  enquiryCollection:
    process.env.NEXT_PUBLIC_VERB_APPWRITE_ENQUIRIES_COLLECTION_ID,
  subjectCollection:
    process.env.NEXT_PUBLIC_VERB_APPWRITE_SUBJECT_COLLECTION_ID,
  classCollection: process.env.NEXT_PUBLIC_VERB_APPWRITE_CLASS_COLLECTION_ID,
  teacherCollection:
    process.env.NEXT_PUBLIC_VERB_APPWRITE_TEACHER_COLLECTION_ID,
  schoolCollection: process.env.NEXT_PUBLIC_VERB_APPWRITE_SCHOOL_COLLECTION_ID,
  userCollection: process.env.NEXT_PUBLIC_VERB_APPWRITE_USER_COLLECTION_ID,
  studentCollection: process.env.NEXT_PUBLIC_VERB_APPWRITE_STUDENT_COLLECTION_ID,
  sectionCollection: process.env.NEXT_PUBLIC_VERB_APPWRITE_SECTION_COLLECTION_ID,
  enrollmentCollection: process.env.NEXT_PUBLIC_VERB_APPWRITE_ENROLLMENT_COLLECTION_ID,
  academicYearCollection: process.env.NEXT_PUBLIC_VERB_APPWRITE_ACADEMIC_YEAR_COLLECTION_ID,
  attendanceCollection: process.env.NEXT_PUBLIC_VERB_APPWRITE_ATTENDANCE_COLLECTION_ID,
  examScheduleCollection: process.env.NEXT_PUBLIC_VERB_APPWRITE_EXAM_SCHEDULE_COLLECTION_ID,
  resultCollection: process.env.NEXT_PUBLIC_VERB_APPWRITE_RESULT_COLLECTION_ID,
  feeCollection: process.env.NEXT_PUBLIC_VERB_APPWRITE_FEE_COLLECTION_ID,
  feePaymentCollection: process.env.NEXT_PUBLIC_VERB_APPWRITE_FEE_PAYMENT_COLLECTION_ID,
  bucketId: process.env.NEXT_PUBLIC_VERB_APPWRITE_BUCKET_ID,
};

client
  .setEndpoint(appwriteConfig.endpoint!)
  .setProject(appwriteConfig.projectId!);

export const account = new Account(client);
export const database = new Databases(client);
export const storage = new Storage(client);
export const avatars = new Avatars(client);

export { ID, type Models } from "appwrite";
