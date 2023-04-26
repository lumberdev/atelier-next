import { getAuthorizationToken } from '@lib/auth/getAuhtorizationToken';
import { verifyAuthorizationToken } from '@lib/auth/verifyAuthorizationToken';
import { credentials } from '@lib/data/credentials';
import { redirect } from 'next/navigation';
import { NextResponse } from 'next/server';

export const POST = async (request: Request) => {
  const body = (await request.json()) as { password?: string };
  const password = body.password ?? null;

  if (!password)
    return new NextResponse(JSON.stringify({ error: { message: 'Invalid request body.' } }), { status: 400 });

  const token = getAuthorizationToken({ merchantSecret: credentials.goodehealth.secret, merchantPassword: password });
  const authorized = verifyAuthorizationToken({
    token,
    merchantSecret: credentials.goodehealth.secret,
    merchantPassword: credentials.goodehealth.password,
  });

  if (!authorized)
    return new NextResponse(JSON.stringify({ error: { message: 'Incorrect password.' } }), { status: 400 });

  const response = new NextResponse(JSON.stringify({ authorized: true }));
  response.cookies.set('auth_token', token);

  return response;
};
