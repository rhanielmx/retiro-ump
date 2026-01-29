import { Utensils, BookOpen, Clock, Users } from 'lucide-react';

interface ScheduleItemProps {
  time: string;
  activity: string;
  type: 'meal' | 'talk' | 'logistics' | 'activity';
  speaker?: string;
}

export function ScheduleItem({ time, activity, type, speaker }: ScheduleItemProps) {
  const getTypeStyles = () => {
    switch (type) {
      case 'meal': return 'bg-blue-50 border-blue-200 hover:bg-blue-100';
      case 'talk': return 'bg-green-50 border-green-200 hover:bg-green-100';
      case 'logistics': return 'bg-gray-50 border-gray-200 hover:bg-gray-100';
      case 'activity': return 'bg-yellow-50 border-yellow-200 hover:bg-yellow-100';
    }
  };

  const getTypeIcon = () => {
    switch (type) {
      case 'meal': return <Utensils className="h-5 w-5 text-blue-600 flex-shrink-0" />;
      case 'talk': return <BookOpen className="h-5 w-5 text-green-600 flex-shrink-0" />;
      case 'logistics': return <Clock className="h-5 w-5 text-gray-600 flex-shrink-0" />;
      case 'activity': return <Users className="h-5 w-5 text-yellow-600 flex-shrink-0" />;
    }
  };

  const getContainerStyles = () => {
    switch (type) {
      case 'meal': return 'bg-primary/10 border-blue-200';
      case 'talk': return 'bg-green-100/10 border-green-200';
      case 'logistics': return 'bg-gray-100/10 border-gray-200';
      case 'activity': return 'bg-yellow-100/10 border-yellow-200';
    }
  };

  return (
    <div className={`flex items-center gap-3 p-3 rounded-lg border transition-all duration-200 min-h-[72px] ${getTypeStyles()}`}>
      <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center border ${getContainerStyles()}`}>
        <span className="font-bold text-xs">{time}</span>
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-medium flex items-center gap-2 text-sm leading-tight">
          {getTypeIcon()}
          <span className="break-words">{activity}</span>
        </h4>
        {speaker && (
          <p className="text-xs text-muted-foreground mt-1">
            Com {speaker}
          </p>
        )}
      </div>
    </div>
  );
}