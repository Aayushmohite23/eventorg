import AuthForm from '../../../components/AuthForm';
import Link from 'next/link';

export default function SignupPage() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center">
      <AuthForm mode="signup" />
      <p className="mt-4 text-center">
        Already have an account?{' '}
        <Link href="/login" className="text-[#f02e65] underline">Login</Link>
      </p>
    </div>
  );
} 