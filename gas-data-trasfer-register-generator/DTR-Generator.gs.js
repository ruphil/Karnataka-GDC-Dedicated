let ss = SpreadsheetApp.openById('1TZFi3_2h0TOHIPgY_PjV7xUTPnHlJ00bvv-tN-Qy_bw');

function doGet(){
  var html = HtmlService.createHtmlOutputFromFile('DTR').setTitle('Generate DTR')
  .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
  return html;
}

function getDronesDataFromField(){
  let sheetNames = new Array();
  let sheetsObj = ss.getSheets();

  let sheetsToIgnore = ['Drone-Flying-Summary', 'GCPs-Summary', 'VARS'];
  for (var i=0 ; i < sheetsObj.length ; i++){
    let sheetName = sheetsObj[i].getName();
    if (!sheetsToIgnore.includes(sheetName)){
      sheetNames.push(sheetName);
    }
  }
  return sheetNames;
}

function getFlightIDs(droneSheet){
  let sheet = ss.getSheetByName(droneSheet);

  let lastRow = sheet.getLastRow();
  let flightIDColNo = 3;

  let flightIDs = sheet.getRange(2, flightIDColNo, lastRow - 1, 2).getValues();

  flightIDs = flightIDs.map((row, index) => {
    return {
      id: row[0],
      category: row[1],
      rowNo: index + 2
    }
  });
  
  flightIDs = flightIDs.filter((obj) => {
    console.log(obj);
    let condA = obj.category == 'Unsuccessful_Technical_Issue' || obj.category == 'Unsuccessful_Poor_Weather';
    let condB = obj.category == 'Geotagging_Error' || obj.category == 'Unsuccessful_High_WindSpeed';

    let cond1 = condA || condB;
    let cond2 = obj.id !== "";
    return !cond1 & cond2;
  });

  flightIDs.reverse();

  return [flightIDs, droneSheet];
}

function getDataTransferDetails(data){
  let droneSheet = data[0];
  let requiredRows = data[1];

  let sheet = ss.getSheetByName(droneSheet);

  let matchedRangeList = getMatchedRangeList(requiredRows);
  let ranges = sheet.getRangeList(matchedRangeList).getRanges();

  let dronewiseDetails = [];
  for (let i = 0; i < ranges.length; i++){
    let displayValues = ranges[i].getDisplayValues();
    dronewiseDetails = dronewiseDetails.concat(displayValues);
  }
  
  return dronewiseDetails;
}

function getMatchedRangeList(matchedRows){
  let rangeList = [];
  let startCol = 'B';
  let endCol = 'AQ';

  // Adding the Field Names also here
  // rangeList.push(`${startCol}1:${endCol}1`);

  for (let i = 0; i < matchedRows.length; i++){
    let matchedRow = matchedRows[i];
    let range = `${startCol}${matchedRow}:${endCol}${matchedRow}`;
    rangeList.push(range);
  }

  return rangeList;
}