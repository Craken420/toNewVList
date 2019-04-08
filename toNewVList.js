const chardet   = require('chardet')
const fs        = require('fs')
const iconvlite = require('iconv-lite')
const path = require('path')
const R = require('ramda')

const { toJson } = require('./Json/intlsFiletoJson')
const { continueFields } = require('./Json/clsContinueFields')
const cls = require('./RegExp/cls')

/*Strings */

//const namesFiles = pathDir => fs.readdirSync(pathDir)
const clsContinua = txt => txt.replace(/^.*?\d{3}=.*/gm, '')

const getPathsFiles = pathDir => fs.readdirSync(pathDir).map(x => path.resolve(pathDir, x))

const getTxtInOriginCod = pathFile => {
    return iconvlite.decode(
        fs.readFileSync(pathFile),
        chardet.detectFileSync(pathFile)
    )
}

function txtToList (stringValue) {
    stringValue = stringValue.replace(/=/g, '<IGUAL>')
    return stringValue.split(/<BR>/gi).filter(Boolean).reduce((previous, current) => {
                return previous.trim() + '=' + current.trim() + '\n' + current.trim()
            },'(Inicio)').replace(/$/,'=(Fin)') + '\n'
}

/* Validate */
const isObj = value => (typeof(value) == 'object' ? true : false)
const isString = value => (typeof(value) == 'string' ? true : false)
const isEmptyString = string => (string == '') ? true : false

/* Arrays */
const filterFiles = (ext, files) => files.filter(x => ext.indexOf(path.extname(x)) > -1 && fs.statSync(x).isFile())
const getFilterFile = R.curry((ext, files) => filterFiles(ext, files))

const getContent = files => files.map(x => getTxtInOriginCod(x))

const clsComents = txts => txts.map(x => cls.intls.comments(x))

const toObj = array => array.map(x => toJson(x))

const filterKeys = array => ['ListaRefrescar','ListaCampos', 'SQL', 'ListaEnCaptura'].filter(item => array.includes(item))

//Array
const getObjects = R.pipe(
    getContent,
    clsComents,
    toObj
)

const getObj = R.pipe(
    getTxtInOriginCod,
    cls.intls.comments,
    toJson
)

//Obj
const deepFreeze = obj => {
    if (isObj(obj) && !Object.isFrozen(obj)) {
        Object.keys(obj).forEach(name => deepFreeze(obj[name]));
        Object.freeze(obj);
    }
    return obj;
}

const copyObj = obj => JSON.parse( JSON.stringify( obj ) )

const delEmpty = jsonx =>{
    let obj = copyObj(jsonx)
    for (key in obj) {
        (isString(obj[key])) ? (isEmptyString(obj[key])) && delete obj[key] : (isObj(obj[key])) && delEmpty(obj[key])
    }
    return jsonx
}

const getListKeys = obj => {
    let filterObj = {}
    for (key in obj) {
        let filtKeys = filterKeys(Object.keys(obj[key]))
        if (filtKeys.length != 0){
            filtKeys.forEach(x => {
                let objX = {}
                let txtField = obj[key][x]
                if (/<BR>/gi.test(txtField)) {
                    objX[x] = txtToList(txtField)
                    filterObj[key] = objX
                }
            })
        }
        // return { key : filterKeys(Object.keys(obj[key]))}
    }
    return filterObj
}

//Obj
const getX = R.pipe(
    deepFreeze,
    continueFields,
    getListKeys,
    delEmpty
)

//Usage
const files = getFilterFile( ['.esp'], getPathsFiles('Testing\\') )

const getDeepKeys = (times, obj) => {
    let array = []
    while (times--) {
        for (key in obj) {
            if (times > 0) {
                array.push(key)
            } else {
               getDeepKeys(times, obj[key])
            }
        }
    }
    console.log(array)
}

files.forEach(x => {
    let obj = getX(Object.freeze(getObj(x)))
    let txt = getTxtInOriginCod(x)
    // for (key in obj) {
        getDeepKeys(1, obj)
        // console.log(key)
    // }
})

// const filterObjects = objects => objects.map(x =>  getX(Object.freeze(x)))
// filterObjects(getObjects(files))

// console.log(filterObjects(getObjects(files)))


/*** Works With Pats ***/
/* Pure Function */
/* First Order Functions */
/* Combinador */
// const getPathsFiles = fn => (...args) => fn.apply(this, args).map(x => path.resolve(args.join(), x))
// const pathsFiles = getPathsFiles(namesFiles)

// const getFilterFiles = fn => (...args) => fn.apply(this, args).filter(x => ext.indexOf(path.extname(x)) > -1 && fs.statSync(x).isFile())
// const filterFiles = getFilterFiles(getPathsFiles)

/*
*** CURRY ***

const findStudentFromDb = R.curry( (db, ssn) => {
    return find(db, ssn);
});


const findStudentFromArray = R.curry( (array, ssn) => {
    return array[ssn];
});

const findStudent = useDB ? findStudentFromDb(db) : findStudentFromArray(array)
const student = findStudent('444-444-444');

*** COMBINATOR ***

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

*/