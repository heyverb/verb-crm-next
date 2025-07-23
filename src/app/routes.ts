import {
  AudioWaveform,
  BookOpen,
  Command,
  GalleryVerticalEnd,
  HelpCircleIcon,
  LayoutDashboardIcon,
  SearchIcon,
  Settings2,
  SettingsIcon,
  SquareTerminal,
  UsersRound,
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
      icon: LayoutDashboardIcon,
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
      icon: SettingsIcon,
    },
    {
      title: "Get Help",
      url: "#",
      icon: HelpCircleIcon,
    },
    {
      title: "Search",
      url: "#",
      icon: SearchIcon,
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
      icon: UsersRound,
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
      icon: BookOpen,
      items: [
        {
          title: "Introduction",
          url: "#",
        },
        {
          title: "Get Started",
          url: "#",
        },
        {
          title: "Tutorials",
          url: "#",
        },
        {
          title: "Changelog",
          url: "#",
        },
      ],
    },
    {
      title: "Class",
      url: "class",
      icon: Settings2,
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
      icon: Settings2,
      items: [
        {
          title: "General",
          url: "#",
        },
        {
          title: "Team",
          url: "#",
        },
        {
          title: "Billing",
          url: "#",
        },
        {
          title: "Limits",
          url: "#",
        },
      ],
    },
    {
      title: "Exams",
      url: "exam",
      icon: Settings2,
      items: [
        {
          title: "General",
          url: "#",
        },
        {
          title: "Team",
          url: "#",
        },
        {
          title: "Billing",
          url: "#",
        },
        {
          title: "Limits",
          url: "#",
        },
      ],
    },
  ],
};
