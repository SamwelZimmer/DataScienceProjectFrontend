'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Toaster } from 'react-hot-toast';

import { signIn } from '../../../lib/helpers';
import { successToast, errorToast } from '../../../lib/toasties';


export default function AdminPage() {

  const [password, setPassword] = useState("");

  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (signIn(password)) {
      router.push("/uploader")
      successToast("welcome back")
    } else {
      errorToast("dun goofed")
    }

  }
  
  return (
    <>
      <main className='w-screen h-screen flex items-center justify-center'>
        <form onSubmit={handleSubmit}>
          <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" id="source" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="to the kitchen" required />
        </form>
      </main>

      <Toaster />
    </>
  )
}
