'use client';

import { useRouter } from 'next/navigation';
import AuthForm from '../components/AuthForm';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();

  const handleLogin = async (formData) => {
    await login(formData.email, formData.password);
    router.push('/');
  };

  return <AuthForm mode="login" onSubmit={handleLogin} />;
}