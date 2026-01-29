import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScheduleItem } from './ScheduleItem';
import type { ScheduleDay as ScheduleDayType } from './scheduleData';

interface ScheduleDayProps {
  day: ScheduleDayType;
}

export function ScheduleDay({ day }: ScheduleDayProps) {
  return (
    <div className="w-80 flex-shrink-0">
      <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 h-full">
        <CardHeader className="bg-gradient-to-r from-primary/10 to-secondary/10 border-b">
          <CardTitle className="text-xl font-bold">
            {day.dayName}
            <span className="text-sm font-normal text-muted-foreground ml-2">
              {day.date}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="space-y-3">
            {day.activities.map((activity, index) => (
              <ScheduleItem key={index} {...activity} />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}