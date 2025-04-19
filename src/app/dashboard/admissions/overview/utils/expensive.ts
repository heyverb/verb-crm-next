import { DateTime } from "luxon";
import { CreateAdmissionTypeWithModel } from "../extras/admission.interface";

export const mapDataWithAdmission = (
  admission: CreateAdmissionTypeWithModel[],
  dates: string[]
) => {
  const mappedData = admission?.map((item) => {
    return {
      ...item,
      createdAt: DateTime.fromISO(item.$createdAt).toFormat("yyyy-MM-dd"),
    };
  });

  const groupedData = dates?.map((date) => {
    const filteredData = mappedData?.filter((item) => {
      return item.createdAt === date;
    });

    return {
      date,
      admission: filteredData?.length,
    };
  });

  return groupedData;
};
