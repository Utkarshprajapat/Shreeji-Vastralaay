/**
 * Google Apps Script for Shreeji Vastraalay Order Management
 * 
 * SETUP INSTRUCTIONS:
 * 1. Go to https://script.google.com/
 * 2. Create a new project
 * 3. Replace the default code with this code
 * 4. Save the project as "Shreeji Vastraalay Orders"
 * 5. Deploy as Web App with "Execute as: Me" and "Who has access: Anyone"
 * 6. Copy the Web App URL and update GOOGLE_SHEET_WEBHOOK_URL in app.js
 */

function doPost(e) {
  try {
    console.log('Received POST request:', e);
    
    // Get the active spreadsheet (or create if doesn't exist)
    let spreadsheet;
    try {
      spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    } catch (error) {
      // If no active spreadsheet, create a new one
      spreadsheet = SpreadsheetApp.create('Shreeji Vastraalay Orders');
    }
    
    let sheet = spreadsheet.getActiveSheet();
    
    // Set up headers if this is the first row
    if (sheet.getLastRow() === 0) {
      sheet.getRange(1, 1, 1, 9).setValues([[
        'Order ID', 'Date', 'Customer Name', 'Phone', 'Address', 'Pincode', 'Payment Method', 'Items', 'Total Amount'
      ]]);
      
      // Format header row
      const headerRange = sheet.getRange(1, 1, 1, 9);
      headerRange.setFontWeight('bold');
      headerRange.setBackground('#4285f4');
      headerRange.setFontColor('white');
    }
    
    // Parse the incoming data
    let orderData;
    
    if (e.postData && e.postData.contents) {
      // Handle URL-encoded form data
      const params = new URLSearchParams(e.postData.contents);
      orderData = {
        orderId: params.get('Order ID') || 'ORD-' + Date.now(),
        date: params.get('Date') || new Date().toLocaleString('en-IN'),
        customerName: params.get('Customer Name') || '',
        phone: params.get('Phone') || '',
        address: params.get('Address') || '',
        pincode: params.get('Pincode') || '',
        paymentMethod: params.get('Payment Method') || '',
        items: params.get('Items') || '',
        totalAmount: params.get('Total Amount') || '0'
      };
    } else if (e.parameter) {
      // Handle URL parameters
      orderData = {
        orderId: e.parameter['Order ID'] || 'ORD-' + Date.now(),
        date: e.parameter['Date'] || new Date().toLocaleString('en-IN'),
        customerName: e.parameter['Customer Name'] || '',
        phone: e.parameter['Phone'] || '',
        address: e.parameter['Address'] || '',
        pincode: e.parameter['Pincode'] || '',
        paymentMethod: e.parameter['Payment Method'] || '',
        items: e.parameter['Items'] || '',
        totalAmount: e.parameter['Total Amount'] || '0'
      };
    } else {
      throw new Error('No data received');
    }
    
    console.log('Parsed order data:', orderData);
    
    // Add the order to the sheet
    const newRow = [
      orderData.orderId,
      orderData.date,
      orderData.customerName,
      orderData.phone,
      orderData.address,
      orderData.pincode,
      orderData.paymentMethod,
      orderData.items,
      orderData.totalAmount
    ];
    
    sheet.appendRow(newRow);
    
    // Auto-resize columns for better readability
    sheet.autoResizeColumns(1, 9);
    
    console.log('Order added successfully:', newRow);
    
    // Send success response
    return ContentService
      .createTextOutput(JSON.stringify({
        status: 'success',
        message: 'Order recorded successfully',
        orderId: orderData.orderId
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    console.error('Error processing order:', error);
    
    // Send error response
    return ContentService
      .createTextOutput(JSON.stringify({
        status: 'error',
        message: error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  // Handle GET requests (for testing)
  return ContentService
    .createTextOutput('Shreeji Vastraalay Order System is running. Use POST to submit orders.')
    .setMimeType(ContentService.MimeType.TEXT);
}

// Test function to verify the script works
function testScript() {
  const testData = {
    postData: {
      contents: 'Order%20ID=TEST001&Date=2024-01-15&Customer%20Name=Test%20Customer&Phone=9999999999&Address=Test%20Address&Pincode=123456&Payment%20Method=COD&Items=Test%20Item&Total%20Amount=299'
    }
  };
  
  const result = doPost(testData);
  console.log('Test result:', result.getContent());
}