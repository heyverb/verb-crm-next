"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MoreHorizontal,
  Phone,
  Mail,
  Calendar,
  Eye,
  UserPlus,
  MessageSquare,
} from "lucide-react";
import { format } from "date-fns";
import { EnquiryModel } from "@/appwrite/schema/enquiry.schema";
import {
  EnquiryStatusEnum,
  EnquiryPriorityEnum,
} from "@/appwrite/interface/enquiry.interface";

export const columns: ColumnDef<EnquiryModel>[] = [
  {
    accessorKey: "student_fname",
    header: "Student Name",
    cell: ({ row }) => {
      const fname = row.original.student_fname;
      const lname = row.original.student_lname;
      return (
        <div className="font-medium">
          {fname} {lname}
        </div>
      );
    },
  },
  {
    accessorKey: "interested_class",
    header: "Class",
    cell: ({ row }) => {
      return <div className="text-sm">{row.getValue("interested_class")}</div>;
    },
  },
  {
    accessorKey: "guardian_name",
    header: "Guardian",
    cell: ({ row }) => {
      const name = row.getValue("guardian_name");
      const phone = row.original.guardian_phone;
      return (
        <div>
          <div className="font-medium">{name}</div>
          <div className="text-sm text-muted-foreground flex items-center gap-1">
            <Phone className="h-3 w-3" />
            {phone}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "source",
    header: "Source",
    cell: ({ row }) => {
      const source = row.getValue("source") as string;
      const sourceMap: Record<string, { label: string; variant: "default" | "secondary" | "outline" }> = {
        WEBSITE: { label: "Website", variant: "default" },
        WALK_IN: { label: "Walk In", variant: "secondary" },
        PHONE_CALL: { label: "Phone", variant: "outline" },
        REFERRAL: { label: "Referral", variant: "default" },
        ADVERTISEMENT: { label: "Ad", variant: "secondary" },
        SOCIAL_MEDIA: { label: "Social", variant: "outline" },
        OTHER: { label: "Other", variant: "secondary" },
      };
      const config = sourceMap[source] || { label: source, variant: "default" as const };
      return <Badge variant={config.variant}>{config.label}</Badge>;
    },
  },
  {
    accessorKey: "priority",
    header: "Priority",
    cell: ({ row }) => {
      const priority = row.getValue("priority") as EnquiryPriorityEnum;
      const priorityMap = {
        [EnquiryPriorityEnum.Urgent]: { label: "Urgent", className: "bg-red-500 text-white hover:bg-red-600" },
        [EnquiryPriorityEnum.High]: { label: "High", className: "bg-orange-500 text-white hover:bg-orange-600" },
        [EnquiryPriorityEnum.Medium]: { label: "Medium", className: "bg-yellow-500 text-white hover:bg-yellow-600" },
        [EnquiryPriorityEnum.Low]: { label: "Low", className: "bg-green-500 text-white hover:bg-green-600" },
      };
      const config = priorityMap[priority];
      return (
        <Badge className={config.className}>
          {config.label}
        </Badge>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as EnquiryStatusEnum;
      const statusMap = {
        [EnquiryStatusEnum.New]: { label: "New", variant: "default" as const },
        [EnquiryStatusEnum.Contacted]: { label: "Contacted", variant: "secondary" as const },
        [EnquiryStatusEnum.FollowUp]: { label: "Follow Up", variant: "outline" as const },
        [EnquiryStatusEnum.Interested]: { label: "Interested", variant: "default" as const },
        [EnquiryStatusEnum.NotInterested]: { label: "Not Interested", variant: "destructive" as const },
        [EnquiryStatusEnum.Converted]: { label: "Converted", variant: "default" as const },
        [EnquiryStatusEnum.Closed]: { label: "Closed", variant: "secondary" as const },
      };
      const config = statusMap[status];
      return <Badge variant={config.variant}>{config.label}</Badge>;
    },
  },
  {
    accessorKey: "$createdAt",
    header: "Date",
    cell: ({ row }) => {
      const date = row.getValue("$createdAt") as string;
      return (
        <div className="text-sm text-muted-foreground">
          {format(new Date(date), "dd MMM yyyy")}
        </div>
      );
    },
  },
  {
    accessorKey: "follow_up_date",
    header: "Follow Up",
    cell: ({ row }) => {
      const date = row.getValue("follow_up_date") as string;
      if (!date) return <span className="text-muted-foreground">-</span>;
      return (
        <div className="flex items-center gap-1 text-sm">
          <Calendar className="h-3 w-3" />
          {format(new Date(date), "dd MMM")}
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const enquiry = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => {
                // TODO: View enquiry details
                console.log("View enquiry:", enquiry.$id);
              }}
            >
              <Eye className="mr-2 h-4 w-4" />
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                // TODO: Add follow up
                console.log("Add follow up:", enquiry.$id);
              }}
            >
              <MessageSquare className="mr-2 h-4 w-4" />
              Add Follow Up
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                window.location.href = `tel:${enquiry.guardian_phone}`;
              }}
            >
              <Phone className="mr-2 h-4 w-4" />
              Call Guardian
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                window.location.href = `mailto:${enquiry.guardian_email}`;
              }}
            >
              <Mail className="mr-2 h-4 w-4" />
              Email Guardian
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                // TODO: Convert to admission
                console.log("Convert to admission:", enquiry.$id);
              }}
              className="text-green-600"
            >
              <UserPlus className="mr-2 h-4 w-4" />
              Convert to Admission
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];