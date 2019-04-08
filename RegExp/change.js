let rgx = require('./patterns')
let { txtToRgx } = require('./txtToRgx')

module.exports.intls = {
    comp: {
    },
    field: {
    }
}

module.exports.mix = {
    bitTxtToLower: (txt, txtToLower) => {
       return txt.replace(txtToRgx(txtToLower), txtToLower.toLowerCase())
    },
    bitTxtToUpper: (txt, txtToUpper) => {
        return txt.replace(txtToRgx(txtToUpper), txtToUpper.toUpperCase())
    },
    lastLowScriptToPoint: txt => txt.replace(rgx.mix.lastLowScript, '.'),
    lastPointToLowScript: txt => txt.replace(rgx.mix.lastPoint, '_')
}

module.exports.sql = {
}
