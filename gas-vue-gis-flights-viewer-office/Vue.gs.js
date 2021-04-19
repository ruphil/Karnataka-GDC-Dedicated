let ssFlightLines = '1yWo4S6M8CFFNHk7CeSzJDynyCCR4ebfFOaHqT3SbuR4';
let ssPlannedAreas = '1gWauQV_T_6bCeFO6rCstnCGvzR4kzDMwhGFK60pl-J0';

let compiledDPRID = '1ckZh2ycBOBTkwh-YjkAwfxKm35IQQbuCRfj7AgHTAtc';

let ssAbadiLimits = '13n0oZk8k7FBta8AkGxEOfSt3jstnY2Qv0A4q5-C0vAw';

function doGet() {
  return HtmlService.createTemplateFromFile('index')
  .evaluate()
  .setTitle('Vue-GIS-Flights-Office')
  .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename)
  .getContent();
}

//  GIS Viewer   -----------------------------------------------------------------------------------------------

function getFlightsIDsAndGJs(dates){
  let sheet = SpreadsheetApp.openById(compiledDPRID).getSheetByName('flights-log');
  let flightIDsDateWise = [];

  try{
    flightIDsDateWise = sheet.getRange(2, 1, sheet.getLastRow(), 4).getDisplayValues();

    flightIDsDateWise = flightIDsDateWise.filter((row) => {
      let flightID = row[1];
      let category = row[2];
      let currentDate = row[3];

      let condA = category == 'Unsuccessful_Technical_Issue' || category == 'Unsuccessful_Poor_Weather';
      let condB = category == 'Geotagging_Error' || category == 'Unsuccessful_High_WindSpeed' || category == 'Unsuccessful_Geotagging';

      let cond1 = condA || condB;
      let cond2 = flightID != '';
      let cond3 = compareDates(dates, currentDate);

      if(!cond1 && cond2 && cond3){
        return true;
      } else {
        return false;
      }
    });
  } catch (e) {}

  let fGJObj = getGeoJSONs(flightIDsDateWise);
  return fGJObj;
}

function compareDates(dates, currentDate){
  let currentDateParts = currentDate.split('/');
  let currentDateObj = new Date(currentDateParts[2], currentDateParts[0] - 1, currentDateParts[1]);

  let fromDateObj = parseDMY(dates[0]);
  let toDateObj = parseDMY(dates[1]);
  
  let cond1 = fromDateObj.getTime() <= currentDateObj.getTime();
  let cond2 = currentDateObj.getTime() <= toDateObj.getTime();

  if (cond1 && cond2){
    return true;
  } else {
    return false;
  }
}

function parseDMY(value) {
  let date = value.split("/");
  let d = parseInt(date[0], 10),
      m = parseInt(date[1], 10),
      y = parseInt(date[2], 10);
  return new Date(y, m - 1, d);
}

function getGeoJSONs(flightIDsDateWise){
  let availFlightGJsWithIDs = [];
  let availPlannedGJsWithIDs = [];

  try{
    availFlightGJsWithIDs = getGJs(flightIDsDateWise, ssFlightLines);
    availPlannedGJsWithIDs = getGJs(flightIDsDateWise, ssPlannedAreas);
  } catch (e) {}

  return {flightIDsDateWise, availFlightGJsWithIDs, availPlannedGJsWithIDs}
}

function getGJs(flightIDsDateWise, sheetIDGJ){
  let ss = SpreadsheetApp.openById(sheetIDGJ);
  let sheetGJ = ss.getSheets()[0];

  let GJsWithIDs = [];

  try{
    let matchedRows = getMatchedRowsForFlights(flightIDsDateWise, sheetGJ);
    let matchedRangeList = getMatchedRangeList(matchedRows, 'A', 'B');
    let ranges = sheetGJ.getRangeList(matchedRangeList).getRanges();

    for (let i = 0; i < ranges.length; i++){
      let values = ranges[i].getValues();
      GJsWithIDs = GJsWithIDs.concat(values);
    }
  } catch (e) {}
  
  return GJsWithIDs;
}

function getMatchedRowsForFlights(flightIDsDateWise, sheetGJ){
  let lastRow = sheetGJ.getLastRow();
  let gjIDs = sheetGJ.getRange(2, 1, lastRow - 1, 1).getValues();

  let startRow = 2;
  let matchedRows = [];
  for (let i = 0; i < gjIDs.length; i++){
    for (let j = 0; j < flightIDsDateWise.length; j++){
      if(gjIDs[i][0] == flightIDsDateWise[j][1]){
        matchedRows.push(startRow + i);
      }
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

//  Abadi Limits Loader   -----------------------------------------------------------------------------------------------

function loadabadilimitsgeojsonfromserver(district){
  let ss = SpreadsheetApp.openById(ssAbadiLimits);
  let sheetabadilimits = ss.getSheetByName('abadilimits');

  let GJsWithDistricts = [];
  try{
    let matchedRows = getMatchedRowsForAbadis(sheetabadilimits, district);
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

function getMatchedRowsForAbadis(sheetabadilimits, district){
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

//  Shapefiles Downloader   -----------------------------------------------------------------------------------------------

function loadAllDPRs(){
  let sss = SpreadsheetApp.openById(compiledDPRID);
  let sheet = sss.getSheets()[0];
  return sheet.getRange(1, 1, sheet.getLastRow(), sheet.getLastColumn()).getDisplayValues();
}

function loadAllFlightlines(){
  let sss = SpreadsheetApp.openById(ssFlightLines);
  let sheet = sss.getSheets()[0];
  return sheet.getRange(1, 1, sheet.getLastRow(), sheet.getLastColumn()).getValues();
}

function loadAllPlannedAreas(){
  let sss = SpreadsheetApp.openById(ssPlannedAreas);
  let sheet = sss.getSheets()[0];
  return sheet.getRange(1, 1, sheet.getLastRow(), sheet.getLastColumn()).getValues();
}

function loadAllAbadiLimits(){
  let sss = SpreadsheetApp.openById(ssAbadiLimits);
  let sheet = sss.getSheets()[0];
  return sheet.getRange(1, 1, sheet.getLastRow(), sheet.getLastColumn()).getDisplayValues();
}
