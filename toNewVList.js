const chardet   = require('chardet')
const fs        = require('fs')
const iconvlite = require('iconv-lite')
const R = require('ramda')
const { promisify } = require('util')

let dir = 'Testing\\'

const readFile = promisify(fs.readFileSync)
const dtctCodFile = pathFile => chardet.detectFileSync(pathFile)


exports.getTxtInOriginCoding = pathFile => {
    return iconvlite.decode(
        fs.readFileSync(pathFile),
        chardet.detectFileSync(pathFile)
    )
}

const getTxtInOriginCod  = R.pipe(
    readFile
)

console.log(getTxtInOriginCod('Testing\\'))

/*
const identity = function (fn, logger) {
    return function (...args) {
        logger(args);
        const result = fn.apply(this, args);
        logger(result);
        return result;
    }
};

const exp = function (num) {
    return num * num;
};

const expLog = identity(exp, console.log);

expLog(3)
console.log()
const getList = R.pipe(
    R.zip,
    R.sortBy(R.prop(1)),
    R.reverse,
    R.pluck(0),
    R.head
);
*/