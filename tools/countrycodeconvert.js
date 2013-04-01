#!/usr/bin/env node
// convert country codes from csv to json
// by @leaskh

// init modules
var fs = require('fs');

// init functions
var trim = function(string) {
    return string ? string.replace(/^\s+|\s+$/g, '') : '';
};

// This will parse a delimited string into an array of
// arrays. The default delimiter is the comma, but this
// can be overriden in the second argument.
function CSVToArray( strData, strDelimiter ){
    // Check to see if the delimiter is defined. If not,
    // then default to comma.
    strDelimiter = (strDelimiter || ","); 
    // Create a regular expression to parse the CSV values.
    var objPattern = new RegExp(
        (
            // Delimiters.
            "(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +

            // Quoted fields.
            "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +

            // Standard fields.
            "([^\"\\" + strDelimiter + "\\r\\n]*))"
        ),
        "gi"
        );
    // Create an array to hold our data. Give the array
    // a default empty first row.
    var arrData = [[]];
    // Create an array to hold our individual pattern
    // matching groups.
    var arrMatches = null;
    // Keep looping over the regular expression matches
    // until we can no longer find a match.
    while (arrMatches = objPattern.exec( strData )){
        // Get the delimiter that was found.
        var strMatchedDelimiter = arrMatches[ 1 ];
        // Check to see if the given delimiter has a length
        // (is not the start of string) and if it matches
        // field delimiter. If id does not, then we know
        // that this delimiter is a row delimiter.
        if (
            strMatchedDelimiter.length &&
            (strMatchedDelimiter != strDelimiter)
            ){
            // Since we have reached a new row of data,
            // add an empty row to our data array.
            arrData.push( [] );
        }
        // Now that we have our delimiter out of the way,
        // let's check to see which kind of value we
        // captured (quoted or unquoted).
        if (arrMatches[ 2 ]){
            // We found a quoted value. When we capture
            // this value, unescape any double quotes.
            var strMatchedValue = arrMatches[ 2 ].replace(
                new RegExp( "\"\"", "g" ),
                "\""
                );
        } else {
            // We found a non-quoted value.
            var strMatchedValue = arrMatches[ 3 ];
        }
        // Now that we have our value string, let's add
        // it to the data array.
        arrData[ arrData.length - 1 ].push( strMatchedValue );
    }
    // Return the parsed data.
    return( arrData );
}

// read source csv file
var fileCsv = '/Users/leask/Documents/Working/exfe/wiki/wiki/data/country_codes.csv';
var csv = fs.readFileSync(fileCsv, 'utf-8');
if (!csv) {
    console.log('Error reading source csv file.');
    return;
}

// handle csv file into array && filter
csv = CSVToArray(csv);
var resCsv = [];
for (var i = 1; i < csv.length; i++) {
    if (csv[i].length > 3
     && csv[i][0]
     && csv[i][1]
     && csv[i][2]
     && csv[i][3]) {
        var arrCountryCode = csv[i][3].split('\n');
        for (var j = 0; j < arrCountryCode.length; j++) {
            var countryCode = trim(arrCountryCode[j].replace(/^\+/, ''));
            var countryName = trim(csv[i][1].replace(/\(.*\)/g, ''));
            var shortName   = trim(csv[i][2].toUpperCase());
            var extraInfo   = trim(csv[i][0].toLowerCase());
            var supportSms  = typeof csv[i][14] !== 'undefined' && csv[i][14] === 'TRUE';
            var searchIndex = countryCode               + ' '
                            + countryName.toLowerCase() + ' '
                            + shortName.toLowerCase()   + ' '
                            + extraInfo;
            var support     = ['iMessage'];
            if (supportSms) {
                support.push('SMS');
            }
            var regular     = '^\\+' + countryCode;
            resCsv.push({
                'country_code' : countryCode,
                'country_name' : countryName,
                'short_name'   : shortName,
                'search_index' : searchIndex,
                'support'      : support,
                'regular'      : regular,
                'format_long'  : 0,
                'format_reg'   : null
            });
        }
    }
}

// output
var doc = "define('countrycodes', function () { return "
        + JSON.stringify(resCsv, null, 4) + ";});";
fs.writeFileSync('jslib/countrycodes/lib/countrycodes.js', doc);
console.log('Done: ' + resCsv.length);
