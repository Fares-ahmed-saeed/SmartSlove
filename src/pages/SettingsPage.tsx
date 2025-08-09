
import { useTheme } from "@/hooks/useTheme";
import { useSettings } from "@/hooks/useSettings";
import { useTranslation } from "@/hooks/useTranslation";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Moon, Sun, Volume2, VolumeX, Vibrate, Info, Languages, Palette, Share2, Download, FileText, Users } from "lucide-react";
import { toast } from "sonner";

export const SettingsPage = () => {
  const { theme, toggleTheme } = useTheme();
  const { t, language } = useTranslation();
  const {
    soundEnabled,
    setSoundEnabled,
    vibrationEnabled,
    setVibrationEnabled,
    language: currentLanguage,
    setLanguage,
    saveOperations,
    setSaveOperations,
    showHistory,
    setShowHistory,
    scientificDefault,
    setScientificDefault,
    playSound,
    triggerVibration,
  } = useSettings();

  const handleSoundToggle = (enabled: boolean) => {
    setSoundEnabled(enabled);
    if (enabled) playSound();
  };

  const handleVibrationToggle = (enabled: boolean) => {
    setVibrationEnabled(enabled);
    if (enabled) triggerVibration();
  };

  const handleShareCalculations = () => {
    const history = localStorage.getItem('calculatorHistory');
    if (history) {
      const shareData = {
        title: 'حساباتي من الآلة الحاسبة',
        text: 'شاهد حساباتي الأخيرة',
        url: window.location.href
      };
      
      if (navigator.share) {
        navigator.share(shareData);
      } else {
        navigator.clipboard.writeText(window.location.href);
        toast.success('تم نسخ الرابط للحافظة');
      }
    } else {
      toast.error('لا توجد حسابات للمشاركة');
    }
  };

  const handleExportPDF = () => {
    const history = localStorage.getItem('calculatorHistory');
    if (history) {
      const calculations = JSON.parse(history);
      const content = calculations.map((calc: any) => 
        `${calc.expression} = ${calc.result} (${new Date(calc.timestamp).toLocaleString()})`
      ).join('\n');
      
      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'calculations.txt';
      a.click();
      URL.revokeObjectURL(url);
      toast.success('تم تصدير الحسابات بنجاح');
    } else {
      toast.error('لا توجد حسابات للتصدير');
    }
  };

  const handleExportExcel = () => {
    const history = localStorage.getItem('calculatorHistory');
    if (history) {
      const calculations = JSON.parse(history);
      let csv = 'التعبير,النتيجة,التاريخ\n';
      calculations.forEach((calc: any) => {
        csv += `"${calc.expression}","${calc.result}","${new Date(calc.timestamp).toLocaleString()}"\n`;
      });
      
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'calculations.csv';
      a.click();
      URL.revokeObjectURL(url);
      toast.success('تم تصدير الحسابات كملف Excel');
    } else {
      toast.error('لا توجد حسابات للتصدير');
    }
  };

  const handleBackupHistory = () => {
    const history = localStorage.getItem('calculatorHistory');
    const savedResults = localStorage.getItem('savedCalculatorResults');
    
    if (history || savedResults) {
      const backup = {
        history: history ? JSON.parse(history) : [],
        saved: savedResults ? JSON.parse(savedResults) : [],
        timestamp: new Date().toISOString()
      };
      
      const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `calculator-backup-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success('تم إنشاء نسخة احتياطية من السجل');
    } else {
      toast.error('لا توجد بيانات للنسخ الاحتياطي');
    }
  };

  const handleCreateWorkspace = () => {
    const workspaceId = Math.random().toString(36).substr(2, 9);
    const workspaceUrl = `${window.location.origin}?workspace=${workspaceId}`;
    navigator.clipboard.writeText(workspaceUrl);
    toast.success('تم إنشاء مساحة عمل تعاونية ونسخ الرابط للحافظة');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 p-4 pb-20">
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold text-center mb-6 text-foreground">
          {t('settings')}
        </h1>

        <div className="space-y-4">
          {/* Theme Settings */}
          <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette size={20} className="text-primary" />
                {t('appearance')}
              </CardTitle>
              <CardDescription>
                {t('chooseTheme')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sun size={16} className="text-muted-foreground" />
                  <span className="text-sm">{t('light')}</span>
                </div>
                <Switch
                  checked={theme === 'dark'}
                  onCheckedChange={toggleTheme}
                />
                <div className="flex items-center gap-2">
                  <span className="text-sm">{t('dark')}</span>
                  <Moon size={16} className="text-muted-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Separator className="bg-border/50" />

          {/* Language Settings */}
          <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Languages size={20} className="text-primary" />
                {t('language')}
              </CardTitle>
              <CardDescription>
                {t('chooseLanguage')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Select value={currentLanguage} onValueChange={setLanguage}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ar">{t('arabic')}</SelectItem>
                  <SelectItem value="en">{t('english')}</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          <Separator className="bg-border/50" />

          {/* Social Features */}
          <Card className="bg-gradient-to-br from-primary/20 to-accent/20 border-primary/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <Users size={20} className="text-primary" />
                {t('socialFeatures')}
              </CardTitle>
              <CardDescription className="text-foreground/80">
                {t('shareAndExport')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-3">
                <Button
                  onClick={handleShareCalculations}
                  className="flex items-center gap-2 w-full"
                  variant="outline"
                >
                  <Share2 size={16} />
                  {t('shareCalculations')}
                </Button>
                
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    onClick={handleExportPDF}
                    className="flex items-center gap-1 text-xs"
                    variant="outline"
                    size="sm"
                  >
                    <FileText size={14} />
                    {t('exportPDF')}
                  </Button>
                  
                  <Button
                    onClick={handleExportExcel}
                    className="flex items-center gap-1 text-xs"
                    variant="outline"
                    size="sm"
                  >
                    <Download size={14} />
                    {t('exportExcel')}
                  </Button>
                </div>
                
                <Button
                  onClick={handleBackupHistory}
                  className="flex items-center gap-2 w-full"
                  variant="outline"
                >
                  <Download size={16} />
                  {t('backupHistory')}
                </Button>
                
                <Button
                  onClick={handleCreateWorkspace}
                  className="flex items-center gap-2 w-full bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  <Users size={16} />
                  {t('createCollaborativeWorkspace')}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Separator className="bg-border/50" />

          {/* Sound Settings */}
          <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {soundEnabled ? <Volume2 size={20} className="text-primary" /> : <VolumeX size={20} className="text-muted-foreground" />}
                {t('sound')}
              </CardTitle>
              <CardDescription>
                {t('buttonSounds')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-sm">{t('buttonSoundsLabel')}</span>
                <Switch
                  checked={soundEnabled}
                  onCheckedChange={handleSoundToggle}
                />
              </div>
            </CardContent>
          </Card>

          <Separator className="bg-border/50" />

          {/* Vibration Settings */}
          <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Vibrate size={20} className="text-primary" />
                {t('vibration')}
              </CardTitle>
              <CardDescription>
                {t('buttonVibration')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-sm">{t('buttonVibrationLabel')}</span>
                <Switch
                  checked={vibrationEnabled}
                  onCheckedChange={handleVibrationToggle}
                />
              </div>
            </CardContent>
          </Card>

          <Separator className="bg-border/50" />

          {/* App Info */}
          <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info size={20} className="text-primary" />
                {t('appInfo')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">{t('version')}</span>
                <span className="text-sm">1.0.0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">{t('developer')}</span>
                <span className="text-sm">Fares</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">{t('appLanguage')}</span>
                <span className="text-sm">{currentLanguage === 'ar' ? t('arabic') : t('english')}</span>
              </div>
            </CardContent>
          </Card>

          {/* Additional Features */}
          <Card className="bg-gradient-to-br from-primary/20 to-accent/20 border-primary/30">
            <CardHeader>
              <CardTitle className="text-foreground">{t('additionalFeatures')}</CardTitle>
              <CardDescription className="text-foreground/80">
                {t('moreOptions')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">{t('saveOperations')}</span>
                <Switch checked={saveOperations} onCheckedChange={setSaveOperations} />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">{t('history')}</span>
                <Switch checked={showHistory} onCheckedChange={setShowHistory} />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">{t('scientificDefault')}</span>
                <Switch checked={scientificDefault} onCheckedChange={setScientificDefault} />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
