import React, { FC } from "react";
import { Badge } from "../ui/badge";
import { Ban, CheckCircle2Icon, LoaderIcon } from "lucide-react";
import { AdmissionStatusEnum } from "@/appwrite/interface/admission.interface";
import { cn } from "@/lib/utils";

type StatusCellProps = { status: string; message?: boolean };

const StatusCellTextMap: {
  [key: string]: string;
} = {
  [AdmissionStatusEnum.ACCEPTED]: "Accepted",
  [AdmissionStatusEnum.REJECTED]: "Rejected",
  [AdmissionStatusEnum.PENDING]: "Pending",
};

const StatusCellIconMap: {
  [key: string]: React.ReactNode;
} = {
  [AdmissionStatusEnum.ACCEPTED]: (
    <CheckCircle2Icon className="text-green-500 dark:text-green-400" />
  ),
  [AdmissionStatusEnum.REJECTED]: (
    <Ban className="text-red-500 dark:text-red-400" />
  ),
  [AdmissionStatusEnum.PENDING]: (
    <LoaderIcon className="text-amber-500 dark:text-amber-400" />
  ),
};

const StatusCellMessageMap: {
  [key: string]: string;
} = {
  [AdmissionStatusEnum.ACCEPTED]: "Admission has been approved",
  [AdmissionStatusEnum.REJECTED]: "Admission has been rejected",
  [AdmissionStatusEnum.PENDING]: "Admission is under review",
};

const StatusCell: FC<StatusCellProps> = ({ status, message }) => {
  return (
    <Badge
      variant="outline"
      className={cn("flex gap-1 px-1.5 text-muted-foreground [&_svg]:size-3")}
    >
      {StatusCellIconMap[status] || (
        <LoaderIcon className="text-muted-foreground" />
      )}
      {message ? StatusCellMessageMap[status] : StatusCellTextMap[status]}
    </Badge>
  );
};

export default StatusCell;
