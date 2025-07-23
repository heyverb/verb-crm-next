import { Button } from "@/components/ui/button";
import { ExternalLinkIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

const TableRightSideComponent = () => {
  const router = useRouter();
  return (
    <Button
      variant={"secondary"}
      onClick={() => router.replace("/dashboard/admissions/applications")}
    >
      <ExternalLinkIcon />
      View all
    </Button>
  );
};

export default TableRightSideComponent;
