import { cookies } from 'next/headers';
import { verifyAuthorizationToken } from './verifyAuthorizationToken';

export const authorizeRequest = ({
  merchantSecret,
  merchantPassword,
}: {
  merchantSecret: string;
  merchantPassword: string;
}) => {
  const cookieStore = cookies();
  const token = cookieStore.get('auth_token');

  if (!token?.value) return false;

  return verifyAuthorizationToken({ token: token.value, merchantSecret, merchantPassword });
};
