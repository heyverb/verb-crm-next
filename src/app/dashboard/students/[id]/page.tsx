"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Edit, FileText, CreditCard, Calendar } from "lucide-react";
import { getStudentById } from "@/appwrite/services/student.new.service";
import { getUsersByRole } from "@/appwrite/services/user.service";
import { getEnrollments } from "@/appwrite/services/enrollment.service";
import { getStudentAttendanceStats } from "@/appwrite/services/academic.service";
import { getStudentPaymentHistory } from "@/appwrite/services/fee.service";
import { useAuth } from "@/hooks/useAuth";
import { UserRole } from "@/appwrite/interface/user.interface";
import { Loader } from "@/components/custom/Loader";
import { format } from "date-fns";
import { StudentStatus } from "@/appwrite/interface/student.interface";

export default function StudentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user, hasRole } = useAuth();
  const studentId = params.id as string;

  const { data: student, isLoading: studentLoading } = useQuery({
    queryKey: ['student', studentId],
    queryFn: () => getStudentById(studentId),
    enabled: !!studentId,
  });

  const { data: studentUser } = useQuery({
    queryKey: ['studentUser', student?.userId],
    queryFn: async () => {
      const users = await getUsersByRole(UserRole.STUDENT, user?.schoolId || "");
      return users.find(u => u.$id === student?.userId);
    },
    enabled: !!student?.userId && !!user?.schoolId,
  });

  const { data: enrollments } = useQuery({
    queryKey: ['enrollments', studentId],
    queryFn: () => getEnrollments({ studentId }),
    enabled: !!studentId,
  });

  const { data: attendanceStats } = useQuery({
    queryKey: ['attendanceStats', studentId],
    queryFn: () => {
      const currentYear = new Date().getFullYear();
      return getStudentAttendanceStats(
        studentId,
        `${currentYear}-01-01`,
        `${currentYear}-12-31`
      );
    },
    enabled: !!studentId,
  });

  const { data: paymentHistory } = useQuery({
    queryKey: ['paymentHistory', studentId],
    queryFn: () => getStudentPaymentHistory(studentId),
    enabled: !!studentId,
  });

  if (!hasRole([UserRole.ADMIN, UserRole.TEACHER])) {
    router.push('/dashboard/unauthorized');
    return null;
  }

  if (studentLoading) {
    return <Loader />;
  }

  if (!student) {
    return <div>Student not found</div>;
  }

  const getStatusBadge = (status: StudentStatus) => {
    const variant = 
      status === StudentStatus.ACTIVE ? "default" :
      status === StudentStatus.INACTIVE ? "secondary" :
      status === StudentStatus.GRADUATED ? "outline" :
      "destructive";
    
    return <Badge variant={variant}>{status}</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h2 className="text-3xl font-bold tracking-tight">
              {studentUser?.name || 'Student Details'}
            </h2>
            <p className="text-muted-foreground">
              Admission No: {student.admissionNumber}
            </p>
          </div>
        </div>
        {hasRole([UserRole.ADMIN]) && (
          <Button onClick={() => router.push(`/dashboard/students/${studentId}/edit`)}>
            <Edit className="mr-2 h-4 w-4" />
            Edit Student
          </Button>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Status</CardTitle>
          </CardHeader>
          <CardContent>
            {getStatusBadge(student.status)}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Attendance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {attendanceStats?.attendancePercentage.toFixed(1)}%
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Fees Paid</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₹{paymentHistory?.reduce((sum, p) => sum + p.amount, 0) || 0}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Class</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {enrollments?.[0]?.classId || 'N/A'}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="personal" className="space-y-4">
        <TabsList>
          <TabsTrigger value="personal">Personal Information</TabsTrigger>
          <TabsTrigger value="academic">Academic</TabsTrigger>
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
          <TabsTrigger value="fees">Fees</TabsTrigger>
        </TabsList>

        <TabsContent value="personal" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>
                Student's personal and contact details
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Full Name</p>
                <p className="text-lg">{studentUser?.name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Email</p>
                <p className="text-lg">{studentUser?.email}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Date of Birth</p>
                <p className="text-lg">{format(new Date(student.dateOfBirth), "dd MMM yyyy")}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Gender</p>
                <p className="text-lg">{student.gender}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Blood Group</p>
                <p className="text-lg">{student.bloodGroup || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Aadhar Number</p>
                <p className="text-lg">{student.aadharNumber || 'N/A'}</p>
              </div>
              <div className="md:col-span-2">
                <p className="text-sm font-medium text-muted-foreground">Address</p>
                <p className="text-lg">{student.address}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Parent/Guardian Information</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Parent Name</p>
                <p className="text-lg">{student.parentName}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Parent Phone</p>
                <p className="text-lg">{student.parentPhone}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Parent Email</p>
                <p className="text-lg">{student.parentEmail || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Emergency Contact</p>
                <p className="text-lg">{student.emergencyContact}</p>
              </div>
              {student.guardianName && (
                <>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Guardian Name</p>
                    <p className="text-lg">{student.guardianName}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Guardian Phone</p>
                    <p className="text-lg">{student.guardianPhone}</p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="academic" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Enrollment History</CardTitle>
            </CardHeader>
            <CardContent>
              {enrollments && enrollments.length > 0 ? (
                <div className="space-y-2">
                  {enrollments.map((enrollment) => (
                    <div key={enrollment.$id} className="flex justify-between items-center p-2 border rounded">
                      <div>
                        <p className="font-medium">Class: {enrollment.classId}</p>
                        <p className="text-sm text-muted-foreground">
                          Enrolled on: {format(new Date(enrollment.enrollmentDate), "dd MMM yyyy")}
                        </p>
                      </div>
                      <Badge>{enrollment.enrollmentStatus}</Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No enrollment records found</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="attendance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Attendance Overview</CardTitle>
            </CardHeader>
            <CardContent>
              {attendanceStats ? (
                <div className="grid gap-4 md:grid-cols-3">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Days</p>
                    <p className="text-2xl font-bold">{attendanceStats.total}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Present</p>
                    <p className="text-2xl font-bold text-green-600">{attendanceStats.present}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Absent</p>
                    <p className="text-2xl font-bold text-red-600">{attendanceStats.absent}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Late</p>
                    <p className="text-2xl font-bold text-yellow-600">{attendanceStats.late}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Leave</p>
                    <p className="text-2xl font-bold text-blue-600">{attendanceStats.leave}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Attendance %</p>
                    <p className="text-2xl font-bold">{attendanceStats.attendancePercentage.toFixed(1)}%</p>
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground">No attendance records found</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="fees" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Payment History</CardTitle>
            </CardHeader>
            <CardContent>
              {paymentHistory && paymentHistory.length > 0 ? (
                <div className="space-y-2">
                  {paymentHistory.map((payment) => (
                    <div key={payment.$id} className="flex justify-between items-center p-2 border rounded">
                      <div>
                        <p className="font-medium">Receipt: {payment.receiptNumber}</p>
                        <p className="text-sm text-muted-foreground">
                          Paid on: {format(new Date(payment.paymentDate), "dd MMM yyyy")}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">₹{payment.amount}</p>
                        <Badge variant={payment.status === 'COMPLETED' ? 'default' : 'secondary'}>
                          {payment.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No payment records found</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}