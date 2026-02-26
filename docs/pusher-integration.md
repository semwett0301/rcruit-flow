# Pusher Integration Guide

## Overview

This document describes the Pusher real-time messaging integration for party invitation notifications and other real-time features in the application.

## Table of Contents

- [Channel Types](#channel-types)
- [Authentication Flow](#authentication-flow)
- [Backend Setup](#backend-setup)
- [Frontend Setup](#frontend-setup)
- [Event Types](#event-types)
- [Working Example](#working-example)
- [Testing](#testing)
- [Troubleshooting](#troubleshooting)

---

## Channel Types

### Production & Development Channels

| Channel Pattern | Description | Auth Required | Use Case |
|----------------|-------------|---------------|----------|
| `private-user-<userId>` | User-specific private channel | Yes - user must match | Party invitations, personal notifications |
| `private-party-<partyId>` | Party-specific private channel | Yes - must be party member | Party updates, member changes |
| `presence-party-<partyId>` | Party member presence tracking | Yes - must be party member | Online member tracking |

### Channel Naming Conventions

- **Private channels**: Prefixed with `private-`, require authentication
- **Presence channels**: Prefixed with `presence-`, require authentication and track online members
- **Public channels**: No prefix, no authentication required (not used in this app)

---

## Authentication Flow

The Pusher authentication flow ensures that users can only subscribe to channels they have permission to access.

### 1. Client Initialization

The client initializes Pusher with a custom authorizer that calls the backend auth endpoint:

```typescript
import Pusher from 'pusher-js';

const pusher = new Pusher(PUSHER_APP_KEY, {
  cluster: PUSHER_CLUSTER,
  authorizer: (channel) => ({
    authorize: async (socketId, callback) => {
      try {
        const response = await fetch('/pusher/auth', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            socket_id: socketId,
            channel_name: channel.name,
          }),
        });
        
        if (!response.ok) {
          throw new Error('Auth failed');
        }
        
        const data = await response.json();
        callback(null, data);
      } catch (error) {
        callback(error as Error, null);
      }
    },
  }),
});
```

### 2. Server Authentication Endpoint

**Endpoint:** `POST /pusher/auth`

**Headers:**
- `Authorization: Bearer <jwt_token>` - Required for user identification
- `Content-Type: application/json` or `application/x-www-form-urlencoded`

**Request Body (JSON):**
```json
{
  "socket_id": "123456.7890123",
  "channel_name": "private-user-48873148-efcc-4c01-b8a8-56b55f1143e3"
}
```

**Request Body (Form URL-encoded):**
```
socket_id=123456.7890123&channel_name=private-user-48873148-efcc-4c01-b8a8-56b55f1143e3
```

**Success Response (200):**
```json
{
  "auth": "<app_key>:<hmac_sha256_signature>"
}
```

**For presence channels (200):**
```json
{
  "auth": "<app_key>:<hmac_sha256_signature>",
  "channel_data": "{\"user_id\":\"123\",\"user_info\":{\"name\":\"John\"}}"
}
```

**Error Response (403):**
```json
{
  "error": "Forbidden",
  "message": "Not authorized to access this channel"
}
```

### 3. Signature Generation

The authentication signature is computed using HMAC-SHA256:

**For private channels:**
```typescript
import crypto from 'crypto';

const stringToSign = `${socketId}:${channelName}`;
const signature = crypto
  .createHmac('sha256', PUSHER_APP_SECRET)
  .update(stringToSign)
  .digest('hex');
const auth = `${PUSHER_APP_KEY}:${signature}`;
```

**For presence channels:**
```typescript
const channelData = JSON.stringify({
  user_id: userId,
  user_info: { username: user.username }
});
const stringToSign = `${socketId}:${channelName}:${channelData}`;
const signature = crypto
  .createHmac('sha256', PUSHER_APP_SECRET)
  .update(stringToSign)
  .digest('hex');
```

### 4. Authorization Logic

The server validates that the user has permission to access the requested channel:

```typescript
// For user channels: verify the user ID matches
if (channelName.startsWith('private-user-')) {
  const channelUserId = channelName.replace('private-user-', '');
  if (channelUserId !== authenticatedUser.id) {
    return res.status(403).json({ error: 'Forbidden' });
  }
}

// For party channels: verify user is a party member
if (channelName.startsWith('private-party-')) {
  const partyId = channelName.replace('private-party-', '');
  const isMember = await checkPartyMembership(authenticatedUser.id, partyId);
  if (!isMember) {
    return res.status(403).json({ error: 'Forbidden' });
  }
}
```

---

## Backend Setup

### Environment Variables

Add the following to your `.env` file:

```env
# Pusher Configuration
PUSHER_APP_ID=your_app_id
PUSHER_APP_KEY=your_app_key
PUSHER_APP_SECRET=your_app_secret
PUSHER_CLUSTER=us2
```

### Server-Side Event Triggering

```typescript
import Pusher from 'pusher';

const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID!,
  key: process.env.PUSHER_APP_KEY!,
  secret: process.env.PUSHER_APP_SECRET!,
  cluster: process.env.PUSHER_CLUSTER!,
  useTLS: true,
});

// Trigger a party invitation event
await pusher.trigger(
  `private-user-${targetUserId}`,
  'party-invitation-received',
  {
    partyId: party.id,
    partyName: party.name,
    invitedBy: {
      id: inviter.id,
      username: inviter.username,
    },
    invitedAt: new Date().toISOString(),
  }
);
```

---

## Frontend Setup

### Environment Variables

Add the following to your frontend `.env` file:

```env
# Pusher Configuration (Client-side)
VITE_PUSHER_APP_KEY=your_app_key
VITE_PUSHER_CLUSTER=us2
VITE_API_BASE_URL=http://localhost:3000
```

### Installation

```bash
npm install pusher-js
```

### React Hook Usage

```tsx
import { useEffect, useRef, useState } from 'react';
import Pusher from 'pusher-js';
import { useAuth } from '@/hooks/useAuth';

interface UsePusherOptions {
  onPartyInvitation?: (data: PartyInvitationEvent) => void;
  onPartyUpdate?: (data: PartyUpdateEvent) => void;
}

export function usePusher(options: UsePusherOptions = {}) {
  const { user, accessToken } = useAuth();
  const pusherRef = useRef<Pusher | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!user || !accessToken) return;

    // Enable debug logging in development
    if (import.meta.env.DEV) {
      Pusher.logToConsole = true;
    }

    // Initialize Pusher
    const pusher = new Pusher(import.meta.env.VITE_PUSHER_APP_KEY, {
      cluster: import.meta.env.VITE_PUSHER_CLUSTER,
      authorizer: (channel) => ({
        authorize: async (socketId, callback) => {
          try {
            const response = await fetch(
              `${import.meta.env.VITE_API_BASE_URL}/pusher/auth`,
              {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${accessToken}`,
                },
                body: JSON.stringify({
                  socket_id: socketId,
                  channel_name: channel.name,
                }),
              }
            );

            if (!response.ok) {
              throw new Error('Authorization failed');
            }

            const data = await response.json();
            callback(null, data);
          } catch (error) {
            callback(error as Error, null);
          }
        },
      }),
    });

    pusherRef.current = pusher;

    // Handle connection state changes
    pusher.connection.bind('connected', () => {
      setIsConnected(true);
      setError(null);
    });

    pusher.connection.bind('disconnected', () => {
      setIsConnected(false);
    });

    pusher.connection.bind('error', (err: any) => {
      setError(err);
    });

    // Subscribe to user channel
    const userChannel = pusher.subscribe(`private-user-${user.id}`);

    // Bind event handlers
    if (options.onPartyInvitation) {
      userChannel.bind('party-invitation-received', options.onPartyInvitation);
    }

    if (options.onPartyUpdate) {
      userChannel.bind('party-updated', options.onPartyUpdate);
    }

    // Handle subscription errors
    userChannel.bind('pusher:subscription_error', (err: any) => {
      console.error('Subscription error:', err);
      setError(err);
    });

    // Cleanup
    return () => {
      userChannel.unbind_all();
      pusher.unsubscribe(`private-user-${user.id}`);
      pusher.disconnect();
    };
  }, [user, accessToken, options.onPartyInvitation, options.onPartyUpdate]);

  return { pusher: pusherRef.current, isConnected, error };
}
```

---

## Working Example

### Subscribing to User Channel

Example for User ID: `48873148-efcc-4c01-b8a8-56b55f1143e3`

```typescript
// Frontend - Using the usePusher hook
import { usePusher } from '@/hooks/usePusher';
import { usePartyInvitations } from '@/hooks/usePartyInvitations';
import { toast } from 'sonner';

function NotificationProvider({ children }) {
  const { isConnected, error } = usePusher({
    onPartyInvitation: (invitation) => {
      toast.info(`You've been invited to ${invitation.partyName}!`, {
        description: `Invited by ${invitation.invitedBy.username}`,
        action: {
          label: 'View',
          onClick: () => navigate(`/parties/${invitation.partyId}`),
        },
      });
    },
  });

  if (error) {
    console.error('Pusher error:', error);
  }

  return children;
}
```

### Usage in Components

```tsx
import { usePusher } from '@/hooks/usePusher';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';

function App() {
  const queryClient = useQueryClient();

  usePusher({
    onPartyInvitation: (data) => {
      // Show notification
      toast.success(`You've been invited to ${data.partyName}!`, {
        description: `Invited by ${data.invitedBy.username}`,
        action: {
          label: 'View',
          onClick: () => navigate(`/parties/${data.partyId}`),
        },
      });

      // Invalidate relevant queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['party-invitations'] });
    },
  });

  return <div>{/* Your app content */}</div>;
}
```

---

## Event Types

### Party Invitation Received

**Event name:** `party-invitation-received`

**Channel:** `private-user-<userId>`

**Payload:**
```typescript
interface PartyInvitationEvent {
  partyId: string;
  partyName: string;
  invitedBy: {
    id: string;
    username: string;
  };
  invitedAt: string; // ISO 8601 timestamp
}
```

### Party Updated

**Event name:** `party-updated`

**Channel:** `private-party-<partyId>`

**Payload:**
```typescript
interface PartyUpdateEvent {
  partyId: string;
  updateType: 'member-joined' | 'member-left' | 'settings-changed';
  data: Record<string, any>;
  updatedAt: string;
}
```

### Member Presence

**Event name:** `pusher:member_added` / `pusher:member_removed`

**Channel:** `presence-party-<partyId>`

**Payload:**
```typescript
interface PresenceMember {
  id: string;
  info: {
    username: string;
    avatar?: string;
  };
}
```

---

## Testing

### Using cURL

#### Authenticate a Channel (JSON body)

```bash
# Authenticate channel
curl -X POST http://localhost:3000/pusher/auth \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your_jwt_token>" \
  -d '{"socket_id": "123456.7890123", "channel_name": "private-user-48873148-efcc-4c01-b8a8-56b55f1143e3"}'
```

#### Authenticate a Channel (Form URL-encoded)

```bash
curl -X POST http://localhost:3000/pusher/auth \
  -H "Authorization: Bearer <your_jwt_token>" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "socket_id=123456.789012&channel_name=private-user-48873148-efcc-4c01-b8a8-56b55f1143e3"
```

#### Trigger Mock Event (Development Only)

```bash
curl -X POST http://localhost:3000/pusher/mock-event \
  -H "Content-Type: application/json" \
  -d '{"channel": "private-user-48873148-efcc-4c01-b8a8-56b55f1143e3", "event": "party-invitation-received", "data": {"partyId": "test-party", "partyName": "Test Party", "invitedBy": {"id": "user-123", "username": "testuser"}}}'
```

### Using Bruno

Import the collection from `docs/bruno/pusher-auth.bru`

### Testing with Pusher Debug Console

1. Go to your Pusher dashboard
2. Select your app
3. Navigate to "Debug Console"
4. Watch for events in real-time as you test

### Unit Testing

```typescript
import { vi, describe, it, expect } from 'vitest';

// Mock Pusher for testing
vi.mock('pusher-js', () => ({
  default: vi.fn().mockImplementation(() => ({
    subscribe: vi.fn().mockReturnValue({
      bind: vi.fn(),
      unbind_all: vi.fn(),
    }),
    unsubscribe: vi.fn(),
    disconnect: vi.fn(),
    connection: {
      bind: vi.fn(),
    },
  })),
}));

describe('Pusher Integration', () => {
  it('should subscribe to user channel on mount', () => {
    // Your test implementation
  });
});
```

---

## Troubleshooting

### Common Issues

#### "Invalid signature" Error

**Causes:**
1. Verify `PUSHER_APP_SECRET` is correct
2. Check that `socket_id` format is valid (`\d+\.\d+`)
3. Ensure `channel_name` starts with `private-` or `presence-`
4. Verify the string being signed is exactly `socket_id:channel_name`
5. Signature must be hex-encoded, not base64-encoded

**Solutions:**
```typescript
// Ensure correct signature format
const stringToSign = `${socketId}:${channelName}`;
const signature = crypto
  .createHmac('sha256', process.env.PUSHER_APP_SECRET!)
  .update(stringToSign)
  .digest('hex'); // Must be hex, not base64
```

#### 400 Error on Auth Endpoint

1. Check JWT token is valid and not expired
2. Verify request body is JSON with correct fields (`socket_id`, `channel_name`)
3. Check user has permission to subscribe to the channel
4. Ensure Content-Type header matches the body format

#### cURL vs Bruno/Postman Differences

- Ensure `Content-Type` header matches your body format
- For form data: `Content-Type: application/x-www-form-urlencoded`
- For JSON: `Content-Type: application/json`
- Verify `body_md5` is computed on the exact body string sent (for Pusher API calls)

#### Connection Issues

**Symptoms:** Connection keeps disconnecting or fails to connect

**Solutions:**
1. Verify Pusher credentials in environment variables
2. Check that `VITE_PUSHER_CLUSTER` matches your Pusher app's cluster
3. Verify the app key is correct
4. Check browser console for CORS errors
5. Ensure your auth endpoint is accessible
6. Check network connectivity to Pusher servers

#### Events Not Received

**Checklist:**
1. Verify subscription was successful (check for `pusher:subscription_succeeded` event)
2. Confirm event name matches exactly (case-sensitive)
3. Check that the event is being triggered to the correct channel
4. Use Pusher Debug Console to verify events are being sent

### Debug Mode

Enable Pusher debug logging in development:

```typescript
import Pusher from 'pusher-js';

// Enable logging in development
if (import.meta.env.DEV) {
  Pusher.logToConsole = true;
}
```

### Health Check

Verify your Pusher setup is working:

```typescript
const pusher = new Pusher(appKey, { cluster });

pusher.connection.bind('connected', () => {
  console.log('✅ Pusher connected successfully');
});

pusher.connection.bind('error', (error: any) => {
  console.error('❌ Pusher connection error:', error);
});
```

---

## Security Considerations

1. **Never expose `PUSHER_APP_SECRET`** on the client side
2. **Always validate user permissions** in the auth endpoint before granting channel access
3. **Use private channels** for sensitive data
4. **Implement rate limiting** on the auth endpoint to prevent abuse
5. **Validate channel names** to prevent unauthorized access attempts

---

## Additional Resources

- [Pusher Channels Documentation](https://pusher.com/docs/channels)
- [Pusher JavaScript Client](https://github.com/pusher/pusher-js)
- [Pusher Server Libraries](https://pusher.com/docs/channels/channels_libraries/libraries)
