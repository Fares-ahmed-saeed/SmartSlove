
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "@/hooks/useTranslation";
import { HistoryItem } from "@/hooks/useCalculatorHistory";
import { History, Save, Trash2, Copy } from "lucide-react";
import { cn } from "@/lib/utils";

interface CalculatorHistoryProps {
  history: HistoryItem[];
  savedResults: HistoryItem[];
  onSaveResult: (item: HistoryItem) => void;
  onRemoveFromSaved: (id: string) => void;
  onClearHistory: () => void;
  onClearSaved: () => void;
  onUseResult: (result: string) => void;
}

export const CalculatorHistory = ({
  history,
  savedResults,
  onSaveResult,
  onRemoveFromSaved,
  onClearHistory,
  onClearSaved,
  onUseResult
}: CalculatorHistoryProps) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('history');

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const HistoryList = ({ items, isSaved = false }: { items: HistoryItem[], isSaved?: boolean }) => (
    <ScrollArea className="h-64">
      {items.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          {isSaved ? t('noSavedResults') : t('noHistory')}
        </div>
      ) : (
        <div className="space-y-2">
          {items.map((item) => (
            <div
              key={item.id}
              className="p-3 border border-border rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center justify-between mb-2">
                <Badge variant="secondary" className="text-xs">
                  {formatTime(item.timestamp)}
                </Badge>
                <div className="flex items-center gap-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => copyToClipboard(item.result)}
                    className="h-6 w-6 p-0"
                  >
                    <Copy size={12} />
                  </Button>
                  {!isSaved ? (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onSaveResult(item)}
                      className="h-6 w-6 p-0"
                    >
                      <Save size={12} />
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onRemoveFromSaved(item.id)}
                      className="h-6 w-6 p-0 text-destructive"
                    >
                      <Trash2 size={12} />
                    </Button>
                  )}
                </div>
              </div>
              <div className="font-mono text-sm text-muted-foreground">
                {item.expression}
              </div>
              <div
                className="font-mono text-lg font-bold cursor-pointer hover:text-primary"
                onClick={() => onUseResult(item.result)}
              >
                = {item.result}
              </div>
            </div>
          ))}
        </div>
      )}
    </ScrollArea>
  );

  return (
    <Card className="bg-card/50 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <History size={20} />
          {t('calculatorHistory')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="history">{t('history')}</TabsTrigger>
            <TabsTrigger value="saved">{t('saved')}</TabsTrigger>
          </TabsList>
          
          <TabsContent value="history" className="mt-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-muted-foreground">
                {history.length} {t('operations')}
              </span>
              <Button
                size="sm"
                variant="outline"
                onClick={onClearHistory}
                disabled={history.length === 0}
              >
                {t('clearHistory')}
              </Button>
            </div>
            <HistoryList items={history} />
          </TabsContent>
          
          <TabsContent value="saved" className="mt-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-muted-foreground">
                {savedResults.length} {t('savedResults')}
              </span>
              <Button
                size="sm"
                variant="outline"
                onClick={onClearSaved}
                disabled={savedResults.length === 0}
              >
                {t('clearSaved')}
              </Button>
            </div>
            <HistoryList items={savedResults} isSaved />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
