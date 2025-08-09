
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "@/hooks/useTranslation";
import { Calculator, Clock, Ruler, Weight, Thermometer, Volume, Map, Zap } from "lucide-react";

const conversionTypes = {
  length: {
    nameKey: 'length',
    icon: Ruler,
    units: {
      meter: { nameKey: 'meter', factor: 1 },
      kilometer: { nameKey: 'kilometer', factor: 1000 },
      centimeter: { nameKey: 'centimeter', factor: 0.01 },
      millimeter: { nameKey: 'millimeter', factor: 0.001 },
      inch: { nameKey: 'inch', factor: 0.0254 },
      foot: { nameKey: 'foot', factor: 0.3048 },
      yard: { nameKey: 'yard', factor: 0.9144 },
      mile: { nameKey: 'mile', factor: 1609.34 }
    }
  },
  weight: {
    nameKey: 'weight',
    icon: Weight,
    units: {
      kilogram: { nameKey: 'kilogram', factor: 1 },
      gram: { nameKey: 'gram', factor: 0.001 },
      pound: { nameKey: 'pound', factor: 0.453592 },
      ounce: { nameKey: 'ounce', factor: 0.0283495 },
      ton: { nameKey: 'ton', factor: 1000 }
    }
  },
  temperature: {
    nameKey: 'temperature',
    icon: Thermometer,
    units: {
      celsius: { nameKey: 'celsius', factor: 1 },
      fahrenheit: { nameKey: 'fahrenheit', factor: 1 },
      kelvin: { nameKey: 'kelvin', factor: 1 }
    }
  },
  volume: {
    nameKey: 'volume',
    icon: Volume,
    units: {
      liter: { nameKey: 'liter', factor: 1 },
      milliliter: { nameKey: 'milliliter', factor: 0.001 },
      gallon: { nameKey: 'gallon', factor: 3.78541 },
      quart: { nameKey: 'quart', factor: 0.946353 },
      cup: { nameKey: 'cup', factor: 0.236588 }
    }
  },
  area: {
    nameKey: 'area',
    icon: Map,
    units: {
      squareMeter: { nameKey: 'squareMeter', factor: 1 },
      squareKilometer: { nameKey: 'squareKilometer', factor: 1000000 },
      squareFoot: { nameKey: 'squareFoot', factor: 0.092903 },
      acre: { nameKey: 'acre', factor: 4046.86 },
      hectare: { nameKey: 'hectare', factor: 10000 }
    }
  },
  time: {
    nameKey: 'time',
    icon: Clock,
    units: {
      second: { nameKey: 'second', factor: 1 },
      minute: { nameKey: 'minute', factor: 60 },
      hour: { nameKey: 'hour', factor: 3600 },
      day: { nameKey: 'day', factor: 86400 },
      week: { nameKey: 'week', factor: 604800 },
      month: { nameKey: 'month', factor: 2629746 },
      year: { nameKey: 'year', factor: 31556952 }
    }
  },
  speed: {
    nameKey: 'speed',
    icon: Zap,
    units: {
      meterPerSecond: { nameKey: 'meterPerSecond', factor: 1 },
      kilometerPerHour: { nameKey: 'kilometerPerHour', factor: 0.277778 },
      milePerHour: { nameKey: 'milePerHour', factor: 0.44704 },
      knot: { nameKey: 'knot', factor: 0.514444 }
    }
  }
};

export const UnitConverter = () => {
  const { t } = useTranslation();
  const [selectedType, setSelectedType] = useState('length');
  const [fromUnit, setFromUnit] = useState('meter');
  const [toUnit, setToUnit] = useState('kilometer');
  const [inputValue, setInputValue] = useState('');
  const [result, setResult] = useState('');

  const convert = (value: string) => {
    if (!value || isNaN(parseFloat(value))) {
      setResult('');
      return;
    }

    const numValue = parseFloat(value);
    const type = conversionTypes[selectedType as keyof typeof conversionTypes];
    
    if (selectedType === 'temperature') {
      let result: number;
      
      // Convert to Celsius first
      let celsius: number;
      switch (fromUnit) {
        case 'celsius':
          celsius = numValue;
          break;
        case 'fahrenheit':
          celsius = (numValue - 32) * 5/9;
          break;
        case 'kelvin':
          celsius = numValue - 273.15;
          break;
        default:
          celsius = numValue;
      }
      
      // Convert from Celsius to target
      switch (toUnit) {
        case 'celsius':
          result = celsius;
          break;
        case 'fahrenheit':
          result = celsius * 9/5 + 32;
          break;
        case 'kelvin':
          result = celsius + 273.15;
          break;
        default:
          result = celsius;
      }
      
      setResult(result.toFixed(4).replace(/\.?0+$/, ''));
    } else {
      // Handle non-temperature conversions
      let fromFactor = 1;
      let toFactor = 1;
      
      const typeUnits = type.units as any;
      const fromUnitData = typeUnits[fromUnit];
      const toUnitData = typeUnits[toUnit];
      
      if (fromUnitData && fromUnitData.factor) {
        fromFactor = fromUnitData.factor;
      }
      
      if (toUnitData && toUnitData.factor) {
        toFactor = toUnitData.factor;
      }
      
      const result = (numValue * fromFactor) / toFactor;
      setResult(result.toFixed(8).replace(/\.?0+$/, ''));
    }
  };

  const handleInputChange = (value: string) => {
    setInputValue(value);
    convert(value);
  };

  const handleTypeChange = (newType: string) => {
    setSelectedType(newType);
    setInputValue('');
    setResult('');
    
    // Set default units for the new type
    const typeUnits = Object.keys(conversionTypes[newType as keyof typeof conversionTypes].units);
    setFromUnit(typeUnits[0]);
    setToUnit(typeUnits[1] || typeUnits[0]);
  };

  const swapUnits = () => {
    const tempUnit = fromUnit;
    setFromUnit(toUnit);
    setToUnit(tempUnit);
    if (inputValue) {
      convert(inputValue);
    }
  };

  const currentType = conversionTypes[selectedType as keyof typeof conversionTypes];
  const Icon = currentType.icon;

  return (
    <div className="min-h-screen bg-gradient-bg p-4 pb-20">
      <div className="max-w-md mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <Calculator className="text-primary" size={28} />
          <h1 className="text-2xl font-bold text-foreground">
            {t('unitConverter')}
          </h1>
        </div>
        
        {/* Conversion Type Selector with Icons */}
        <Card className="mb-6 bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Icon size={20} className="text-primary" />
              {t('conversionType')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2 mb-4">
              {Object.entries(conversionTypes).map(([key, type]) => {
                const TypeIcon = type.icon;
                const isSelected = selectedType === key;
                return (
                  <button
                    key={key}
                    onClick={() => handleTypeChange(key)}
                    className={`p-3 rounded-lg border transition-all duration-200 flex items-center gap-2 ${
                      isSelected 
                        ? 'bg-primary text-primary-foreground border-primary' 
                        : 'bg-card hover:bg-muted border-border'
                    }`}
                  >
                    <TypeIcon size={16} />
                    <span className="text-sm font-medium">{t(type.nameKey as any)}</span>
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 gap-4">
          {/* From Unit */}
          <Card className="border-l-4 border-l-primary">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{t('from')}</CardTitle>
                <Badge variant="secondary" className="bg-primary/20 text-primary">
                  {t(currentType.nameKey as any)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="from-unit">{t('unitType')}</Label>
                <Select value={fromUnit} onValueChange={setFromUnit}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(currentType.units).map(([key, unit]) => (
                      <SelectItem key={key} value={key}>
                        {t((unit as any).nameKey)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="input-value">{t('value')}</Label>
                <Input
                  id="input-value"
                  type="number"
                  value={inputValue}
                  onChange={(e) => handleInputChange(e.target.value)}
                  placeholder={t('enterValue')}
                  className="text-right text-lg font-semibold"
                />
              </div>
            </CardContent>
          </Card>

          {/* Swap Button */}
          <div className="flex justify-center">
            <button
              onClick={swapUnits}
              className="bg-primary/20 hover:bg-primary/30 text-primary p-3 rounded-full transition-all duration-200 rotate-90"
            >
              <Calculator size={20} />
            </button>
          </div>

          {/* To Unit */}
          <Card className="border-l-4 border-l-accent">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{t('to')}</CardTitle>
                <Badge variant="secondary" className="bg-accent/20 text-accent">
                  {t(currentType.nameKey as any)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="to-unit">{t('unitType')}</Label>
                <Select value={toUnit} onValueChange={setToUnit}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(currentType.units).map(([key, unit]) => (
                      <SelectItem key={key} value={key}>
                        {t((unit as any).nameKey)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="result">{t('result')}</Label>
                <Input
                  id="result"
                  value={result}
                  readOnly
                  className="bg-gradient-to-r from-accent/20 to-primary/20 text-right font-bold text-xl border-accent/50"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Conversion Info */}
        {result && inputValue && (
          <Card className="mt-6 bg-gradient-to-r from-success/10 to-info/10 border-success/20">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-sm text-muted-foreground mb-1">
                  {t('conversionResult')}
                </div>
                <div className="text-lg font-bold">
                  {inputValue} {t((currentType.units as any)[fromUnit].nameKey)} = {result} {t((currentType.units as any)[toUnit].nameKey)}
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
