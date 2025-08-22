import { getErrorMessage } from "@/lib/error.helper";
import { appwriteConfig, database, ID } from "../config";
import { Query, Models } from "appwrite";
import { AcademicYearModel, AttendanceModel } from "../schema/academic.schema";
import { AttendanceStatus } from "../interface/academic.interface";

export type AcademicYearInterface = AcademicYearModel & Models.Document;
export type AttendanceInterface = AttendanceModel & Models.Document;

const ACADEMIC_YEAR_COLLECTION = "academicYears"; // This should be added to appwriteConfig
const ATTENDANCE_COLLECTION = "attendance"; // This should be added to appwriteConfig

export const createAcademicYear = async (data: AcademicYearModel) => {
  try {
    // If this year is current, unset any existing current year
    if (data.isCurrent) {
      const existingCurrentYear = await getCurrentAcademicYear(data.schoolId);
      if (existingCurrentYear) {
        await updateAcademicYear(existingCurrentYear.$id, { isCurrent: false });
      }
    }

    const yearDoc = await database.createDocument(
      appwriteConfig.databaseId!,
      ACADEMIC_YEAR_COLLECTION,
      ID.unique(),
      data
    );

    return yearDoc as AcademicYearInterface;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const getAcademicYears = async (schoolId: string) => {
  try {
    const response = await database.listDocuments(
      appwriteConfig.databaseId!,
      ACADEMIC_YEAR_COLLECTION,
      [
        Query.equal("schoolId", schoolId),
        Query.orderDesc("startDate"),
      ]
    );
    
    return response.documents as AcademicYearInterface[];
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const getAcademicYearById = async (id: string): Promise<AcademicYearInterface> => {
  try {
    const year = await database.getDocument(
      appwriteConfig.databaseId!,
      ACADEMIC_YEAR_COLLECTION,
      id
    );
    return year as AcademicYearInterface;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const getCurrentAcademicYear = async (schoolId: string): Promise<AcademicYearInterface | null> => {
  try {
    const response = await database.listDocuments(
      appwriteConfig.databaseId!,
      ACADEMIC_YEAR_COLLECTION,
      [
        Query.equal("schoolId", schoolId),
        Query.equal("isCurrent", true),
      ]
    );
    
    if (response.documents.length === 0) {
      return null;
    }
    
    return response.documents[0] as AcademicYearInterface;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const updateAcademicYear = async (id: string, data: Partial<AcademicYearModel>): Promise<AcademicYearInterface> => {
  try {
    // If setting as current, unset any existing current year
    if (data.isCurrent) {
      const yearToUpdate = await getAcademicYearById(id);
      const existingCurrentYear = await getCurrentAcademicYear(yearToUpdate.schoolId);
      if (existingCurrentYear && existingCurrentYear.$id !== id) {
        await database.updateDocument(
          appwriteConfig.databaseId!,
          ACADEMIC_YEAR_COLLECTION,
          existingCurrentYear.$id,
          { isCurrent: false }
        );
      }
    }

    const updatedYear = await database.updateDocument(
      appwriteConfig.databaseId!,
      ACADEMIC_YEAR_COLLECTION,
      id,
      data
    );
    return updatedYear as AcademicYearInterface;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const markAttendance = async (data: AttendanceModel[]) => {
  try {
    const attendanceRecords: AttendanceInterface[] = [];
    
    for (const record of data) {
      // Check if attendance already exists for this student and date
      const existing = await database.listDocuments(
        appwriteConfig.databaseId!,
        ATTENDANCE_COLLECTION,
        [
          Query.equal("studentId", record.studentId),
          Query.equal("date", record.date),
        ]
      );
      
      if (existing.documents.length > 0) {
        // Update existing record
        const updated = await database.updateDocument(
          appwriteConfig.databaseId!,
          ATTENDANCE_COLLECTION,
          existing.documents[0].$id,
          {
            status: record.status,
            remarks: record.remarks,
            markedBy: record.markedBy,
          }
        );
        attendanceRecords.push(updated as AttendanceInterface);
      } else {
        // Create new record
        const created = await database.createDocument(
          appwriteConfig.databaseId!,
          ATTENDANCE_COLLECTION,
          ID.unique(),
          record
        );
        attendanceRecords.push(created as AttendanceInterface);
      }
    }
    
    return attendanceRecords;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const getAttendance = async ({
  studentId,
  classId,
  date,
  startDate,
  endDate,
}: {
  studentId?: string;
  classId?: string;
  date?: string;
  startDate?: string;
  endDate?: string;
}) => {
  try {
    const queries = [];
    
    if (studentId) {
      queries.push(Query.equal("studentId", studentId));
    }
    
    if (classId) {
      queries.push(Query.equal("classId", classId));
    }
    
    if (date) {
      queries.push(Query.equal("date", date));
    }
    
    if (startDate) {
      queries.push(Query.greaterThanEqual("date", startDate));
    }
    
    if (endDate) {
      queries.push(Query.lessThanEqual("date", endDate));
    }
    
    queries.push(Query.orderDesc("date"));
    
    const response = await database.listDocuments(
      appwriteConfig.databaseId!,
      ATTENDANCE_COLLECTION,
      queries
    );
    
    return response.documents as AttendanceInterface[];
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const getStudentAttendanceStats = async (
  studentId: string,
  startDate: string,
  endDate: string
) => {
  try {
    const attendance = await getAttendance({
      studentId,
      startDate,
      endDate,
    });
    
    const stats = {
      total: attendance.length,
      present: attendance.filter(a => a.status === AttendanceStatus.PRESENT).length,
      absent: attendance.filter(a => a.status === AttendanceStatus.ABSENT).length,
      late: attendance.filter(a => a.status === AttendanceStatus.LATE).length,
      holiday: attendance.filter(a => a.status === AttendanceStatus.HOLIDAY).length,
      leave: attendance.filter(a => a.status === AttendanceStatus.LEAVE).length,
      halfDay: attendance.filter(a => a.status === AttendanceStatus.HALF_DAY).length,
    };
    
    stats['attendancePercentage'] = stats.total > 0 
      ? ((stats.present + stats.late + stats.halfDay) / stats.total) * 100 
      : 0;
    
    return stats;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const getClassAttendanceForDate = async (classId: string, date: string) => {
  try {
    const attendance = await getAttendance({
      classId,
      date,
    });
    
    return attendance;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const bulkMarkAttendance = async (
  classId: string,
  date: string,
  studentStatuses: { studentId: string; status: AttendanceStatus; remarks?: string }[],
  markedBy: string
) => {
  try {
    const attendanceData: AttendanceModel[] = studentStatuses.map(({ studentId, status, remarks }) => ({
      studentId,
      classId,
      date,
      status,
      remarks: remarks || "",
      markedBy,
    }));
    
    return await markAttendance(attendanceData);
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};