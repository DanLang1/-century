import { Suspense } from 'react';
import { UpdateUserForm } from '@/components/UpdateUserForm';

export default async function ConvertAnonToFullUser() {
  return (
    <Suspense>
      <UpdateUserForm />
    </Suspense>
  );
}
