import { DataTable } from "@/components/dashboard/data-table";
import { SectionCards } from "@/components/dashboard/section-cards";
import React from "react";
import data from "./data.json";
import { widgetItems } from "../overview/extras/widgetItems";

const AdmissionEnquiryPage = () => {
  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      <SectionCards items={widgetItems} />
      <DataTable
        data={data}
        columns={[]}
        dataStatus={[
          {
            title: "Accepted",
            value: "accepted",
          },
          {
            title: "Pending",
            value: "pending",
          },
          {
            title: "Rejected",
            value: "rejected",
          },
        ]}
      />
    </div>
  );
};

export default AdmissionEnquiryPage;
