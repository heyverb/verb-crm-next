import { cn } from "@/lib/utils";
import { LoaderCircle } from "lucide-react";
import React, { FC } from "react";

interface LoaderProps {
  size?: number;
  className?: string;
}
const Loader: FC<LoaderProps> = ({ size = 30, className }) => {
  return <LoaderCircle size={size} className={cn(className, "animate-spin")} />;
};

export default Loader;
