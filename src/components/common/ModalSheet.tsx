import React, { FC } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "../ui/sheet";

interface ModalSheetProps {
  children: React.ReactNode;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
  footer?: React.ReactNode[];
}

const ModalSheet: FC<ModalSheetProps> = ({
  children,
  isOpen,
  onOpenChange,
  title,
  description,
  footer,
}) => {
  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="flex flex-col">
        <SheetHeader className="gap-1">
          <SheetTitle>{title}</SheetTitle>
          <SheetDescription>{description}</SheetDescription>
        </SheetHeader>
        <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-4 text-sm">
          {children}
        </div>
        {footer?.length && (
          <SheetFooter className="mt-auto flex gap-2 sm:flex-col sm:space-x-0">
            {footer?.map((item) => item)}
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default ModalSheet;
