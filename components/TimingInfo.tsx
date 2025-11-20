import { RequestMetadata } from '@/types/user';

interface TimingInfoProps {
  metadata: RequestMetadata;
  serverDuration: number;
  serverTimestamp: number;
}

function formatTimestamp(timestamp: number): string {
  return new Date(timestamp).toISOString();
}

interface TimingRowProps {
  label: string;
  value: string;
  testId: string;
}

function TimingRow({ label, value, testId }: TimingRowProps) {
  return (
    <div>
      <span className="font-medium text-blue-800">{label}:</span>
      <span className="ml-2 text-blue-600" data-test-id={testId}>
        {value}
      </span>
    </div>
  );
}

export function TimingInfo({ metadata, serverDuration, serverTimestamp }: TimingInfoProps) {
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-md p-4 space-y-2" data-test-id="timing-information">
      <h3 className="font-semibold text-blue-900 mb-2">
        Timing Information
      </h3>
      <div className="text-sm space-y-1">
        <TimingRow
          label="Button Click"
          value={formatTimestamp(metadata.clickTime)}
          testId="button-click-time"
        />
        <TimingRow
          label="Request Sent"
          value={formatTimestamp(metadata.requestSentTime)}
          testId="request-sent-time"
        />
        <TimingRow
          label="Response Received"
          value={formatTimestamp(metadata.responseReceivedTime)}
          testId="response-received-time"
        />
        <div className="pt-2 border-t border-blue-300 mt-2">
          <span className="font-medium text-blue-800">Client Duration:</span>
          <span className="ml-2 text-blue-600 font-semibold" data-test-id="client-duration">
            {metadata.clientDuration}ms
          </span>
        </div>
        <TimingRow
          label="Server Duration"
          value={`${serverDuration}ms`}
          testId="server-duration"
        />
        <TimingRow
          label="Server Timestamp"
          value={formatTimestamp(serverTimestamp)}
          testId="server-timestamp"
        />
      </div>
    </div>
  );
}
