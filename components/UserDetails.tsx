import { User } from '@/types/user';

interface UserDetailsProps {
  user: User;
}

interface DetailRowProps {
  label: string;
  value: string;
  testId: string;
}

function DetailRow({ label, value, testId }: DetailRowProps) {
  return (
    <div>
      <span className="font-semibold text-gray-700">{label}:</span>
      <span className="ml-2 text-gray-600" data-test-id={testId}>
        {value}
      </span>
    </div>
  );
}

export function UserDetails({ user }: UserDetailsProps) {
  return (
    <div className="bg-gray-50 border border-gray-200 rounded-md p-4 space-y-3" data-test-id="user-details">
      <DetailRow label="User ID" value={user.id} testId="user-id-value" />
      <DetailRow label="Username" value={user.username} testId="username-value" />
      <DetailRow label="Email" value={user.email} testId="email-value" />
    </div>
  );
}
