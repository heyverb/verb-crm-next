"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { DataTable } from "@/components/dashboard/data-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Search, Download } from "lucide-react";
import { studentColumns } from "../components/StudentTableColumns";
import { getStudents } from "@/appwrite/services/student.new.service";
import { useAuth } from "@/hooks/useAuth";
import { UserRole } from "@/appwrite/interface/user.interface";
import Loader from "@/components/common/Loader";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getClasses } from "@/appwrite/services/class.service";

export default function StudentListPage() {
  const router = useRouter();
  const { user, hasRole } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClass, setSelectedClass] = useState<string>("all");
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const { data: studentsData, isLoading: studentsLoading } = useQuery({
    queryKey: ["students", pageIndex, pageSize, selectedClass],
    queryFn: () =>
      getStudents({
        pageIndex,
        pageSize,
        classId: selectedClass === "all" ? undefined : selectedClass,
      }),
    enabled: !!user,
  });

  const { data: classes } = useQuery({
    queryKey: ["classes", user?.schoolId],
    queryFn: () => getClasses({ schoolId: user?.schoolId || "" }),
    enabled: !!user?.schoolId,
  });

  if (!hasRole([UserRole.ADMIN, UserRole.TEACHER])) {
    router.push("/dashboard/unauthorized");
    return null;
  }

  const handleExport = () => {
    // TODO: Implement export functionality
    console.log("Export students");
  };

  if (studentsLoading) {
    return <Loader />;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Students</h2>
          <p className="text-muted-foreground">
            Manage and view all students in your school
          </p>
        </div>
        {hasRole([UserRole.ADMIN]) && (
          <Button onClick={() => router.push("/dashboard/students/create")}>
            <Plus className="mr-2 h-4 w-4" />
            Add Student
          </Button>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Student List</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, admission number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <Select value={selectedClass} onValueChange={setSelectedClass}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Filter by class" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Classes</SelectItem>
                {classes?.map((cls) => (
                  <SelectItem key={cls.$id} value={cls.$id}>
                    {cls.name} {cls.section || ""}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={handleExport}>
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>

          <DataTable
            columns={studentColumns}
            data={studentsData?.students || []}
            pageCount={Math.ceil((studentsData?.total || 0) / pageSize)}
            pagination={{
              pageIndex,
              pageSize,
            }}
            onPaginationChange={(updater) => {
              if (typeof updater === "function") {
                const newPagination = updater({ pageIndex, pageSize });
                setPageIndex(newPagination.pageIndex);
                setPageSize(newPagination.pageSize);
              }
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}
