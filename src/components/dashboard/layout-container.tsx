"use client";
import React from "react";
import Loader from "../common/Loader";

interface LayoutContainerProps {
  children: React.ReactNode;
  loading?: boolean;
  errorMessage?: string | null;
}

const LayoutContainer: React.FC<LayoutContainerProps> = ({
  loading,
  children,
  errorMessage,
}) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader />
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-red-500">{errorMessage}</p>
      </div>
    );
  }

  return <div>{children}</div>;
};

export default LayoutContainer;
