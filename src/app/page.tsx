/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { getAccount } from "@/appwrite/services/user.service";
import Loader from "@/components/common/Loader";
import useApi from "@/hooks/useApi";
import { useAppDispatch, useAppSelector } from "@/hooks/useRedux";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { saveSchool, saveUser } from "./redux/action";
import { GetSchoolByUserId } from "@/appwrite/services/schools.service";

const Page = () => {
  const route = useRouter();
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(true);
  const { mutation, isLoading } = useApi(getAccount);
  const { mutation: schoolMutation, isLoading: schoolLoading } =
    useApi(GetSchoolByUserId);

  const { user } = useAppSelector((state) => state.globalReducer);

  console.log(user);

  const validateUser = useCallback(async () => {
    try {
      const account = await mutation.mutateAsync({});
      const schoolRes = await schoolMutation.mutateAsync({
        id: account.db.documents[0].$id,
      });
      dispatch(saveSchool(schoolRes));
      dispatch(saveUser(account));
      setLoading(false);
      route.replace("/dashboard/overview");
    } catch {
      route.replace("/auth/login");
    }
  }, []);

  useEffect(() => {
    if (user) {
      route.replace("/dashboard/overview");
      setLoading(false);
    } else {
      validateUser();
    }
  }, []);

  if (isLoading || loading || schoolLoading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center">
        <Loader />
      </div>
    );
  }
  return null;
};

export default Page;
