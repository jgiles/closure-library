var acorn_loose = require('acorn/acorn_loose');
var fs = require('fs');

var text = fs.readFileSync('./closure/goog/ui/minimal_crash.js');
var ast = acorn_loose.parse_dammit(text, {
  allowReturnOutsideFunction: true,
  allowTrailingCommas: true
});
