# Pusher Integration Guide

## Overview

This document describes the Pusher real-time messaging integration for party invitation notifications and other real-time features in the application.

## Table of Contents

- [Channel Types](#channel-types)
- [Backend Setup](#backend-setup)
- [Frontend Setup](#frontend-setup)
- [Event Types](#event-types)
- [Testing](#testing)
- [Troubleshooting](#troubleshooting)

---

## Channel Types

### Production & Development Channels

| Channel Pattern | Description | Auth Required |
|----------------|-------------|---------------|
| `private-user-<user-id>` | User-specific notifications (party invitations) | Yes - user must match |
| `presence-party-<party-id>` | Party member presence tracking | Yes - must be party member |
| `private-party-<party-id>` | Party-specific events | Yes - must be party member |

### Channel Naming Conventions

- **Private channels**: Prefixed with `private-`, require authentication
- **Presence channels**: Prefixed with `presence-`, require authentication and track online members
- **Public channels**: No prefix, no authentication required (not used in this app)

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

### Authentication Endpoint

The auth endpoint is available at `POST /pusher/auth`. This endpoint validates that users can only subscribe to channels they have permission to access.

#### Request Format

```http
POST /pusher/auth
Content-Type: application/x-www-form-urlencoded
Authorization: Bearer <jwt_token>

socket_id=123456.789012&channel_name=private-user-<user-id>
```

#### Response Format

**Success (200):**
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

**Error (403):**
```json
{
  "error": "Forbidden",
  "message": "Not authorized to access this channel"
}
```

### Signature Generation

The authentication signature is computed using HMAC-SHA256:

**For private channels:**
```
signature = HMAC-SHA256(app_secret, "<socket_id>:<channel_name>")
```

**For presence channels:**
```
signature = HMAC-SHA256(app_secret, "<socket_id>:<channel_name>:<channel_data_json>")
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
VITE_API_URL=http://localhost:3000
```

### Installation

```bash
npm install pusher-js
```

### Initialization Example

```typescript
import Pusher from 'pusher-js';

// Initialize Pusher client
const pusher = new Pusher(import.meta.env.VITE_PUSHER_APP_KEY, {
  cluster: import.meta.env.VITE_PUSHER_CLUSTER,
  authorizer: (channel) => ({
    authorize: async (socketId, callback) => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/pusher/auth`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Bearer ${userAccessToken}`,
          },
          body: new URLSearchParams({
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

// Subscribe to user channel
const channel = pusher.subscribe(`private-user-${userId}`);

// Listen for party invitations
channel.bind('party-invitation-received', (data: PartyInvitationEvent) => {
  console.log('Received invitation:', data);
  // Handle the invitation (show toast, update state, etc.)
});

// Handle subscription errors
channel.bind('pusher:subscription_error', (error: any) => {
  console.error('Subscription error:', error);
});

// Cleanup on unmount
function cleanup() {
  channel.unbind_all();
  pusher.unsubscribe(`private-user-${userId}`);
}
```

### React Hook Usage

```tsx
import { useEffect, useRef } from 'react';
import Pusher from 'pusher-js';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

interface UsePusherOptions {
  onPartyInvitation?: (data: PartyInvitationEvent) => void;
  onPartyUpdate?: (data: PartyUpdateEvent) => void;
}

export function usePusher(options: UsePusherOptions = {}) {
  const { user, accessToken } = useAuth();
  const pusherRef = useRef<Pusher | null>(null);

  useEffect(() => {
    if (!user || !accessToken) return;

    // Initialize Pusher
    const pusher = new Pusher(import.meta.env.VITE_PUSHER_APP_KEY, {
      cluster: import.meta.env.VITE_PUSHER_CLUSTER,
      authorizer: (channel) => ({
        authorize: async (socketId, callback) => {
          try {
            const response = await fetch(
              `${import.meta.env.VITE_API_URL}/pusher/auth`,
              {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/x-www-form-urlencoded',
                  'Authorization': `Bearer ${accessToken}`,
                },
                body: new URLSearchParams({
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

    // Subscribe to user channel
    const userChannel = pusher.subscribe(`private-user-${user.id}`);

    // Bind event handlers
    if (options.onPartyInvitation) {
      userChannel.bind('party-invitation-received', options.onPartyInvitation);
    }

    if (options.onPartyUpdate) {
      userChannel.bind('party-updated', options.onPartyUpdate);
    }

    // Handle connection state changes
    pusher.connection.bind('state_change', (states: any) => {
      console.log('Pusher connection state:', states.current);
    });

    // Cleanup
    return () => {
      userChannel.unbind_all();
      pusher.unsubscribe(`private-user-${user.id}`);
      pusher.disconnect();
    };
  }, [user, accessToken, options.onPartyInvitation, options.onPartyUpdate]);

  return pusherRef.current;
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

**Channel:** `private-user-<user-id>`

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

**Channel:** `private-party-<party-id>`

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

**Channel:** `presence-party-<party-id>`

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

### Testing with cURL

#### Authenticate a Channel

```bash
# Replace <jwt_token> and <user-id> with actual values
curl -X POST http://localhost:3000/pusher/auth \
  -H "Authorization: Bearer <jwt_token>" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "socket_id=123456.789012&channel_name=private-user-<user-id>"
```

#### Trigger Event via Pusher API (Server-side)

```bash
#!/bin/bash

# Configuration
APP_ID="your_app_id"
APP_KEY="your_app_key"
APP_SECRET="your_app_secret"
CLUSTER="us2"

# Event data
BODY='{"name":"party-invitation-received","channel":"private-user-123","data":"{\"partyId\":\"abc\",\"partyName\":\"Test Party\"}"}'

# Compute required values
BODY_MD5=$(echo -n "$BODY" | md5sum | cut -d' ' -f1)
TIMESTAMP=$(date +%s)

# Build string to sign
STRING_TO_SIGN="POST\n/apps/${APP_ID}/events\nauth_key=${APP_KEY}&auth_timestamp=${TIMESTAMP}&auth_version=1.0&body_md5=${BODY_MD5}"

# Generate signature
SIGNATURE=$(echo -ne "$STRING_TO_SIGN" | openssl dgst -sha256 -hmac "$APP_SECRET" | cut -d' ' -f2)

# Make request
curl -X POST "https://api-${CLUSTER}.pusher.com/apps/${APP_ID}/events?auth_key=${APP_KEY}&auth_timestamp=${TIMESTAMP}&auth_version=1.0&body_md5=${BODY_MD5}&auth_signature=${SIGNATURE}" \
  -H "Content-Type: application/json" \
  -d "$BODY"
```

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
1. String being signed doesn't match exactly: `<socket_id>:<channel_name>`
2. Extra whitespace or encoding issues in the signature string
3. Incorrect `PUSHER_APP_SECRET`
4. Signature is base64-encoded instead of hex-encoded

**Solutions:**
```typescript
// Ensure correct signature format
const stringToSign = `${socketId}:${channelName}`;
const signature = crypto
  .createHmac('sha256', process.env.PUSHER_APP_SECRET!)
  .update(stringToSign)
  .digest('hex'); // Must be hex, not base64
```

#### cURL vs Bruno/Postman Differences

- Ensure `Content-Type: application/x-www-form-urlencoded` for auth requests
- Body must be URL-encoded for form data
- For JSON bodies, use `Content-Type: application/json`
- Verify `body_md5` is computed on the exact body string sent

#### Connection Issues

**Symptoms:** Connection keeps disconnecting or fails to connect

**Solutions:**
1. Check that `VITE_PUSHER_CLUSTER` matches your Pusher app's cluster
2. Verify the app key is correct
3. Check browser console for CORS errors
4. Ensure your auth endpoint is accessible

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
