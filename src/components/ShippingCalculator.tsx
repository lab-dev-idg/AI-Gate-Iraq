import { useState, useEffect } from 'react';
import { Calculator, Scale, Maximize, Zap, Info, DollarSign } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useLanguage } from '@/src/lib/LanguageContext';
import { loadSession, saveSession, addServiceAction } from '@/src/lib/sessionStore';

export function ShippingCalculator() {
  const { lang, t } = useLanguage();
  const [origin, setOrigin] = useState<string>(() => loadSession().drafts.costOrigin || 'China');
  const [destination, setDestination] = useState<string>(() => loadSession().drafts.costDestination || 'Baghdad');
  const [weight, setWeight] = useState<string>(() => loadSession().drafts.costWeight || '');
  const [length, setLength] = useState<string>('');
  const [width, setWidth] = useState<string>('');
  const [height, setHeight] = useState<string>('');
  const [speed, setSpeed] = useState<string>(() => loadSession().drafts.costCargoType || 'standard');
  const [estimatedCost, setEstimatedCost] = useState<number | null>(null);
  const [iqdCost, setIqdCost] = useState<number | null>(null);
  const [iqdRate, setIqdRate] = useState<number>(1310);

  const ORIGINS = ['China', 'Turkey', 'UAE', 'Jordan', 'Europe', 'USA'];
  const DESTINATIONS = ['Baghdad', 'Erbil', 'Basra', 'Sulaymaniyah', 'Duhok', 'Najaf'];

  useEffect(() => {
    saveSession({
      drafts: {
        costOrigin: origin,
        costDestination: destination,
        costWeight: weight,
        costCargoType: speed,
      }
    });
  }, [origin, destination, weight, speed]);

  // Fetch current IQD rate for integration
  useEffect(() => {
    const fetchRate = async () => {
      try {
        const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
        const data = await response.json();
        if (data.rates.IQD) {
          setIqdRate(data.rates.IQD);
        }
      } catch (error) {
        console.error('Error fetching IQD rate for calculator:', error);
      }
    };
    fetchRate();
  }, []);

  const calculateCost = () => {
    const w = parseFloat(weight) || 0;
    const l = parseFloat(length) || 0;
    const wi = parseFloat(width) || 0;
    const h = parseFloat(height) || 0;

    if (w === 0) {
      setEstimatedCost(null);
      return;
    }

    // Volumetric weight (common industry standard: L*W*H / 5000)
    const volWeight = (l * wi * h) / 5000;
    const chargeableWeight = Math.max(w, volWeight);

    // Base mock calculation logic based on origin
    let baseRate = 20; // Default base handling fee in USD
    let perKgRate = 6; // Default $6 per kg

    // Adjust rates based on origin (mock distance factors)
    const originRates: Record<string, { base: number; perKg: number }> = {
      'China': { base: 50, perKg: 8 },
      'Turkey': { base: 25, perKg: 4 },
      'UAE': { base: 30, perKg: 5 },
      'Jordan': { base: 20, perKg: 3.5 },
      'Europe': { base: 45, perKg: 9 },
      'USA': { base: 60, perKg: 12 }
    };

    if (originRates[origin]) {
      baseRate = originRates[origin].base;
      perKgRate = originRates[origin].perKg;
    }

    // Speed modifiers
    if (speed === 'express') {
      baseRate *= 1.5;
      perKgRate *= 1.5;
    } else if (speed === 'urgent') {
      baseRate *= 2.5;
      perKgRate *= 2.2;
    }

    const totalUsd = baseRate + (chargeableWeight * perKgRate);
    setEstimatedCost(totalUsd);
    setIqdCost(totalUsd * iqdRate);
    if (w > 0) {
      addServiceAction(`Calculated shipping cost: ${w} kg from ${origin} to ${destination}`, 'cost');
    }
  };

  useEffect(() => {
    calculateCost();
  }, [origin, destination, weight, length, width, height, speed, iqdRate]);

  return (
    <Card className="border border-slate-200/60 dark:border-slate-800/60 shadow-sm bg-white dark:bg-slate-900/80 rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800/80">
        <CardTitle className="text-lg flex items-center justify-between font-arabic text-slate-950 dark:text-white">
          <div className="flex items-center gap-2">
            <Calculator className="w-5 h-5 text-emerald-500" />
            {t.calculator.title}
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Info className="w-4 h-4 text-slate-400 cursor-help" />
              </TooltipTrigger>
              <TooltipContent className="max-w-[200px] text-[10px] bg-slate-900 dark:bg-slate-800 text-white rounded-lg p-2">
                {t.calculator.tooltip}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-5 p-6 space-y-4">
        {/* Origin & Destination */}
        <div className="grid grid-cols-2 gap-3" dir="rtl">
          <div className="space-y-1.5 text-right">
            <Label className="text-[10px] font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider font-arabic">{t.calculator.origin}</Label>
            <Select value={origin} onValueChange={setOrigin}>
              <SelectTrigger className="h-11 text-xs bg-slate-50/50 dark:bg-slate-900 border-slate-200/80 rounded-xl px-4 font-semibold">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ORIGINS.map(o => <SelectItem key={o} value={o} className="text-xs font-medium">{o}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5 text-right">
            <Label className="text-[10px] font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider font-arabic">{t.calculator.destination}</Label>
            <Select value={destination} onValueChange={setDestination}>
              <SelectTrigger className="h-11 text-xs bg-slate-50/50 dark:bg-slate-900 border-slate-200/80 rounded-xl px-4 font-semibold">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {DESTINATIONS.map(d => <SelectItem key={d} value={d} className="text-xs font-medium">{d}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Weight Input */}
        <div className="space-y-2 text-right" dir="rtl">
          <div className="flex items-center justify-between mb-1">
            <Label htmlFor="weight" className="text-xs font-black text-slate-700 dark:text-slate-300 font-arabic">{t.calculator.weight}</Label>
            <Scale className="w-3.5 h-3.5 text-emerald-500/85" />
          </div>
          <Input
            id="weight"
            type="number"
            placeholder="0.00"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            className="h-11 text-right bg-slate-50/50 dark:bg-slate-900 border-slate-200/80 rounded-xl px-4 font-semibold shadow-inner focus-visible:ring-emerald-500"
            dir="ltr"
          />
        </div>

        {/* Dimensions Grid */}
        <div className="space-y-2 text-right" dir="rtl">
          <div className="flex items-center justify-between mb-1">
            <Label className="text-xs font-black text-slate-700 dark:text-slate-300 font-arabic">{t.calculator.dimensions}</Label>
            <Maximize className="w-3.5 h-3.5 text-emerald-500/85" />
          </div>
          <div className="grid grid-cols-3 gap-2">
            <Input
              placeholder="L"
              type="number"
              value={length}
              onChange={(e) => setLength(e.target.value)}
              className="h-11 text-center text-xs bg-slate-50/50 dark:bg-slate-900 border-slate-200/80 rounded-xl font-semibold shadow-inner focus-visible:ring-emerald-500"
              dir="ltr"
            />
            <Input
              placeholder="W"
              type="number"
              value={width}
              onChange={(e) => setWidth(e.target.value)}
              className="h-11 text-center text-xs bg-slate-50/50 dark:bg-slate-900 border-slate-200/80 rounded-xl font-semibold shadow-inner focus-visible:ring-emerald-500"
              dir="ltr"
            />
            <Input
              placeholder="H"
              type="number"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              className="h-11 text-center text-xs bg-slate-50/50 dark:bg-slate-900 border-slate-200/80 rounded-xl font-semibold shadow-inner focus-visible:ring-emerald-500"
              dir="ltr"
            />
          </div>
        </div>

        {/* Shipping Speed */}
        <div className="space-y-2 text-right" dir="rtl">
          <div className="flex items-center justify-between mb-1">
            <Label className="text-xs font-black text-slate-700 dark:text-slate-300 font-arabic">{t.calculator.speed}</Label>
            <Zap className="w-3.5 h-3.5 text-emerald-500/85" />
          </div>
          <Select value={speed} onValueChange={setSpeed}>
            <SelectTrigger className="h-11 text-xs bg-slate-50/50 dark:bg-slate-900 border-slate-200/80 rounded-xl px-4 font-semibold">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="standard" className="text-xs font-medium">{t.calculator.speedStandard}</SelectItem>
              <SelectItem value="express" className="text-xs font-medium">{t.calculator.speedExpress}</SelectItem>
              <SelectItem value="urgent" className="text-xs font-medium">{t.calculator.speedUrgent}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Result Area */}
        <div className="mt-5 p-5 rounded-2xl bg-slate-50/50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-800/80 space-y-3">
          <div className="flex flex-col items-center">
            <p className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-black tracking-widest mb-1.5 font-sans">{t.calculator.estimatedCost}</p>
            {estimatedCost !== null ? (
              <div className="text-center">
                <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono tracking-tight flex items-center justify-center gap-0.5">
                  <DollarSign className="w-5 h-5 shrink-0" />
                  {estimatedCost.toFixed(2)}
                </div>
                {iqdCost !== null && (
                  <div className="text-sm font-bold text-slate-500 mt-1 font-mono">
                    ≈ {iqdCost.toLocaleString()} IQD
                  </div>
                )}
              </div>
            ) : (
              <div className="text-xs text-slate-400 dark:text-slate-500 italic py-2 font-arabic">{t.calculator.completeInfo}</div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
