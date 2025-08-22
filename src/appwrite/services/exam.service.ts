import { getErrorMessage } from "@/lib/error.helper";
import { appwriteConfig, database, ID } from "../config";
import { Query, Models } from "appwrite";
import { ExamModel, ExamScheduleModel, ResultModel } from "../schema/exam.schema";
import { ExamStatus } from "../interface/exam.interface";

export type ExamInterface = ExamModel & Models.Document;
export type ExamScheduleInterface = ExamScheduleModel & Models.Document;
export type ResultInterface = ResultModel & Models.Document;

const EXAM_SCHEDULE_COLLECTION = "examSchedules"; // This should be added to appwriteConfig
const RESULT_COLLECTION = "results"; // This should be added to appwriteConfig

export const createExam = async (data: ExamModel) => {
  try {
    const examDoc = await database.createDocument(
      appwriteConfig.databaseId!,
      appwriteConfig.examCollection!,
      ID.unique(),
      data
    );

    return examDoc as ExamInterface;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const getExams = async ({
  schoolId,
  academicYearId,
  type,
  status,
}: {
  schoolId: string;
  academicYearId?: string;
  type?: string;
  status?: ExamStatus;
}) => {
  try {
    const queries = [Query.equal("schoolId", schoolId)];
    
    if (academicYearId) {
      queries.push(Query.equal("academicYearId", academicYearId));
    }
    
    if (type) {
      queries.push(Query.equal("type", type));
    }
    
    if (status) {
      queries.push(Query.equal("status", status));
    }
    
    queries.push(Query.orderDesc("startDate"));
    
    const response = await database.listDocuments(
      appwriteConfig.databaseId!,
      appwriteConfig.examCollection!,
      queries
    );
    
    return response.documents as ExamInterface[];
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const getExamById = async (id: string): Promise<ExamInterface> => {
  try {
    const exam = await database.getDocument(
      appwriteConfig.databaseId!,
      appwriteConfig.examCollection!,
      id
    );
    return exam as ExamInterface;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const updateExam = async (id: string, data: Partial<ExamModel>): Promise<ExamInterface> => {
  try {
    const updatedExam = await database.updateDocument(
      appwriteConfig.databaseId!,
      appwriteConfig.examCollection!,
      id,
      data
    );
    return updatedExam as ExamInterface;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const publishExam = async (examId: string) => {
  try {
    return await updateExam(examId, { isPublished: true });
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const createExamSchedule = async (data: ExamScheduleModel) => {
  try {
    const scheduleDoc = await database.createDocument(
      appwriteConfig.databaseId!,
      EXAM_SCHEDULE_COLLECTION,
      ID.unique(),
      data
    );

    return scheduleDoc as ExamScheduleInterface;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const getExamSchedule = async (examId: string, classId?: string) => {
  try {
    const queries = [Query.equal("examId", examId)];
    
    if (classId) {
      queries.push(Query.equal("classId", classId));
    }
    
    queries.push(Query.orderAsc("examDate"));
    queries.push(Query.orderAsc("startTime"));
    
    const response = await database.listDocuments(
      appwriteConfig.databaseId!,
      EXAM_SCHEDULE_COLLECTION,
      queries
    );
    
    return response.documents as ExamScheduleInterface[];
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const updateExamSchedule = async (id: string, data: Partial<ExamScheduleModel>): Promise<ExamScheduleInterface> => {
  try {
    const updatedSchedule = await database.updateDocument(
      appwriteConfig.databaseId!,
      EXAM_SCHEDULE_COLLECTION,
      id,
      data
    );
    return updatedSchedule as ExamScheduleInterface;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const createResult = async (data: ResultModel) => {
  try {
    const resultDoc = await database.createDocument(
      appwriteConfig.databaseId!,
      RESULT_COLLECTION,
      ID.unique(),
      data
    );

    return resultDoc as ResultInterface;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const getResults = async ({
  studentId,
  examId,
  subjectId,
}: {
  studentId?: string;
  examId?: string;
  subjectId?: string;
}) => {
  try {
    const queries = [];
    
    if (studentId) {
      queries.push(Query.equal("studentId", studentId));
    }
    
    if (examId) {
      queries.push(Query.equal("examId", examId));
    }
    
    if (subjectId) {
      queries.push(Query.equal("subjectId", subjectId));
    }
    
    const response = await database.listDocuments(
      appwriteConfig.databaseId!,
      RESULT_COLLECTION,
      queries
    );
    
    return response.documents as ResultInterface[];
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const updateResult = async (id: string, data: Partial<ResultModel>): Promise<ResultInterface> => {
  try {
    const updatedResult = await database.updateDocument(
      appwriteConfig.databaseId!,
      RESULT_COLLECTION,
      id,
      data
    );
    return updatedResult as ResultInterface;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const getStudentExamResults = async (studentId: string, examId: string) => {
  try {
    const response = await database.listDocuments(
      appwriteConfig.databaseId!,
      RESULT_COLLECTION,
      [
        Query.equal("studentId", studentId),
        Query.equal("examId", examId),
      ]
    );
    
    return response.documents as ResultInterface[];
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const calculateStudentPercentage = async (studentId: string, examId: string) => {
  try {
    const results = await getStudentExamResults(studentId, examId);
    
    if (results.length === 0) {
      return 0;
    }
    
    const totalMarksObtained = results.reduce((sum, result) => sum + result.marksObtained, 0);
    const totalMaxMarks = results.length * 100; // Assuming 100 marks per subject
    
    return (totalMarksObtained / totalMaxMarks) * 100;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const getClassResults = async (examId: string, classId: string) => {
  try {
    // First get all students in the class
    const enrollments = await database.listDocuments(
      appwriteConfig.databaseId!,
      "enrollments",
      [
        Query.equal("classId", classId),
        Query.equal("enrollmentStatus", "ACTIVE"),
      ]
    );
    
    const studentIds = enrollments.documents.map(enrollment => enrollment.studentId);
    
    // Then get results for these students
    const results: ResultInterface[] = [];
    for (const studentId of studentIds) {
      const studentResults = await getStudentExamResults(studentId, examId);
      results.push(...studentResults);
    }
    
    return results;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};