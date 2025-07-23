"use client";
import { DataTable } from "@/components/dashboard/data-table";
import React, { useEffect, useMemo } from "react";
import { GetAdmissions } from "@/appwrite/services/admission.service";
import useApi from "@/hooks/useApi";
import { getStatusWidget } from "../overview/utils/widget-items";
import { columns } from "../components/AdmissionTableColumns";
import LayoutContainer from "@/components/dashboard/layout-container";

const EnquiriesPage = () => {
  const {
    mutation,
    data: admissionData,
    isLoading,
    isError,
  } = useApi(GetAdmissions);

  useEffect(() => {
    mutation.mutate({});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const widgetItems = useMemo(() => {
    return getStatusWidget(admissionData);
  }, [admissionData]);

  const updtedIdsData = useMemo(() => {
    return admissionData?.map((item) => ({
      ...item,
      id: item.$id,
    }));
  }, [admissionData]);

  return (
    <LayoutContainer
      loading={isLoading}
      errorMessage={isError ? "Error loading admissions" : null}
    >
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        <DataTable
          dataStatus={widgetItems}
          columns={columns}
          data={updtedIdsData || []}
        />
      </div>
    </LayoutContainer>
  );
};

export default EnquiriesPage;
