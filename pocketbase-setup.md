
# PocketBase Setup Guide

This guide explains how to set up PocketBase for TopCenter.

## 1. Running PocketBase with Docker

We've configured PocketBase to run as part of the Docker Compose setup. When you start the application with `docker-compose up -d`, PocketBase will automatically be started and accessible at http://localhost:8090.

## 2. First-time Setup

When you first access PocketBase at http://localhost:8090/_/, you'll need to create an admin account:

1. Navigate to http://localhost:8090/_/
2. Follow the setup wizard to create your admin account
3. Once logged in, you'll see the PocketBase Admin UI

## 3. Creating Required Collections

For TopCenter to work with PocketBase, you need to create the following collections:

### Chat Messages Collection

1. In the PocketBase Admin UI, go to Collections and click "Create collection"
2. Set collection name to `chat_messages`
3. Add the following schema fields:
   - `content` (type: text)
   - `sender` (type: select, options: user,assistant,system,agent)
   - `timestamp` (type: date)
4. Set appropriate permissions (typically full access for authenticated users)

### Users Collection

PocketBase already comes with a built-in `users` collection, but you may want to update its schema to match your needs.

## 4. API Access

- Your frontend will access PocketBase at the URL specified in `VITE_POCKETBASE_URL` environment variable
- When running in Docker, the app service connects to PocketBase using `http://pocketbase:8090`
- When running locally, it connects to `http://localhost:8090`

## 5. Testing Your Setup

You can test your PocketBase setup using our PocketBaseChatDemo component:

1. Navigate to your app
2. Create a new user in the demo component
3. Send messages to test the real-time functionality

## 6. Backup and Migration

PocketBase stores its data in the `pocketbase-data` Docker volume. To backup your data:

```bash
docker run --rm -v pocketbase-data:/pb_data -v $(pwd):/backup alpine sh -c "cd /pb_data && tar czf /backup/pocketbase-backup.tar.gz ."
```

To restore from a backup:

```bash
docker run --rm -v pocketbase-data:/pb_data -v $(pwd):/backup alpine sh -c "cd /pb_data && tar xf /backup/pocketbase-backup.tar.gz"
```

## 7. Security Considerations

- In production, ensure PocketBase is not directly exposed to the internet
- Use the authentication features of PocketBase for secure access
- Configure proper access rules for each collection
