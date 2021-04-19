let sourceSpreadsheetID = '1TZFi3_2h0TOHIPgY_PjV7xUTPnHlJ00bvv-tN-Qy_bw';

let targetSpreadsheetID = '1ckZh2ycBOBTkwh-YjkAwfxKm35IQQbuCRfj7AgHTAtc';

// Target Test Sheet
// let targetSpreadsheetID = '1ypnd7P4zHqj4kIK7YQ3-LL9PpyxXY1wD5Iu7QvgONsY';

// DPR-MASTER-JAN-2021
// let sourceSpreadsheetID = '1VToX1IZi-aA9DrXCTz9kMFkOMsmddFloDC0PsOdTeoM';

function getNewFlightIDs() {
  let allFlightsInTarget = getAvailableFlightsIDsInTarget();
  // console.log(allFlightsInTarget);
  let allFlightsWithSheetNamesInSource = getAllFlightIDsInSource();
  
  checkNPutNewFlightIDs(allFlightsInTarget, allFlightsWithSheetNamesInSource);
}

function checkNPutNewFlightIDs(allFlightsInTarget, allFlightsWithSheetNamesInSource){
  // console.log(allFlightsInTarget, allFlightsWithSheetNamesInSource);

  let newFlightSource = [];
  for(let i = 0; i < allFlightsWithSheetNamesInSource.length; i++){
    let flightIDSource = allFlightsWithSheetNamesInSource[i][0];
    
    if (!allFlightsInTarget.includes(flightIDSource)){
      newFlightSource.push(allFlightsWithSheetNamesInSource[i]);
    }
  }

  // console.log(newFlightSource);
  putnewFlightIDsNFormulae(newFlightSource);
}

function putnewFlightIDsNFormulae(newFlightSource){
  console.log(newFlightSource);
  if(newFlightSource.length > 0){
    let tss = SpreadsheetApp.openById(targetSpreadsheetID);
    let sheet = tss.getSheetByName('flights-log');

    let lastRow = sheet.getLastRow();

    let flightIDs = [];
    let formulas = [];
    let numOfCols = 43;
    for (let i = 0; i < newFlightSource.length; i++){
      let flightIDSource = newFlightSource[i][0];
      let sheetName = newFlightSource[i][1];
      flightIDs.push([sheetName, flightIDSource]);

      let rowFormulas = [];
      for (let j = 0; j < numOfCols; j++){
        let rowNo = lastRow + 1 + i;
        let formulaParts = '=VLOOKUP($B' + rowNo;
        formulaParts += ', IMPORTRANGE("https://docs.google.com/spreadsheets/d/' + sourceSpreadsheetID +'/edit", "';
        formulaParts += sheetName;
        formulaParts += '!$C$2:$AT"),' + (j + 2).toString() + ',false)';

        rowFormulas.push(formulaParts);
      }

      formulas.push(rowFormulas);
    }
    
    sheet.getRange(lastRow + 1, 1, newFlightSource.length, 2).setValues(flightIDs);
    sheet.getRange(lastRow + 1, 3, newFlightSource.length, numOfCols).setFormulas(formulas);
  }

  console.log('Done...');
}

function getAvailableFlightsIDsInTarget(){
  let tss = SpreadsheetApp.openById(targetSpreadsheetID);
  let sheet = tss.getSheetByName('flights-log');

  let lastRow = sheet.getLastRow();

  if (lastRow == 1) return [];

  let flightIDs = sheet.getRange(2, 2, lastRow - 1, 1).getValues();

  let customFlightIDs = [];
  for(let i = 0; i < flightIDs.length; i++){
    customFlightIDs.push(flightIDs[i][0]);
  }

  return customFlightIDs;
}

function getAllFlightIDsInSource(){
  let sss = SpreadsheetApp.openById(sourceSpreadsheetID);

  let sheetsObj = sss.getSheets();
  let sheetsToIgnore = ['Drone-Flying-Summary', 'GCPs-Summary', 'VARS'];
  
  let flightIDsWithSheetName = [];
  for (let i = 0; i < sheetsObj.length; i++){
    let currentSheetObj = sheetsObj[i];
    let sheetName = currentSheetObj.getName();
    if (!sheetsToIgnore.includes(sheetName)){
      let lastRow = currentSheetObj.getLastRow();

      let flightsValues = currentSheetObj.getRange(2, 3, lastRow - 1).getValues();
      for (let j = 0; j < flightsValues.length; j++){
        let flightID = flightsValues[j][0];

        if(flightID != ''){
          flightIDsWithSheetName.push([flightID, sheetName]);
        }
      }
    }
  }

  return flightIDsWithSheetName;
}
