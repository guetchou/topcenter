
# PocketBase Setup Guide

## Installation

1. Download PocketBase from [pocketbase.io](https://pocketbase.io/docs/)
2. Extract the executable and run it:
   ```
   ./pocketbase serve
   ```
3. Access the admin UI at http://127.0.0.1:8090/_/

## Required Collections

Create the following collections in the PocketBase Admin UI:

### 1. chat_messages

| Field    | Type     | Required | Notes                                |
|----------|----------|----------|--------------------------------------|
| content  | Text     | Yes      | The message content                  |
| sender   | Text     | Yes      | One of: 'user', 'agent', 'assistant', 'system' |
| timestamp| Date     | Yes      | Auto-filled with current time        |

### 2. users (already exists)

This collection is created automatically by PocketBase.

## Environment Variables

Add the following to your `.env` file:

```
VITE_POCKETBASE_URL=http://127.0.0.1:8090
```

## Example Usage

```tsx
import { usePocketBase } from "@/hooks/usePocketBase";

// In your component:
const { 
  records, 
  loading, 
  create,
  isAuthenticated,
  login,
  logout 
} = usePocketBase('your_collection');

// Authentication
await login('email@example.com', 'password');

// CRUD operations
await create({ field: 'value' });
```

## Security Rules

Set appropriate security rules in the PocketBase Admin UI for each collection.

For chat_messages, you might want:
- Authenticated users can create messages
- Users can only view messages they've created
- Admins can view all messages

## Deployment

For production, host your PocketBase instance on a server with the database backed up regularly.
