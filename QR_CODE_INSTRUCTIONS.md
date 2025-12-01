# 📱 QR Code Setup Instructions

## Save Your QR Code Image

1. **Save the QR code image from your screenshot:**
   - Right-click on the QR code image you shared
   - Save it as `qr-code.png`
   - Place it in the same folder as your website files:
     ```
     Shreeji Vastraalay/
     ├── index.html
     ├── products.html
     ├── paytm_payment.html
     ├── qr-code.png  ← Save here
     ├── app.js
     └── styles.css
     ```

2. **Or download from Paytm:**
   - Open Paytm app
   - Go to Profile → QR Code
   - Download/Save QR code
   - Rename to `qr-code.png`
   - Place in project folder

## ✅ Your UPI Details Updated

Your payment page now uses:
- **UPI ID:** 9173273691@ptsbi
- **Name:** Utkarsh Prajapati
- **Bank:** Paytm Payments Bank (SBI)

## 🎯 What's Working Now

When customers select "Pay Online":
1. **Paytm App** - Opens Paytm with your UPI ID
2. **UPI Payment** - Opens any UPI app with payment details
3. **QR Code** - Shows your QR code for scanning

All payments will come directly to your bank account linked with this UPI ID!

## 🚀 Next Steps

1. Save QR code as `qr-code.png` in project folder
2. Push changes to GitHub:
   ```bash
   git add .
   git commit -m "Added Paytm payment integration"
   git push origin main
   ```
3. Test the payment flow
4. Start accepting orders! 💰

---

**Note:** If QR code image is not showing, make sure:
- File is named exactly `qr-code.png` (lowercase)
- File is in the root folder (same as index.html)
- File is pushed to GitHub
