import { prisma } from '@lib/prisma';
import { NextResponse } from 'next/server';

export const OPTIONS = async (request: Request) => {
  return new Response('', {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
};

export const POST = async (request: Request) => {
  const { identifier, name, password } = (await request.json()) as {
    identifier: string;
    name: string;
    password: string;
  };

  const newMerchant = await prisma.merchant.create({
    data: {
      shopId: identifier,
      campaigns: { create: { name, password, theme: { create: { primaryColor: '#000' } } } },
    },
    include: {
      campaigns: {
        include: {
          theme: true,
        },
      },
    },
  });

  return new NextResponse(JSON.stringify({ success: true }), {
    status: 201,
  });
};
