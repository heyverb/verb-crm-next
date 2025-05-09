import { ChartAreaInteractive } from "@/components/dashboard/chart-area-interactive";
import { DataTable } from "@/components/dashboard/data-table";
import { SectionCards } from "@/components/dashboard/section-cards";

import data from "./data.json";
import { widgetItems } from "../admissions/overview/extras/widgetItems";

export default function Page() {
  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      <SectionCards items={widgetItems} />
      <div className="px-4 lg:px-6">
        <ChartAreaInteractive
          title="Admissions"
          description="Total admission this month"
        />
      </div>
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
}
