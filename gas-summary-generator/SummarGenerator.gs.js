let ss = SpreadsheetApp.openById('1TZFi3_2h0TOHIPgY_PjV7xUTPnHlJ00bvv-tN-Qy_bw');

function doGet(){
  var html = HtmlService.createHtmlOutputFromFile('SummaryHTML').setTitle('Generate Summary')
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

function fetchDroneDetails(data){
  let droneSheet = data[0];
  let reportDate = data[1];

  let sheet = ss.getSheetByName(droneSheet);

  let lastRow = sheet.getLastRow();
  let dateColumnNo = 5;

  let dateValues = sheet.getRange(2, dateColumnNo, lastRow - 1, 1).getDisplayValues();

  let startRow = 2;
  let matchedRows = [];
  for (let i = 0; i < dateValues.length; i++){
    let datesMatch = compareDates(dateValues[i][0], reportDate);
    if (datesMatch){
      matchedRows.push(startRow + i);
    }
  }

  let matchedRangeList = getMatchedRangeList(matchedRows);
  let ranges = sheet.getRangeList(matchedRangeList).getRanges();

  let droneDetailsDateWise = [];
  for (let i = 0; i < ranges.length; i++){
    let displayValues = ranges[i].getDisplayValues();
    droneDetailsDateWise = droneDetailsDateWise.concat(displayValues);
  }
  return droneDetailsDateWise;
}

function getMatchedRangeList(matchedRows){
  let rangeList = [];
  let startCol = 'B';
  let endCol = 'AQ';

  // Adding the Field Names also here
  rangeList.push(`${startCol}1:${endCol}1`);

  for (let i = 0; i < matchedRows.length; i++){
    let matchedRow = matchedRows[i];
    let range = `${startCol}${matchedRow}:${endCol}${matchedRow}`;
    rangeList.push(range);
  }
  return rangeList;
}

function compareDates(dateInput, dateGSheet){
  let dateInputParts = dateInput.split('-');
  let dateGSheetParts = dateGSheet.split('-');

  let cond1 = dateInputParts[0] == dateGSheetParts[2];
  let cond2 = dateInputParts[1] == dateGSheetParts[1];
  let cond3 = dateInputParts[2] == dateGSheetParts[0];

  if (cond1 && cond2 && cond3){
    return true;
  } else {
    return false;
  }
}

function submitSummaryDetails(summaryDetails){
  const lock = LockService.getScriptLock();
  lock.tryLock(10000);

  if (lock.hasLock){
    let sheet = ss.getSheetByName('Drone-Flying-Summary');
    let lastRow = ss.getLastRow();

    let newRow = sheet.getRange(lastRow + 1, 1, 1, 16);
    newRow.setValues([summaryDetails]);

    let summaryDate = summaryDetails[1];
    
    setTodaysColour(summaryDate, newRow);

    let range = sheet.getRange('A2:P');
    range.sort([{column: 2, ascending: false}, {column: 3, ascending: true}]);

    let numberOfFlights = parseInt(summaryDetails[5]);
    if(numberOfFlights == 0){
      return 0;
    } else {
      return 1;
    }
  }
}

function setTodaysColour(summaryDate, newRow){
  let summaryDateParts = summaryDate.split('-');
  let summaryDateObj = new Date(summaryDateParts[0], summaryDateParts[1], summaryDateParts[2]);

  let Jan2000 = new Date('1/1/2000');
  let diffTime = summaryDateObj.getTime() - Jan2000.getTime();
  let diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  let flagColours = [
    {
      r: 80,
      g: 158,
      b: 47
    }, 
    {
      r: 255,
      g: 255,
      b: 255
    },
    {
      r: 255,
      g: 143,
      b: 28
    }
  ];

  let currentDayColour = flagColours[diffDays % 3];
  newRow.setBackgroundRGB(currentDayColour.r, currentDayColour.g, currentDayColour.b);
}
