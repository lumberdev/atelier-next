'use client';

import { useRouter } from 'next/navigation';
import { FormEventHandler } from 'react';

const PasswordForm = () => {
  const router = useRouter();

  const handleSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    event?.preventDefault();

    const target = event.target as HTMLFormElement;
    const field = target.querySelector('input') as HTMLInputElement;
    const password = field.value;

    fetch('/password/submit', {
      method: 'POST',
      body: JSON.stringify({ password }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (!data.authorized) return;
        router.replace('/');
      });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" name="password" className="text-black" minLength={8} required />

      <button type="submit">Submit</button>
    </form>
  );
};

export default PasswordForm;
