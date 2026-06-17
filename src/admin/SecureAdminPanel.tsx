import { useCallback, useState } from 'react';
import AdminPanel from './AdminPanel';
import { FirebaseAdminGate } from './FirebaseAdminGate';

export default function SecureAdminPanel() {
  const [verified, setVerified] = useState(false);

  const handleSuccess = useCallback(() => {
    sessionStorage.setItem('ai-gate-iraq-admin-auth', 'true');
    setVerified(true);
  }, []);

  const handleBackToApp = useCallback(() => {
    window.location.href = '/';
  }, []);

  if (!verified) {
    sessionStorage.removeItem('ai-gate-iraq-admin-auth');
    return (
      <FirebaseAdminGate
        onSuccess={handleSuccess}
        onBackToApp={handleBackToApp}
      />
    );
  }

  return <AdminPanel />;
}
