import { useState } from 'react';
import { MessageSquare, Send, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

import { useLanguage } from '@/src/lib/LanguageContext';

export function FeedbackDialog() {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [email, setEmail] = useState('');
  const [type, setType] = useState<'feedback' | 'issue'>('feedback');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedback.trim()) return;

    setIsSubmitting(true);
    
    // Simulate a real submission delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    console.log('Feedback submitted:', { type, email, feedback });
    
    toast.success(t.feedback.success, {
      icon: <CheckCircle2 className="w-4 h-4 text-green-500" />,
    });

    setFeedback('');
    setEmail('');
    setIsSubmitting(false);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger
        render={
          <Button variant="outline" className="gap-2 border-primary/20 hover:bg-primary/5">
            <MessageSquare className="w-4 h-4 text-primary" />
            <span className="hidden sm:inline">{t.feedback.title}</span>
          </Button>
        }
      />
      <DialogContent className="sm:max-w-[425px]" dir="rtl">
        <DialogHeader className="text-right">
          <DialogTitle className="text-xl font-bold flex items-center gap-2 justify-end">
            {t.feedback.title}
            <MessageSquare className="w-5 h-5 text-primary" />
          </DialogTitle>
          <DialogDescription className="text-right">
            {t.feedback.desc}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="flex gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
            <button
              type="button"
              onClick={() => setType('feedback')}
              className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all ${
                type === 'feedback' 
                  ? 'bg-white dark:bg-slate-700 shadow-sm text-primary' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {t.feedback.typeIdea}
            </button>
            <button
              type="button"
              onClick={() => setType('issue')}
              className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all ${
                type === 'issue' 
                  ? 'bg-white dark:bg-slate-700 shadow-sm text-destructive' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {t.feedback.typeBug}
            </button>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-xs font-bold uppercase tracking-wider block text-right">ئیمەیل (ئارەزوومەندانە)</Label>
            <Input
              id="email"
              type="email"
              placeholder="example@mail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="text-right h-10"
              dir="ltr"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="feedback" className="text-xs font-bold uppercase tracking-wider block text-right">{t.feedback.message}</Label>
            <Textarea
              id="feedback"
              placeholder={t.feedback.message}
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className="min-h-[120px] text-right resize-none"
              required
            />
          </div>

          <DialogFooter className="flex-row-reverse sm:justify-start gap-2 pt-2">
            <Button type="submit" disabled={isSubmitting || !feedback.trim()} className="w-full sm:w-auto gap-2">
              {isSubmitting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                </>
              ) : (
                <>
                  {t.feedback.send}
                  <Send className="w-4 h-4 ml-1" />
                </>
              )}
            </Button>
            <Button type="button" variant="ghost" onClick={() => setIsOpen(false)} className="w-full sm:w-auto">
              پەشیمانبوونەوە
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function RefreshCw(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
      <path d="M21 3v5h-5" />
      <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
      <path d="M3 21v-5h5" />
    </svg>
  );
}
