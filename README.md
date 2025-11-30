# Shreeji Vastraalay - E-Commerce Website

A premium, fully responsive e-commerce website for Laddu Gopal dresses and accessories.

## 🎨 Features

- ✅ Clean, modern UI inspired by Apple/Ajio/Myntra
- ✅ Fully responsive design (mobile, tablet, desktop)
- ✅ Dynamic shopping cart with add/remove/update quantity
- ✅ Checkout form with validation
- ✅ Google Sheets integration for order management
- ✅ COD and Prepaid payment options
- ✅ Smooth animations and transitions
- ✅ No frameworks - Pure HTML, CSS, JavaScript

## 📁 File Structure

```
├── index.html          # Home page
├── products.html       # Products page
├── styles.css          # All styles
├── app.js             # JavaScript functionality
└── README.md          # This file
```

## 🚀 Quick Start

1. Open `index.html` in your browser
2. Browse products and add items to cart
3. Proceed to checkout and place orders

## ⚙️ Configuration

### 1. Update Product Images

In `app.js`, replace emoji placeholders with actual image URLs:

```javascript
const products = [
    {
        id: 1,
        name: "Premium Silk Poshak",
        price: 599,
        image: "https://your-image-url.com/image.jpg", // ← Replace this
        sizes: ["0 No", "1 No", "2 No", "3 No", "4 No"],
        featured: true
    },
    // ... more products
];
```

### 2. Add/Edit Products

Edit the `products` array in `app.js`:

```javascript
{
    id: 9,                    // Unique ID
    name: "New Product",      // Product name
    price: 499,               // Price in rupees
    image: "🎁",              // Image URL or emoji
    sizes: ["S", "M", "L"],   // Available sizes
    featured: true            // Show on home page?
}
```

### 3. Setup Google Sheets Integration

#### Step 1: Create Google Sheet
1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new spreadsheet named "Shreeji Vastraalay Orders"
3. Add these column headers in Row 1:
   - Order ID
   - Date
   - Customer Name
   - Phone
   - Address
   - Pincode
   - Payment Method
   - Items
   - Total Amount

#### Step 2: Create Apps Script
1. In your Google Sheet, go to **Extensions > Apps Script**
2. Delete any existing code
3. Paste this code:

```javascript
function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    const data = JSON.parse(e.postData.contents);
    
    // Format items list
    const itemsList = data.items.map(item => 
      `${item.name} (${item.size}) x${item.quantity} = ₹${item.subtotal}`
    ).join(', ');
    
    // Append row to sheet
    sheet.appendRow([
      data.orderId,
      data.orderDate,
      data.customerName,
      data.phone,
      data.address,
      data.pincode,
      data.paymentMethod,
      itemsList,
      data.totalAmount
    ]);
    
    return ContentService.createTextOutput(JSON.stringify({
      status: 'success',
      orderId: data.orderId
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      status: 'error',
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}
```

#### Step 3: Deploy Web App
1. Click **Deploy > New deployment**
2. Click the gear icon ⚙️ and select **Web app**
3. Settings:
   - Description: "Order Webhook"
   - Execute as: **Me**
   - Who has access: **Anyone**
4. Click **Deploy**
5. Copy the **Web app URL**

#### Step 4: Update Website
In `app.js`, replace the webhook URL (line 3):

```javascript
const GOOGLE_SHEET_WEBHOOK_URL = "YOUR_COPIED_WEB_APP_URL_HERE";
```

### 4. Customize Brand Details

Update contact information in both HTML files:

```html
<p>Email: info@shreejivastraalay.com</p>
<p>Phone: +91 XXXXX XXXXX</p>
```

### 5. Update Colors (Optional)

In `styles.css`, modify CSS variables:

```css
:root {
    --primary-color: #B02E2E;      /* Main brand color */
    --secondary-color: #D4AF37;    /* Gold accent */
    --bg-color: #F6F6F7;           /* Background */
    --text-color: #111;            /* Text color */
}
```

## 📱 Testing

1. **Add to Cart**: Select size and add products
2. **View Cart**: Click cart icon to see items
3. **Update Quantity**: Use +/- buttons
4. **Checkout**: Fill form and place order
5. **Check Google Sheet**: Verify order appears

## 🎯 Payment Flow

- **COD**: Order submitted directly
- **Prepaid**: Shows message "Payment link will be sent on WhatsApp"

## 🌐 Deployment

### Option 1: GitHub Pages
1. Create GitHub repository
2. Upload all files
3. Go to Settings > Pages
4. Select main branch
5. Your site will be live at `https://username.github.io/repo-name`

### Option 2: Netlify
1. Drag and drop folder to [Netlify](https://app.netlify.com)
2. Site goes live instantly

### Option 3: Any Web Host
Upload all files to your hosting via FTP

## 📝 Notes

- Replace emoji placeholders with real product images
- Test Google Sheets integration before going live
- Update contact details and social links
- Consider adding WhatsApp integration for prepaid payments
- Add SSL certificate for secure checkout

## 🎨 Design Credits

Inspired by Apple, Ajio, and Myntra's clean, minimal design philosophy.

## 📞 Support

For issues or questions, contact: info@shreejivastraalay.com

---

**Built with ❤️ for Shreeji Vastraalay**
