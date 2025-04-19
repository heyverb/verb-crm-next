import React, { FC } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";

interface ModalSheetProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  trigger?: React.ReactNode;
  footer?: React.ReactNode[];
  open?: boolean;
}

const ModalSheetWithTrigger: FC<ModalSheetProps> = ({
  children,
  title,
  description,
  trigger,
  footer,
}) => {
  return (
    <Sheet>
      <SheetTrigger asChild>{trigger}</SheetTrigger>
      <SheetContent
        side="right"
        className="flex flex-col w-full sm:max-w-[600px]"
      >
        <SheetHeader className="gap-1 p-0 px-4 pt-4">
          <SheetTitle>{title}</SheetTitle>
          <SheetDescription>{description}</SheetDescription>
        </SheetHeader>

        <div className="flex flex-1 flex-col gap-4 overflow-y-auto px-4 text-sm">
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

export default ModalSheetWithTrigger;
