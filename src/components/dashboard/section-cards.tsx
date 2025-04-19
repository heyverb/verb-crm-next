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
    <div className="*:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-4 grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card lg:px-6">
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
