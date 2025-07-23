"use client";
import { DataTable } from "@/components/dashboard/data-table";
import React, { useEffect, useMemo, useState } from "react";
import useApi from "@/hooks/useApi";

import { columns } from "../components/AdmissionTableColumns";
import LayoutContainer from "@/components/dashboard/layout-container";
import { GetStudents } from "@/appwrite/services/student.service";
import { getStatusWidget } from "../overview/utils/widget-items";
import { useMount } from "@/hooks/useMount";

const ListPage = () => {
  const { mounting } = useMount();

  const [pagination, setPagination] = useState<{
    pageIndex: number;
    pageSize: number;
  }>({
    pageSize: 10,
    pageIndex: 0,
  });

  const {
    mutation,
    data: studentData,
    isLoading,
    isError,
  } = useApi(GetStudents);

  useEffect(() => {
    mutation.mutateAsync(pagination);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination.pageIndex, pagination.pageSize]);

  const widgetItems = useMemo(() => {
    return getStatusWidget(studentData);
  }, [studentData]);

  const updtedIdsData = useMemo(() => {
    return studentData?.map((item) => ({
      ...item,
      id: item.$id,
    }));
  }, [studentData]);

  return (
    <LayoutContainer
      loading={mounting}
      errorMessage={isError ? "Error loading admissions" : null}
    >
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        <DataTable
          dataStatus={widgetItems}
          columns={columns}
          data={updtedIdsData || []}
          showPagination
          showSearch
          setPaginationData={setPagination}
          loading={isLoading}
        />
      </div>
    </LayoutContainer>
  );
};

export default ListPage;
