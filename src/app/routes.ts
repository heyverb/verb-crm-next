import {
  AudioWaveform,
  BookOpen,
  Command,
  GalleryVerticalEnd,
  HelpCircle,
  LayoutDashboard,
  Search,
  Settings,
  SquareTerminal,
  Users,
  GraduationCap,
  FileText,
  DollarSign,
} from "lucide-react";

export const route = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "https://ui.shadcn.com/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Overview",
      url: "/dashboard/overview",
      icon: LayoutDashboard,
    },
  ],
  teams: [
    {
      name: "Acme Inc",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "#",
      icon: Settings,
    },
    {
      title: "Get Help",
      url: "#",
      icon: HelpCircle,
    },
    {
      title: "Search",
      url: "#",
      icon: Search,
    },
  ],
  navModel: [
    {
      title: "Admissions",
      url: "admissions",
      icon: SquareTerminal,
      items: [
        {
          title: "Overview",
          url: "/dashboard/admissions/overview",
        },
        {
          title: "Create admission",
          url: "/dashboard/admissions/create-admission",
        },
        {
          title: "Applications",
          url: "/dashboard/admissions/applications",
        },
        {
          title: "Enquiries",
          url: "/dashboard/admissions/enquiries",
        },
      ],
    },
    {
      title: "Students",
      url: "students",
      icon: Users,
      items: [
        {
          title: "Overview",
          url: "/dashboard/students/overview",
        },
        {
          title: "list",
          url: "/dashboard/students/list",
        },
      ],
    },
    {
      title: "Attendance",
      url: "attendance",
      icon: SquareTerminal,

      items: [
        {
          title: "History",
          url: "#",
        },
        {
          title: "Starred",
          url: "#",
        },
        {
          title: "Settings",
          url: "#",
        },
      ],
    },
    {
      title: "Teachers",
      url: "teachers",
      icon: GraduationCap,
      items: [
        {
          title: "Overview",
          url: "/dashboard/teachers/overview",
        },
        {
          title: "List",
          url: "/dashboard/teachers/list",
        },
        {
          title: "Add Teacher",
          url: "/dashboard/teachers/create",
        },
      ],
    },
    {
      title: "Class",
      url: "class",
      icon: BookOpen,
      items: [
        {
          title: "Overview",
          url: "/dashboard/class/overview",
        },
        {
          title: "Create admission",
          url: "/dashboard/class/create-class",
        },
        {
          title: "Applications",
          url: "/dashboard/class/list",
        },
      ],
    },
    {
      title: "Subjects",
      url: "subjects",
      icon: BookOpen,
      items: [
        {
          title: "Overview",
          url: "/dashboard/subjects/overview",
        },
        {
          title: "List",
          url: "/dashboard/subjects/list",
        },
        {
          title: "Add Subject",
          url: "/dashboard/subjects/create",
        },
      ],
    },
    {
      title: "Exams",
      url: "exams",
      icon: FileText,
      items: [
        {
          title: "Overview",
          url: "/dashboard/exams/overview",
        },
        {
          title: "Schedule",
          url: "/dashboard/exams/schedule",
        },
        {
          title: "Results",
          url: "/dashboard/exams/results",
        },
      ],
    },
    {
      title: "Fees",
      url: "fees",
      icon: DollarSign,
      items: [
        {
          title: "Overview",
          url: "/dashboard/fees/overview",
        },
        {
          title: "Payments",
          url: "/dashboard/fees/payments",
        },
        {
          title: "Pending",
          url: "/dashboard/fees/pending",
        },
      ],
    },
  ],
};
