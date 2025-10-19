# Ayrshare Integration - Quick Start Guide

Get your social media dashboard up and running in 5 minutes!

## Prerequisites
- Node.js 18+
- PostgreSQL database
- Ayrshare account at https://www.ayrshare.com

## Step 1: Get API Key (2 minutes)

1. Sign up at [Ayrshare](https://www.ayrshare.com)
2. Go to Dashboard → Settings → API Keys
3. Copy your API key

## Step 2: Configure Environment (1 minute)

Create `.env.local`:

```env
AYRSHARE_API_KEY=your_api_key_here
NEXTAUTH_SECRET=generate_a_random_string_here
DATABASE_URL=your_postgresql_url
```

Generate NEXTAUTH_SECRET:
```bash
openssl rand -base64 32
```

## Step 3: Setup Database (1 minute)

```bash
npm run prisma migrate dev
```

This creates the necessary tables for posts and accounts.

## Step 4: Start the App (1 minute)

```bash
npm run dev
```

Visit `http://localhost:3000`

## Step 5: Access Dashboard

1. Click **Sign In** / **Sign Up**
2. Create account or sign in
3. Click **Dashboard** in navigation
4. Start posting!

## First Post

1. Go to `/dashboard`
2. Write your post content
3. Select platforms (Facebook, Instagram, LinkedIn, TikTok, X)
4. Click **"Publish Now"** to post immediately
5. Or click the **Calendar** icon to schedule

## Link Social Accounts

1. Go to **Dashboard** → **Settings**
2. Click **"+ Add Account"**
3. Select platform
4. Enter your username
5. Click **"Add Account"**

## Using Scheduled Posts

1. Write your post
2. Click the **Calendar** icon
3. Select date and time
4. Click **"Schedule"**
5. Post will publish automatically at scheduled time

## Viewing Analytics

- **Dashboard** shows quick stats:
  - Total posts
  - Posted today
  - Scheduled posts
  - Failed posts

- **Post Timeline** shows all posts with status filters

## Supported Platforms

- 📘 Facebook
- 📷 Instagram
- 💼 LinkedIn
- 🎵 TikTok
- 𝕏 X (Twitter)

## Common Commands

```bash
# Start development server
npm run dev

# Run database migrations
npm run prisma migrate dev

# Generate Prisma client
npm run prisma generate

# View database with Prisma Studio
npm run prisma studio

# Build for production
npm run build

# Start production server
npm run start
```

## Troubleshooting

**Issue: "Post failed to publish"**
- Check Ayrshare API key in `.env.local`
- Verify accounts are linked in Settings
- Check character count (280 max for X)

**Issue: Database connection error**
- Verify DATABASE_URL in `.env.local`
- Ensure PostgreSQL is running
- Run migrations: `npm run prisma migrate dev`

**Issue: Can't access dashboard**
- Make sure you're signed in
- Check authentication is working
- Try signing out and back in

## Next Steps

1. ✅ Link all social media accounts
2. ✅ Post your first message
3. ✅ Try scheduling a post
4. ✅ Check analytics
5. ✅ Explore settings

## Need Help?

- **Setup Issues**: See `AYRSHARE_SETUP.md`
- **Implementation Details**: See `AYRSHARE_IMPLEMENTATION.md`
- **API Docs**: https://docs.ayrshare.com
- **Support**: https://www.ayrshare.com/support

## What's Included

✅ Post composer with validation
✅ Multi-platform publishing
✅ Post scheduling
✅ Analytics dashboard
✅ Post history/timeline
✅ Social account management
✅ Dark mode support
✅ Responsive design
✅ Error handling
✅ Authentication integration

## API Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/social/post` | Create/publish post |
| GET | `/api/social/post` | Get user's posts |
| GET | `/api/social/accounts` | Get linked accounts |
| POST | `/api/social/accounts` | Link new account |
| GET | `/api/social/campaigns` | Get campaigns |
| POST | `/api/social/campaigns` | Create campaign |

## Pricing

Ayrshare offers free and paid plans. Check [Pricing](https://www.ayrshare.com/pricing) for details.

Free tier includes:
- Basic social posting
- Up to 5 social accounts
- API access
- Community support

---

**You're all set!** 🎉 

Start posting across all platforms from one dashboard.
