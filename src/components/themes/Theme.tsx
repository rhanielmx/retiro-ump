import { Card, CardContent } from '@/components/ui/card';
import type { Theme as ThemeType } from './themesData';

interface ThemeProps {
  theme: ThemeType;
}

export function Theme({ theme }: ThemeProps) {
  return (
    <Card className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      <CardContent className="p-6">
        <div className={`w-full h-2 rounded-t-lg bg-gradient-to-r ${theme.color} mb-4`}></div>
        <h3 className="text-xl font-bold text-primary mb-2">{theme.title}</h3>
        <p className="text-sm text-muted-foreground mb-3">{theme.subtitle}</p>
        <div className="flex items-center gap-2 text-sm text-primary font-medium">
          <span className="px-2 py-1 bg-primary/10 rounded-full">{theme.reference}</span>
        </div>
      </CardContent>
    </Card>
  );
}