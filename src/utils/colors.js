// Array(50).fill(1).map((e,index)=>{console.log(`\x1b[${index}m ${index} \x1b[0m`)});1;

/* eslint-disable no-console */

console.err = function(...args) {

    console.log('\x1b[31m', ...args, '\x1b[0m');

};

console.sent = function(...args) {

    console.log('\x1b[32m', ...args, '\x1b[0m');

};

console.info = function(...args) {

    console.log('\x1b[34m', ...args, '\x1b[0m');

};
