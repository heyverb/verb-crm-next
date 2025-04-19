import { StatusEnum } from "@/appwrite/interface/admission.interface";
import { CreateAdmissionType } from "@/components/forms/admission-form";
import { DateTime } from "luxon";

interface NewCreateAdmissionType extends CreateAdmissionType {
  $createdAt: string;
}

export const getStatusWidget = (data: NewCreateAdmissionType[]) => {
  const pendingAdmissions = data?.filter(
    (item) => item.status === StatusEnum.Pending
  );
  const acceptedAdmissions = data?.filter(
    (item) => item.status === StatusEnum.Accepted
  );
  const rejectedAdmissions = data?.filter(
    (item) => item.status === StatusEnum.Rejected
  );

  const newAdmission = data?.filter((item) => {
    const originalDate = DateTime.fromISO(item.$createdAt);

    const newDate = originalDate.minus({ days: 7 });
    return DateTime.fromISO(item.$createdAt).diff(newDate);
  });

  const totalAdmissionPercentage = () => {
    return ((data?.length || 0) / (data?.length || 1)) * 100;
  };

  const newAdmissionsPercentage = () => {
    return ((newAdmission?.length || 0) / (data?.length || 1)) * 100;
  };

  const acceptedAdmissionsPercentage = () => {
    return ((acceptedAdmissions?.length || 0) / (data?.length || 1)) * 100;
  };

  const rejectedAdmissionsPercentage = () => {
    return ((rejectedAdmissions?.length || 0) / (data?.length || 1)) * 100;
  };

  const pendingAdmissionsPercentage = () => {
    return ((pendingAdmissions?.length || 0) / (data?.length || 1)) * 100;
  };

  return [
    {
      title: "Total admissions",
      key: "total",
      value: data?.length.toString(),
      description: "Total number of admissions",
      subDescription: "This month",
      isUpDown: totalAdmissionPercentage() > 0,
      percentage: `${totalAdmissionPercentage().toFixed(2)}%`,
    },
    {
      title: "New admissions",
      key: "new",
      value: newAdmission?.length.toString(),
      description: "New admissions",
      subDescription: "This month",
      isUpDown: newAdmissionsPercentage() > 0,
      percentage: `${newAdmissionsPercentage().toFixed(2)}%`,
    },
    {
      title: "Accepted admissions",
      key: "accepted",
      value: acceptedAdmissions?.length.toString(),
      description: "Accepted admissions",
      subDescription: "This month",
      isUpDown: acceptedAdmissionsPercentage() > 0,
      percentage: `${acceptedAdmissionsPercentage().toFixed(2)}%`,
    },
    {
      title: "Pending admissions",
      key: "pending",
      value: pendingAdmissions?.length.toString(),
      description: "Pending admissions",
      subDescription: "This month",
      isUpDown: pendingAdmissionsPercentage() > 0,
      percentage: `${pendingAdmissionsPercentage().toFixed(2)}%`,
    },
    {
      title: "Rejected admissions",
      key: "rejected",
      value: rejectedAdmissions?.length.toString(),
      description: "Rejected admissions",
      subDescription: "This month",
      isUpDown: rejectedAdmissionsPercentage() > 0,
      percentage: `${rejectedAdmissionsPercentage().toFixed(2)}%`,
    },
  ];
};
