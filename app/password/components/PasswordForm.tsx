'use client';

import { useRouter } from 'next/navigation';
import { FC, FormEventHandler, useEffect } from 'react';

const PasswordForm: FC<{ redirect?: string; merchant?: string }> = ({ redirect, merchant }) => {
  const router = useRouter();

  const handleSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    event?.preventDefault();

    const target = event.target as HTMLFormElement;
    const field = target.querySelector('input') as HTMLInputElement;
    const password = field.value;

    fetch('/password/submit', {
      method: 'POST',
      body: JSON.stringify({ merchant, password }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (!data.authorized) return;
        router.replace(redirect ? redirect : '/');
      });
  };

  useEffect(() => {
    if (!redirect) return;

    const url = new URL(window.location.href);
    url.search = '';

    window.history.replaceState(null, '', url);
  }, [redirect]);

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" name="password" className="text-black" minLength={8} required />

      <button type="submit">Submit</button>
    </form>
  );
};

export default PasswordForm;
