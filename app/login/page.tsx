import { Suspense } from 'react';
import { AuthenticationForm } from '@/components/AuthenticationForm';
import { login, signup } from './actions';

export default function LoginPage() {
  return (
    <Suspense>
      <AuthenticationForm />
    </Suspense>
  );
}
