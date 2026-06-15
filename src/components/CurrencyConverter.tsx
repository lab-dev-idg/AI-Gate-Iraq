import { useState, useEffect } from 'react';
import { RefreshCw, ArrowLeftRight, Landmark } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';

import { useLanguage } from '@/src/lib/LanguageContext';
import { loadSession, saveSession, addServiceAction } from '@/src/lib/sessionStore';

interface Rates {
  [key: string]: number;
}

export function CurrencyConverter() {
  const { lang, t } = useLanguage();
  const [amount, setAmount] = useState<string>(() => loadSession().drafts.currencyAmount || '1');
  const [fromCurrency, setFromCurrency] = useState<string>(() => loadSession().drafts.currencyFrom || 'USD');
  const [toCurrency, setToCurrency] = useState<string>(() => loadSession().drafts.currencyTo || 'IQD');
  const [rates, setRates] = useState<Rates>({});
  const [result, setResult] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<string>('');

  const currencies = ['USD', 'IQD', 'EUR', 'GBP', 'TRY', 'CNY', 'AED'];

  useEffect(() => {
    saveSession({
      drafts: {
        currencyAmount: amount,
        currencyFrom: fromCurrency,
        currencyTo: toCurrency,
      }
    });
  }, [amount, fromCurrency, toCurrency]);

  const fetchRates = async () => {
    setIsLoading(true);
    try {
      // Using a widely available free endpoint for basic USD rates
      const response = await fetch(`https://api.exchangerate-api.com/v4/latest/${fromCurrency}`);
      const data = await response.json();
      setRates(data.rates);
      setLastUpdate(new Date().toLocaleTimeString());
      
      if (data.rates[toCurrency]) {
        setResult(parseFloat(amount) * data.rates[toCurrency]);
        addServiceAction(`Converted ${amount} ${fromCurrency} to ${toCurrency}`, 'currency');
      }
    } catch (error) {
      console.error('Error fetching rates:', error);
      // Fallback rates if API fails (approximate 2026 rates)
      const fallbackRates: Rates = {
        'IQD': 1310,
        'USD': 1,
        'EUR': 0.92,
        'TRY': 33,
        'AED': 3.67,
      };
      if (fromCurrency === 'USD') {
         setRates(fallbackRates);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRates();
  }, [fromCurrency]);

  useEffect(() => {
    if (rates[toCurrency] && amount) {
      setResult(parseFloat(amount) * rates[toCurrency]);
    } else {
      setResult(null);
    }
  }, [amount, toCurrency, rates]);

  const swapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  return (
    <Card className="border border-slate-200/60 dark:border-slate-800/60 shadow-sm bg-white dark:bg-slate-900/80 rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800/80">
        <CardTitle className="text-lg flex items-center gap-2 font-arabic text-slate-950 dark:text-white">
          <Landmark className="w-5 h-5 text-emerald-500" />
          {t.converter.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4 space-y-4">
        <div className="space-y-2">
          <Label htmlFor="amount" className="text-xs font-bold uppercase tracking-wider text-slate-500 mr-1">{t.converter.amount}</Label>
          <Input
            id="amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="h-10 text-right bg-slate-50/50 dark:bg-slate-900 border-slate-200/80 rounded-xl"
            dir="ltr"
          />
        </div>

        <div className="grid grid-cols-1 gap-2 items-end">
          <div className="space-y-2">
            <Label className="text-xs font-bold uppercase tracking-wider text-slate-500 mr-1">{t.converter.from}</Label>
            <Select value={fromCurrency} onValueChange={setFromCurrency}>
              <SelectTrigger className="h-10 bg-slate-50/50 dark:bg-slate-900 border-slate-200/80 rounded-xl">
                <SelectValue placeholder={lang === 'ar' ? 'العملة' : 'دراو'} />
              </SelectTrigger>
              <SelectContent>
                {currencies.map(c => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-center -my-1">
            <Button variant="ghost" size="icon" onClick={swapCurrencies} className="rounded-full hover:bg-slate-100 dark:hover:bg-slate-800">
              <ArrowLeftRight className="w-4 h-4 text-emerald-500 rotate-90 lg:rotate-0" />
            </Button>
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-bold uppercase tracking-wider text-slate-500 mr-1">{t.converter.to}</Label>
            <Select value={toCurrency} onValueChange={setToCurrency}>
              <SelectTrigger className="h-10 bg-slate-50/50 dark:bg-slate-900 border-slate-200/80 rounded-xl">
                <SelectValue placeholder={lang === 'ar' ? 'العملة' : 'دراو'} />
              </SelectTrigger>
              <SelectContent>
                {currencies.map(c => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="mt-4 p-4 rounded-2xl bg-slate-50/50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-800/80 flex flex-col items-center justify-center space-y-1">
          {isLoading ? (
            <RefreshCw className="w-5 h-5 animate-spin text-emerald-500" />
          ) : result !== null ? (
            <>
              <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono tracking-tight">
                {result.toLocaleString(undefined, { maximumFractionDigits: 2 })} {toCurrency}
              </div>
              <div className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-bold tracking-widest">
                {t.converter.marketRate} {lastUpdate}
              </div>
            </>
          ) : (
             <div className="text-sm text-slate-500">{t.converter.noRate}</div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
