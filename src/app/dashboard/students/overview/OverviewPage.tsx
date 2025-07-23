"use client";
import { DataTable } from "@/components/dashboard/data-table";
import { SectionCards } from "@/components/dashboard/section-cards";
import React, { useEffect, useMemo } from "react";
import useApi from "@/hooks/useApi";

import LayoutContainer from "@/components/dashboard/layout-container";
import { columns } from "../components/AdmissionTableColumns";
import { AdmissionAreaChart } from "../components/AdmissionAreaChart";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Datepicker from "@/components/common/Datepicker";
import { DateTime } from "luxon";
import { generateDateRange } from "@/lib/utils";
import { mapDataWithAdmission } from "./utils/expensive";
import { GetStudents } from "@/appwrite/services/student.service";
import { getStatusWidget } from "./utils/widget-items";
import TableRightSideComponent from "../components/TableRightSideComponent";

export default function OverviewPage() {
  const [showCustomTimePicker, setShowCustomTimePicker] = React.useState(false);
  const [dateType, setDateType] = React.useState("7d");

  const [storeDateRange, setStoreDateRange] = React.useState({
    from: "",
    to: "",
  });

  const [dateRange, setDateRange] = React.useState({
    from: "",
    to: "",
  });

  const {
    mutation,
    data: studentData,
    isLoading,
    isError,
  } = useApi(GetStudents);

  useEffect(() => {
    mutation.mutate({ pageSize: 5 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const widgetItems = useMemo(() => {
    return getStatusWidget(studentData);
  }, [studentData]);

  const updtedIdsDats = useMemo(() => {
    return studentData?.map((item) => ({
      ...item,
      id: item.$id,
    }));
  }, [studentData]);

  useEffect(() => {
    if (dateType === "custom") {
      setShowCustomTimePicker(!showCustomTimePicker);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateType]);

  const mappedData = useMemo(() => {
    return mapDataWithAdmission(
      studentData,
      generateDateRange(dateType, storeDateRange.from, storeDateRange.to)
    );
  }, [studentData, storeDateRange.from, storeDateRange.to, dateType]);

  return (
    <LayoutContainer
      loading={isLoading}
      errorMessage={isError ? "Error loading admissions" : null}
    >
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        <SectionCards items={widgetItems} />
        <div className="px-4 lg:px-6">
          <AdmissionAreaChart
            title="Admission"
            description="Admission status this month"
            data={mappedData}
            setDateType={setDateType}
            dateType={dateType}
          />
        </div>
        <DataTable
          showSearch
          columns={columns}
          data={updtedIdsDats || []}
          dataStatus={widgetItems}
          tableRightNavigationComponent={<TableRightSideComponent />}
        />
      </div>

      <Dialog
        open={showCustomTimePicker}
        onOpenChange={() => {
          setShowCustomTimePicker(!showCustomTimePicker);
          setDateType("7d");
        }}
      >
        <DialogContent
          className="sm:max-w-[425px]"
          aria-description="custom date picker"
        >
          <DialogHeader>
            <DialogTitle>Select Date</DialogTitle>
          </DialogHeader>

          <div>
            <Datepicker
              selectRange
              onChange={(date) => {
                const [from, to] = date as Date[];
                setDateRange({
                  from: DateTime.fromJSDate(from).toFormat("yyyy-MM-dd"),
                  to: DateTime.fromJSDate(to).toFormat("yyyy-MM-dd"),
                });
              }}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              onClick={() => {
                setStoreDateRange(dateRange);
                setShowCustomTimePicker(!showCustomTimePicker);
              }}
            >
              Save changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </LayoutContainer>
  );
}
