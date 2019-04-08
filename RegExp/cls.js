let rgx = require('./patterns')

module.exports.intls = {
    comments: txt => txt.replace(rgx.intls.comments, ''),
    afterAbbreviatObj: txt => txt.replace(rgx.intls.aftereAbbreviatObj, ''),
    comp: {
        outSide: (nameComp, txt) => {
            if (rgx.make.intls.comp.outSide(nameComp).test(txt)) {
                return txt.replace(rgx.make.intls.comp.outSide(nameComp), '')
            } else {
                return txt
            }
        },
        allExceptFirstComp: txt => txt.replace(rgx.intls.comp.firstNameComp, ''),
    },
    field: {
    }
}

module.exports.mix = {
}

module.exports.paths = {
    ext: txt => txt.replace(rgx.paths.ext, ''),
    allUntilExt: txt => txt.replace(rgx.paths.untilExt, ''),
    rootFile: txt => txt.replace(rgx.paths.file, '')
}

module.exports.sql = {
}
