import PasswordForm from './components/PasswordForm';

const PasswordPage = ({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) => {
  const redirect = (searchParams?.redirect as string) ?? '';
  const [merchant] = redirect.split('/').reverse();

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1>Password</h1>

      <PasswordForm redirect={redirect} merchant={merchant} />
    </main>
  );
};

export default PasswordPage;
