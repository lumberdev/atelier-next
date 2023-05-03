import { getAuthorizationToken } from '@lib/auth/getAuhtorizationToken';
import { verifyAuthorizationToken } from '@lib/auth/verifyAuthorizationToken';
import { NextResponse } from 'next/server';
import { prisma } from '@lib/prisma';

export const POST = async (request: Request) => {
  const body = (await request.json()) as { password?: string; merchant?: string };
  const password = body.password ?? null;
  const merchantIdentifier = body.merchant ?? null;

  if (!password || !merchantIdentifier)
    return new NextResponse(JSON.stringify({ error: { message: 'Invalid request body.' } }), { status: 400 });

  const merchant = await prisma?.merchant.findUnique({
    where: { storeId: merchantIdentifier },
    select: { secret: true, campaigns: { select: { password: true } } },
  });
  const [campaign] = merchant?.campaigns ?? [];

  if (!merchant)
    return new NextResponse(JSON.stringify({ error: { message: 'Invalid request body.' } }), { status: 400 });

  const token = getAuthorizationToken({ merchantSecret: merchant.secret!, merchantPassword: password });
  const authorized = verifyAuthorizationToken({
    token,
    merchantSecret: merchant.secret!,
    merchantPassword: campaign.password!,
  });

  if (!authorized)
    return new NextResponse(JSON.stringify({ error: { message: 'Incorrect password.' } }), { status: 400 });

  const response = new NextResponse(JSON.stringify({ authorized: true }));
  response.cookies.set('auth_token', token);

  return response;
};
