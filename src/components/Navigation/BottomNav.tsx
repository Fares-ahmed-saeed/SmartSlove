
import { Calculator, Code, RotateCcw, BarChart3, Settings, Brain, DollarSign, TrendingUp } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/hooks/useTranslation";
import { useState } from "react";

const mainNavItems = [
  { icon: Calculator, labelKey: "calculator", path: "/" },
  { icon: Code, labelKey: "programmer", path: "/programmer" },
  { icon: RotateCcw, labelKey: "converter", path: "/converter" },
  { icon: BarChart3, labelKey: "graphing", path: "/graphing" },
  { icon: Settings, labelKey: "settings", path: "/settings" }
];

const additionalNavItems = [
  { icon: Brain, labelKey: "ai", path: "/ai" },
  { icon: DollarSign, labelKey: "currency", path: "/currency" },
  { icon: TrendingUp, labelKey: "investment", path: "/investment" }
];

export const BottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [showMore, setShowMore] = useState(false);

  return (
    <>
      {/* شاشة إضافية للأدوات الجديدة */}
      {showMore && (
        <div 
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setShowMore(false)}
        />
      )}
      
      {showMore && (
        <div className="fixed bottom-16 left-0 right-0 bg-card border-t border-border z-50 animate-slide-in-right">
          <div className="flex justify-around items-center h-16 px-2">
            {additionalNavItems.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;
              
              return (
                <button
                  key={item.path}
                  onClick={() => {
                    navigate(item.path);
                    setShowMore(false);
                  }}
                  className={cn(
                    "flex flex-col items-center justify-center p-2 rounded-lg transition-all duration-200",
                    "min-w-[60px] h-12",
                    isActive 
                      ? "text-primary bg-primary/10" 
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  )}
                >
                  <Icon 
                    size={20} 
                    className={cn(
                      "transition-all duration-200",
                      isActive && "text-primary"
                    )} 
                  />
                  <span className="text-xs mt-1 font-medium">{t(item.labelKey as any)}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* التنقل الرئيسي */}
      <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border z-30">
        <div className="flex justify-around items-center h-16 px-2">
          {mainNavItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={cn(
                  "flex flex-col items-center justify-center p-2 rounded-lg transition-all duration-200",
                  "min-w-[60px] h-12",
                  isActive 
                    ? "text-primary bg-primary/10" 
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                )}
              >
                <Icon 
                  size={20} 
                  className={cn(
                    "transition-all duration-200",
                    isActive && "text-primary"
                  )} 
                />
                <span className="text-xs mt-1 font-medium">{t(item.labelKey as any)}</span>
              </button>
            );
          })}
          
          {/* زر المزيد - مخفي الآن لإظهار جميع الصفحات */}
          <button
            onClick={() => setShowMore(!showMore)}
            className={cn(
              "flex flex-col items-center justify-center p-2 rounded-lg transition-all duration-200",
              "min-w-[60px] h-12",
              showMore
                ? "text-primary bg-primary/10" 
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
            )}
          >
            <div className="flex space-x-1">
              <div className="w-1 h-1 bg-current rounded-full"></div>
              <div className="w-1 h-1 bg-current rounded-full"></div>
              <div className="w-1 h-1 bg-current rounded-full"></div>
            </div>
            <span className="text-xs mt-1 font-medium">{t('moreOptions')}</span>
          </button>
        </div>
      </div>
    </>
  );
};
