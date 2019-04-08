let rgx = require('./patterns')

module.exports.intls = {
    comp: {
        addInTheEnd: (nameComp, newContent, txt) => {
            return txt.replace(rgx.make.intls.comp.inTheEnd(nameComp), newContent)
        }
    },
    field: {
    }
}

module.exports.mix = {
}

module.exports.paths = {
}

module.exports.sql = {
}
