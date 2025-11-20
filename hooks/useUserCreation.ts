import { useState, FormEvent } from 'react';
import { ApiResponse, RequestMetadata } from '@/types/user';
import { Logger } from '@/lib/logger';

const logger = new Logger('CLIENT');

const API_ENDPOINT = '/api/users';

interface UseUserCreationReturn {
  username: string;
  email: string;
  isLoading: boolean;
  response: ApiResponse | null;
  requestMetadata: RequestMetadata | null;
  error: string | null;
  setUsername: (value: string) => void;
  setEmail: (value: string) => void;
  handleSubmit: (e: FormEvent<HTMLFormElement>) => Promise<void>;
}

export function useUserCreation(): UseUserCreationReturn {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<ApiResponse | null>(null);
  const [requestMetadata, setRequestMetadata] = useState<RequestMetadata | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const clickTime = Date.now();
    logger.log(`Button clicked - Timestamp: ${clickTime}`);

    setIsLoading(true);
    setResponse(null);
    setRequestMetadata(null);
    setError(null);

    try {
      const requestSentTime = Date.now();
      logger.log(`Request sent - Timestamp: ${requestSentTime}`);

      const res = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email }),
      });

      const responseReceivedTime = Date.now();
      logger.log(`Response received - Timestamp: ${responseReceivedTime}`);

      const data: ApiResponse = await res.json();
      const clientDuration = responseReceivedTime - requestSentTime;

      logger.log(`Response parsed - Duration: ${clientDuration}ms`);
      logger.log('Response data:', data);

      setResponse(data);
      setRequestMetadata({
        clickTime,
        requestSentTime,
        responseReceivedTime,
        clientDuration,
      });

      if (data.success) {
        setUsername('');
        setEmail('');
      } else {
        setError(data.error || 'Request failed');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      logger.error('Error occurred:', err);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
      logger.log('Loading state cleared');
    }
  };

  return {
    username,
    email,
    isLoading,
    response,
    requestMetadata,
    error,
    setUsername,
    setEmail,
    handleSubmit,
  };
}
