let { adapt }= require('./adapt')
let count = require('../Mix/Text/countInTxt')

module.exports.txtToRgx = txt => {

   let numLinesTxt = count.Lines(txt)
   let countCharact = count.characters(txt)

    if (numLinesTxt == 1 && countCharact < 60) {

        return new RegExp(`${adapt.toRegExp(txt)}`, ``)

    } else if (numLinesTxt >= 1 && countCharact < 80) {

        let start = adapt.toRegExp(txt.match(new RegExp(`.*`, ``)).join(''))
        let end = adapt.toRegExp(txt.match(new RegExp(`.*$`, ``)).join('')).replace(/(\\s)+(\\n)+$/,'')

        return new RegExp(`${start}[^]*${end}`, ``)

    } else if (numLinesTxt >= 1 && countCharact >= 80) {

        let start = adapt.toRegExp(txt.match(new RegExp(`.{80}`, ``)).join(''))
        let end = adapt.toRegExp(txt.match(new RegExp(`.{80}$`, ``)).join('')).replace(/(\\s)+(\\n)+$/,'')

        return new RegExp(`${start}[^]*${end}`, ``)

    } else {
        console.log('Exception in regular expression')
        return new RegExp(`${adapt.toRegExp(txt)}`, ``)
    }
}