import { ChartAreaInteractive } from "@/components/dashboard/chart-area-interactive";
import { SectionCards } from "@/components/dashboard/section-cards";
import React from "react";

const Page = () => {
  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      <SectionCards items={[]} />
      <div className="px-4 lg:px-6">
        <ChartAreaInteractive title={""} description={""} />
      </div>
    </div>
  );
};

export default Page;
