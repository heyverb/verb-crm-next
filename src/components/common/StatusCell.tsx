import React, { FC } from "react";
import { Badge } from "../ui/badge";
import { Ban, CheckCircle2Icon, LoaderIcon } from "lucide-react";
import { StatusEnum } from "@/appwrite/interface/admission.interface";

type StatusCellProps = { status: string };
const StatusCellTextMap: {
  [key: string]: string;
} = {
  [StatusEnum.Accepted]: "Accepted",
  [StatusEnum.Rejected]: "Rejected",
  [StatusEnum.Pending]: "Pending",
};
const StatusCellIconMap: {
  [key: string]: React.ReactNode;
} = {
  [StatusEnum.Accepted]: (
    <CheckCircle2Icon className="text-green-500 dark:text-green-400" />
  ),
  [StatusEnum.Rejected]: <Ban className="text-red-500 dark:text-red-400" />,
  [StatusEnum.Pending]: (
    <LoaderIcon className="text-amber-500 dark:text-amber-400" />
  ),
};

const StatusCell: FC<StatusCellProps> = ({ status }) => {
  return (
    <Badge
      variant="outline"
      className="flex gap-1 px-1.5 text-muted-foreground [&_svg]:size-3"
    >
      {StatusCellIconMap[status] || (
        <LoaderIcon className="text-muted-foreground" />
      )}
      {StatusCellTextMap[status] || status}
    </Badge>
  );
};

export default StatusCell;
