function checkAndProtectRows() {
  let ss = SpreadsheetApp.openById('1TZFi3_2h0TOHIPgY_PjV7xUTPnHlJ00bvv-tN-Qy_bw');

  let sheets = ss.getSheets();
  let sheetsToIgnore = ['VARS', 'Drone-Flying-Summary'];

  for (let i = 0; i < sheets.length; i++){
    let sheet = sheets[i];

    let protections = sheet.getProtections(SpreadsheetApp.ProtectionType.RANGE);

    let protectionRanges = [];
    for (let x = 0; x < protections.length; x++){
      protectionRanges.push(protections[x].getRange().getA1Notation());
    }

    let sheetName = sheet.getName();

    if (sheetsToIgnore.includes(sheetName)) continue;

    let lastRow = sheet.getLastRow();

    let dates = sheet.getRange(2, 5, lastRow - 1, 1).getValues();

    for (let j = 0; j < dates.length; j++){
      let dateSheet = dates[j][0];
      if(lessThanYesterdayThreeDays(dateSheet)){
        let rowNo = j + 2;
        // Logger.log(rowNo);

        let rowStatsRange = sheet.getRange('A' + rowNo.toString());
        let dataRange = sheet.getRange('B' + rowNo.toString() + ':AQ' + rowNo.toString());
        let rangeA1Notation = dataRange.getA1Notation();

        if(!protectionRanges.includes(rangeA1Notation)){
          dataRange.protect().addEditor(ss.getOwner());
        }
        rowStatsRange.setValue('Protected');
      }
    }
  }
}

function lessThanYesterdayThreeDays(dateSheet){
  let dateNow = new Date();

  let threeDaysMilliSeconds = 3 * 60 * 60 * 24 * 1000;

  try{
    if((dateNow.getTime() - dateSheet.getTime()) < threeDaysMilliSeconds){
      return true;
    } else {
      return false;
    }
  } catch (e) {
    return false;
  }
}
