<template>
  <div class="App">
    <div class="title">Vue Collector GIS</div>
    <div class="sourcefolderdiv">
      <div class="eachfolderdiv" v-for="(item, index) in data.sourcefolders" v-bind:key="index" v-on:dblclick="removeThis">
        {{ item }}
      </div>
    </div>
    <div class="sourcefolderbtns">
      <button class="srcbtn" v-on:click="selectSourceFolder" v-bind:disabled="data.working">+</button>
    </div>
    <div class="controllers">
      <Controllers v-bind:data="data" @setPaths="setPaths" @startSearching="startSearching"/>
    </div>
    <div class="separator"></div>
    <div class="reports">
      <Reports v-bind:data="data" v-bind:stats="stats"/>
    </div>
  </div>
</template>

<script>
const { ipcRenderer } = require('electron');

import Controllers from './components/Controllers';
import Reports from './components/Reports';

const fs = require('fs');
const path = require('path');
const glob = require('glob');
const archiver = require('archiver');
const dateformat = require('dateformat');
const XLSX = require('xlsx');

export default {
  components: {
    Controllers, Reports
  },

  data: function(){
    return {
      data: {
        working: false,
        sourcefolders: [],
        currentsourcefolderindex: 0,
        sourcefolder: 'Source://folder',
        targetfolder: 'Target://folder',
        excelpath: 'Path://excel',
        // sourcefolder: 'D:/Field_Data',
        // targetfolder: 'D:/TORRENTS',
        // excelpath: 'D:/Missing_Flightlines.xlsx'
      },
      stats: {
        totalfolders: 0,
        currentdirno: 0,
      },
      missingFlightIDsXlData: [],
    }
  },

  methods: {
    removeThis(e){
      if(!this.data.working){
        this.data.sourcefolders.splice(this.data.sourcefolders.indexOf(e.target.innerText), 1)
      }
    },

    selectSourceFolder(){
      ipcRenderer.send('open-folder', ['Select Source Folder', 'sourcefolder']);
    },

    startSearching(){
      console.log('Starting To Search');
      this.data.working = true;

      this.missingFlightIDsXlData = this.getColumnsData(['A','B','C'], this.data.excelpath);
      // console.log(missingFlightIDsXlData.length);

      this.startSearchingFolders();
    },

    getColumnsData(cols, filePath){
      let workbook = XLSX.readFile(filePath);
      let worksheet = workbook.Sheets[workbook.SheetNames[0]];

      let range = XLSX.utils.decode_range(worksheet['!ref']);
      let num_rows = range.e.r - range.s.r + 1;
      let num_cols = range.e.c - range.s.c + 1;

      let colData = [];
      for (let i = 0; i < num_rows; i++){
        let rowData = [];
        for (let j = 0; j < cols.length; j++){
          let A1Notation = cols[j] + (i + 1).toString();
          let valueObj = worksheet[A1Notation];
          if (valueObj == undefined){
            rowData.push(undefined);
          } else {
            rowData.push(valueObj.v);
          }
        }
        colData.push(rowData);
      }

      return colData;
    },

    startSearchingFolders(){
      if(this.data.currentsourcefolderindex >= this.data.sourcefolders.length){
        this.saveXLFile(this.missingFlightIDsXlData, this.data.excelpath);
        this.data.working = false;
        this.data.currentsourcefolderindex = 0;
        return 0;
      }

      this.data.sourcefolder = this.data.sourcefolders[this.data.currentsourcefolderindex];

      glob(path.join(this.data.sourcefolder, '/**/'), {}, (err, dirs) => {
        // console.log(dirs);
        this.stats.totalfolders = dirs.length;

        for(let i = 0; i < dirs.length; i++){
          let sourceFolderSinglePath = dirs[i];
          let folderName = path.basename(dirs[i]);

          this.stats.currentdirno = i + 1;

          for (let j = 0; j < this.missingFlightIDsXlData.length; j++){

            let whetherFound = this.missingFlightIDsXlData[j][1];
            let missingFlightID = this.missingFlightIDsXlData[j][0];

            let similarity = this.checkStringSimilarity(missingFlightID, folderName);

            if(similarity){
              if(whetherFound != 'Found'){
                this.updateFlightsIDsXLData(missingFlightID, sourceFolderSinglePath);

                this.startCopyingData(missingFlightID, folderName, sourceFolderSinglePath);
              } else {
                console.log(i, j, missingFlightID, 'Already Found');
              } 
            }
          }
        }

        this.data.currentsourcefolderindex++;
        this.startSearchingFolders();
      });
    },

    startCopyingData(missingFlightID, folderName, sourceFolderSinglePath){
      missingFlightID = missingFlightID.replace(/[^a-z0-9_+-]/gi, '');
      folderName = folderName.replace(/[^a-z0-9_+-]/gi, '');

      let targetFolderSinglePath = path.join(this.data.targetfolder, missingFlightID, folderName);
      if (!fs.existsSync(targetFolderSinglePath)){
        fs.mkdirSync(targetFolderSinglePath, { recursive: true });
      }

      console.log(sourceFolderSinglePath, targetFolderSinglePath);
      this.copyNArrangeData(sourceFolderSinglePath, targetFolderSinglePath);
    },

    copyNArrangeData(sourceFolderSinglePath, targetFolderSinglePath){
      this.copyKMLs(sourceFolderSinglePath, targetFolderSinglePath);
      this.copyShapes(sourceFolderSinglePath, targetFolderSinglePath);
    },

    copyKMLs(sourceFolderSinglePath, targetFolderSinglePath){
      let kmlFiles = glob.sync('**/*.kml', {cwd: sourceFolderSinglePath});

      for (let k = 0; k < kmlFiles.length; k++){
        let kmlFileSourcePath = path.join(sourceFolderSinglePath, kmlFiles[k]);
        // let kmlfilename = path.parse(kmlFileSourcePath).base;

        let kmlFileTargetPath = path.join(targetFolderSinglePath, 'KML-' + (k + 1).toString() + '.kml');
        if (!fs.existsSync(targetFolderSinglePath)){
            fs.mkdirSync(targetFolderSinglePath, { recursive: true });
        }

        fs.copyFileSync(kmlFileSourcePath, kmlFileTargetPath);
      }
    },

    copyShapes(sourceFolderSinglePath, targetFolderSinglePath){
      let zippath = path.join(targetFolderSinglePath, 'shapefiles.zip');
      // console.log(zippath);

      let zipout = fs.createWriteStream(zippath);

      let archive = archiver('zip', {
        zlib: { level: 9 }
      });

      archive.pipe(zipout);

      let shapefiles = glob.sync('**/*.shp', {cwd: sourceFolderSinglePath});
      // console.log(shapefiles);

      for (let s = 0; s < shapefiles.length; s++){
        let shapefilePath = path.join(sourceFolderSinglePath, shapefiles[s]);

        let thisshapefilename = path.parse(shapefilePath).name;
        let thisshapefileDir = path.parse(shapefilePath).dir;
        // console.log(thisshapefilename, thisshapefileDir);

        if (!fs.existsSync(targetFolderSinglePath)){
          fs.mkdirSync(targetFolderSinglePath, { recursive: true });
        }

        let shapeFormats = ['.cpg', '.dbf', '.prj', '.sbn', '.sbx', '.shp', '.shx'];
        
        let shapeFileSize = 0;
        let shapeFilePartsToCopy = [];

        for (let f = 0; f < shapeFormats.length; f++){
          let shapefilenameWithFormat = thisshapefilename + shapeFormats[f];
          let foundFiles = glob.sync(shapefilenameWithFormat, {cwd: thisshapefileDir});
          if(foundFiles.length == 1){
            // console.log(foundFiles);

            let currentFile = foundFiles[0];

            let shapefilePath = path.join(thisshapefileDir, currentFile);
            // console.log(shapefilePath);

            let stats = fs.statSync(shapefilePath)
            let fileSizeInBytes = stats.size;
            shapeFileSize += fileSizeInBytes;

            let modName = (s + 1).toString() + shapeFormats[f];
            
            shapeFilePartsToCopy.push([shapefilePath, modName]);
          }
        }

        if(shapeFileSize < 20000){
          for (let i = 0; i < shapeFilePartsToCopy.length; i++){
            let shapefilePath = shapeFilePartsToCopy[i][0];
            let modName = shapeFilePartsToCopy[i][1];

            archive.append(fs.createReadStream(shapefilePath), { name: modName });
          }
        }
      }
      
      archive.finalize();
      
    },

    updateFlightsIDsXLData(missingFlightID, sourceFolderSinglePath){
      for (let i = 0; i < this.missingFlightIDsXlData.length; i++){
        let missingFlightIDXL = this.missingFlightIDsXlData[i][0];
        if(missingFlightID == missingFlightIDXL){
          this.missingFlightIDsXlData[i][1] = 'Found';
          if(this.missingFlightIDsXlData[i][2] === undefined){
            this.missingFlightIDsXlData[i][2] = sourceFolderSinglePath;  
          } else {
            this.missingFlightIDsXlData[i][2] = sourceFolderSinglePath + ',' + this.missingFlightIDsXlData[i][2];
          }
        }
      }
    },

    checkStringSimilarity(missingFlightID, nameToCheckAgainst){
      let numberPattern = /\d+/g;

      let numbersExtractedMissingFlightID = missingFlightID.match(numberPattern);
      let numbersExtractedName = nameToCheckAgainst.match(numberPattern);

      try{
        numbersExtractedMissingFlightID.map((val) => {
          return parseInt(val);
        });

        numbersExtractedName.map((val) => {
          return parseInt(val);
        });

        let similar = numbersExtractedMissingFlightID.every(val => numbersExtractedName.includes(val));

        return similar;
      } catch(e) {
        return false;
      }
    },

    saveXLFile(dataArry, location){
      let wb = XLSX.utils.book_new();
      let ws = XLSX.utils.aoa_to_sheet(dataArry);
      XLSX.utils.book_append_sheet(wb, ws, 'Missing_Flightlines');
      XLSX.writeFile(wb, location);
    },

    
    //  ---------------------------------------------------------------------------------------------------------
    // Setting Paths Functions

    setPaths(data){
      let pathType = data[0];

      if(pathType == 'sourcefolder'){
        this.data.sourcefolder = data[1];
      } else if (pathType == 'targetfolder'){
        this.data.targetfolder = data[1];
      } else if (pathType == 'excelpath'){
        this.data.excelpath = data[1];
      }
    }
  },

  created: function() {
    ipcRenderer.on('sourcefolder', (event, arg) => {
      this.data.sourcefolders.push(arg);
    });
  },
}
</script>

<style scoped>
  .App {
    text-align: center;
  }

  .title {
    color: white;
    font-size: 6vw;
    padding-top: 6vh;
  }

  .sourcefolderdiv {
    text-align: left;
    margin-top: 2vh;
    left: 10vw;
    position: fixed;
    border: 2px solid white;
    width: 70vw;
    height: 20vh;
    overflow-y: scroll;
  }

  .sourcefolderbtns {
    margin-top: 2vh;
    left: 82vw;
    position: fixed;
  }

  .srcbtn {
    margin: 1vh;
    padding: 2vw;
    color: blue;
  }

  .srcbtn:hover {
    cursor: pointer;
  }

  .srcbtn:active {
    background-color: lightskyblue;
    outline: none;
  }

  .eachfolderdiv {
    color: linen;
    padding: 1vh;
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    outline: 0;
  }

  .eachfolderdiv:hover {
    background-color: lightskyblue;
  }

  .controllers {
    margin-top: 30vh;
    left: 10vw;
    position: fixed;
  }

  .separator {
    color: white;
    margin-top: 30vh;
    height: 45vh;
    left: 53vw;
    position: fixed;
    border: 2px solid white;
  }

  .reports {
    color: white;
    margin-top: 30vh;
    left: 65vw;
    position: fixed;
  }
</style>