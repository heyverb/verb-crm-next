"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, Eye, Edit, Trash } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { StudentInterface } from "@/appwrite/services/student.new.service";
import { StudentStatus } from "@/appwrite/interface/student.interface";
import { format } from "date-fns";

export const studentColumns: ColumnDef<StudentInterface>[] = [
  {
    accessorKey: "admissionNumber",
    header: "Admission No.",
  },
  {
    accessorKey: "rollNumber",
    header: "Roll No.",
  },
  {
    id: "name",
    header: "Student Name",
    cell: ({ row }) => {
      // You'll need to fetch user data or join it
      return <span>Student Name</span>;
    },
  },
  {
    accessorKey: "currentClassId",
    header: "Class",
    cell: ({ row }) => {
      // You'll need to fetch class data or join it
      return <span>Class Name</span>;
    },
  },
  {
    accessorKey: "parentName",
    header: "Parent Name",
  },
  {
    accessorKey: "parentPhone",
    header: "Contact",
  },
  {
    accessorKey: "admissionDate",
    header: "Admission Date",
    cell: ({ row }) => {
      return format(new Date(row.getValue("admissionDate")), "dd MMM yyyy");
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as StudentStatus;
      const variant = 
        status === StudentStatus.ACTIVE ? "default" :
        status === StudentStatus.INACTIVE ? "secondary" :
        status === StudentStatus.GRADUATED ? "outline" :
        "destructive";
      
      return <Badge variant={variant}>{status}</Badge>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const student = row.original;

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
              onClick={() => navigator.clipboard.writeText(student.admissionNumber)}
            >
              Copy admission number
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Eye className="mr-2 h-4 w-4" />
              View details
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem className="text-destructive">
              <Trash className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];