let ssDPR = SpreadsheetApp.openById('1TZFi3_2h0TOHIPgY_PjV7xUTPnHlJ00bvv-tN-Qy_bw');
let ssFlightLines = SpreadsheetApp.openById('1yWo4S6M8CFFNHk7CeSzJDynyCCR4ebfFOaHqT3SbuR4');
let ssPlannedAreas = SpreadsheetApp.openById('1gWauQV_T_6bCeFO6rCstnCGvzR4kzDMwhGFK60pl-J0');
let ssAbadiLimits = SpreadsheetApp.openById('13n0oZk8k7FBta8AkGxEOfSt3jstnY2Qv0A4q5-C0vAw');

let folderId = '1ENj9pb7r8qnr8e8bXTVLKVjh7nXFUkjM';

function doGet() {
  return HtmlService.createTemplateFromFile('index')
  .evaluate()
  .setTitle('Karnataka-Daily-Flights-GIS')
  .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename)
  .getContent();
}

function getDronesDataFromField(){
  let sheetNames = new Array();
  let sheetsObj = ssDPR.getSheets();

  let sheetsToIgnore = ['Drone-Flying-Summary', 'GCPs-Summary', 'VARS'];
  for (var i=0 ; i < sheetsObj.length ; i++){
    let sheetName = sheetsObj[i].getName();
    if (!sheetsToIgnore.includes(sheetName)){
      sheetNames.push(sheetName);
    }
  }
  return sheetNames;
}

function getFlightIDsNOthers(droneSheet){
  let sheetFlightIDs = ssDPR.getSheetByName(droneSheet);

  let lastRow = sheetFlightIDs.getLastRow();
  let flightIDColNo = 3;

  let flightIDsInRecord = sheetFlightIDs.getRange(2, flightIDColNo, lastRow - 1, 3).getDisplayValues();

  flightIDsInRecord = flightIDsInRecord.map((row, index) => {
    return {
      id: row[0].toUpperCase(),
      category: row[1],
      rowNo: index + 2,
      date: row[2]
    }
  });
  
  flightIDsInRecord = flightIDsInRecord.filter((obj) => {
    console.log(obj);
    let condA = obj.category == 'Unsuccessful_Technical_Issue' || obj.category == 'Unsuccessful_Poor_Weather';
    let condB = obj.category == 'Geotagging_Error' || obj.category == 'Unsuccessful_High_WindSpeed';

    let cond1 = condA || condB;
    let cond2 = obj.id !== "";
    return !cond1 & cond2;
  });

  flightIDsInRecord.reverse();

  let sheetflightslines = ssFlightLines.getSheetByName('flightlines');
  let sheetplannedareas = ssPlannedAreas.getSheetByName('plannedareas');

  let idsFlightlines  = [];
  let idsPlannedareas = [];

  try{
    idsFlightlines = sheetflightslines.getRange(1, 1, sheetflightslines.getLastRow(), 1).getValues();
    idsPlannedareas = sheetplannedareas.getRange(1, 1, sheetplannedareas.getLastRow(), 1).getValues();
  } catch (e) {}

  return {droneSheet, flightIDsInRecord, idsFlightlines, idsPlannedareas};
}

function uploadFlightGeoJSON(data){
  let flightID = data[0];
  let geojsonStr = data[1];

  let sheetflightslines = ssFlightLines.getSheetByName('flightlines');
  sheetflightslines.appendRow([flightID, geojsonStr]);
  return 'done';
}

function uploadPlannedAreaGeoJSON(data){
  let flightID = data[0];
  let geojsonStr = data[1];

  let sheetplannedareas = ssPlannedAreas.getSheetByName('plannedareas');
  sheetplannedareas.appendRow([flightID, geojsonStr]);
  return 'done';
}

function loadgeojsonfromserver(data){
  let flightID = data[0];
  let category = data[1];

  let sheet = null;
  if(category == 'flight'){
    sheet = ssFlightLines.getSheetByName('flightlines');
  } else if (category == 'planned'){
    sheet = ssPlannedAreas.getSheetByName('plannedareas');
  }

  let sheetFlightIDs = sheet.getRange(1, 1, sheet.getLastRow(), 1).getValues();
  for (let i = 0; i < sheetFlightIDs.length; i++){
    if(flightID.toUpperCase() == sheetFlightIDs[i][0].toUpperCase()){
      let rowNo = i + 1;
      return sheet.getRange(rowNo, 2).getValue();
    }
  }
}

function loadabadilimitsgeojsonfromserver(district){
  let sheetabadilimits = ssAbadiLimits.getSheetByName('abadilimits');

  let GJsWithDistricts = [];
  try{
    let matchedRows = getMatchedRows(sheetabadilimits, district);
    let matchedRangeList = getMatchedRangeList(matchedRows, 'B', 'C');
    let ranges = sheetabadilimits.getRangeList(matchedRangeList).getRanges();

    for (let i = 0; i < ranges.length; i++){
      let values = ranges[i].getDisplayValues();
      let rowValues = values[0].concat(ranges[i].getRowIndex());
      GJsWithDistricts.push(rowValues);
    }
  } catch (e) {}

  return GJsWithDistricts;
}

function getMatchedRows(sheetabadilimits, district){
  let districtsAbadilimits = sheetabadilimits.getRange(1, 1, sheetabadilimits.getLastRow(), 1).getValues();

  let startRow = 2;
  let matchedRows = [];
  for (let i = 0; i < districtsAbadilimits.length; i++){
    if(districtsAbadilimits[i][0] == district){
      matchedRows.push(startRow + i);
    }
  }
  
  return matchedRows;
}

function getMatchedRangeList(matchedRows, startCol, endCol, headerRow = false){
  let rangeList = [];

  if(headerRow){
    rangeList.push(`${startCol}1:${endCol}1`);
  }

  for (let i = 0; i < matchedRows.length; i++){
    let matchedRow = matchedRows[i];
    let range = `${startCol}${matchedRow}:${endCol}${matchedRow}`;
    rangeList.push(range);
  }
  return rangeList;
}

function uploadAbadiLimitGeoJSON(data){
  let district = data[0];
  let date = data[1];
  let gjStr = data[2];

  let sheetabadilimits = ssAbadiLimits.getSheetByName('abadilimits');
  sheetabadilimits.appendRow([district, date, gjStr]);
  return 'Success...';
}