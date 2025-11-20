export interface User {
  id: string;
  username: string;
  email: string;
  createdAt: number;
}

export interface ApiResponse {
  success: boolean;
  user?: User;
  error?: string;
  timestamp: number;
  requestDuration: number;
}

export interface RequestMetadata {
  clickTime: number;
  requestSentTime: number;
  responseReceivedTime: number;
  clientDuration: number;
}
