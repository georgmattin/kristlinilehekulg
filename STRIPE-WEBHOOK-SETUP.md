# Stripe Webhook Setup Guide

## Local Development Setup

Localhostis webhook'ide testimiseks kasutame Stripe CLI-d, mis loob turvallise tunneli Stripe ja teie localhost'i vahel.

### 1. Installi Stripe CLI

**Windows:**
```bash
# Laadi alla Stripe CLI
https://github.com/stripe/stripe-cli/releases/latest

# Või kasuta Chocolatey
choco install stripe
```

**macOS:**
```bash
brew install stripe/stripe-cli/stripe
```

**Linux:**
```bash
# Laadi alla ja installi käsitsi
wget https://github.com/stripe/stripe-cli/releases/latest/download/stripe_X.X.X_linux_x86_64.tar.gz
```

### 2. Autendi Stripe CLI

```bash
# Logi sisse oma Stripe kontole
stripe login
```

Avatakse brauser, kus saad autentida oma Stripe kontoga.

### 3. Käivita Webhook'i Forward

```bash
# Käivita webhook forward localhost'ile
stripe listen --forward-to localhost:3000/api/webhook/stripe
```

**Näed väljundit umbes sellist:**
```
> Ready! Your webhook signing secret is whsec_1a2b3c4d5e6f... (^C to quit)
> Forwarding to localhost:3000/api/webhook/stripe
```

### 4. Kopeeri Webhook Secret

Kopeeri `whsec_...` väärtus ja lisa see oma `.env.local` faili:

```env
STRIPE_WEBHOOK_SECRET=whsec_1a2b3c4d5e6f...
```

### 5. Taaskäivita Development Server

```bash
# Taaskäivita Next.js server
npm run dev
```

### 6. Testi Webhook'e

Avades teises terminalis:

```bash
# Saada test webhook
stripe trigger checkout.session.completed
```

## Production Setup

### 1. Loo Webhook Endpoint Stripe Dashboard'is

1. Mine Stripe Dashboard'i: https://dashboard.stripe.com/webhooks
2. Kliki "Add endpoint"
3. Lisa URL: `https://yourdomain.com/api/webhook/stripe`
4. Vali events:
   - `checkout.session.completed`
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `charge.dispute.created`

### 2. Kopeeri Webhook Secret

Kopeeri signing secret ja lisa production .env faili.

## Troubleshooting

### Webhook ei saa ühendust

```bash
# Kontrolli, kas server töötab
curl http://localhost:3000/api/webhook/stripe

# Kontrolli Stripe CLI staatust
stripe status
```

### Signature verification ebaõnnestub

```bash
# Kontrolli, kas webhook secret on õige
echo $STRIPE_WEBHOOK_SECRET

# Vaata Stripe CLI logisid
stripe logs tail
```

### Webhook kutsutakse kaks korda

See on normaalne Stripe käitumine - nad saadavad retry webhook'e kindluse jaoks.

## Kasutamiseks

1. **Development**: Käivita `stripe listen` iga arendamise sessioni ajal
2. **Production**: Seadista webhook endpoint Stripe dashboard'is
3. **Testing**: Kasuta `stripe trigger` commandid test webhook'ide saatmiseks

## Olulised märkused

- ⚠️ Webhook secret on erinev development ja production jaoks
- 🔄 Stripe CLI peab olema käivitatud kogu development sessioni jooksul
- 📧 E-postid saadetakse ainult siis, kui webhook õnnestub
- 🧪 Kasuta test card numbreid: `4242424242424242` 