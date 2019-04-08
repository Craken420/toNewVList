const { adapt }= require('./adapt')

module.exports.intls = {

    //=> Get: ';Commentary util end of line'
    comments: /^;.*$/gm,

    //=> _FRM_
    objBtwnLowScripts: /(?<=_)(dlg|frm|rep|tbl|vis)(?=_)/i,

    //=> Entry: 'ActivoF_Cat_FRM_MAVI' Get: 'ActivoF_Cat_FRM'
    beforeAbbreviatObj: /.*?(?<=_)(dlg|frm|rep|tbl|vis)/gi,

    //=> Entry: 'ActivoF_Cat_FRM_MAVI' Get: '_MAVI'
    aftereAbbreviatObj: /(?<=.*?_(dlg|frm|rep|tbl|vis)(?=_)).*/gi,

    comp: {
/*
        //=> Entry:
            [Version.frm/AccionePerfilDBMail]
            Nombre=PerfilDBMail
            Boton=84
        //=> Get:
            Nombre=PerfilDBMail
            Boton=84
        */
        firstNameComp: /(?<=\[.*?\]$)[^]*/m,

        /*
        //=> Entry:
            [Version.frm/AccionePerfilDBMail]
            Nombre=PerfilDBMail
            Boton=84
        //=> Get:
            Nombre=PerfilDBMail
            Boton=84
        */
        allExcepHeadComp: /(?<=^\[.*?\/.*?\]$)(\r(?!^\[.+?\]).*?$)+/gm,

        /*
        //=> Entry:
            [Version.frm/AccionePerfilDBMail]
            Nombre=PerfilDBMail
            Boton=84
        //=> Get:'[Version.frm/AccionePerfilDBMail]'
        */
        head: /(?<=^\[).*?(?=\]$)/gm,

        /*
        //=> Entry:
            [Version.frm/AccionePerfilDBMail]
            Nombre=PerfilDBMail
            Boton=84
        //=> Get:'Version.frm'
        */
        nameFile: /(?<=^\[).*?(?=\/.*?\])/g,
    },
    field: {
        full: /^.*?\=.*?(?=(\r|\n|$))/gm,
        name: /^.*?(?=\=)/gm,
    }
}

module.exports.make = {
    intls: {
        comp: {
            byName: nameComp => new RegExp(`\\[\\b${adapt.toRegExp(nameComp)}\\b\\]((\\n|\\r)(?!^\\[.+?\\]).*?$)+`, `gm`),
            byNameFile: nameFile => new RegExp(`^\\[${adapt.toRegExp(nameFile)}\\/.*?\\]((\\n|\\r)(?!^\\[.+?\\]).*?$)+`, `gm`),
            exist: nameComp => new RegExp(`^\\[${adapt.toRegExp(nameComp.join(''))}\\]`, `gm`),
            inTheEnd: nameComp => new RegExp (`(?<=\\[${nameComp}\\](\\r\\n(?!^\\[.+?\\]).*?$)+)`,`m`),
            outSide: nameComp => new RegExp(`\\[(?!(\\b${adapt.toRegExp(nameComp)}\\b)).*?\\/.*?\\]((\\n|\\r)(?!^\\[.+?\\]).*?$)+`, `gim`),
            // outSide: nameComp => new RegExp(`\\[(?!(\\b${adapt.toRegExp(nameComp)}\\b|Acciones)).*?\\]((\\n|\\r)(?!^\\[.+?\\]).*?$)+`, `gm`),
        },
        field: {
            fullByName: fieldName => { return new RegExp(`^${adapt.toRegExp(fieldName)}\\=.*`, `gim`)},
            content: fieldName => new RegExp(`(?<=^${adapt.toRegExp(fieldName)}\=).*?(?=(\\r|\\n|$))`, `gm`)
        },
    },
    mix: {
        startUntilEnd: (firstLine, lastLine) => { 
            return new RegExp (`${adapt.toRegExp(firstLine)}[^]*${adapt.toRegExp(lastLine).replace(/\\s$/, '')}`, ``)
        },
    },
    sql: {
    }
}

module.exports.mix = {
    //=> Entry: 'ActivoF_Cat_FRM' Get Latest: '_' Exmp: ActivoF_Cat"_"FRM
    lastLowScript: /_(?!.*?_)/,
    lastPoint: /\.(?!.*?\.)/
}

module.exports.paths = {

    //=> Entry: 'Name File.txt' Get: '.txt'
    ext: /\.\w+$/,
    untilExt: /.*?(?=\.\w+$)/,
    //=> Entry: 'c:/Path/Name File.txt' Get: 'Name File.txt'
    file: /.*(\\|\/)/,
}

module.exports.sql = {
}
