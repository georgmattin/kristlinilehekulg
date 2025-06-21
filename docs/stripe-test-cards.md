# Stripe Test Credit Cards

## ✅ Successful Payments:
- **Visa:** 4242 4242 4242 4242
- **Visa (debit):** 4000 0566 5566 5556
- **Mastercard:** 5555 5555 5555 4444
- **American Express:** 3782 822463 10005

## ❌ Failed Payments:
- **Generic decline:** 4000 0000 0000 0002
- **Insufficient funds:** 4000 0000 0000 9995
- **Lost card:** 4000 0000 0000 9987
- **Stolen card:** 4000 0000 0000 9979

## 🔧 Test Details:
- **Any future expiry date:** 12/34
- **Any 3-digit CVC:** 123
- **Any billing postal code:** 12345

## 🎯 Testing Scenarios:
1. **Successful purchase** → Use 4242 4242 4242 4242
2. **Failed payment** → Use 4000 0000 0000 0002
3. **Webhook testing** → Complete purchase and check logs
