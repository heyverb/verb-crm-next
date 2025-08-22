"use client";

import React, { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Users,
  Search,
  Filter,
  Download,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  FileText,
  TrendingUp,
  Calendar,
  UserCheck,
  AlertCircle,
} from "lucide-react";
import { DataTable } from "@/components/dashboard/data-table";
import { useAuth } from "@/hooks/useAuth";
import { GetAdmissions } from "@/appwrite/services/admission.service";
import { AdmissionStatusEnum } from "@/appwrite/interface/admission.interface";
import { columns } from "../components/AdmissionTableColumns";
import Loader from "@/components/common/Loader";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Cell,
  ResponsiveContainer,
} from "recharts";
import { cn } from "@/lib/utils";

const ApplicationPage = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [classFilter, setClassFilter] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<string>("all");
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize] = useState(10);

  // Fetch admissions data
  const { data: admissionsData, isLoading } = useQuery({
    queryKey: ["applications", user?.schoolId, pageIndex, pageSize, statusFilter, classFilter, searchTerm],
    queryFn: () => GetAdmissions({
      pageIndex: pageIndex.toString(),
      pageSize: pageSize.toString(),
      // Add filters when API supports them
    }),
    enabled: !!user?.schoolId,
  });

  // Calculate statistics
  const stats = useMemo(() => {
    if (!admissionsData || admissionsData.length === 0) {
      return {
        total: 0,
        submitted: 0,
        pending: 0,
        accepted: 0,
        rejected: 0,
        processingRate: 0,
        acceptanceRate: 0,
        avgProcessingTime: 0,
        statusBreakdown: [],
        classDistribution: [],
        recentApplications: [],
      };
    }

    const statusCounts = {
      [AdmissionStatusEnum.SUBMITTED]: 0,
      [AdmissionStatusEnum.PENDING]: 0,
      [AdmissionStatusEnum.ACCEPTED]: 0,
      [AdmissionStatusEnum.REJECTED]: 0,
    };

    const classDistribution: Record<string, number> = {};

    admissionsData.forEach((admission: any) => {
      // Count by status
      if (statusCounts.hasOwnProperty(admission.status)) {
        statusCounts[admission.status as AdmissionStatusEnum]++;
      }

      // Count by class
      const className = admission.preferred_class || "Unknown";
      classDistribution[className] = (classDistribution[className] || 0) + 1;
    });

    const total = admissionsData.length;
    const processed = statusCounts[AdmissionStatusEnum.ACCEPTED] + statusCounts[AdmissionStatusEnum.REJECTED];
    const processingRate = total > 0 ? (processed / total) * 100 : 0;
    const acceptanceRate = processed > 0 
      ? (statusCounts[AdmissionStatusEnum.ACCEPTED] / processed) * 100 
      : 0;

    const statusBreakdown = Object.entries(statusCounts).map(([status, count]) => ({
      status,
      count,
      percentage: total > 0 ? (count / total) * 100 : 0,
    }));

    const classDistributionArray = Object.entries(classDistribution)
      .map(([className, count]) => ({
        class: className,
        count,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);

    return {
      total,
      submitted: statusCounts[AdmissionStatusEnum.SUBMITTED],
      pending: statusCounts[AdmissionStatusEnum.PENDING],
      accepted: statusCounts[AdmissionStatusEnum.ACCEPTED],
      rejected: statusCounts[AdmissionStatusEnum.REJECTED],
      processingRate: processingRate.toFixed(1),
      acceptanceRate: acceptanceRate.toFixed(1),
      avgProcessingTime: 3.5, // Mock data - replace with actual calculation
      statusBreakdown,
      classDistribution: classDistributionArray,
      recentApplications: admissionsData.slice(0, 5),
    };
  }, [admissionsData]);

  // Filter data based on search and filters
  const filteredData = useMemo(() => {
    if (!admissionsData) return [];

    let filtered = [...admissionsData];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter((item: any) => {
        const searchLower = searchTerm.toLowerCase();
        return (
          item.student_name?.toLowerCase().includes(searchLower) ||
          item.guardian_name?.toLowerCase().includes(searchLower) ||
          item.email?.toLowerCase().includes(searchLower) ||
          item.phone?.includes(searchTerm)
        );
      });
    }

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((item: any) => item.status === statusFilter);
    }

    // Apply class filter
    if (classFilter !== "all") {
      filtered = filtered.filter((item: any) => item.preferred_class === classFilter);
    }

    // Apply date filter
    if (dateFilter !== "all") {
      const now = new Date();
      const dateThreshold = new Date();
      
      switch (dateFilter) {
        case "today":
          dateThreshold.setHours(0, 0, 0, 0);
          break;
        case "week":
          dateThreshold.setDate(now.getDate() - 7);
          break;
        case "month":
          dateThreshold.setMonth(now.getMonth() - 1);
          break;
      }

      filtered = filtered.filter((item: any) => {
        const applicationDate = new Date(item.$createdAt);
        return applicationDate >= dateThreshold;
      });
    }

    return filtered.map((item: any) => ({
      ...item,
      id: item.$id,
    }));
  }, [admissionsData, searchTerm, statusFilter, classFilter, dateFilter]);

  const chartConfig = {
    count: {
      label: "Applications",
      color: "hsl(var(--chart-1))",
    },
  } satisfies ChartConfig;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[600px]">
        <Loader />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Applications</h2>
          <p className="text-muted-foreground">
            Review and manage admission applications
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
            <Users className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground mt-1">
              <TrendingUp className="inline h-3 w-3 text-green-500 mr-1" />
              <span className="text-green-500">+12%</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-yellow-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pending}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Avg. processing: {stats.avgProcessingTime} days
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Accepted</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.accepted}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats.acceptanceRate}% acceptance rate
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Processing Rate</CardTitle>
            <FileText className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.processingRate}%</div>
            <Progress value={Number(stats.processingRate)} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="applications" className="space-y-4">
        <TabsList className="grid w-full max-w-[400px] grid-cols-2">
          <TabsTrigger value="applications">Applications</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        {/* Applications Tab */}
        <TabsContent value="applications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Application List</CardTitle>
              <CardDescription>
                View and process all admission applications
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Filters */}
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
                <div className="flex flex-1 items-center space-x-2">
                  <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search by name, email, phone..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value={AdmissionStatusEnum.SUBMITTED}>Submitted</SelectItem>
                      <SelectItem value={AdmissionStatusEnum.PENDING}>Pending</SelectItem>
                      <SelectItem value={AdmissionStatusEnum.ACCEPTED}>Accepted</SelectItem>
                      <SelectItem value={AdmissionStatusEnum.REJECTED}>Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={classFilter} onValueChange={setClassFilter}>
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Class" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Classes</SelectItem>
                      <SelectItem value="Class 1">Class 1</SelectItem>
                      <SelectItem value="Class 2">Class 2</SelectItem>
                      <SelectItem value="Class 3">Class 3</SelectItem>
                      <SelectItem value="Class 4">Class 4</SelectItem>
                      <SelectItem value="Class 5">Class 5</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={dateFilter} onValueChange={setDateFilter}>
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Date Range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Time</SelectItem>
                      <SelectItem value="today">Today</SelectItem>
                      <SelectItem value="week">This Week</SelectItem>
                      <SelectItem value="month">This Month</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" size="icon">
                    <Filter className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Status Summary */}
              <div className="mb-6 p-4 bg-muted/50 rounded-lg">
                <div className="grid grid-cols-4 gap-4">
                  {stats.statusBreakdown.map((item) => {
                    const statusConfig = {
                      [AdmissionStatusEnum.SUBMITTED]: { 
                        label: "Submitted", 
                        color: "bg-blue-500",
                        icon: FileText,
                      },
                      [AdmissionStatusEnum.PENDING]: { 
                        label: "Pending", 
                        color: "bg-yellow-500",
                        icon: Clock,
                      },
                      [AdmissionStatusEnum.ACCEPTED]: { 
                        label: "Accepted", 
                        color: "bg-green-500",
                        icon: CheckCircle,
                      },
                      [AdmissionStatusEnum.REJECTED]: { 
                        label: "Rejected", 
                        color: "bg-red-500",
                        icon: XCircle,
                      },
                    };
                    const config = statusConfig[item.status as AdmissionStatusEnum];
                    const Icon = config?.icon || FileText;

                    return (
                      <div key={item.status} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Icon className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm font-medium">{config?.label}</span>
                          </div>
                          <span className="text-sm font-bold">{item.count}</span>
                        </div>
                        <Progress 
                          value={item.percentage} 
                          className="h-2"
                          indicatorClassName={cn(config?.color)}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Data Table */}
              <DataTable
                columns={columns}
                data={filteredData}
                showDataStatusTab={false}
                showPagination={true}
                paginationData={{ pageIndex, pageSize }}
                setPaginationData={({ pageIndex: newPageIndex }) => {
                  if (newPageIndex !== undefined) setPageIndex(newPageIndex);
                }}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Class Distribution Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Applications by Class</CardTitle>
                <CardDescription>
                  Distribution of applications across classes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-[300px]">
                  <BarChart data={stats.classDistribution}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis 
                      dataKey="class" 
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                    />
                    <YAxis 
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                    />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                      {stats.classDistribution.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={`hsl(var(--chart-${(index % 5) + 1}))`} 
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>
                  Common application management tasks
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-yellow-500/10 rounded-full">
                        <AlertCircle className="h-5 w-5 text-yellow-500" />
                      </div>
                      <div>
                        <p className="font-medium">Pending Reviews</p>
                        <p className="text-sm text-muted-foreground">
                          {stats.pending} applications need review
                        </p>
                      </div>
                    </div>
                    <Button size="sm">Review</Button>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-500/10 rounded-full">
                        <Calendar className="h-5 w-5 text-blue-500" />
                      </div>
                      <div>
                        <p className="font-medium">Schedule Interviews</p>
                        <p className="text-sm text-muted-foreground">
                          {stats.submitted} applications ready
                        </p>
                      </div>
                    </div>
                    <Button size="sm" variant="outline">Schedule</Button>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-500/10 rounded-full">
                        <UserCheck className="h-5 w-5 text-green-500" />
                      </div>
                      <div>
                        <p className="font-medium">Send Acceptance Letters</p>
                        <p className="text-sm text-muted-foreground">
                          {stats.accepted} students accepted
                        </p>
                      </div>
                    </div>
                    <Button size="sm" variant="outline">Send</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ApplicationPage;