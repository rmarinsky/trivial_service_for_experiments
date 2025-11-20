'use client';

import { UserForm } from '@/components/UserForm';
import { ResponseDisplay } from '@/components/ResponseDisplay';
import { useUserCreation } from '@/hooks/useUserCreation';

export default function Home() {
  const {
    username,
    email,
    isLoading,
    response,
    requestMetadata,
    setUsername,
    setEmail,
    handleSubmit,
  } = useUserCreation();

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow-md rounded-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            Playwright Response Test
          </h1>

          <UserForm
            username={username}
            email={email}
            isLoading={isLoading}
            onUsernameChange={setUsername}
            onEmailChange={setEmail}
            onSubmit={handleSubmit}
          />

          {response && (
            <ResponseDisplay response={response} metadata={requestMetadata} />
          )}
        </div>

        <div className="mt-4 text-center text-sm text-gray-500">
          <p>Open browser console to see detailed timing logs</p>
          <p className="mt-1">Network request includes full round-trip time</p>
        </div>
      </div>
    </div>
  );
}
