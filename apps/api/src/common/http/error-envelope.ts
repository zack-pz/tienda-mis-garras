export type ErrorEnvelope = {
  statusCode: number;
  error: string;
  message: string | string[];
  timestamp: string;
  path: string;
};

export function createErrorEnvelope(input: {
  statusCode: number;
  error: string;
  message: string | string[];
  path: string;
}): ErrorEnvelope {
  return {
    ...input,
    timestamp: new Date().toISOString(),
  };
}
