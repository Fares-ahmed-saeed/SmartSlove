
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "@/hooks/useTranslation";
import { ArrowUpDown, TrendingUp, DollarSign, RefreshCw, Globe } from "lucide-react";
import { fetchExchangeRates, type CurrencyRate } from "@/services/currencyService";

export const CurrencyConverter = () => {
  const { t, language } = useTranslation();
  const [amount, setAmount] = useState('100');
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('SAR');
  const [result, setResult] = useState('');
  const [rates, setRates] = useState<CurrencyRate[]>([]);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [isLoading, setIsLoading] = useState(false);
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    loadExchangeRates();
    
    // Auto-refresh every 10 minutes
    const interval = setInterval(() => {
      if (!isLoading) {
        loadExchangeRates();
      }
    }, 600000);
    
    // Check network status
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    calculateConversion();
  }, [amount, fromCurrency, toCurrency, rates]);

  const loadExchangeRates = async () => {
    setIsLoading(true);
    try {
      const newRates = await fetchExchangeRates();
      setRates(newRates);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Failed to load exchange rates:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateConversion = () => {
    if (!amount || isNaN(parseFloat(amount)) || rates.length === 0) {
      setResult('');
      return;
    }

    const fromRate = rates.find(c => c.code === fromCurrency)?.rate || 1;
    const toRate = rates.find(c => c.code === toCurrency)?.rate || 1;
    
    const amountInUSD = parseFloat(amount) / fromRate;
    const convertedAmount = amountInUSD * toRate;
    
    setResult(convertedAmount.toFixed(4).replace(/\.?0+$/, ''));
  };

  const swapCurrencies = () => {
    const temp = fromCurrency;
    setFromCurrency(toCurrency);
    setToCurrency(temp);
  };

  const formatNumber = (num: string) => {
    return new Intl.NumberFormat(language === 'ar' ? 'ar-SA' : 'en-US').format(parseFloat(num));
  };

  const getExchangeRate = (from: string, to: string) => {
    const fromRate = rates.find(c => c.code === from)?.rate || 1;
    const toRate = rates.find(c => c.code === to)?.rate || 1;
    return (toRate / fromRate).toFixed(4);
  };

  return (
    <div className="min-h-screen bg-gradient-bg p-4 pb-20" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <DollarSign className="text-primary" size={32} />
          <h1 className="text-3xl font-bold text-foreground">
            {language === 'ar' ? 'محول العملات' : 'Currency Converter'}
          </h1>
          <Badge variant="secondary" className={`${isOnline ? 'bg-gradient-to-r from-green-500 to-blue-500' : 'bg-gray-500'} text-white`}>
            {isOnline ? (
              <div className="flex items-center gap-1">
                <Globe size={12} />
                {language === 'ar' ? 'مباشر 2025' : 'Live 2025'}
              </div>
            ) : (
              <div className="flex items-center gap-1">
                {language === 'ar' ? 'غير متصل' : 'Offline'}
              </div>
            )}
          </Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* المحول الرئيسي / Main Converter */}
          <div className="lg:col-span-2">
            <Card className="border-primary/20">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <ArrowUpDown size={20} />
                    {language === 'ar' ? 'تحويل العملات' : 'Currency Exchange'}
                  </CardTitle>
                  <Button variant="outline" size="sm" onClick={loadExchangeRates} disabled={isLoading}>
                    <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} />
                    {language === 'ar' ? 'تحديث' : 'Refresh'}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  {language === 'ar' ? 'آخر تحديث: ' : 'Last updated: '}
                  {lastUpdated.toLocaleString(language === 'ar' ? 'ar-SA' : 'en-US')}
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* من / From */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">{language === 'ar' ? 'من' : 'From'}</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <Input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder={language === 'ar' ? 'المبلغ' : 'Amount'}
                      className="text-lg font-semibold text-right"
                    />
                    <Select value={fromCurrency} onValueChange={setFromCurrency}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-background border z-50">
                        {rates.map((currency) => (
                          <SelectItem key={currency.code} value={currency.code}>
                            <div className="flex items-center gap-2">
                              <span>{currency.flag}</span>
                              <span>{currency.code}</span>
                              <span className="text-sm text-muted-foreground">
                                {language === 'ar' ? currency.name : currency.nameEn}
                              </span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* زر التبديل / Swap Button */}
                <div className="flex justify-center">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={swapCurrencies}
                    className="rounded-full p-2 h-10 w-10"
                  >
                    <ArrowUpDown size={16} />
                  </Button>
                </div>

                {/* إلى / To */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">{language === 'ar' ? 'إلى' : 'To'}</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <Input
                      value={result ? formatNumber(result) : ''}
                      readOnly
                      className="text-lg font-bold text-right bg-muted"
                    />
                    <Select value={toCurrency} onValueChange={setToCurrency}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-background border z-50">
                        {rates.map((currency) => (
                          <SelectItem key={currency.code} value={currency.code}>
                            <div className="flex items-center gap-2">
                              <span>{currency.flag}</span>
                              <span>{currency.code}</span>
                              <span className="text-sm text-muted-foreground">
                                {language === 'ar' ? currency.name : currency.nameEn}
                              </span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* معلومات التحويل / Conversion Info */}
                {result && (
                  <div className="p-4 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg border">
                    <div className="text-center space-y-2">
                      <div className="text-lg">
                        <span className="font-bold text-2xl text-primary">
                          {formatNumber(amount)} {fromCurrency}
                        </span>
                        <span className="mx-3 text-muted-foreground">=</span>
                        <span className="font-bold text-2xl text-primary">
                          {formatNumber(result)} {toCurrency}
                        </span>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        1 {fromCurrency} = {getExchangeRate(fromCurrency, toCurrency)} {toCurrency}
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* أسعار الصرف / Exchange Rates */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp size={20} />
                  {language === 'ar' ? 'أسعار الصرف' : 'Exchange Rates'}
                </CardTitle>
                <p className="text-xs text-muted-foreground">
                  {language === 'ar' ? 'مقابل الدولار الأمريكي' : 'Against US Dollar'}
                </p>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <RefreshCw className="animate-spin" size={24} />
                    <span className="ml-2">{language === 'ar' ? 'جاري التحديث...' : 'Updating...'}</span>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {rates.slice(1, 13).map((currency) => (
                      <div
                        key={currency.code}
                        className="flex items-center justify-between p-2 hover:bg-muted/50 rounded-lg cursor-pointer transition-colors"
                        onClick={() => {
                          setFromCurrency('USD');
                          setToCurrency(currency.code);
                        }}
                      >
                        <div className="flex items-center gap-2">
                          <span>{currency.flag}</span>
                          <div className="flex flex-col">
                            <span className="font-medium text-sm">{currency.code}</span>
                            <span className="text-xs text-muted-foreground">
                              {language === 'ar' ? currency.name : currency.nameEn}
                            </span>
                          </div>
                        </div>
                        <span className="text-sm font-medium">
                          {currency.rate.toFixed(4).replace(/\.?0+$/, '')}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
