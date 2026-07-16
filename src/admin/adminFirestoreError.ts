interface FirebaseErrorLike {
  code?: unknown;
}

const getErrorCode = (error: unknown): string => {
  if (typeof error !== 'object' || error === null || !('code' in error)) return '';
  const code = (error as FirebaseErrorLike).code;
  return typeof code === 'string' ? code : '';
};

export const getAdminFirestoreErrorMessage = (
  error: unknown,
  fallback: string,
): string => {
  const code = getErrorCode(error);

  if (code.endsWith('permission-denied')) {
    return 'Firestore rules ـی production لەگەڵ وەشانی Admin Panel هاوتا نییە، یان ڕێگەپێدانی ئادمین تەواو نییە.';
  }

  if (code.endsWith('unauthenticated')) {
    return 'دانیشتنی ئادمین بەسەرچووە؛ تکایە دووبارە بچۆرە ژوورەوە.';
  }

  if (code.endsWith('unavailable')) {
    return 'Firestore بەردەست نییە؛ پەیوەندی ئینتەرنێت بپشکنە و دووبارە هەوڵ بدەرەوە.';
  }

  return fallback;
};
