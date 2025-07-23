"use client";
import Loader from "@/components/common/Loader";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const Page = () => {
  const router = useRouter();
  const [Loading, setLoading] = useState(true);
  useEffect(() => {
    router.push("/dashboard/overview");
    return () => {
      setLoading(false);
    };
  }, []);

  if (Loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center">
        <Loader />
      </div>
    );
  }
};

export default Page;
