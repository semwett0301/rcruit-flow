/**
 * Pusher client initialization and subscription utilities
 *
 * This module provides utilities for initializing the Pusher client,
 * subscribing to private user channels, and managing the connection lifecycle.
 */

import Pusher, { Channel } from 'pusher-js';

let pusherInstance: Pusher | null = null;

export interface PusherConfig {
  appKey: string;
  cluster: string;
  authEndpoint: string;
  authToken: string;
}

/**
 * Initialize Pusher client with authentication
 *
 * Creates a singleton Pusher instance configured with the provided settings.
 * If an instance already exists, returns the existing one.
 *
 * @param config - Configuration object for Pusher initialization
 * @returns The Pusher client instance
 *
 * @example
 * ```typescript
 * const pusher = initializePusher({
 *   appKey: import.meta.env.VITE_PUSHER_APP_KEY,
 *   cluster: import.meta.env.VITE_PUSHER_CLUSTER,
 *   authEndpoint: `${API_URL}/pusher/auth`,
 *   authToken: userAccessToken,
 * });
 * ```
 */
export function initializePusher(config: PusherConfig): Pusher {
  if (pusherInstance) {
    return pusherInstance;
  }

  pusherInstance = new Pusher(config.appKey, {
    cluster: config.cluster,
    authEndpoint: config.authEndpoint,
    auth: {
      headers: {
        Authorization: `Bearer ${config.authToken}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    },
  });

  // Enable logging in development
  if (import.meta.env.DEV) {
    Pusher.logToConsole = true;
  }

  return pusherInstance;
}

/**
 * Subscribe to a private-user channel for receiving notifications
 *
 * Subscribes to a user-specific private channel and sets up event handlers
 * for subscription success and error events.
 *
 * @param pusher - The Pusher client instance
 * @param userId - The user ID to subscribe to
 * @returns The subscribed Channel instance
 *
 * @example
 * ```typescript
 * const channel = subscribeToUserChannel(pusher, userId);
 * channel.bind('party-invitation-received', (data) => {
 *   console.log('Received invitation:', data);
 * });
 * ```
 */
export function subscribeToUserChannel(pusher: Pusher, userId: string): Channel {
  const channelName = `private-user-${userId}`;

  const channel = pusher.subscribe(channelName);

  channel.bind('pusher:subscription_succeeded', () => {
    console.log(`Successfully subscribed to ${channelName}`);
  });

  channel.bind('pusher:subscription_error', (error: unknown) => {
    console.error(`Failed to subscribe to ${channelName}:`, error);
  });

  return channel;
}

/**
 * Disconnect and cleanup Pusher instance
 *
 * Disconnects the current Pusher client and clears the singleton reference.
 * Safe to call even if no instance exists.
 */
export function disconnectPusher(): void {
  if (pusherInstance) {
    pusherInstance.disconnect();
    pusherInstance = null;
  }
}

/**
 * Get current Pusher instance
 *
 * Returns the current Pusher singleton instance, or null if not initialized.
 *
 * @returns The current Pusher instance or null
 */
export function getPusherInstance(): Pusher | null {
  return pusherInstance;
}

/**
 * Update auth token (e.g., after token refresh)
 *
 * Updates the authorization header for the Pusher instance.
 * Useful when the user's access token is refreshed.
 *
 * @param token - The new authentication token
 */
export function updatePusherAuthToken(token: string): void {
  if (pusherInstance) {
    const auth = pusherInstance.config.auth as {
      headers: { Authorization: string };
    };
    auth.headers.Authorization = `Bearer ${token}`;
  }
}
