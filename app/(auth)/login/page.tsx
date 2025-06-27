import AuthForm from '../../../components/AuthForm';
import Link from 'next/link';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center">
      <AuthForm mode="login" />
      <p className="mt-4 text-center">
        Don&apos;t have an account?{' '}
        <Link href="/signup" className="text-[#f02e65] underline">Sign up</Link>
      </p>
    </div>
  );
} 