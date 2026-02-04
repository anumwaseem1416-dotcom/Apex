// Error handling utilities for better stability
export class AppError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public isOperational: boolean = true
  ) {
    super(message);
    this.name = 'AppError';
    Error.captureStackTrace(this, this.constructor);
  }
}

export const handleApiError = (error: any): string => {
  if (error.response) {
    // Server responded with error status
    const { status, data } = error.response;
    
    if (status === 400) {
      return data?.message || 'Invalid request. Please check your input.';
    } else if (status === 401) {
      return 'Authentication failed. Please login again.';
    } else if (status === 403) {
      return 'You do not have permission to perform this action.';
    } else if (status === 404) {
      return 'The requested resource was not found.';
    } else if (status === 409) {
      return data?.message || 'A conflict occurred. This item may already exist.';
    } else if (status >= 500) {
      return 'Server error. Please try again later.';
    }
    
    return data?.message || `Request failed with status ${status}`;
  } else if (error.request) {
    // Network error
    return 'Network error. Please check your internet connection.';
  } else {
    // Other error
    return error.message || 'An unexpected error occurred.';
  }
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  }).format(amount);
};

export const formatDate = (date: string | Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(date));
};

export const validateIMEI = (imei: string): string | null => {
  if (imei.length !== 15 || !/^\d+$/.test(imei)) {
    return 'IMEI must be exactly 15 digits';
  }
  return null;
};