import { useEffect, useRef, useCallback, useState } from 'react';
import Pusher, { Channel } from 'pusher-js';
import { useAuth } from './useAuth';

/**
 * Options for the usePusher hook
 */
interface UsePusherOptions {
  /** Whether Pusher should be enabled (default: true) */
  enabled?: boolean;
}

/**
 * Return type for the usePusher hook
 */
interface UsePusherReturn {
  /** The Pusher instance, or null if not connected */
  pusher: Pusher | null;
  /** The user's private channel instance, or null if not subscribed */
  userChannel: Channel | null;
  /** Whether the Pusher connection is established */
  isConnected: boolean;
  /** Any error that occurred during connection or subscription */
  error: Error | null;
  /** Subscribe to an additional channel */
  subscribe: (channelName: string) => Channel | null;
  /** Unsubscribe from a channel */
  unsubscribe: (channelName: string) => void;
}

const PUSHER_KEY = import.meta.env.VITE_PUSHER_APP_KEY;
const PUSHER_CLUSTER = import.meta.env.VITE_PUSHER_CLUSTER || 'us2';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

/**
 * React hook for Pusher initialization and private channel subscription
 *
 * This hook handles the complete lifecycle of Pusher connections including:
 * - Initializing the Pusher client with authentication
 * - Subscribing to the user's private channel
 * - Managing connection state and errors
 * - Providing methods to subscribe/unsubscribe from additional channels
 *
 * @param options - Configuration options for the hook
 * @returns Object containing Pusher instance, channel, connection status, and utility methods
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { userChannel, isConnected, error, subscribe } = usePusher();
 *
 *   useEffect(() => {
 *     if (userChannel) {
 *       userChannel.bind('notification', (data) => {
 *         console.log('Received notification:', data);
 *       });
 *     }
 *   }, [userChannel]);
 *
 *   if (error) return <div>Connection error: {error.message}</div>;
 *   if (!isConnected) return <div>Connecting...</div>;
 *
 *   return <div>Connected to real-time updates</div>;
 * }
 * ```
 */
export function usePusher(options: UsePusherOptions = {}): UsePusherReturn {
  const { enabled = true } = options;
  const { user, accessToken } = useAuth();
  const pusherRef = useRef<Pusher | null>(null);
  const userChannelRef = useRef<Channel | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Initialize Pusher
  useEffect(() => {
    if (!enabled || !user?.id || !accessToken) {
      return;
    }

    // Enable Pusher logging in development
    if (import.meta.env.DEV) {
      Pusher.logToConsole = true;
    }

    const pusher = new Pusher(PUSHER_KEY, {
      cluster: PUSHER_CLUSTER,
      authorizer: (channel) => ({
        authorize: async (socketId, callback) => {
          try {
            const response = await fetch(`${API_BASE_URL}/pusher/auth`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
              },
              body: JSON.stringify({
                socket_id: socketId,
                channel_name: channel.name,
              }),
            });

            if (!response.ok) {
              const errorData = await response.json().catch(() => ({}));
              throw new Error(errorData.message || `Auth failed: ${response.status}`);
            }

            const data = await response.json();
            callback(null, data);
          } catch (err) {
            console.error('Pusher auth error:', err);
            callback(err as Error, null);
          }
        },
      }),
    });

    pusher.connection.bind('connected', () => {
      console.log('Pusher connected');
      setIsConnected(true);
      setError(null);
    });

    pusher.connection.bind('disconnected', () => {
      console.log('Pusher disconnected');
      setIsConnected(false);
    });

    pusher.connection.bind('error', (err: Error) => {
      console.error('Pusher connection error:', err);
      setError(err);
    });

    pusherRef.current = pusher;

    // Subscribe to user's private channel
    const userChannel = pusher.subscribe(`private-user-${user.id}`);

    userChannel.bind('pusher:subscription_succeeded', () => {
      console.log(`Successfully subscribed to private-user-${user.id}`);
    });

    userChannel.bind('pusher:subscription_error', (err: { error?: string; status?: number }) => {
      console.error('Subscription error:', err);
      setError(new Error(`Subscription failed: ${err.error || 'Unknown error'}`));
    });

    userChannelRef.current = userChannel;

    return () => {
      userChannel.unbind_all();
      pusher.unsubscribe(`private-user-${user.id}`);
      pusher.disconnect();
      pusherRef.current = null;
      userChannelRef.current = null;
      setIsConnected(false);
    };
  }, [enabled, user?.id, accessToken]);

  /**
   * Subscribe to an additional Pusher channel
   * @param channelName - The name of the channel to subscribe to
   * @returns The Channel instance, or null if Pusher is not initialized
   */
  const subscribe = useCallback((channelName: string): Channel | null => {
    if (!pusherRef.current) return null;
    return pusherRef.current.subscribe(channelName);
  }, []);

  /**
   * Unsubscribe from a Pusher channel
   * @param channelName - The name of the channel to unsubscribe from
   */
  const unsubscribe = useCallback((channelName: string): void => {
    if (!pusherRef.current) return;
    pusherRef.current.unsubscribe(channelName);
  }, []);

  return {
    pusher: pusherRef.current,
    userChannel: userChannelRef.current,
    isConnected,
    error,
    subscribe,
    unsubscribe,
  };
}
