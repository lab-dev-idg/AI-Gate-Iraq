import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Package, Search, Truck, CheckCircle2, Factory, Clock, History, X, User } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from './AuthProvider';
import { db, collection, query, where, onSnapshot, addDoc, serverTimestamp, orderBy, doc, setDoc } from '@/src/lib/firebase';
import { useLanguage } from '@/src/lib/LanguageContext';

interface Milestone {
  status: string;
  location: string;
  date: string;
  time: string;
  icon: React.ReactNode;
  isCompleted: boolean;
}

interface ShipmentData {
  id?: string;
  trackingNumber: string;
  status: string;
  origin: string;
  destination: string;
  estimatedDelivery: string;
  milestones?: Milestone[];
}

const MOCK_SHIPMENTS: Record<string, ShipmentData> = {
  'LX123456789': {
    trackingNumber: 'LX123456789',
    status: 'لە گواستنەوەدایە',
    origin: 'ئەستەنبوڵ، تورکیا',
    destination: 'هەولێر، عێراق',
    estimatedDelivery: '٢٠٢٤/٠٤/٢٥',
    milestones: [
      { status: 'وەرگیرا', location: 'ئەستەنبوڵ، تورکیا', date: '٢٠٢٤/٠٤/١٨', time: '١٠:٣٠ بەیانی', icon: <Factory className="w-4 h-4" />, isCompleted: true },
      { status: 'گەیشتە مەرز', location: 'ئیبراهیم خەلیل', date: '٢٠٢٤/٠٤/٢٠', time: '٠٣:١٥ پاشنیوەڕۆ', icon: <Package className="w-4 h-4" />, isCompleted: true },
      { status: 'لە گواستنەوەدایە', location: 'ڕێگای مووسڵ-هەولێر', date: '٢٠٢٤/٠٤/٢١', time: '٠٩:٠٠ بەیانی', icon: <Truck className="w-4 h-4" />, isCompleted: true },
      { status: 'بۆ گەیاندن', location: 'هەولێر', date: '--', time: '--', icon: <Clock className="w-4 h-4" />, isCompleted: false },
      { status: 'گەیەنرا', location: 'هەولێر', date: '--', time: '--', icon: <CheckCircle2 className="w-4 h-4" />, isCompleted: false },
    ]
  }
};

export function ShipmentTracker() {
  const { lang, t } = useLanguage();
  const { user } = useAuth();
  const [trackingId, setTrackingId] = useState('');
  const [shipment, setShipment] = useState<ShipmentData | null>(null);
  const [history, setHistory] = useState<ShipmentData[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, `users/${user.uid}/shipments`),
      orderBy('updatedAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const historyData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as ShipmentData[];
      setHistory(historyData);
    });

    return () => unsubscribe();
  }, [user]);

  const handleTrack = async (idToTrack?: string) => {
    const id = (idToTrack || trackingId).trim().toUpperCase();
    if (!id) return;
    
    setIsSearching(true);
    setError('');
    setShowHistory(false);
    
    // Simulate API delay
    setTimeout(async () => {
      const data = MOCK_SHIPMENTS[id];
      if (data) {
        setShipment(data);
        // Save to Firebase if user is logged in
        if (user) {
          const shipmentRef = doc(db, `users/${user.uid}/shipments`, id);
          await setDoc(shipmentRef, {
            trackingNumber: data.trackingNumber,
            status: data.status,
            estimatedDelivery: data.estimatedDelivery,
            userId: user.uid,
            updatedAt: serverTimestamp()
          });
        }
      } else {
        setError('ببورە، ئەم ژمارەیە نەدۆزرایەوە. تکایە LX123456789 تاقی بکەرەوە.');
        setShipment(null);
      }
      setIsSearching(false);
    }, 800);
  };

  return (
    <Card className="border border-slate-200/60 dark:border-slate-800/60 shadow-sm bg-white dark:bg-slate-900/80 rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800/80">
        <CardTitle className="text-lg flex items-center justify-between text-slate-950 dark:text-white font-arabic">
          <div className="flex items-center gap-2">
            <Truck className="w-5 h-5 text-emerald-500" />
            {t.tracker.title}
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setShowHistory(!showHistory)}
            className="h-8 px-2 text-xs gap-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-emerald-600 dark:text-emerald-400 font-bold"
          >
            <History className="w-4 h-4" />
            {t.tracker.history}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4 space-y-4">
        {!showHistory ? (
          <>
            <div className="flex gap-2">
              <Input 
                placeholder={t.tracker.placeholder} 
                value={trackingId}
                onChange={(e) => setTrackingId(e.target.value)}
                className="bg-slate-50/50 dark:bg-slate-900 border-slate-200/80 rounded-xl h-10 text-right"
                onKeyDown={(e) => e.key === 'Enter' && handleTrack()}
              />
              <Button onClick={() => handleTrack()} disabled={isSearching} size="icon" className="h-10 w-10 bg-emerald-500 hover:bg-emerald-600 dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white rounded-xl">
                <Search className={`w-4 h-4 ${isSearching ? 'animate-pulse' : ''}`} />
              </Button>
            </div>

            {error && (
              <p className="text-xs text-red-500 text-right">{error}</p>
            )}

            <AnimatePresence mode="wait">
              {shipment && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-2 gap-2 text-[11px] p-3 bg-slate-50/50 dark:bg-slate-950/40 rounded-2xl border border-slate-100 dark:border-slate-800/80">
                    <div className="text-right">
                      <span className="text-slate-400 block mb-0.5">دۆخ:</span>
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">{shipment.status}</span>
                    </div>
                    <div className="text-right border-r border-slate-200 dark:border-slate-800 pr-3">
                      <span className="text-slate-400 block mb-0.5">گەیاندنی پێشبینیکراو:</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">{shipment.estimatedDelivery}</span>
                    </div>
                  </div>

                  <div className="relative space-y-4 pr-4">
                    <div className="absolute right-[19px] top-2 bottom-2 w-0.5 bg-slate-100 dark:bg-slate-800" />
                    
                    {shipment.milestones?.map((step, idx) => (
                      <div key={idx} className="relative flex items-start flex-row-reverse gap-3">
                        <div className={`z-10 w-10 h-10 rounded-full flex items-center justify-center shrink-0 border-4 border-white dark:border-slate-900 ${step.isCompleted ? 'bg-primary text-white shadow-md shadow-primary/10' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}>
                          {step.icon}
                        </div>
                        
                        <div className="text-right flex-1 pt-1.5">
                          <p className={`text-xs font-bold ${step.isCompleted ? 'text-slate-900 dark:text-white' : 'text-slate-400 dark:text-slate-500'}`}>
                            {step.status}
                          </p>
                          <p className="text-[10px] text-slate-400 dark:text-slate-500">
                            {step.location} • {step.date}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            
            {!shipment && !error && (
              <div className="text-center py-6 opacity-45">
                <Package className="w-8 h-8 mx-auto mb-2 text-slate-300 dark:text-slate-700" />
                <p className="text-[10px] text-slate-500 dark:text-slate-400">{t.tracker.placeholder}</p>
              </div>
            )}
          </>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500">{t.tracker.history}</span>
              <Button variant="ghost" size="icon" className="h-6 w-6 mt-0.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md" onClick={() => setShowHistory(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
            <div className="space-y-2 max-h-64 overflow-y-auto pr-1 cs-scroll">
              {!user ? (
                <div className="text-center py-6 px-2 bg-slate-50/50 dark:bg-slate-900/40 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
                  <User className="w-8 h-8 mx-auto mb-2 text-slate-300 dark:text-slate-700" />
                  <p className="text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">Authorization Required</p>
                  <p className="text-[10px] text-slate-500">Please sign in to track history</p>
                </div>
              ) : history.length === 0 ? (
                <div className="text-center py-6 opacity-45">
                  <History className="w-8 h-8 mx-auto mb-2 text-slate-300 dark:text-slate-700" />
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">{t.tracker.noHistory}</p>
                </div>
              ) : (
                history.map((item) => (
                <div 
                  key={item.id} 
                  className="p-3 rounded-xl border border-slate-100 dark:border-slate-800/80 hover:border-emerald-500/30 transition-all cursor-pointer group bg-slate-50/40 dark:bg-slate-950/20 hover:shadow-sm"
                  onClick={() => handleTrack(item.trackingNumber)}
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-xs font-bold font-mono text-emerald-600 dark:text-emerald-400">{item.trackingNumber}</span>
                    <span className="text-[10px] bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400 px-1.5 py-0.5 rounded-full font-bold">
                      {item.status}
                    </span>
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-400">
                    <span>گەیاندن: {item.estimatedDelivery}</span>
                  </div>
                </div>
              )))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
