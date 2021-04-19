function doGet() {
    return HtmlService.createTemplateFromFile('index')
    .evaluate()
    .setTitle('Shapefiles-Geojson-Sheets')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
  }
  
  function include(filename) {
    return HtmlService.createHtmlOutputFromFile(filename)
    .getContent();
  }
  
  function appendGJs(data){
    let sheetID = data[0];
    let sheetName = data[1];
    let dataArry = data[2];
  
    let numberOfRows = dataArry.length;
    let numberOfCols = dataArry[0].length;
  
    let sheet = SpreadsheetApp.openById(sheetID).getSheetByName(sheetName);
    let lastRow = sheet.getLastRow();
  
    sheet.getRange(lastRow + 1, 1, numberOfRows, numberOfCols).setValues(dataArry);
  }