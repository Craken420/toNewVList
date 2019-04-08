const fs = require('fs')
const path = require('path')
const { promisify } = require('util')

const readdir = promisify(fs.readdir)
const stat = promisify(fs.stat)

const getFiles = async function (dir) {

    const result = readdir(dir).map(file => path.resolve(dir, file))

    return await Promise.all(result)
}

 getFiles('Testing\\')