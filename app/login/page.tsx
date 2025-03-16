import { Suspense } from 'react';
import { AuthenticationForm } from '@/components/AuthenticationForm';

export default function LoginPage() {
  return (
    <Suspense>
      <AuthenticationForm />
    </Suspense>
  );
}
