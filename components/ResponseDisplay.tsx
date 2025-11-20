import { ApiResponse, RequestMetadata } from '@/types/user';
import { UserDetails } from './UserDetails';
import { TimingInfo } from './TimingInfo';

interface ResponseDisplayProps {
  response: ApiResponse;
  metadata: RequestMetadata | null;
}

export function ResponseDisplay({ response, metadata }: ResponseDisplayProps) {
  return (
    <div className="mt-8 border-t pt-8" data-test-id="response-section">
      <h2 className="text-2xl font-semibold text-gray-900 mb-4">
        Response Data
      </h2>

      {response.success && response.user ? (
        <div className="space-y-4">
          <div className="bg-green-50 border border-green-200 rounded-md p-4" data-test-id="success-message">
            <p className="text-green-800 font-medium">
              ✓ User created successfully!
            </p>
          </div>

          <UserDetails user={response.user} />

          {metadata && (
            <TimingInfo
              metadata={metadata}
              serverDuration={response.requestDuration}
              serverTimestamp={response.timestamp}
            />
          )}

          <details className="bg-gray-50 border border-gray-200 rounded-md p-4" data-test-id="raw-json-details">
            <summary className="font-semibold text-gray-700 cursor-pointer">
              Raw Response JSON
            </summary>
            <pre className="mt-2 text-xs text-gray-600 overflow-auto" data-test-id="raw-json-content">
              {JSON.stringify(response, null, 2)}
            </pre>
          </details>
        </div>
      ) : (
        <div className="bg-red-50 border border-red-200 rounded-md p-4" data-test-id="error-message">
          <p className="text-red-800">
            ✗ Error: {response.error || 'Unknown error'}
          </p>
        </div>
      )}
    </div>
  );
}
