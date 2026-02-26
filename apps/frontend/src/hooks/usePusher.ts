import { useEffect, useRef, useCallback } from 'react';
import { Channel } from 'pusher-js';
import {
  initializePusher,
  subscribeToUserChannel,
  disconnectPusher,
  getPusherInstance,
} from '../lib/pusher';
import { useAuth } from './useAuth';

/**
 * Options for the usePusher hook
 */
interface UsePusherOptions {
  /** Callback fired when a party invitation is received */
  onPartyInvitation?: (data: PartyInvitationData) => void;
  /** Callback fired when a Pusher error occurs */
  onError?: (error: PusherError) => void;
}

/**
 * Data structure for party invitation events
 */
interface PartyInvitationData {
  partyId: string;
  partyName: string;
  inviterId: string;
  inviterName: string;
  invitedAt: string;
}

/**
 * Pusher error structure
 */
interface PusherError {
  type: string;
  error: string;
  status?: number;
}

/**
 * Return type for the usePusher hook
 */
interface UsePusherReturn {
  /** The current Pusher channel instance, or null if not connected */
  channel: Channel | null;
  /** Whether the Pusher connection is established */
  isConnected: boolean;
}

/**
 * React hook for managing Pusher subscriptions
 *
 * This hook handles the lifecycle of Pusher connections and subscriptions,
 * automatically connecting when the user is authenticated and cleaning up
 * on unmount.
 *
 * @param options - Configuration options for event handlers
 * @returns Object containing the channel instance and connection status
 *
 * @example
 * ```tsx
 * function NotificationProvider({ children }) {
 *   const { showNotification } = useNotifications();
 *
 *   usePusher({
 *     onPartyInvitation: (data) => {
 *       showNotification(`You've been invited to ${data.partyName}`);
 *     },
 *   });
 *
 *   return <>{children}</>;
 * }
 * ```
 */
export function usePusher(options: UsePusherOptions = {}): UsePusherReturn {
  const { user, accessToken } = useAuth();
  const channelRef = useRef<Channel | null>(null);
  const optionsRef = useRef(options);

  // Keep options ref up to date to avoid stale closures
  useEffect(() => {
    optionsRef.current = options;
  }, [options]);

  const setupPusher = useCallback(() => {
    if (!user?.id || !accessToken) {
      return;
    }

    try {
      const pusher = initializePusher({
        appKey: import.meta.env.VITE_PUSHER_APP_KEY,
        cluster: import.meta.env.VITE_PUSHER_CLUSTER || 'us2',
        authEndpoint: `${import.meta.env.VITE_API_URL}/pusher/auth`,
        authToken: accessToken,
      });

      // Subscribe to user's private channel
      const channel = subscribeToUserChannel(pusher, user.id);
      channelRef.current = channel;

      // Bind event handlers
      channel.bind('party-invitation-received', (data: PartyInvitationData) => {
        optionsRef.current.onPartyInvitation?.(data);
      });

      channel.bind('pusher:subscription_error', (error: PusherError) => {
        console.error('Pusher subscription error:', error);
        optionsRef.current.onError?.(error);
      });

      channel.bind('pusher:subscription_succeeded', () => {
        console.debug(`Successfully subscribed to private-user-${user.id}`);
      });

      return () => {
        if (channelRef.current) {
          channelRef.current.unbind_all();
          const pusherInstance = getPusherInstance();
          if (pusherInstance) {
            pusherInstance.unsubscribe(`private-user-${user.id}`);
          }
          channelRef.current = null;
        }
      };
    } catch (error) {
      console.error('Failed to setup Pusher:', error);
      optionsRef.current.onError?.({
        type: 'setup_error',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      return;
    }
  }, [user?.id, accessToken]);

  useEffect(() => {
    const cleanup = setupPusher();

    return () => {
      cleanup?.();
    };
  }, [setupPusher]);

  // Cleanup on unmount - disconnect Pusher entirely
  useEffect(() => {
    return () => {
      disconnectPusher();
    };
  }, []);

  return {
    channel: channelRef.current,
    isConnected: !!channelRef.current,
  };
}
