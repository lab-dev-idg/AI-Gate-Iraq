import { AdminRole, AdminIntakeItem } from './adminTypes';

export function getRoleLabelKu(role: AdminRole): string {
  switch (role) {
    case 'owner':
      return 'خاوەن دەسەڵات';
    case 'admin':
      return 'بەڕێوەبەر (Admin)';
    case 'editor':
      return 'نووسەر (Editor)';
    case 'viewer':
      return 'بینەر (Viewer)';
    default:
      return 'نادیار';
  }
}

export function getIntakeStatusLabelKu(status: AdminIntakeItem['status']): string {
  switch (status) {
    case 'new':
      return 'نوێ';
    case 'reviewing':
      return 'لە ژێر پێداچوونەوەدا';
    case 'contacted':
      return 'پەیوەندی پێوەکراوە';
    case 'closed':
      return 'داخراوە';
    case 'archived':
      return 'ئەرشیف کراوە';
    default:
      return status;
  }
}

export function getIntakeStatusColorClass(status: AdminIntakeItem['status']): string {
  switch (status) {
    case 'new':
      return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
    case 'reviewing':
      return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
    case 'contacted':
      return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
    case 'closed':
      return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
    case 'archived':
      return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
    default:
      return 'bg-slate-500/10 text-slate-500 border-slate-500/20';
  }
}

export function formatKuDate(isoString: string): string {
  try {
    const d = new Date(isoString);
    return d.toLocaleDateString('ku-IQ', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch {
    return isoString;
  }
}
