# Ayrshare Social Media Integration Setup Guide

## Overview

This guide will help you set up the Ayrshare Social Media API integration in your Next.js SaaS application. This enables users to compose, schedule, and publish posts across multiple social platforms (Facebook, Instagram, LinkedIn, TikTok, X/Twitter).

## Prerequisites

1. **Ayrshare Account**: Create an account at [https://www.ayrshare.com](https://www.ayrshare.com)
2. **API Key**: Obtain your Ayrshare API key from your dashboard
3. **Linked Social Accounts**: Link your social media accounts in Ayrshare dashboard
4. **PostgreSQL Database**: Ensure your project has a PostgreSQL database

## Step 1: Get Your Ayrshare API Key

1. Log in to your Ayrshare account at [https://app.ayrshare.com](https://app.ayrshare.com)
2. Navigate to **Settings** → **API Keys**
3. Copy your API key
4. Keep this key secure (never commit it to version control)

## Step 2: Update Environment Variables

Add the following to your `.env.local` file:

```env
# Ayrshare Configuration
AYRSHARE_API_KEY=your_api_key_here
AYRSHARE_BASE_URL=https://api.ayrshare.com/api
```

**Important**: Never commit `.env.local` to version control. Add it to `.gitignore`.

## Step 3: Run Database Migrations

The database schema has been updated to include `SocialAccount` and `SocialPost` models.

```bash
npm run prisma migrate dev
```

This will:
- Create the `SocialAccount` table
- Create the `SocialPost` table
- Generate Prisma client

## Step 4: Features Available

### Core Features

#### 1. **Post Composer**
- Write and compose social media posts
- Support for multiple platforms selection
- Character limit (280 characters default)
- Real-time validation

#### 2. **Media Upload**
- Upload images and videos
- Preview before posting
- Multiple file format support

#### 3. **Post Scheduling**
- Schedule posts for future publication
- Date and time picker
- Timezone support

#### 4. **Analytics Dashboard**
- View total posts published
- Track posts published today
- Monitor scheduled posts
- Track failed posts
- Platform statistics

#### 5. **Post History**
- View all posts with status
- Filter by status (posted, scheduled, draft, failed)
- See post details and platforms
- Track publish timestamps

#### 6. **Social Account Management**
- Link and manage multiple social accounts
- Platform-specific account settings
- Active/inactive account toggling

## Step 5: API Routes Reference

### POST `/api/social/post`
Create and publish a new post

**Request:**
```json
{
  "content": "Your post content",
  "platforms": ["facebook", "instagram", "linkedin"],
  "mediaUrls": ["https://example.com/image.jpg"],
  "scheduledFor": "2024-12-25T10:00:00Z" // Optional
}
```

**Response:**
```json
{
  "id": "post-id",
  "userId": "user-id",
  "content": "Your post content",
  "platforms": ["facebook", "instagram", "linkedin"],
  "status": "posted|scheduled|draft|failed",
  "postedAt": "2024-12-20T10:00:00Z",
  "createdAt": "2024-12-20T09:00:00Z"
}
```

### GET `/api/social/post`
Get all posts for the current user

**Response:**
```json
[
  {
    "id": "post-id",
    "content": "Post content",
    "platforms": ["facebook"],
    "status": "posted",
    "postedAt": "2024-12-20T10:00:00Z",
    "createdAt": "2024-12-20T09:00:00Z"
  }
]
```

### GET `/api/social/accounts`
Get linked social accounts

**Response:**
```json
[
  {
    "id": "account-id",
    "platform": "facebook",
    "username": "facebook_username",
    "profileUrl": "https://facebook.com/profile",
    "isActive": true
  }
]
```

### POST `/api/social/accounts`
Link a new social account

**Request:**
```json
{
  "platform": "facebook",
  "username": "facebook_username",
  "profileUrl": "https://facebook.com/profile"
}
```

## Step 6: Dashboard Access

After authentication, users can access the social dashboard at:

```
/dashboard
```

The dashboard includes:
- Post composer
- Analytics overview
- Quick stats
- Post timeline
- Quick action buttons

## Step 7: Supported Platforms

The following platforms are supported:

- 📘 **Facebook**
- 📷 **Instagram**
- 💼 **LinkedIn**
- 🎵 **TikTok**
- 𝕏 **X (Twitter)**

Each platform has specific character limits and media requirements. Ayrshare handles these automatically.

## Common Use Cases

### Use Case 1: Publishing a Post Immediately

```javascript
const response = await fetch("/api/social/post", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    content: "Check out our latest update!",
    platforms: ["facebook", "instagram"],
  }),
});
```

### Use Case 2: Scheduling a Post

```javascript
const tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);

const response = await fetch("/api/social/post", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    content: "Tomorrow's announcement!",
    platforms: ["linkedin", "x"],
    scheduledFor: tomorrow.toISOString(),
  }),
});
```

### Use Case 3: Posting with Media

```javascript
const response = await fetch("/api/social/post", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    content: "Check out this amazing image!",
    platforms: ["instagram", "facebook"],
    mediaUrls: ["https://example.com/image.jpg"],
  }),
});
```

## Troubleshooting

### Issue: "Unauthorized" Error

**Solution:**
- Verify `AYRSHARE_API_KEY` is set in `.env.local`
- Make sure user is authenticated
- Check that API key is valid and active

### Issue: "Platform not supported" Error

**Solution:**
- Verify the platform name is correct (lowercase)
- Check platform is linked in Ayrshare dashboard
- Ensure social account is active

### Issue: Post Fails to Publish

**Solution:**
- Check post content length (varies by platform)
- Verify social accounts are properly linked
- Review Ayrshare account for rate limits
- Check API key quota

### Issue: Database Connection Error

**Solution:**
- Verify DATABASE_URL is set
- Run migrations: `npm run prisma migrate dev`
- Check PostgreSQL connection

## Best Practices

1. **Character Limits**
   - Keep posts under 280 characters for X/Twitter
   - Optimize for each platform individually
   - Use platform-specific features when possible

2. **Media Handling**
   - Compress images before upload
   - Test media uploads with different formats
   - Provide alt text for accessibility

3. **Scheduling**
   - Schedule posts during peak engagement hours
   - Space out posts to avoid spam filters
   - Use analytics to find best posting times

4. **Error Handling**
   - Implement retry logic for failed posts
   - Log errors for debugging
   - Notify users of posting failures

5. **Security**
   - Never expose API keys
   - Validate user input on client and server
   - Use HTTPS for all requests
   - Implement rate limiting

## Support & Resources

- **Ayrshare Documentation**: https://docs.ayrshare.com
- **API Explorer**: https://app.ayrshare.com/api
- **GitHub Issues**: Report bugs and feature requests

## Pricing

Ayrshare offers different plans. Check https://www.ayrshare.com/pricing for details.

Free tier includes basic posting capabilities.

## Next Steps

1. Set up your `.env.local` file
2. Run database migrations
3. Link your social accounts
4. Start publishing posts
5. Monitor analytics
6. Create campaigns for bulk posting

---

**Need Help?** Contact support at https://www.ayrshare.com or check the documentation.
