const spawn = require('child_process').spawn;

let codeLines = []


codeLines.push('import arcpy')
codeLines.push('print(arcpy)')
codeLines.push('print(2+2)')

let currentIndex = 0;
runArcpyNGetOut();

function runArcpyNGetOut(){
    let codeLine = codeLines[currentIndex];

    let args = ['./arcpy.py']
    let child = spawn('C:\\Python27\\ArcGIS10.7\\python.exe', args);

    child.stdin.setEncoding('utf-8');

    dataString = '';
    child.stdout.on('data', function(data){
        dataString += data.toString();
        console.log(dataString);
    });

    child.stdout.on('end', function(){
        currentIndex++;
        if(currentIndex < codeLines.length){
            runArcpyNGetOut()
        }
    }); 

    child.stdin.write(codeLine);
    child.stdin.end();
}