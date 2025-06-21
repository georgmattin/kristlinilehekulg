# Stripe Price ID Juhend

## Mis on Stripe Price ID?

Stripe Price ID on unikaalne identifikaator, mis viitab konkreetsele toote hinnale Stripe'is. See on vajalik, et luua checkout session'e ja võimaldab:

- **Paremat jõudlust** - ei pea iga kord uut hinda looma
- **Stripe analytics** - näed paremini müügistatistikat
- **Promotion codes** - töötavad paremini
- **Konsistentsust** - sama hind alati sama ID

## Kuidas saada Stripe Price ID-sid?

### Meetod 1: Automaatne genereerimine (Soovitatav)

1. **Mine admin panelisse**: `/admin`
2. **Lisa uus toode** või **muuda olemasolevat**
3. **Täida toote andmed**:
   - Pealkiri ✅
   - Kirjeldus ✅
   - Hind ✅
   - Veendu et "Is Free" pole märgitud ✅
4. **Kliki "Generate" nuppu** Stripe Price ID välja kõrval
5. **Price ID luuakse automaatselt** ja salvestatakse andmebaasi

### Meetod 2: Käsitsi Stripe Dashboard'is

1. **Mine Stripe Dashboard'i**: https://dashboard.stripe.com/products
2. **Create product** või vali olemasolev toode
3. **Add pricing** või loo uus hind
4. **Kopeeri Price ID** (algab `price_`)
5. **Lisa Price ID admin panelisse** käsitsi

### Meetod 3: Stripe CLI abil

```bash
# Loo toode
stripe products create --name "Minu Toode" --description "Toote kirjeldus"

# Loo hind tootele
stripe prices create --unit-amount=2000 --currency=usd --product=prod_xxxxx

# Price ID kuvatakse vastuses
```

## Kuidas see töötab meie süsteemis?

### 1. Kui Price ID on olemas:
```typescript
// Checkout kasutab Price ID-d (kiire ja efektiivne)
sessionData.line_items = [
  {
    price: product.stripe_price_id, // price_1ABC123...
    quantity: 1,
  },
]
```

### 2. Kui Price ID puudub:
```typescript
// Checkout loob dünaamilise hinna (aeglasem)
sessionData.line_items = [
  {
    price_data: {
      currency: "usd",
      unit_amount: product.price * 100,
      product_data: {
        name: product.title,
        description: product.description,
      }
    },
    quantity: 1,
  },
]
```

## Andmebaasi struktuur

```sql
-- products tabel sisaldab stripe_price_id välja
ALTER TABLE products ADD COLUMN stripe_price_id TEXT;
```

## Price ID vorming

Stripe Price ID-d järgivad mustrit:
- **Live**: `price_1ABC123DEF456GHI789`
- **Test**: `price_1ABC123DEF456GHI789` (sama formaat)

## Testimine

### 1. Checkout testimine
1. Loo toode Price ID-ga
2. Mine toote lehele
3. Kliki "Buy Now"
4. Kontrolli, et checkout kasutab Price ID-d (konsool logides)

### 2. Analüütika kontrollimine
1. Mine Stripe Dashboard'i
2. Vaata Payments > Overview
3. Price ID-ga oste on paremini organiseeritud

## Olulised märkused

⚠️ **Tähelepanu**:
- Price ID on seotud konkreetse hinnaga
- Hinna muutmiseks loo uus Price ID
- Vana Price ID jääb endiselt töötavaks
- Test ja live keskkondadel on erinevad Price ID-d

✅ **Parimad praktikad**:
- Kasuta Price ID-sid kõigi tasuliste toodete jaoks
- Tasuta toodete jaoks jäta Price ID tühjaks
- Genereeri Price ID-d admin paneelis automaatselt
- Säilita vanade Price ID-de arhiiv

## Troubleshooting

### Probleem: "Price not found"
**Lahendus**: Kontrolli, et Price ID on õiges Stripe kontol (test vs live)

### Probleem: "Invalid price"
**Lahendus**: Veendu, et Price ID algab `price_` ja on 29 tähemärki pikk

### Probleem: Generate nupp ei tööta
**Lahendus**: 
1. Kontrolli, et STRIPE_SECRET_KEY on seadistatud
2. Veendu, et toote pealkiri ja hind on täidetud
3. Kontrolli, et "Is Free" pole märgitud

## Eelised vs. Dünaamiline Hind

| Aspekt | Price ID | Dünaamiline |
|--------|----------|-------------|
| Kiirus | ⚡ Kiire | 🐌 Aeglasem |
| Analytics | ✅ Täpne | ❌ Piiratud |
| Promocodes | ✅ Töötab | ❌ Problemaatiline |
| Arendus | ✅ Lihtne | ⚠️ Keerulisem |
| Stripe fees | ✅ Standard | ✅ Standard |

**Soovitus**: Kasuta alati Price ID-sid tasuliste toodete jaoks! 