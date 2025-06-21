# Environment Variables Setup Guide

This guide will help you set up all the necessary environment variables for the Kristlinilehekulg project.

## Quick Setup

1. Copy the content from `env-template.txt` to a new file called `.env.local`
2. Replace all placeholder values with your actual credentials
3. Restart your development server

## Required Environment Variables

### 1. Supabase Configuration

**NEXT_PUBLIC_SUPABASE_URL**
- Get this from your Supabase project dashboard
- Format: `https://your-project-id.supabase.co`

**NEXT_PUBLIC_SUPABASE_ANON_KEY**
- Get this from your Supabase project dashboard
- Found in Settings > API > Project API keys > anon public

### 2. Stripe Configuration

**STRIPE_SECRET_KEY**
- Get this from your Stripe dashboard
- Development: `sk_test_...`
- Production: `sk_live_...`

**NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY**
- Get this from your Stripe dashboard
- Development: `pk_test_...`
- Production: `pk_live_...`

**STRIPE_WEBHOOK_SECRET**
- Create a webhook endpoint in Stripe dashboard
- Endpoint URL: `https://your-domain.com/api/webhook/stripe`
- Copy the webhook signing secret

### 3. Site Configuration

**NEXT_PUBLIC_SITE_URL**
- Development: `http://localhost:3000`
- Production: `https://your-domain.com`

### 4. Email Service (SMTP Configuration)

**SMTP_HOST** (Optional)
- Default: mail.veebimajutus.ee
- SMTP server hostname

**SMTP_PORT** (Optional)
- Default: 465
- SMTP server port

**SMTP_USER** (Optional)
- Default: no-reply@theolivegroceoffice.eu
- SMTP authentication username

**SMTP_PASS** (Optional)
- Default: Minemunni1.
- SMTP authentication password

Email will work with default values, but you can override them with environment variables for security.

## How to Get Your Credentials

### Supabase Setup
1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Go to Settings > API
4. Copy the Project URL and anon public key

### Stripe Setup
1. Go to [stripe.com](https://stripe.com)
2. Create an account or sign in
3. Go to Developers > API keys
4. Copy your publishable and secret keys
5. Go to Developers > Webhooks
6. Create a new endpoint with URL: `https://your-domain.com/api/webhook/stripe`
7. Copy the webhook signing secret

### Email Service Setup
Email is now configured automatically with veebimajutus.ee SMTP server.
No additional setup required - emails will be sent from no-reply@theolivegroceoffice.eu

## Example .env.local File

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Stripe
STRIPE_SECRET_KEY=sk_test_51ABC123...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_51ABC123...
STRIPE_WEBHOOK_SECRET=whsec_ABC123...

# Site
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Email (optional - defaults are configured)
# SMTP_HOST=mail.veebimajutus.ee
# SMTP_PORT=465
# SMTP_USER=no-reply@theolivegroceoffice.eu
# SMTP_PASS=Minemunni1.

# Environment
NODE_ENV=development
```

## Security Notes

- Never commit your `.env.local` file to version control
- Use test keys for development
- Use live keys only in production
- Keep your secret keys secure
- Rotate keys regularly

## Troubleshooting

### Common Issues

1. **"STRIPE_SECRET_KEY is not set"**
   - Make sure you've created `.env.local` file
   - Check that the variable name is exactly `STRIPE_SECRET_KEY`

2. **"Supabase connection failed"**
   - Verify your Supabase URL and key
   - Check that your Supabase project is active

3. **"Webhook signature verification failed"**
   - Make sure your webhook secret is correct
   - Verify the webhook endpoint URL in Stripe

4. **Environment variables not loading**
   - Restart your development server after creating `.env.local`
   - Make sure the file is in the project root directory

## Next Steps

After setting up your environment variables:

1. Run the database setup scripts in the `scripts/` folder
2. Install dependencies: `pnpm install`
3. Start the development server: `pnpm dev`
4. Create your first admin user at `/admin/register`
5. Set up your products and content through the admin panel 