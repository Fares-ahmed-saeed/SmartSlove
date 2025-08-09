
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "@/hooks/useTranslation";
import { TrendingUp, Calculator, PiggyBank, Target, BarChart } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface InvestmentData {
  year: number;
  value: number;
  profit: number;
}

export const InvestmentCalculator = () => {
  const { t, language } = useTranslation();
  const [principal, setPrincipal] = useState('10000');
  const [rate, setRate] = useState('15');
  const [time, setTime] = useState('10');
  const [compound, setCompound] = useState('yearly');
  const [monthlyAddition, setMonthlyAddition] = useState('500');
  const [result, setResult] = useState<InvestmentData[]>([]);
  const [totalValue, setTotalValue] = useState(0);
  const [totalProfit, setTotalProfit] = useState(0);

  const compoundOptions = language === 'ar' ? [
    { value: 'yearly', label: 'سنوياً', frequency: 1 },
    { value: 'monthly', label: 'شهرياً', frequency: 12 },
    { value: 'quarterly', label: 'ربع سنوي', frequency: 4 },
  ] : [
    { value: 'yearly', label: 'Annually', frequency: 1 },
    { value: 'monthly', label: 'Monthly', frequency: 12 },
    { value: 'quarterly', label: 'Quarterly', frequency: 4 },
  ];

  useEffect(() => {
    calculateInvestment();
  }, [principal, rate, time, compound, monthlyAddition]);

  const calculateInvestment = () => {
    const p = parseFloat(principal) || 0;
    const r = (parseFloat(rate) || 0) / 100;
    const t = parseFloat(time) || 0;
    const frequency = compoundOptions.find(opt => opt.value === compound)?.frequency || 1;
    const monthly = parseFloat(monthlyAddition) || 0;

    if (p <= 0 || t <= 0) {
      setResult([]);
      return;
    }

    const data: InvestmentData[] = [];
    let currentValue = p;
    let totalInvested = p;

    for (let year = 1; year <= t; year++) {
      // إضافة الاستثمار الشهري / Add monthly investment
      const yearlyAddition = monthly * 12;
      totalInvested += yearlyAddition;
      
      // حساب القيمة مع الفائدة المركبة / Calculate value with compound interest
      const ratePerPeriod = r / frequency;
      const periodsPerYear = frequency;
      
      // استثمار أساسي مع فائدة مركبة / Principal with compound interest
      currentValue = currentValue * Math.pow(1 + ratePerPeriod, periodsPerYear);
      
      // إضافة الاستثمار الشهري مع فائدة متوسطة للسنة / Add monthly investment with average interest for the year
      currentValue += yearlyAddition * (1 + r/2);

      const profit = currentValue - totalInvested;
      
      data.push({
        year,
        value: Math.round(currentValue),
        profit: Math.round(profit)
      });
    }

    setResult(data);
    setTotalValue(data[data.length - 1]?.value || 0);
    setTotalProfit(data[data.length - 1]?.profit || 0);
  };

  const formatEGP = (amount: number) => {
    return new Intl.NumberFormat(language === 'ar' ? 'ar-EG' : 'en-EG', {
      style: 'currency',
      currency: 'EGP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat(language === 'ar' ? 'ar-EG' : 'en-EG').format(num);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 p-4 pb-20" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <PiggyBank className="text-primary" size={32} />
          <h1 className="text-3xl font-bold text-foreground">
            {language === 'ar' ? 'حاسبة الاستثمار' : 'Investment Calculator'}
          </h1>
          <Badge variant="secondary" className="bg-gradient-to-r from-green-500 to-blue-500 text-white">
            {language === 'ar' ? 'بالجنيه المصري' : 'Egyptian Pound (EGP)'}
          </Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* المدخلات / Inputs */}
          <div className="space-y-4">
            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator size={20} />
                  {language === 'ar' ? 'بيانات الاستثمار' : 'Investment Data'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    {language === 'ar' ? 'المبلغ الأساسي (جنيه مصري)' : 'Principal Amount (EGP)'}
                  </label>
                  <Input
                    type="number"
                    value={principal}
                    onChange={(e) => setPrincipal(e.target.value)}
                    placeholder="10000"
                    className="text-right"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    {language === 'ar' ? 'معدل العائد السنوي (%)' : 'Annual Return Rate (%)'}
                  </label>
                  <Input
                    type="number"
                    value={rate}
                    onChange={(e) => setRate(e.target.value)}
                    placeholder="15"
                    className="text-right"
                  />
                  <p className="text-xs text-muted-foreground">
                    {language === 'ar' ? 'متوسط العائد في البورصة المصرية 10-20%' : 'Egyptian Stock Exchange average 10-20%'}
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    {language === 'ar' ? 'مدة الاستثمار (سنوات)' : 'Investment Period (Years)'}
                  </label>
                  <Input
                    type="number"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    placeholder="10"
                    className="text-right"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    {language === 'ar' ? 'تكرار الفائدة المركبة' : 'Compounding Frequency'}
                  </label>
                  <Select value={compound} onValueChange={setCompound}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-background border z-50">
                      {compoundOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    {language === 'ar' ? 'الإضافة الشهرية (جنيه مصري)' : 'Monthly Addition (EGP)'}
                  </label>
                  <Input
                    type="number"
                    value={monthlyAddition}
                    onChange={(e) => setMonthlyAddition(e.target.value)}
                    placeholder="500"
                    className="text-right"
                  />
                </div>
              </CardContent>
            </Card>

            {/* النتائج السريعة / Quick Results */}
            {totalValue > 0 && (
              <Card className="border-green-200 bg-green-50/50 dark:border-green-800 dark:bg-green-900/20">
                <CardHeader>
                  <CardTitle className="text-green-700 dark:text-green-300 flex items-center gap-2">
                    <Target size={20} />
                    {language === 'ar' ? 'النتائج النهائية' : 'Final Results'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      {language === 'ar' ? 'القيمة الإجمالية:' : 'Total Value:'}
                    </span>
                    <span className="font-bold text-green-700 dark:text-green-300">
                      {formatEGP(totalValue)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      {language === 'ar' ? 'إجمالي الربح:' : 'Total Profit:'}
                    </span>
                    <span className="font-bold text-green-700 dark:text-green-300">
                      {formatEGP(totalProfit)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      {language === 'ar' ? 'نسبة العائد:' : 'Return Rate:'}
                    </span>
                    <span className="font-bold text-green-700 dark:text-green-300">
                      {((totalProfit / (parseFloat(principal) + parseFloat(monthlyAddition) * 12 * parseFloat(time))) * 100).toFixed(1)}%
                    </span>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* الرسم البياني والجدول / Chart and Table */}
          <div className="lg:col-span-2 space-y-4">
            {result.length > 0 && (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart size={20} />
                      {language === 'ar' ? 'نمو الاستثمار عبر السنوات' : 'Investment Growth Over Years'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={result}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                          dataKey="year" 
                          label={{ 
                            value: language === 'ar' ? 'السنة' : 'Year', 
                            position: 'insideBottom', 
                            offset: -10 
                          }}
                        />
                        <YAxis 
                          tickFormatter={(value) => `${Math.round(value/1000)}K`}
                          label={{ 
                            value: language === 'ar' ? 'القيمة (جنيه)' : 'Value (EGP)', 
                            angle: -90, 
                            position: 'insideLeft' 
                          }}
                        />
                        <Tooltip 
                          formatter={(value: number) => [formatEGP(value), language === 'ar' ? 'القيمة' : 'Value']}
                          labelFormatter={(label) => `${language === 'ar' ? 'السنة' : 'Year'} ${label}`}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="value" 
                          stroke="hsl(var(--primary))" 
                          strokeWidth={3}
                          dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 4 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>{language === 'ar' ? 'جدول النمو التفصيلي' : 'Detailed Growth Table'}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="max-h-64 overflow-y-auto">
                      <table className="w-full text-sm">
                        <thead className="sticky top-0 bg-background">
                          <tr className="border-b">
                            <th className="text-right p-2">{language === 'ar' ? 'السنة' : 'Year'}</th>
                            <th className="text-right p-2">{language === 'ar' ? 'القيمة الإجمالية' : 'Total Value'}</th>
                            <th className="text-right p-2">{language === 'ar' ? 'الربح المحقق' : 'Profit Earned'}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {result.map((item, index) => (
                            <tr key={index} className="border-b hover:bg-muted/50">
                              <td className="text-right p-2 font-medium">{item.year}</td>
                              <td className="text-right p-2 text-green-600 dark:text-green-400">
                                {formatEGP(item.value)}
                              </td>
                              <td className="text-right p-2 text-blue-600 dark:text-blue-400">
                                {formatEGP(item.profit)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}

            {result.length === 0 && (
              <Card className="border-dashed border-2 border-muted-foreground/30">
                <CardContent className="flex items-center justify-center h-40">
                  <div className="text-center text-muted-foreground">
                    <PiggyBank size={48} className="mx-auto mb-3 opacity-50" />
                    <p>{language === 'ar' ? 'أدخل بيانات الاستثمار لعرض النتائج' : 'Enter investment data to display results'}</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
