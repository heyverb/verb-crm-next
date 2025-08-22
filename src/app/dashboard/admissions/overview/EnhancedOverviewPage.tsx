"use client";

import React, { useMemo, useState } from "react";
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
  UserPlus,
  UserCheck,
  TrendingUp,
  CheckCircle,
  PhoneCall,
  Mail,
  Download,
  Filter,
} from "lucide-react";
import {
  Pie,
  PieChart,
  Cell,
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DataTable } from "@/components/dashboard/data-table";
import { useAuth } from "@/hooks/useAuth";
import { GetAdmissions } from "@/appwrite/services/admission.service";
import { GetEnquiryStats } from "@/appwrite/services/enquiry.service";
import { AdmissionStatusEnum } from "@/appwrite/interface/admission.interface";
import { columns } from "../components/AdmissionTableColumns";
import Loader from "@/components/common/Loader";

export default function EnhancedOverviewPage() {
  const { user } = useAuth();
  const [dateRange, setDateRange] = useState("7d");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");

  console.log("user", user);
  // Fetch admissions data
  const { data: admissionsData, isLoading: admissionsLoading } = useQuery({
    queryKey: ["admissions-overview", user?.$id],
    queryFn: () => GetAdmissions({ pageIndex: "0", pageSize: "100" }),
    enabled: !!user?.$id,
  });

  console.log("admissionsData", admissionsData);
  // Fetch enquiry stats
  const { data: enquiryStats, isLoading: enquiryLoading } = useQuery({
    queryKey: ["enquiry-stats", user?.$id],
    queryFn: () => GetEnquiryStats(user?.$id),
    enabled: !!user?.$id,
  });

  if (admissionsLoading || enquiryLoading) {
    return (
      <div className="flex items-center justify-center h-[600px]">
        <Loader />
      </div>
    );
  }

  // Process admissions data for statistics
  const admissionStats = useMemo(() => {
    if (!admissionsData) return null;

    const stats = {
      total: admissionsData.length,
      submitted: 0,
      pending: 0,
      accepted: 0,
      rejected: 0,
      conversionRate: 0,
      monthlyTrend: [] as any[],
      classDistribution: [] as any[],
    };

    // Count by status
    admissionsData.forEach((admission: any) => {
      switch (admission.status) {
        case AdmissionStatusEnum.SUBMITTED:
          stats.submitted++;
          break;
        case AdmissionStatusEnum.PENDING:
          stats.pending++;
          break;
        case AdmissionStatusEnum.ACCEPTED:
          stats.accepted++;
          break;
        case AdmissionStatusEnum.REJECTED:
          stats.rejected++;
          break;
      }
    });

    // Calculate conversion rate
    if (enquiryStats?.total) {
      stats.conversionRate = (stats.accepted / enquiryStats.total) * 100;
    }

    return stats;
  }, [admissionsData, enquiryStats]);

  // Mock data for charts - replace with real data processing
  const monthlyAdmissionData = [
    { month: "Jan", applications: 45, accepted: 38, rejected: 7 },
    { month: "Feb", applications: 52, accepted: 45, rejected: 7 },
    { month: "Mar", applications: 68, accepted: 58, rejected: 10 },
    { month: "Apr", applications: 75, accepted: 65, rejected: 10 },
    { month: "May", applications: 82, accepted: 70, rejected: 12 },
    { month: "Jun", applications: 90, accepted: 78, rejected: 12 },
  ];

  const enquirySourceData = enquiryStats?.bySource
    ? Object.entries(enquiryStats.bySource).map(([source, count]) => ({
        name: source.replace(/_/g, " "),
        value: count as number,
        color: getColorForSource(source),
      }))
    : [];

  const statusDistribution = [
    {
      name: "New",
      value: enquiryStats?.byStatus.new || 0,
      color: "hsl(var(--chart-1))",
    },
    {
      name: "Contacted",
      value: enquiryStats?.byStatus.contacted || 0,
      color: "hsl(var(--chart-2))",
    },
    {
      name: "Follow Up",
      value: enquiryStats?.byStatus.followUp || 0,
      color: "hsl(var(--chart-3))",
    },
    {
      name: "Converted",
      value: enquiryStats?.byStatus.converted || 0,
      color: "hsl(var(--chart-4))",
    },
  ];

  const chartConfig = {
    applications: {
      label: "Applications",
      color: "hsl(var(--chart-1))",
    },
    accepted: {
      label: "Accepted",
      color: "hsl(var(--chart-2))",
    },
    rejected: {
      label: "Rejected",
      color: "hsl(var(--chart-3))",
    },
  } satisfies ChartConfig;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            Admissions Overview
          </h2>
          <p className="text-muted-foreground">
            Monitor admission applications, enquiries, and conversion rates
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Enquiries
            </CardTitle>
            <div className="rounded-full bg-blue-500/10 p-2">
              <PhoneCall className="h-4 w-4 text-blue-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{enquiryStats?.total || 0}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
              <span className="text-green-500">+15%</span>
              <span className="ml-1">from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Applications</CardTitle>
            <div className="rounded-full bg-green-500/10 p-2">
              <Users className="h-4 w-4 text-green-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {admissionStats?.total || 0}
            </div>
            <div className="flex items-center text-xs text-muted-foreground">
              <span>{admissionStats?.pending || 0} pending review</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Accepted</CardTitle>
            <div className="rounded-full bg-purple-500/10 p-2">
              <UserCheck className="h-4 w-4 text-purple-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {admissionStats?.accepted || 0}
            </div>
            <div className="flex items-center text-xs text-muted-foreground">
              <CheckCircle className="mr-1 h-3 w-3 text-green-500" />
              <span>
                {(
                  ((admissionStats?.accepted || 0) /
                    (admissionStats?.total || 1)) *
                  100
                ).toFixed(1)}
                % acceptance rate
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Conversion Rate
            </CardTitle>
            <div className="rounded-full bg-orange-500/10 p-2">
              <TrendingUp className="h-4 w-4 text-orange-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {admissionStats?.conversionRate.toFixed(1)}%
            </div>
            <div className="flex items-center text-xs text-muted-foreground">
              <span>Enquiry to admission</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Monthly Admissions Trend */}
        <Card className="col-span-4">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Admission Trends</CardTitle>
                <CardDescription>
                  Monthly applications and acceptance rates
                </CardDescription>
              </div>
              <Badge variant="secondary">Live</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <AreaChart data={monthlyAdmissionData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis
                  dataKey="month"
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area
                  type="monotone"
                  dataKey="applications"
                  stroke="hsl(var(--chart-1))"
                  fill="hsl(var(--chart-1))"
                  fillOpacity={0.2}
                  strokeWidth={2}
                />
                <Area
                  type="monotone"
                  dataKey="accepted"
                  stroke="hsl(var(--chart-2))"
                  fill="hsl(var(--chart-2))"
                  fillOpacity={0.6}
                  strokeWidth={2}
                />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Enquiry Pipeline */}
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Enquiry Pipeline</CardTitle>
            <CardDescription>Current status distribution</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[250px]">
              <PieChart>
                <ChartTooltip content={<ChartTooltipContent />} />
                <Pie
                  data={statusDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {statusDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ChartContainer>
            <div className="mt-4 space-y-2">
              {statusDistribution.map((status, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: status.color }}
                    />
                    <span className="text-sm">{status.name}</span>
                  </div>
                  <span className="text-sm font-medium">{status.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Secondary Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Enquiry Sources */}
        <Card>
          <CardHeader>
            <CardTitle>Enquiry Sources</CardTitle>
            <CardDescription>Where enquiries come from</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {enquirySourceData.map((source, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div
                      className="h-2 w-2 rounded-full"
                      style={{ backgroundColor: source.color }}
                    />
                    <span className="text-sm">{source.name}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium">{source.value}</span>
                    <Progress
                      value={(source.value / (enquiryStats?.total || 1)) * 100}
                      className="w-20 h-2"
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Priority Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Priority Levels</CardTitle>
            <CardDescription>Enquiry priority breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Urgent</span>
                  <span className="text-sm font-medium">
                    {enquiryStats?.byPriority.urgent || 0}
                  </span>
                </div>
                <Progress
                  value={
                    ((enquiryStats?.byPriority.urgent || 0) /
                      (enquiryStats?.total || 1)) *
                    100
                  }
                  className="h-2 bg-red-200"
                >
                  <div
                    className="h-full bg-red-500 rounded-full"
                    style={{
                      width: `${
                        ((enquiryStats?.byPriority.urgent || 0) /
                          (enquiryStats?.total || 1)) *
                        100
                      }%`,
                    }}
                  />
                </Progress>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">High</span>
                  <span className="text-sm font-medium">
                    {enquiryStats?.byPriority.high || 0}
                  </span>
                </div>
                <Progress
                  value={
                    ((enquiryStats?.byPriority.high || 0) /
                      (enquiryStats?.total || 1)) *
                    100
                  }
                  className="h-2 bg-orange-200"
                >
                  <div
                    className="h-full bg-orange-500 rounded-full"
                    style={{
                      width: `${
                        ((enquiryStats?.byPriority.high || 0) /
                          (enquiryStats?.total || 1)) *
                        100
                      }%`,
                    }}
                  />
                </Progress>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Medium</span>
                  <span className="text-sm font-medium">
                    {enquiryStats?.byPriority.medium || 0}
                  </span>
                </div>
                <Progress
                  value={
                    ((enquiryStats?.byPriority.medium || 0) /
                      (enquiryStats?.total || 1)) *
                    100
                  }
                  className="h-2 bg-yellow-200"
                >
                  <div
                    className="h-full bg-yellow-500 rounded-full"
                    style={{
                      width: `${
                        ((enquiryStats?.byPriority.medium || 0) /
                          (enquiryStats?.total || 1)) *
                        100
                      }%`,
                    }}
                  />
                </Progress>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Low</span>
                  <span className="text-sm font-medium">
                    {enquiryStats?.byPriority.low || 0}
                  </span>
                </div>
                <Progress
                  value={
                    ((enquiryStats?.byPriority.low || 0) /
                      (enquiryStats?.total || 1)) *
                    100
                  }
                  className="h-2 bg-green-200"
                >
                  <div
                    className="h-full bg-green-500 rounded-full"
                    style={{
                      width: `${
                        ((enquiryStats?.byPriority.low || 0) /
                          (enquiryStats?.total || 1)) *
                        100
                      }%`,
                    }}
                  />
                </Progress>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common admission tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" className="h-auto flex-col gap-2 p-4">
                <UserPlus className="h-5 w-5" />
                <span className="text-xs">New Enquiry</span>
              </Button>
              <Button variant="outline" className="h-auto flex-col gap-2 p-4">
                <Users className="h-5 w-5" />
                <span className="text-xs">Applications</span>
              </Button>
              <Button variant="outline" className="h-auto flex-col gap-2 p-4">
                <PhoneCall className="h-5 w-5" />
                <span className="text-xs">Follow Up</span>
              </Button>
              <Button variant="outline" className="h-auto flex-col gap-2 p-4">
                <Mail className="h-5 w-5" />
                <span className="text-xs">Send Email</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Applications Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Recent Applications</CardTitle>
              <CardDescription>Latest admission applications</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="submitted">Submitted</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="accepted">Accepted</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm">
                <Filter className="mr-2 h-4 w-4" />
                More Filters
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={
              admissionsData?.slice(0, 5).map((item: any) => ({
                ...item,
                id: item.$id,
              })) || []
            }
            showDataStatusTab={false}
          />
        </CardContent>
      </Card>
    </div>
  );
}

function getColorForSource(source: string): string {
  const colors: Record<string, string> = {
    WEBSITE: "hsl(var(--chart-1))",
    WALK_IN: "hsl(var(--chart-2))",
    PHONE_CALL: "hsl(var(--chart-3))",
    REFERRAL: "hsl(var(--chart-4))",
    ADVERTISEMENT: "hsl(var(--chart-5))",
    SOCIAL_MEDIA: "#8b5cf6",
    OTHER: "#6b7280",
  };
  return colors[source] || "#6b7280";
}
