/**
 * Hook for handling party invitation notifications via Pusher.
 *
 * This hook subscribes to the user's Pusher channel and listens for
 * party invitation events including new invitations, acceptances, and declines.
 */
import { useEffect, useCallback } from 'react';
import { usePusher } from './usePusher';

/**
 * Represents a party invitation received via Pusher.
 */
export interface PartyInvitation {
  /** Unique identifier for the invitation */
  id: string;
  /** ID of the party the user is being invited to */
  partyId: string;
  /** Display name of the party */
  partyName: string;
  /** ID of the user who sent the invitation */
  inviterId: string;
  /** Display name of the inviter */
  inviterName: string;
  /** ISO timestamp of when the invitation was created */
  createdAt: string;
}

/**
 * Options for configuring party invitation event handlers.
 */
interface UsePartyInvitationsOptions {
  /** Callback fired when a new party invitation is received */
  onInvitationReceived?: (invitation: PartyInvitation) => void;
  /** Callback fired when an invitation is accepted */
  onInvitationAccepted?: (data: { invitationId: string; partyId: string }) => void;
  /** Callback fired when an invitation is declined */
  onInvitationDeclined?: (data: { invitationId: string }) => void;
}

/**
 * Hook for subscribing to party invitation notifications via Pusher.
 *
 * @param options - Configuration options with event callbacks
 * @returns Object containing the connection status
 *
 * @example
 * ```tsx
 * const { isConnected } = usePartyInvitations({
 *   onInvitationReceived: (invitation) => {
 *     showNotification(`${invitation.inviterName} invited you to ${invitation.partyName}`);
 *   },
 *   onInvitationAccepted: ({ partyId }) => {
 *     navigateToParty(partyId);
 *   },
 *   onInvitationDeclined: ({ invitationId }) => {
 *     removeInvitationFromList(invitationId);
 *   },
 * });
 * ```
 */
export function usePartyInvitations(options: UsePartyInvitationsOptions = {}) {
  const { userChannel, isConnected } = usePusher();
  const { onInvitationReceived, onInvitationAccepted, onInvitationDeclined } = options;

  useEffect(() => {
    if (!userChannel || !isConnected) return;

    // Handler for new party invitations
    const handleInvitation = (data: PartyInvitation) => {
      console.log('Party invitation received:', data);
      onInvitationReceived?.(data);
    };

    // Handler for accepted invitations
    const handleAccepted = (data: { invitationId: string; partyId: string }) => {
      console.log('Party invitation accepted:', data);
      onInvitationAccepted?.(data);
    };

    // Handler for declined invitations
    const handleDeclined = (data: { invitationId: string }) => {
      console.log('Party invitation declined:', data);
      onInvitationDeclined?.(data);
    };

    // Bind event listeners to the user channel
    userChannel.bind('party-invitation', handleInvitation);
    userChannel.bind('party-invitation-accepted', handleAccepted);
    userChannel.bind('party-invitation-declined', handleDeclined);

    // Cleanup: unbind event listeners when dependencies change or component unmounts
    return () => {
      userChannel.unbind('party-invitation', handleInvitation);
      userChannel.unbind('party-invitation-accepted', handleAccepted);
      userChannel.unbind('party-invitation-declined', handleDeclined);
    };
  }, [userChannel, isConnected, onInvitationReceived, onInvitationAccepted, onInvitationDeclined]);

  return { isConnected };
}
