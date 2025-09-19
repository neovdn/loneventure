/**
 * Date utility functions for handling various timestamp formats
 */

export const formatTimestamp = (timestamp: any): string => {
  try {
    // Handle null/undefined
    if (!timestamp) {
      return new Date().toLocaleTimeString();
    }

    // If it's already a Date object
    if (timestamp instanceof Date) {
      return timestamp.toLocaleTimeString();
    }

    // Handle Firestore Timestamp objects
    if (timestamp && typeof timestamp.toDate === 'function') {
      return timestamp.toDate().toLocaleTimeString();
    }

    // Handle timestamp objects with seconds/nanoseconds
    if (timestamp && typeof timestamp.seconds === 'number') {
      return new Date(timestamp.seconds * 1000).toLocaleTimeString();
    }

    // Handle string timestamps
    if (typeof timestamp === 'string') {
      const date = new Date(timestamp);
      if (!isNaN(date.getTime())) {
        return date.toLocaleTimeString();
      }
    }

    // Handle numeric timestamps
    if (typeof timestamp === 'number') {
      return new Date(timestamp).toLocaleTimeString();
    }

    // Fallback for any other format
    console.warn('Unknown timestamp format:', timestamp);
    return new Date().toLocaleTimeString();
  } catch (error) {
    console.error('Error formatting timestamp:', error, timestamp);
    return new Date().toLocaleTimeString();
  }
};

export const normalizeTimestamp = (timestamp: any): Date => {
  try {
    // Handle null/undefined
    if (!timestamp) {
      return new Date();
    }

    // If it's already a Date object
    if (timestamp instanceof Date) {
      return timestamp;
    }

    // Handle Firestore Timestamp objects
    if (timestamp && typeof timestamp.toDate === 'function') {
      return timestamp.toDate();
    }

    // Handle timestamp objects with seconds/nanoseconds
    if (timestamp && typeof timestamp.seconds === 'number') {
      return new Date(timestamp.seconds * 1000);
    }

    // Handle string timestamps
    if (typeof timestamp === 'string') {
      const date = new Date(timestamp);
      if (!isNaN(date.getTime())) {
        return date;
      }
    }

    // Handle numeric timestamps
    if (typeof timestamp === 'number') {
      return new Date(timestamp);
    }

    // Fallback
    console.warn('Unknown timestamp format, using current time:', timestamp);
    return new Date();
  } catch (error) {
    console.error('Error normalizing timestamp:', error, timestamp);
    return new Date();
  }
};