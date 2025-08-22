"use client";

import { useQuery } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Users,
  GraduationCap,
  BookOpen,
  DollarSign,
  TrendingUp,
  UserCheck,
  Calendar,
  AlertCircle,
  Activity,
  CreditCard,
  School,
  Award,
  Bell,
  FileText,
  Download,
} from "lucide-react";
import {
  Bar,
  BarChart,
  Pie,
  PieChart,
  Cell,
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts";
import { useAuth } from "@/hooks/useAuth";
import { getStudents } from "@/appwrite/services/student.new.service";
import { getTeachers } from "@/appwrite/services/teacher.service";
import { getClasses } from "@/appwrite/services/class.service";
import { calculateTotalFeesCollected } from "@/appwrite/services/fee.service";
import { getCurrentAcademicYear } from "@/appwrite/services/academic.service";
import Loader from "@/components/common/Loader";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function DashboardOverview() {
  const { user, isAdmin, isTeacher, isStudent } = useAuth();

  const { data: studentsData, isLoading: studentsLoading } = useQuery({
    queryKey: ["dashboard-students"],
    queryFn: () => getStudents({ pageSize: 1 }),
    enabled: !!user && (isAdmin || isTeacher),
  });

  const { data: teachersData, isLoading: teachersLoading } = useQuery({
    queryKey: ["dashboard-teachers"],
    queryFn: () => getTeachers({ pageSize: 1 }),
    enabled: !!user && isAdmin,
  });

  const { data: classes, isLoading: classesLoading } = useQuery({
    queryKey: ["dashboard-classes", user?.schoolId],
    queryFn: () => getClasses({ schoolId: user?.schoolId || "" }),
    enabled: !!user?.schoolId && (isAdmin || isTeacher),
  });

  const { data: currentYear } = useQuery({
    queryKey: ["current-academic-year", user?.schoolId],
    queryFn: () => getCurrentAcademicYear(user?.schoolId || ""),
    enabled: !!user?.schoolId,
  });

  const { data: totalFees } = useQuery({
    queryKey: ["total-fees-collected", user?.schoolId],
    queryFn: () => {
      const currentMonth = new Date();
      const startDate = new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth(),
        1
      )
        .toISOString()
        .split("T")[0];
      const endDate = new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth() + 1,
        0
      )
        .toISOString()
        .split("T")[0];
      return calculateTotalFeesCollected(
        user?.schoolId || "",
        startDate,
        endDate
      );
    },
    enabled: !!user?.schoolId && isAdmin,
  });

  if (studentsLoading || teachersLoading || classesLoading) {
    return (
      <div className="flex items-center justify-center h-[600px]">
        <Loader />
      </div>
    );
  }

  // Mock data for charts - in production, this would come from your API
  const enrollmentData = [
    { month: "Jan", students: 120, target: 150 },
    { month: "Feb", students: 145, target: 150 },
    { month: "Mar", students: 165, target: 170 },
    { month: "Apr", students: 180, target: 180 },
    { month: "May", students: 195, target: 200 },
    { month: "Jun", students: 210, target: 220 },
  ];

  const attendanceData = [
    { day: "Mon", attendance: 92 },
    { day: "Tue", attendance: 88 },
    { day: "Wed", attendance: 95 },
    { day: "Thu", attendance: 90 },
    { day: "Fri", attendance: 85 },
  ];

  const classDistribution = [
    { name: "Primary", value: 40, color: "hsl(var(--chart-1))" },
    { name: "Middle", value: 30, color: "hsl(var(--chart-2))" },
    { name: "High", value: 20, color: "hsl(var(--chart-3))" },
    { name: "Senior", value: 10, color: "hsl(var(--chart-4))" },
  ];

  const feeCollectionData = [
    { month: "Jan", collected: 85000, pending: 15000 },
    { month: "Feb", collected: 92000, pending: 8000 },
    { month: "Mar", collected: 88000, pending: 12000 },
    { month: "Apr", collected: 95000, pending: 5000 },
    { month: "May", collected: 90000, pending: 10000 },
    { month: "Jun", collected: 98000, pending: 2000 },
  ];

  const chartConfig = {
    students: {
      label: "Students",
      color: "hsl(var(--chart-1))",
    },
    target: {
      label: "Target",
      color: "hsl(var(--chart-2))",
    },
    attendance: {
      label: "Attendance %",
      color: "hsl(var(--chart-3))",
    },
    collected: {
      label: "Collected",
      color: "hsl(var(--chart-4))",
    },
    pending: {
      label: "Pending",
      color: "hsl(var(--chart-5))",
    },
  } satisfies ChartConfig;

  const getDashboardContent = () => {
    if (isAdmin) {
      return (
        <>
          {/* Key Metrics */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="border-l-4 border-l-blue-500">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Students
                </CardTitle>
                <div className="rounded-full bg-blue-500/10 p-2">
                  <Users className="h-4 w-4 text-blue-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {studentsData?.total || 0}
                </div>
                <div className="flex items-center text-xs text-muted-foreground">
                  <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
                  <span className="text-green-500">+12%</span>
                  <span className="ml-1">from last month</span>
                </div>
              </CardContent>
            </Card>
            <Card className="border-l-4 border-l-purple-500">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Teaching Staff
                </CardTitle>
                <div className="rounded-full bg-purple-500/10 p-2">
                  <GraduationCap className="h-4 w-4 text-purple-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {teachersData?.total || 0}
                </div>
                <div className="flex items-center text-xs text-muted-foreground">
                  <Activity className="mr-1 h-3 w-3 text-green-500" />
                  <span>Student-Teacher Ratio: 15:1</span>
                </div>
              </CardContent>
            </Card>
            <Card className="border-l-4 border-l-green-500">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Active Classes
                </CardTitle>
                <div className="rounded-full bg-green-500/10 p-2">
                  <School className="h-4 w-4 text-green-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{classes?.length || 0}</div>
                <div className="flex items-center text-xs text-muted-foreground">
                  <Users className="mr-1 h-3 w-3" />
                  <span>Avg. 25 students per class</span>
                </div>
              </CardContent>
            </Card>
            <Card className="border-l-4 border-l-orange-500">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Monthly Revenue
                </CardTitle>
                <div className="rounded-full bg-orange-500/10 p-2">
                  <DollarSign className="h-4 w-4 text-orange-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ₹{(totalFees || 0).toLocaleString()}
                </div>
                <div className="flex items-center text-xs text-muted-foreground">
                  <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
                  <span className="text-green-500">+8%</span>
                  <span className="ml-1">collection rate: 92%</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts Row */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            {/* Enrollment Trend Chart */}
            <Card className="col-span-4">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Enrollment Overview</CardTitle>
                    <CardDescription>
                      Student enrollment vs target for current session
                    </CardDescription>
                  </div>
                  <Badge variant="secondary">Live</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-[300px]">
                  <AreaChart data={enrollmentData}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      className="stroke-muted"
                    />
                    <XAxis
                      dataKey="month"
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                    />
                    <YAxis
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                    />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Area
                      type="monotone"
                      dataKey="target"
                      stroke="hsl(var(--chart-2))"
                      fill="hsl(var(--chart-2))"
                      fillOpacity={0.2}
                      strokeWidth={2}
                    />
                    <Area
                      type="monotone"
                      dataKey="students"
                      stroke="hsl(var(--chart-1))"
                      fill="hsl(var(--chart-1))"
                      fillOpacity={0.6}
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Performance Snapshot</CardTitle>
                <CardDescription>Key metrics at a glance</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <UserCheck className="h-4 w-4 text-blue-500" />
                      <span className="text-sm font-medium">
                        Attendance Rate
                      </span>
                    </div>
                    <span className="text-sm font-bold">89.5%</span>
                  </div>
                  <Progress value={89.5} className="h-2" />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Award className="h-4 w-4 text-green-500" />
                      <span className="text-sm font-medium">Pass Rate</span>
                    </div>
                    <span className="text-sm font-bold">94.2%</span>
                  </div>
                  <Progress value={94.2} className="h-2" />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <CreditCard className="h-4 w-4 text-orange-500" />
                      <span className="text-sm font-medium">
                        Fee Collection
                      </span>
                    </div>
                    <span className="text-sm font-bold">92%</span>
                  </div>
                  <Progress value={92} className="h-2" />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Activity className="h-4 w-4 text-purple-500" />
                      <span className="text-sm font-medium">
                        Staff Utilization
                      </span>
                    </div>
                    <span className="text-sm font-bold">87%</span>
                  </div>
                  <Progress value={87} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Second Row - Analytics */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {/* Attendance Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Weekly Attendance</CardTitle>
                <CardDescription>Average attendance by day</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-[200px]">
                  <BarChart data={attendanceData}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      className="stroke-muted"
                    />
                    <XAxis
                      dataKey="day"
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                    />
                    <YAxis
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                    />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar
                      dataKey="attendance"
                      fill="hsl(var(--chart-3))"
                      radius={[8, 8, 0, 0]}
                    />
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Class Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Student Distribution</CardTitle>
                <CardDescription>By education level</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-[200px]">
                  <PieChart>
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Pie
                      data={classDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {classDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ChartContainer>
                <div className="mt-4 grid grid-cols-2 gap-2">
                  {classDistribution.map((item, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div
                        className="h-3 w-3 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-xs">
                        {item.name}: {item.value}%
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Fee Collection */}
            <Card>
              <CardHeader>
                <CardTitle>Fee Collection Status</CardTitle>
                <CardDescription>Monthly collection overview</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-[200px]">
                  <BarChart data={feeCollectionData}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      className="stroke-muted"
                    />
                    <XAxis
                      dataKey="month"
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                    />
                    <YAxis
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                    />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar
                      dataKey="collected"
                      fill="hsl(var(--chart-4))"
                      stackId="a"
                    />
                    <Bar
                      dataKey="pending"
                      fill="hsl(var(--chart-5))"
                      stackId="a"
                    />
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>

          {/* Third Row - Quick Actions and Activities */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Frequently used features</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    className="h-auto flex-col gap-2 p-4"
                  >
                    <UserCheck className="h-5 w-5" />
                    <span className="text-xs">Attendance</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-auto flex-col gap-2 p-4"
                  >
                    <Calendar className="h-5 w-5" />
                    <span className="text-xs">Schedule</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-auto flex-col gap-2 p-4"
                  >
                    <Users className="h-5 w-5" />
                    <span className="text-xs">Add Student</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-auto flex-col gap-2 p-4"
                  >
                    <Bell className="h-5 w-5" />
                    <span className="text-xs">Notice</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-auto flex-col gap-2 p-4"
                  >
                    <FileText className="h-5 w-5" />
                    <span className="text-xs">Reports</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-auto flex-col gap-2 p-4"
                  >
                    <CreditCard className="h-5 w-5" />
                    <span className="text-xs">Fees</span>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activities */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activities</CardTitle>
                <CardDescription>Latest system events</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="rounded-full bg-green-500/10 p-2 mt-0.5">
                      <Users className="h-3 w-3 text-green-500" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">
                        New Student Enrolled
                      </p>
                      <p className="text-xs text-muted-foreground">
                        John Doe - Class 10A
                      </p>
                      <p className="text-xs text-muted-foreground">
                        2 minutes ago
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="rounded-full bg-blue-500/10 p-2 mt-0.5">
                      <CreditCard className="h-3 w-3 text-blue-500" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">
                        Fee Payment Received
                      </p>
                      <p className="text-xs text-muted-foreground">
                        ₹15,000 - Sarah Johnson
                      </p>
                      <p className="text-xs text-muted-foreground">
                        15 minutes ago
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="rounded-full bg-purple-500/10 p-2 mt-0.5">
                      <GraduationCap className="h-3 w-3 text-purple-500" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">New Teacher Joined</p>
                      <p className="text-xs text-muted-foreground">
                        Ms. Emily Chen - Mathematics
                      </p>
                      <p className="text-xs text-muted-foreground">
                        1 hour ago
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Academic Info */}
            <Card>
              <CardHeader>
                <CardTitle>Academic Session</CardTitle>
                <CardDescription>
                  {currentYear?.name || "2024-2025"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Progress
                    </span>
                    <span className="text-sm font-medium">65%</span>
                  </div>
                  <Progress value={65} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Term</span>
                    <Badge>2nd Term</Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Working Days</span>
                    <span className="font-medium">142/220</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Holidays Left</span>
                    <span className="font-medium">18</span>
                  </div>
                </div>
                <div className="pt-2">
                  <Button className="w-full" variant="outline" size="sm">
                    <Calendar className="mr-2 h-4 w-4" />
                    View Academic Calendar
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      );
    }

    if (isTeacher) {
      return (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  My Classes
                </CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">5</div>
                <p className="text-xs text-muted-foreground">
                  Classes assigned
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Students
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">150</div>
                <p className="text-xs text-muted-foreground">In my classes</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Pending Tasks
                </CardTitle>
                <AlertCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">8</div>
                <p className="text-xs text-muted-foreground">
                  Assignments to grade
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Today&apos;s Classes
                </CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">4</div>
                <p className="text-xs text-muted-foreground">Scheduled today</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Today&apos;s Schedule</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="p-2 border rounded">
                    <p className="font-medium">9:00 AM - Mathematics</p>
                    <p className="text-sm text-muted-foreground">Class 10-A</p>
                  </div>
                  <div className="p-2 border rounded">
                    <p className="font-medium">10:00 AM - Science</p>
                    <p className="text-sm text-muted-foreground">Class 9-B</p>
                  </div>
                  <div className="p-2 border rounded">
                    <p className="font-medium">2:00 PM - Mathematics</p>
                    <p className="text-sm text-muted-foreground">Class 10-B</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <button className="w-full text-left p-2 hover:bg-accent rounded-md flex items-center space-x-2">
                  <UserCheck className="h-4 w-4" />
                  <span>Mark Attendance</span>
                </button>
                <button className="w-full text-left p-2 hover:bg-accent rounded-md flex items-center space-x-2">
                  <BookOpen className="h-4 w-4" />
                  <span>Create Assignment</span>
                </button>
                <button className="w-full text-left p-2 hover:bg-accent rounded-md flex items-center space-x-2">
                  <TrendingUp className="h-4 w-4" />
                  <span>Enter Marks</span>
                </button>
              </CardContent>
            </Card>
          </div>
        </>
      );
    }

    if (isStudent) {
      return (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Attendance
                </CardTitle>
                <UserCheck className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">92%</div>
                <p className="text-xs text-muted-foreground">This month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Assignments
                </CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">3</div>
                <p className="text-xs text-muted-foreground">
                  Pending submission
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Next Exam</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">5</div>
                <p className="text-xs text-muted-foreground">Days remaining</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Fees Due</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">₹0</div>
                <p className="text-xs text-muted-foreground">All paid</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Today&apos;s Classes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="p-2 border rounded">
                    <p className="font-medium">9:00 AM - Mathematics</p>
                    <p className="text-sm text-muted-foreground">Room 201</p>
                  </div>
                  <div className="p-2 border rounded">
                    <p className="font-medium">10:00 AM - Science</p>
                    <p className="text-sm text-muted-foreground">Lab 1</p>
                  </div>
                  <div className="p-2 border rounded">
                    <p className="font-medium">11:00 AM - English</p>
                    <p className="text-sm text-muted-foreground">Room 105</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Recent Grades</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span>Mathematics - Unit Test 1</span>
                    <span className="font-bold">85/100</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Science - Practical</span>
                    <span className="font-bold">92/100</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>English - Essay</span>
                    <span className="font-bold">88/100</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      );
    }

    return null;
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            Welcome back, {user?.name}! 👋
          </h2>
          <p className="text-muted-foreground">
            Here&apos;s your school&apos;s performance overview for today
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
          <Button size="sm">
            <Bell className="mr-2 h-4 w-4" />
            View Notifications
          </Button>
        </div>
      </div>

      {getDashboardContent()}
    </div>
  );
}
