export const widgetItems: {
  title: string;
  isUpDown: boolean;
  description: string;
  subDescription: string;
  value: string;
  percentage: string;
}[] = [
  {
    title: "Total admissions",
    value: "1,234",
    description: "Total number of admissions",
    subDescription: "This month",
    isUpDown: true,
    percentage: "12%",
  },
  {
    title: "New admissions",
    value: "234",
    description: "New admissions",
    subDescription: "This month",
    isUpDown: true,
    percentage: "5%",
  },
  {
    title: "Pending admissions",
    value: "123",
    description: "Pending admissions",
    subDescription: "This month",
    isUpDown: false,
    percentage: "2%",
  },
  {
    title: "Rejected admissions",
    value: "123",
    description: "Rejected admissions",
    subDescription: "This month",
    isUpDown: false,
    percentage: "2%",
  },
];
