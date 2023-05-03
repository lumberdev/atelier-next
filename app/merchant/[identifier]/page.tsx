import { authorizeRequest } from '@lib/auth/authorizeRequest';
import { prisma } from '@lib/prisma';
import { redirect } from 'next/navigation';

const MerchantPage = async ({ params }: { params: { identifier: string } }) => {
  const merchant = await prisma.merchant.findUnique({
    where: { storeId: params.identifier },
    include: { campaigns: { include: { theme: true } } },
  });

  const [campaign] = merchant?.campaigns ?? [];
  const theme = campaign?.theme;

  const merchantSecret = merchant?.secret ?? '';
  const merchantPassword = campaign?.password ?? '';

  const authorized = authorizeRequest({
    merchantSecret,
    merchantPassword,
  });

  console.log({ authorized, merchantSecret, merchantPassword });

  if (!authorized) {
    const search = new URLSearchParams({ redirect: `/merchant/${params.identifier}` });
    redirect(`/password?${search.toString()}`);
  }

  return (
    <div className="w-full min-h-screen flex flex-col justify-center items-center">
      <h1 className="text-5xl">MerchantPage</h1>

      <pre>{JSON.stringify(merchant ?? {}, null, 2)}</pre>
    </div>
  );
};

export default MerchantPage;
