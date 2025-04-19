import Link from "next/link";
import React, { FC } from "react";
import { Button } from "../ui/button";
import { capitalizeEnum, cn } from "@/lib/utils";
import { ExternalLink } from "lucide-react";

interface LinkButtonProps {
  href: string;
  name: string;
  target?: React.HTMLAttributeAnchorTarget;
  className?: React.HTMLAttributes<HTMLButtonElement>["className"];
}
const LinkButton: FC<LinkButtonProps> = ({ href, name, target, className }) => {
  return (
    <Link href={href} target={target} className={cn("w-full", className)}>
      <Button variant="link" type="button">
        {capitalizeEnum(name)}
        <ExternalLink />
      </Button>
    </Link>
  );
};

export default LinkButton;
