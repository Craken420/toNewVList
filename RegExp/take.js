let rgx = require('./patterns')

module.exports.intls = {
    objBtwnLowScripts: txt => (rgx.intls.objBtwnLowScripts.test(txt)) ? txt.match(rgx.intls.objBtwnLowScripts) : false,
    beforeAbbreviatObj: txt => {
        if (rgx.intls.beforeAbbreviatObj.test(txt)) {
            return txt.match(rgx.intls.beforeAbbreviatObj)
        } else {
            return false
        }
    },
    comp: {
        byName: (nameComp, txt) => {
            if (rgx.make.intls.comp.byName(nameComp).test(txt)) {
                // console.log('------------------------------------------')
                // console.log(rgx.make.intls.comp.byName(nameComp))
                // console.log(txt.match(rgx.make.intls.comp.byName(nameComp)))
                // console.log('------------------------------------------')
                // console.log(txt)
                return txt.match(rgx.make.intls.comp.byName(nameComp))
            } else {
                false
            }
        },
        byNameFile: (nameComp, txt) => {
            if (rgx.make.intls.comp.byNameFile(nameComp).test(txt)) {
                return txt.match(rgx.make.intls.comp.byNameFile(nameComp))
            } else {
                false
            }
        },
        head: txt => (rgx.intls.comp.head.test(txt.replace(/^/, '\n'))) ? txt.replace(/^/, '\n').match(rgx.intls.comp.head) : false,
        nameFile: txt => rgx.intls.comp.nameFile.test(txt) && txt.match(rgx.intls.comp.nameFile),
        outSide: (nameComp, txt) => {
            if (rgx.make.intls.comp.outSide(nameComp).test(txt)) {
                return txt.match(rgx.make.intls.comp.outSide(nameComp))
            } else {
                return false
            }
        }
    },
    field: {
        content: (field, txt) => {
            if (rgx.make.intls.field.content(field).test(txt)) {
                return txt.match(rgx.make.intls.field.content(field)).join('')
            }
        },
        full: txt => (rgx.intls.field.full.test(txt)) ? txt.match(rgx.intls.field.full) : false,
        fullByName: (fieldName,txt) => (rgx.make.intls.field.fullByName(fieldName).test(txt)) ? txt.match(rgx.make.intls.field.fullByName(fieldName)) : false,
        name: txt => (rgx.intls.field.name.test(txt)) ? txt.match(rgx.intls.field.name) : false,
    }
}

module.exports.mix = {

    firstTwoLines: txt => { if (/.*?\r\n.*?\r\n/.test(txt)) return txt.match(/.*?\r\n.*?\r\n/).join('')},

    firstLine: txt => { if (/.*/.test(txt)) return txt.match(/.*/).join('')},
  
    lastTwoLines: txt => {
      let lastLine = txt.replace(/^\s\n/gm, '').split('\r\n')
      return  lastLine[lastLine.length-2] + '\r\n'
            + lastLine[lastLine.length-1]
    },
    lastLine: txt => {
      let lastLine = txt.replace(/^\s\n/gm, '').split('\r\n')
      return lastLine[lastLine.length-1]
    }
}

module.exports.paths = {
    ext: txt => {
        if (rgx.paths.ext.test(txt)) {
            return txt.match(rgx.paths.ext).join('')
        } else {
            return false
        }
    },
}

module.exports.sql = {
}
