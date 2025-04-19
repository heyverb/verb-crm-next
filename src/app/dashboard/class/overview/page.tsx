import { ChartAreaInteractive } from "@/components/dashboard/chart-area-interactive";
import { DataTable } from "@/components/dashboard/data-table";
import { SectionCards } from "@/components/dashboard/section-cards";

import data from "./data.json";

export default function Dashboard() {
  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      <SectionCards items={[]} />
      <div className="px-4 lg:px-6">
        <ChartAreaInteractive title={""} description={""} />
      </div>
      <DataTable data={data} dataStatus={[]} columns={undefined} />
    </div>
  );
}
