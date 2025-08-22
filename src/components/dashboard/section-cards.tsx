import AnalyticCard from "../common/AnalyticCard";

export type WidgetItemsProps = {
  items: {
    title: string;
    value: string;
    isUpDown?: boolean;
    description?: string;
    subDescription?: string;
    percentage?: string;
    key?: string;
  }[];
};
export function SectionCards({ items }: WidgetItemsProps) {
  if (!items || items.length === 0) {
    return null;
  }
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 px-4 lg:px-6 *:data-[slot=card]:shadow-xs *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card">
      {items.map((item, index) => (
        <AnalyticCard
          key={index}
          title={item.title}
          value={item.value}
          isUpDown={item.isUpDown}
          description={item.description}
          subDescription={item.subDescription}
          percentage={item.percentage}
        />
      ))}
    </div>
  );
}
