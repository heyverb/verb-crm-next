import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser, logoutUser } from "@/appwrite/services/user.service";
import { UserInterface } from "@/appwrite/services/user.service";
import { UserRole } from "@/appwrite/interface/user.interface";

interface UseAuthReturn {
  user: UserInterface | null;
  loading: boolean;
  error: string | null;
  logout: () => Promise<void>;
  hasRole: (roles: UserRole[]) => boolean;
  isAdmin: boolean;
  isTeacher: boolean;
  isStudent: boolean;
  isParent: boolean;
}

export const useAuth = (): UseAuthReturn => {
  const [user, setUser] = useState<UserInterface | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const currentUser = await getCurrentUser();
        if (currentUser) {
          setUser(currentUser);
        } else {
          router.push("/auth/login");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch user");
        router.push("/auth/login");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [router]);

  const logout = async () => {
    try {
      await logoutUser();
      setUser(null);
      router.push("/auth/login");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to logout");
    }
  };

  const hasRole = (roles: UserRole[]): boolean => {
    if (!user) return false;
    return roles.includes(user.role as UserRole);
  };

  console.log(user);
  const isAdmin = user?.role === UserRole.ADMIN;
  const isTeacher = user?.role === UserRole.TEACHER;
  const isStudent = user?.role === UserRole.STUDENT;
  const isParent = user?.role === UserRole.PARENT;

  return {
    user,
    loading,
    error,
    logout,
    hasRole,
    isAdmin,
    isTeacher,
    isStudent,
    isParent,
  };
};

export const useRequireAuth = (requiredRoles?: UserRole[]) => {
  const { user, loading, hasRole } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/auth/login");
      } else if (requiredRoles && !hasRole(requiredRoles)) {
        router.push("/dashboard/unauthorized");
      }
    }
  }, [user, loading, requiredRoles, hasRole, router]);

  return { user, loading };
};
