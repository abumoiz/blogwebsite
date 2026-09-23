'use client';

import { useRouter } from 'next/navigation';
import AuthForm from '../components/AuthForm';
import { useAuth } from '../context/AuthContext';

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();

  const handleRegister = async (formData) => {
    await register(formData.username, formData.email, formData.password);
    router.push('/login');
  };

  return <AuthForm mode="register" onSubmit={handleRegister} />;
}