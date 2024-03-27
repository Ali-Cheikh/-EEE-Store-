function doPost(e) {
    // Get the active sheet of the current spreadsheet
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

    // Create an empty array to store row data
    var rowData = [];

    // Add an empty row
    rowData.push(""); 

    // Add the name from the request parameters
    rowData.push(e.parameter.name);

    // Add the phone number from the request parameters
    rowData.push(e.parameter.phone);

    // Add the product name from the request parameters
    rowData.push(e.parameter.productName);

    // Add the product count from the request parameters
    rowData.push(e.parameter.count);

    // Add the price from the request parameters
    rowData.push(e.parameter.price + "dt"); // Assuming "dt" is a currency symbol

    // Add the location from the request parameters
    rowData.push(e.parameter.location);

    // Calculate total price based on count and price
    var totalPrice = parseFloat(e.parameter.price) * parseInt(e.parameter.count);
    rowData.push(totalPrice);

    // Append the rowData array to the spreadsheet
    sheet.appendRow(rowData);

    // Return a success message
    return ContentService.createTextOutput("Success").setMimeType(ContentService.MimeType.TEXT);
}
