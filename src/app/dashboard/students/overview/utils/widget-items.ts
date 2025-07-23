import { CreateAdmissionType } from "@/components/forms/admission-form";
import { DateTime } from "luxon";

interface NewCreateAdmissionType extends CreateAdmissionType {
  $createdAt: string;
}

export const getStatusWidget = (data: NewCreateAdmissionType[]) => {
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

  return [
    {
      title: "Total students",
      key: "total",
      value: data?.length.toString(),
      description: "Total number of admissions",
      subDescription: "This month",
      isUpDown: totalAdmissionPercentage() > 0,
      percentage: `${totalAdmissionPercentage().toFixed(2)}%`,
    },
    {
      title: "New students",
      key: "new",
      value: newAdmission?.length.toString(),
      description: "New admissions",
      subDescription: "This month",
      isUpDown: newAdmissionsPercentage() > 0,
      percentage: `${newAdmissionsPercentage().toFixed(2)}%`,
    },
  ];
};
