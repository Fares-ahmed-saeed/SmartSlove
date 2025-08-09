
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "@/hooks/useTranslation";
import { ImportantPoint } from "@/utils/mathUtils";

interface ImportantPointsProps {
  points: ImportantPoint[];
}

export const ImportantPoints = ({ points }: ImportantPointsProps) => {
  const { t } = useTranslation();

  const getPointTypeLabel = (type: ImportantPoint['type']) => {
    switch (type) {
      case 'root': return t('roots');
      case 'intersection': return t('intersections');
      case 'extremum': return t('extrema');
      default: return type;
    }
  };

  const getPointTypeColor = (type: ImportantPoint['type']) => {
    switch (type) {
      case 'root': return 'bg-green-500';
      case 'intersection': return 'bg-blue-500';
      case 'extremum': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  if (points.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{t('importantPoints')}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">{t('noPointsFound')}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{t('importantPoints')}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {points.map((point, index) => (
          <div key={index} className="flex items-center justify-between p-2 bg-calc-display rounded-lg">
            <div className="flex items-center gap-2">
              <Badge className={`${getPointTypeColor(point.type)} text-white`}>
                {getPointTypeLabel(point.type)}
              </Badge>
              <span className="text-sm font-medium">{point.label}</span>
            </div>
            <div className="text-sm text-muted-foreground">
              ({point.x.toFixed(3)}, {point.y.toFixed(3)})
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
