import { getErrorMessage } from "@/lib/error.helper";
import { appwriteConfig, database, ID } from "../config";
import { EnquiryModel } from "../schema/enquiry.schema";
import { Query, QueryTypes } from "appwrite";
import { EnquiryStatusEnum, EnquiryPriorityEnum } from "../interface/enquiry.interface";

export const CreateEnquiry = async (data: Omit<EnquiryModel, keyof Models.Document>) => {
  try {
    return (await database.createDocument(
      appwriteConfig.databaseId!,
      appwriteConfig.enquiryCollection!,
      ID.unique(),
      data
    )) as EnquiryModel;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const UpdateEnquiry = async (id: string, data: Partial<EnquiryModel>) => {
  try {
    const enquiryRes = (await database.updateDocument(
      appwriteConfig.databaseId!,
      appwriteConfig.enquiryCollection!,
      id,
      data
    )) as EnquiryModel;

    return enquiryRes;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const DeleteEnquiry = async (id: string) => {
  try {
    await database.deleteDocument(
      appwriteConfig.databaseId!,
      appwriteConfig.enquiryCollection!,
      id
    );
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const GetEnquiries = async ({
  pageIndex = 0,
  pageSize = 10,
  status,
  priority,
  searchTerm,
  sortBy = "$createdAt",
  sortOrder = "desc",
  schoolId,
}: {
  pageIndex?: number;
  pageSize?: number;
  status?: EnquiryStatusEnum;
  priority?: EnquiryPriorityEnum;
  searchTerm?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  schoolId?: string;
}) => {
  const queries: QueryTypes[] = [];

  // Pagination
  queries.push(Query.limit(pageSize));
  queries.push(Query.offset(pageIndex * pageSize));

  // Sorting
  if (sortOrder === "desc") {
    queries.push(Query.orderDesc(sortBy));
  } else {
    queries.push(Query.orderAsc(sortBy));
  }

  // Filters
  if (status) {
    queries.push(Query.equal("status", status));
  }

  if (priority) {
    queries.push(Query.equal("priority", priority));
  }

  if (schoolId) {
    queries.push(Query.equal("school", schoolId));
  }

  // Search
  if (searchTerm) {
    queries.push(
      Query.or([
        Query.search("student_fname", searchTerm),
        Query.search("student_lname", searchTerm),
        Query.search("guardian_name", searchTerm),
        Query.search("guardian_phone", searchTerm),
        Query.search("guardian_email", searchTerm),
      ])
    );
  }

  try {
    const response = await database.listDocuments(
      appwriteConfig.databaseId!,
      appwriteConfig.enquiryCollection!,
      queries
    );
    
    return {
      enquiries: response.documents as EnquiryModel[],
      total: response.total,
    };
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const GetOneEnquiry = async (id: string) => {
  try {
    const response = await database.getDocument(
      appwriteConfig.databaseId!,
      appwriteConfig.enquiryCollection!,
      id
    );
    return response as EnquiryModel;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const GetEnquiryStats = async (schoolId?: string) => {
  try {
    const queries: QueryTypes[] = [];
    
    if (schoolId) {
      queries.push(Query.equal("school", schoolId));
    }

    const response = await database.listDocuments(
      appwriteConfig.databaseId!,
      appwriteConfig.enquiryCollection!,
      queries
    );

    const enquiries = response.documents as EnquiryModel[];

    // Calculate statistics
    const stats = {
      total: enquiries.length,
      byStatus: {
        new: 0,
        contacted: 0,
        followUp: 0,
        interested: 0,
        notInterested: 0,
        converted: 0,
        closed: 0,
      },
      byPriority: {
        low: 0,
        medium: 0,
        high: 0,
        urgent: 0,
      },
      bySource: {} as Record<string, number>,
      recentEnquiries: enquiries.slice(0, 5),
    };

    enquiries.forEach((enquiry) => {
      // Count by status
      const statusKey = enquiry.status.toLowerCase().replace(/_/g, '') as keyof typeof stats.byStatus;
      if (statusKey in stats.byStatus) {
        stats.byStatus[statusKey]++;
      }

      // Count by priority
      const priorityKey = enquiry.priority.toLowerCase() as keyof typeof stats.byPriority;
      if (priorityKey in stats.byPriority) {
        stats.byPriority[priorityKey]++;
      }

      // Count by source
      const source = enquiry.source;
      stats.bySource[source] = (stats.bySource[source] || 0) + 1;
    });

    return stats;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const AddFollowUp = async (
  enquiryId: string,
  followUp: {
    notes: string;
    by: string;
    next_action?: string;
  }
) => {
  try {
    const enquiry = await GetOneEnquiry(enquiryId);
    
    const newFollowUp = {
      date: new Date().toISOString(),
      notes: followUp.notes,
      by: followUp.by,
      next_action: followUp.next_action,
      created_at: new Date().toISOString(),
    };

    const updatedFollowUps = [...(enquiry.follow_ups || []), newFollowUp];

    return await UpdateEnquiry(enquiryId, {
      follow_ups: updatedFollowUps,
      status: EnquiryStatusEnum.Contacted,
    });
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const ConvertEnquiryToAdmission = async (enquiryId: string) => {
  try {
    return await UpdateEnquiry(enquiryId, {
      status: EnquiryStatusEnum.Converted,
    });
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};