import { useCallback, useState } from 'react';
import AdminPanelV3 from './AdminPanelV3';
import { FirebaseAdminGate } from './FirebaseAdminGate';

export default function SecureAdminPanel() {
  const [adminToken, setAdminToken] = useState<string | null>(null);

  const handleSuccess = useCallback((token: string) => {
    sessionStorage.setItem('ai-gate-iraq-admin-auth', 'true');
    setAdminToken(token);
  }, []);

  const handleBackToApp = useCallback(() => {
    window.location.href = '/';
  }, []);

  if (!adminToken) {
    sessionStorage.removeItem('ai-gate-iraq-admin-auth');
    return (
      <FirebaseAdminGate
        onSuccess={handleSuccess}
        onBackToApp={handleBackToApp}
      />
    );
  }

  return <AdminPanelV3 adminToken={adminToken} />;
}
