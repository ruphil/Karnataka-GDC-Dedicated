const { PythonShell } = require('python-shell');

let options = {
    mode: 'text',
    pythonPath: 'C:\\Python27\\ArcGIS10.7\\python.exe',
    // pythonOptions: ['-u'], // get print results in real-time
    // scriptPath: 'path/to/my/scripts',
    args: ['value1', 'value2', 'value3']
};

let pyshell = PythonShell.run('./arcpy.py', options, function (err, results) {
    console.log(err);
    console.log(results);
 });

pyshell.on('message', function (message) {
    // received a message sent from the Python script (a simple "print" statement)
    console.log(message);
});

pyshell.end(function (err,code,signal) {
    if (err) throw err;
    console.log('The exit code was: ' + code);
    console.log('The exit signal was: ' + signal);
    console.log('finished');
});
