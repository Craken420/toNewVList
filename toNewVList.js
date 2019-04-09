const chardet   = require('chardet')
const fs        = require('fs')
const iconvlite = require('iconv-lite')
const path = require('path')
const R = require('ramda')

const { toJson } = require('./Json/intlsFiletoJson')
const { continueFields } = require('./Json/clsContinueFields')
const cls = require('./RegExp/cls')
const take = require('./RegExp/take')
const rgx = require('./RegExp/patterns')
const change = require('./RegExp/change')


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

function arrayToList (array, head) {
    return array.reduce((previous, current) => {
                return previous.trim() + '=' + current.trim().replace(/=/g, '<IGUAL>') + '\n' + current.trim().replace(/=/g, '<IGUAL>')
            },head).replace(/$/,'=(Fin)')
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

const filterKeys = array => ['ListaRefrescar','ListaAcciones','ListaCampos', 'SQL', 'ListaEnCaptura'].filter(item => array.includes(item))

const getListKeys = obj => {
    let filterObj = {}
    for (key in obj) {
        let filtKeys = filterKeys(Object.keys(obj[key]))
        if (filtKeys.length != 0){
            let objX = {}
            filtKeys.forEach(x => {
                let txtField = obj[key][x]
                if (/<BR>/gi.test(txtField)) {
                    // objX[x] = txtToList(txtField)
                    objX[x] = txtField
                    filterObj[key] = objX
                }
            })
        }
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

const eliminarDuplicado = arreglo => {
    let set =new Set( arreglo.map( JSON.stringify))
    //console.log(set)
    return Array.from(set).map( JSON.parse )
}

const maviToEsp = pathFile => {

    let nameFile = cls.paths.rootFile(pathFile)

    if (rgx.intls.objBtwnLowScripts.test(nameFile)){

        let newPath = change.mix.lastLowScriptToPoint(
            cls.intls.afterAbbreviatObj(
                cls.paths.ext(
                    nameFile
                )
            )
        )

        return newPath.replace(rgx.paths.ext, cls.paths.allUntilExt(newPath).toLowerCase())

    } else {
        return cls.paths.rootFile(pathFile).replace(/(\_|\.).*/g, '')
    }
}
Array.prototype.diff = function(a) {
    return this.filter(function(i) {return a.indexOf(i) < 0;});
};

const createList = file => {
    let obj = getX(Object.freeze(getObj(file)))

    let txt = getTxtInOriginCod(file)

    for (key in obj) {

        Object.keys(obj[key]).forEach(y => {
            // console.log(obj[key][y])
            // console.log(eliminarDuplicado(obj[key][y].split(/=|\n/g)))
            //Yeeeeeeeeeees
            let arrEsp = eliminarDuplicado(obj[key][y].split(/<br>/gi).map(x => x.trim()))

            let headNewList = '\n\n[' + key + '.' + y + ']\n'
            // console.log('Codigo Original/'+ maviToEsp(file))
            let txtOriginal = getTxtInOriginCod('./../../../Intelisis/Intelisis5000/Codigo Original/'+ maviToEsp(file))
            // console.log(txtOriginal)
            let nameComp = key.replace(/.*?\//gm,'') + '.' + y
            // console.log('Incode: ',nameComp)
            let originalComp = take.intls.comp.byName(nameComp, txtOriginal)
            if (originalComp) {
                // console.log('------------------------------')
                let arrOriginal = originalComp.join('').replace(/^(\r\n|\r|\n)$|\r/gm, '').split(/=|\r\n|\n/g).filter(Boolean)
                // console.log(eliminarDuplicado(originalComp.split(/=|\n/g)))
                if (y != 'SQL') {
                    // console.log(arrOriginal[arrOriginal.length -2])
                    console.log(headNewList)
                    console.log(arrayToList(arrEsp.diff( arrOriginal ),arrOriginal[arrOriginal.length -2]))
                    fs.appendFileSync(file, headNewList + arrayToList(arrEsp.diff( arrOriginal ),arrOriginal[arrOriginal.length -2]))
                } else {
                    // console.log(arrOriginal[arrOriginal.length -4])
                    console.log(headNewList + arrayToList(arrEsp.diff( arrOriginal ),arrOriginal[arrOriginal.length -4]))
                    fs.appendFileSync(file, headNewList + arrayToList(arrEsp.diff( arrOriginal ),arrOriginal[arrOriginal.length -4]),'Latin1')
                }
                // console.log(arrEsp.diff( arrOriginal ))
                // console.log(arrayToList(arrEsp.diff( arrOriginal )))
            }
        })
    }

    let finalTxt = getTxtInOriginCod(file)

    for (key in obj) {

        let compTxt = take.intls.comp.byName(key, txt)

        if (compTxt||compTxt.length != 0) {

            let commentKeys = compTxt.join('')

            commentKeys = commentKeys.replace(new RegExp(`^(?=${Object.keys(obj[key]).join('|')})`, `gm`),`;`)

            finalTxt = finalTxt.replace(rgx.make.intls.comp.byName(key), commentKeys)

        }
    }

    fs.writeFileSync(file, finalTxt, 'Latin1')
}
//Usage
// const files = getFilterFile( ['.esp'], getPathsFiles('Testing\\') )

// files.forEach(file => {
    // let file = './../../../Intelisis/Intelisis5000/Reportes Mavi/Cte_FRM_MAVI.esp'
    
    // createList('./../../../Intelisis/Intelisis5000/Reportes Mavi/Cte_TBL_MAVI.esp')
    // createList('./../../../Intelisis/Intelisis5000/Reportes Mavi/Cte_VIS_MAVI.esp')
    // createList('./../../../Intelisis/Intelisis5000/Reportes Mavi/Cte_FRM_MAVI.esp')

    createList('./../../../Intelisis/Intelisis5000/Reportes Mavi/CteEnviarA_TBL_MAVI.esp')
    createList('./../../../Intelisis/Intelisis5000/Reportes Mavi/CteEnviarA_VIS_MAVI.esp')
    createList('./../../../Intelisis/Intelisis5000/Reportes Mavi/CteEnviarA_FRM_MAVI.esp')
// })

// const filterObjects = objects => objects.map(x =>  getX(Object.freeze(x)))
// filterObjects(getObjects(files))

// console.log(filterObjects(getObjects(files)))
