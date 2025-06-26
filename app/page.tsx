import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-white">
      <h1 className="text-4xl font-bold mb-4">EventOrg</h1>
      <p className="mb-8 text-center text-gray-600 max-w-md">
        Effortlessly create, share, and manage your events. Collect RSVPs, track attendance, and keep everything organized in one place.
      </p>
      <div className="flex gap-4">
        <Link href="/login" className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800 transition">Login</Link>
        <Link href="/signup" className="border border-black px-6 py-2 rounded hover:bg-gray-100 transition">Sign Up</Link>
      </div>
    </main>
  );
}
