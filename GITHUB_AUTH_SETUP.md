# GitHub Authentication Setup Guide

This guide will help you set up GitHub OAuth authentication for the Cursor Rules Hub.

## 1. Create a GitHub OAuth Application

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click **"OAuth Apps"** in the left sidebar
3. Click **"New OAuth App"**
4. Fill in the application details:
   - **Application name**: `Cursor Rules Hub` (or your preferred name)
   - **Homepage URL**: `http://localhost:3000` (for development)
   - **Application description**: `AI-powered IDE rules repository`
   - **Authorization callback URL**: `http://localhost:3000/api/auth/callback/github`
5. Click **"Register application"**
6. Copy the **Client ID** and generate a **Client Secret**

## 2. Configure Environment Variables

Create a `.env.local` file in your project root and add:

```bash
# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret-here

# GitHub OAuth App Credentials
GITHUB_CLIENT_ID=your-github-client-id-from-step-1
GITHUB_CLIENT_SECRET=your-github-client-secret-from-step-1
```

### Generate NEXTAUTH_SECRET

You can generate a secure secret using:

```bash
openssl rand -base64 32
```

Or use an online generator like: https://generate-secret.vercel.app/32

## 3. Production Setup

For production deployment, update your GitHub OAuth app:

1. Go back to your GitHub OAuth app settings
2. Update the **Homepage URL** to your production domain
3. Update the **Authorization callback URL** to: `https://yourdomain.com/api/auth/callback/github`
4. Update your production environment variables:
   - `NEXTAUTH_URL=https://yourdomain.com`
   - Keep the same `GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET`
   - Use a new secure `NEXTAUTH_SECRET` for production

## 4. Features Enabled

Once configured, users will be able to:

- ✅ Sign in with their GitHub account
- ✅ Auto-populate author information from GitHub profile
- ✅ Submit cursor rules with authenticated authorship
- ✅ View their profile and manage submissions
- ✅ Track their contributions

## 5. Testing

1. Start your development server: `npm run dev`
2. Go to `http://localhost:3000`
3. Click **"Sign in"** in the header
4. Test the GitHub OAuth flow
5. Try submitting a rule to verify everything works

## Security Notes

- Never commit your `.env.local` file to version control
- Use different OAuth apps for development and production
- Rotate your secrets regularly
- The GitHub OAuth app only requests `read:user user:email` permissions

## Troubleshooting

### Common Issues:

1. **"Authorization callback URL does not match"**
   - Ensure the callback URL in GitHub matches exactly: `http://localhost:3000/api/auth/callback/github`

2. **"NEXTAUTH_SECRET missing"**
   - Make sure you've set the `NEXTAUTH_SECRET` environment variable

3. **"Client ID/Secret invalid"**
   - Double-check your GitHub OAuth app credentials
   - Ensure no extra spaces in your environment variables

4. **Development vs Production URLs**
   - Make sure you're using the correct URLs for your environment
   - Development: `http://localhost:3000`
   - Production: `https://yourdomain.com` 