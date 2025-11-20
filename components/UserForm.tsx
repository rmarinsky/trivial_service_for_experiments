import { FormEvent } from 'react';

interface UserFormProps {
  username: string;
  email: string;
  isLoading: boolean;
  onUsernameChange: (value: string) => void;
  onEmailChange: (value: string) => void;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
}

export function UserForm({
  username,
  email,
  isLoading,
  onUsernameChange,
  onEmailChange,
  onSubmit,
}: UserFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-6" data-test-id="user-creation-form">
      <div>
        <label
          htmlFor="username"
          className="block text-sm font-medium text-gray-700 mb-2"
          data-test-id="username-label"
        >
          Username
        </label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={(e) => onUsernameChange(e.target.value)}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Enter username"
          data-test-id="username-input"
        />
      </div>

      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700 mb-2"
          data-test-id="email-label"
        >
          Email
        </label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => onEmailChange(e.target.value)}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Enter email"
          data-test-id="email-input"
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
        data-test-id="submit-button"
      >
        {isLoading ? 'Creating...' : 'Create User'}
      </button>
    </form>
  );
}
