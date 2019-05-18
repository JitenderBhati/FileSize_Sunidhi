'use-strict';
const fs = require('fs');
const argv = require('yargs').argv;
const path = require('path');
const pretty = require('prettysize');

let path_main = argv.path;

let walkSync = (dir, size)=> {
    var fs = fs || require('fs'),
        files = fs.readdirSync(dir);
    size = size||0;
    files.forEach(file=> {
        if (fs.statSync(path.join(dir, file)).isDirectory()) {
            size = walkSync(path.join(dir, file), size);
            if(size > 1024*1024) {
                console.log(`File Size is greater than 1KB: ${file}`);                
            }
        }
        else {
            // filelist.push(file);
            let temp = fs.statSync(path.join(dir, file));    
            size += temp.size;      
            
            if(temp.size>1024) {                
                console.log(`File Size: \n${path.join(dir, file)}:${pretty(temp.size)}`);                
            }            
        }
    });    
    return size;
};

// MAIN FUNCTION
(() =>{
    var files = fs.readdirSync(path_main);
    files.forEach(file => {
        if (fs.statSync(path.join(path_main, file)).isDirectory()) {
                let fileSize = walkSync(path_main,0);     
                           
                if (fileSize > 1024*1024) {
                    console.log(`File Size is greater than 1MB: ${file}`);
                }
                
        }
        else {            
            let temp = fs.statSync(path.join(path_main, file));
            console.log(`${file} ${JSON.stringify(temp)}`);
            
            if (temp.size > 1024) {
                console.log(formatBytes(temp.size));                
                console.log(`File Size is greater than 1KB: ${file}`);
            } 
        }                
    });
})();


// Alternative of pretty module
function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}
