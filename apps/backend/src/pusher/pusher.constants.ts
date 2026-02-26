/**
 * Pusher Channel Types Documentation
 *
 * This file documents all channel types used in the application
 * for both production and development environments.
 *
 * Channel Types:
 * - Private channels (private-*): Require authentication, used for user-specific data
 * - Presence channels (presence-*): Require authentication, track online members
 *
 * Authentication:
 * - All private and presence channels require server-side authentication
 * - Authentication is handled via the /pusher/auth endpoint
 */

/**
 * Pusher channel name generators
 *
 * These functions generate consistent channel names across the application.
 * Use these constants instead of hardcoding channel names to ensure consistency.
 */
export const PUSHER_CHANNELS = {
  /**
   * Private user channel for user-specific notifications
   * Format: private-user-<user-id>
   * Used for: Party invitations, personal notifications
   * Auth required: Yes (user must match channel user ID)
   *
   * @param userId - The unique identifier of the user
   * @returns The formatted private user channel name
   */
  PRIVATE_USER: (userId: string) => `private-user-${userId}`,

  /**
   * Presence channel for party members
   * Format: presence-party-<party-id>
   * Used for: Real-time party member presence, typing indicators
   * Auth required: Yes (user must be party member)
   *
   * @param partyId - The unique identifier of the party
   * @returns The formatted presence party channel name
   */
  PRESENCE_PARTY: (partyId: string) => `presence-party-${partyId}`,

  /**
   * Private party channel for party-specific events
   * Format: private-party-<party-id>
   * Used for: Party updates, member changes
   * Auth required: Yes (user must be party member)
   *
   * @param partyId - The unique identifier of the party
   * @returns The formatted private party channel name
   */
  PRIVATE_PARTY: (partyId: string) => `private-party-${partyId}`,
} as const;

/**
 * Pusher event names
 *
 * These constants define all event names used in the application.
 * Use these constants instead of hardcoding event names to ensure consistency
 * and enable easy refactoring.
 */
export const PUSHER_EVENTS = {
  // ============================================
  // Party Invitation Events
  // Sent to: PRIVATE_USER channel
  // ============================================

  /** Triggered when a user receives a new party invitation */
  PARTY_INVITATION_RECEIVED: 'party-invitation-received',

  /** Triggered when an invitation is accepted by the recipient */
  PARTY_INVITATION_ACCEPTED: 'party-invitation-accepted',

  /** Triggered when an invitation is declined by the recipient */
  PARTY_INVITATION_DECLINED: 'party-invitation-declined',

  // ============================================
  // Party Events
  // Sent to: PRIVATE_PARTY or PRESENCE_PARTY channels
  // ============================================

  /** Triggered when a new member joins the party */
  PARTY_MEMBER_JOINED: 'party-member-joined',

  /** Triggered when a member leaves the party */
  PARTY_MEMBER_LEFT: 'party-member-left',

  /** Triggered when party details are updated */
  PARTY_UPDATED: 'party-updated',
} as const;

/**
 * Type definitions for channel and event names
 */
export type PusherChannelFunction = (typeof PUSHER_CHANNELS)[keyof typeof PUSHER_CHANNELS];
export type PusherEventName = (typeof PUSHER_EVENTS)[keyof typeof PUSHER_EVENTS];
