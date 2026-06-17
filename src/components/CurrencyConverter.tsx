import { useEffect, useState } from 'react';
import { AlertCircle, ArrowLeftRight, Landmark, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/src/lib/LanguageContext';
import { loadSession, saveSession, addServiceAction } from '@/src/lib/sessionStore';

interface Rates { [key: string]: number }

export function CurrencyConverter() {
  const { lang, t } = useLanguage();
  const [amount, setAmount] = useState(() => loadSession().drafts.currencyAmount || '1');
  const [fromCurrency, setFromCurrency] = useState(() => loadSession().drafts.currencyFrom || 'USD');
  const [toCurrency, setToCurrency] = useState(() => loadSession().drafts.currencyTo || 'IQD');
  const [rates, setRates] = useState<Rates>({});
  const [result, setResult] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState('');
  const [error, setError] = useState('');

  const currencies = ['USD', 'IQD', 'EUR', 'GBP', 'TRY', 'CNY', 'AED'];

  useEffect(() => {
    saveSession({ drafts: { currencyAmount: amount, currencyFrom: fromCurrency, currencyTo: toCurrency } });
  }, [amount, fromCurrency, toCurrency]);

  const fetchRates = async () => {
    setIsLoading(true);
    setError('');
    try {
      const response = await fetch(`https://api.exchangerate-api.com/v4/latest/${fromCurrency}`);
      if (!response.ok) throw new Error(`RATE_HTTP_${response.status}`);
      const data = await response.json();
      if (!data?.rates || typeof data.rates !== 'object') throw new Error('INVALID_RATE_RESPONSE');
      setRates(data.rates);
      setLastUpdate(new Date().toLocaleTimeString(lang === 'ar' ? 'ar-IQ' : 'ku', { hour: '2-digit', minute: '2-digit' }));
    } catch {
      setRates({});
      setResult(null);
      setError(lang === 'ar' ? 'تعذر تحميل سعر الصرف الحالي. حاول مرة أخرى.' : 'نرخی ئێستای دراو بار نەکرا؛ تکایە دووبارە هەوڵ بدەوە.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { void fetchRates(); }, [fromCurrency]);

  useEffect(() => {
    const numericAmount = Number(amount);
    const rate = rates[toCurrency];
    if (Number.isFinite(numericAmount) && numericAmount >= 0 && Number.isFinite(rate)) {
      setResult(numericAmount * rate);
    } else {
      setResult(null);
    }
  }, [amount, toCurrency, rates]);

  const swapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  const recordConversion = () => {
    if (result !== null) addServiceAction(`Converted ${amount} ${fromCurrency} to ${toCurrency}`, 'currency');
  };

  return (
    <Card className="border border-slate-700 bg-[#0E1728] shadow-lg rounded-2xl text-slate-100">
      <CardHeader className="border-b border-slate-700/80 pb-4">
        <CardTitle className="flex items-center gap-2 text-xl font-black text-white">
          <Landmark className="h-5 w-5 text-emerald-400" />
          {t.converter.title}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-5 p-6">
        <div className="space-y-2 text-right">
          <Label htmlFor="amount" className="block text-sm font-bold text-slate-200">{t.converter.amount}</Label>
          <Input
            id="amount"
            type="number"
            min="0"
            step="any"
            value={amount}
            onChange={event => setAmount(event.target.value)}
            className="h-12 rounded-xl border-slate-600 bg-[#111D31] px-4 text-lg font-bold text-white placeholder:text-slate-500 focus-visible:border-emerald-400 focus-visible:ring-emerald-400/30"
            dir="ltr"
          />
        </div>

        <div className="grid grid-cols-1 items-end gap-3 md:grid-cols-[1fr_auto_1fr]" dir="rtl">
          <CurrencyField label={t.converter.from} value={fromCurrency} onChange={setFromCurrency} currencies={currencies} />
          <Button type="button" variant="outline" size="icon" onClick={swapCurrencies} className="mx-auto h-11 w-11 rounded-full border-slate-600 bg-[#111D31] text-emerald-400 hover:bg-slate-700 hover:text-emerald-300">
            <ArrowLeftRight className="h-4 w-4 rotate-90 md:rotate-0" />
          </Button>
          <CurrencyField label={t.converter.to} value={toCurrency} onChange={setToCurrency} currencies={currencies} />
        </div>

        {error && (
          <div className="flex items-start gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-sm font-medium text-rose-200">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{error}</span>
            <button onClick={() => void fetchRates()} className="mr-auto font-black text-rose-100 underline">{lang === 'ar' ? 'إعادة المحاولة' : 'دووبارە'}</button>
          </div>
        )}

        <div className="rounded-2xl border border-slate-700 bg-[#091222] p-6 text-center">
          {isLoading ? (
            <RefreshCw className="mx-auto h-6 w-6 animate-spin text-emerald-400" />
          ) : result !== null ? (
            <>
              <div className="text-3xl font-black tracking-tight text-emerald-400" dir="ltr">
                {toCurrency} {result.toLocaleString(undefined, { maximumFractionDigits: 2 })}
              </div>
              <div className="mt-2 text-xs font-bold text-slate-300">
                {t.converter.marketRate} {lastUpdate}
              </div>
              <button onClick={recordConversion} className="mt-4 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-xs font-black text-emerald-300 hover:bg-emerald-500/20">
                {lang === 'ar' ? 'حفظ العملية' : 'تۆمارکردنی مامەڵە'}
              </button>
            </>
          ) : !error ? (
            <div className="text-sm font-medium text-slate-300">{t.converter.noRate}</div>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}

function CurrencyField({ label, value, onChange, currencies }: { label: string; value: string; onChange: (value: string) => void; currencies: string[] }) {
  return (
    <div className="space-y-2 text-right">
      <Label className="block text-sm font-bold text-slate-200">{label}</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="h-12 rounded-xl border-slate-600 bg-[#111D31] px-4 text-sm font-black text-white focus:ring-emerald-400/30">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="border-slate-700 bg-[#111D31] text-white">
          {currencies.map(currency => <SelectItem key={currency} value={currency} className="text-sm font-bold focus:bg-slate-700 focus:text-white">{currency}</SelectItem>)}
        </SelectContent>
      </Select>
    </div>
  );
}

export default CurrencyConverter;
