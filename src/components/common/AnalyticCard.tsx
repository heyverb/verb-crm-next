import React, { FC } from "react";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Badge } from "../ui/badge";
import { TrendingDownIcon, TrendingUpIcon } from "lucide-react";

type AnalyticCardProps = {
  title: string;
  isUpDown?: boolean;
  description?: string;
  subDescription?: string;
  value?: string;
  percentage?: string;
};
const AnalyticCard: FC<AnalyticCardProps> = ({
  title,
  isUpDown,
  description,
  subDescription,
  value,
  percentage,
}) => {
  return (
    <Card className="@container/card">
      <CardHeader className="relative">
        <CardDescription>{title}</CardDescription>
        <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
          {value}
        </CardTitle>
        <div className="absolute right-4 top-4">
          <Badge variant="outline" className="flex gap-1 rounded-lg text-xs">
            {isUpDown ? (
              <TrendingUpIcon className="size-3 text-green-500" />
            ) : (
              <TrendingDownIcon className="size-3 text-red-500" />
            )}
            {isUpDown ? "+" : "-"}
            {percentage}
          </Badge>
        </div>
      </CardHeader>
      <CardFooter className="flex-col items-start gap-1 text-sm">
        {description && (
          <div className="line-clamp-1 flex gap-2 font-medium">
            {description}{" "}
            {isUpDown ? (
              <TrendingUpIcon className="size-4 text-green-500" />
            ) : (
              <TrendingDownIcon className="size-4 text-red-500" />
            )}
          </div>
        )}

        {subDescription && (
          <div className="text-muted-foreground">{subDescription}</div>
        )}
      </CardFooter>
    </Card>
  );
};

export default AnalyticCard;
