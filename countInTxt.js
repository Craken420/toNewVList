module.exports.Lines = txt => {
    if(txt) {
        if (/\r/g.test(txt)) {
            return txt.match(/\r/g).length + 1
        } else if (/\n/g.test(txt)) {
            return txt.match(/\n/g).length + 1
        } else if (/$/gm.test(txt)) {
            return txt.match(/$/gm).length
        } else {
            return 1
        }
    } else {
        return 0
    }
}

module.exports.characters = txt => {
    if (txt) {
        if (/./g.test(txt)) {
            return txt.match(/./g).length
        } else {
            return 0
        }
    } else {
        return 0
    }
}
