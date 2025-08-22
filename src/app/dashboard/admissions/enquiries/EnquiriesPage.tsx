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
  UserPlus,
  Search,
  Filter,
  Download,
  Phone,
  Mail,
  Users,
  TrendingUp,
  Clock,
  CheckCircle,
} from "lucide-react";
import { DataTable } from "@/components/dashboard/data-table";
import { useAuth } from "@/hooks/useAuth";
import { GetEnquiries, GetEnquiryStats } from "@/appwrite/services/enquiry.service";
import {
  EnquiryStatusEnum,
  EnquiryPriorityEnum,
} from "@/appwrite/interface/enquiry.interface";
import { columns } from "./components/EnquiryTableColumns";
import { CreateEnquiryDialog } from "./components/CreateEnquiryDialog";
import Loader from "@/components/common/Loader";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const EnquiriesPage = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize] = useState(10);

  // Fetch enquiries
  const { data: enquiriesData, isLoading: enquiriesLoading } = useQuery({
    queryKey: ["enquiries", user?.schoolId, pageIndex, pageSize, statusFilter, priorityFilter, searchTerm],
    queryFn: () => GetEnquiries({
      schoolId: user?.schoolId,
      pageIndex,
      pageSize,
      status: statusFilter !== "all" ? statusFilter as EnquiryStatusEnum : undefined,
      priority: priorityFilter !== "all" ? priorityFilter as EnquiryPriorityEnum : undefined,
      searchTerm: searchTerm || undefined,
    }),
    enabled: !!user?.schoolId,
  });

  // Fetch enquiry stats
  const { data: enquiryStats, isLoading: statsLoading } = useQuery({
    queryKey: ["enquiry-stats", user?.schoolId],
    queryFn: () => GetEnquiryStats(user?.schoolId),
    enabled: !!user?.schoolId,
  });

  // Calculate metrics
  const metrics = useMemo(() => {
    if (!enquiryStats) return null;

    const followUpRate = enquiryStats.total > 0
      ? ((enquiryStats.byStatus.followUp + enquiryStats.byStatus.contacted) / enquiryStats.total) * 100
      : 0;

    const conversionRate = enquiryStats.total > 0
      ? (enquiryStats.byStatus.converted / enquiryStats.total) * 100
      : 0;

    return {
      total: enquiryStats.total,
      new: enquiryStats.byStatus.new,
      followUpRate: followUpRate.toFixed(1),
      conversionRate: conversionRate.toFixed(1),
    };
  }, [enquiryStats]);

  if (enquiriesLoading || statsLoading) {
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
          <h2 className="text-3xl font-bold tracking-tight">Enquiries</h2>
          <p className="text-muted-foreground">
            Manage and track admission enquiries
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button onClick={() => setCreateDialogOpen(true)}>
            <UserPlus className="mr-2 h-4 w-4" />
            New Enquiry
          </Button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Enquiries</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics?.total || 0}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500">+{metrics?.new || 0}</span> new this week
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Follow-up Rate</CardTitle>
            <Phone className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics?.followUpRate || 0}%</div>
            <Progress value={Number(metrics?.followUpRate || 0)} className="mt-2" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics?.conversionRate || 0}%</div>
            <Progress value={Number(metrics?.conversionRate || 0)} className="mt-2" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Follow-ups</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{enquiryStats?.byStatus.followUp || 0}</div>
            <p className="text-xs text-muted-foreground">
              Requires immediate attention
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>Enquiry List</CardTitle>
          <CardDescription>View and manage all admission enquiries</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
            <div className="flex flex-1 items-center space-x-2">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, phone, email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value={EnquiryStatusEnum.New}>New</SelectItem>
                  <SelectItem value={EnquiryStatusEnum.Contacted}>Contacted</SelectItem>
                  <SelectItem value={EnquiryStatusEnum.FollowUp}>Follow Up</SelectItem>
                  <SelectItem value={EnquiryStatusEnum.Interested}>Interested</SelectItem>
                  <SelectItem value={EnquiryStatusEnum.NotInterested}>Not Interested</SelectItem>
                  <SelectItem value={EnquiryStatusEnum.Converted}>Converted</SelectItem>
                  <SelectItem value={EnquiryStatusEnum.Closed}>Closed</SelectItem>
                </SelectContent>
              </Select>
              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priority</SelectItem>
                  <SelectItem value={EnquiryPriorityEnum.Low}>Low</SelectItem>
                  <SelectItem value={EnquiryPriorityEnum.Medium}>Medium</SelectItem>
                  <SelectItem value={EnquiryPriorityEnum.High}>High</SelectItem>
                  <SelectItem value={EnquiryPriorityEnum.Urgent}>Urgent</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Priority Summary */}
          {enquiryStats && (
            <div className="mb-6 p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Priority Distribution</span>
                <Badge variant="secondary">{enquiryStats.total} Total</Badge>
              </div>
              <div className="grid grid-cols-4 gap-2">
                <div className="flex items-center justify-between p-2 bg-green-500/10 rounded">
                  <span className="text-xs">Low</span>
                  <span className="text-xs font-medium">{enquiryStats.byPriority.low}</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-yellow-500/10 rounded">
                  <span className="text-xs">Medium</span>
                  <span className="text-xs font-medium">{enquiryStats.byPriority.medium}</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-orange-500/10 rounded">
                  <span className="text-xs">High</span>
                  <span className="text-xs font-medium">{enquiryStats.byPriority.high}</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-red-500/10 rounded">
                  <span className="text-xs">Urgent</span>
                  <span className="text-xs font-medium">{enquiryStats.byPriority.urgent}</span>
                </div>
              </div>
            </div>
          )}

          {/* Data Table */}
          <DataTable
            columns={columns}
            data={enquiriesData?.enquiries || []}
            showDataStatusTab={false}
            showPagination={true}
            paginationData={{ pageIndex, pageSize }}
            setPaginationData={({ pageIndex: newPageIndex }) => {
              if (newPageIndex !== undefined) setPageIndex(newPageIndex);
            }}
          />
        </CardContent>
      </Card>

      {/* Create Enquiry Dialog */}
      <CreateEnquiryDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
      />
    </div>
  );
};

export default EnquiriesPage;
