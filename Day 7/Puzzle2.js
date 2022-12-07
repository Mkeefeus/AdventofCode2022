const path = require('path');
const fs = require('fs');

const input = fs
    .readFileSync(path.join(__dirname, 'input.txt'), 'utf8')
    .toString()
    .trim()
    .split('\r\n');

let home = { '/': { files: [], size: 0 }, size:0 }
let currDir = home['/']
let currDirPath = ['/']
let deepestDirPath = ['/']
let amountNeeded = 30000000
let smallestSize = 70000000
let foundSizes = []


function handleUpDir() {
    let dir = home
    currDirPath.forEach((subDir) => {
        dir = dir[subDir]
    })
    return dir
}

function updateSize(obj) {
    let subObjectSize = 0
    const entries = Object.entries(obj)
    for (const [key, value] of entries) {
        if (key !== "files" && key !== "size") {
            subObjectSize += updateSize(value)
        }
    }
    obj.size += subObjectSize
    if (obj.size <= 100000) {
        foundSizes.push(obj.size)
    }
    return obj.size
}

function getDirToDelete(obj) {
    const entries = Object.entries(obj)
    for (const [key, value] of entries) {
        if (key !== "files" && key !== "size") {
            smallestSize = getDirToDelete(value)
        }
    }
    if (obj.size < smallestSize && obj.size >= amountNeeded) {
        smallestSize = obj.size
    }
    return smallestSize
}

for (i = 2; i < input.length; i++) {
    const line = input[i]
    let lineSplit = line.split(' ')
    if (lineSplit[0] == '$') {
        if (lineSplit[1] == 'cd') {
            if (lineSplit[2] == '..') {
                currDirPath.pop()
                currDir = handleUpDir()
            } else {
                currDir[lineSplit[2]] = currDir[lineSplit[2]] || { files: [], size: 0 }
                currDirPath.push(lineSplit[2])
                if (currDirPath.length > deepestDirPath.length) {
                    deepestDirPath.push(lineSplit[2])
                }
                currDir = currDir[lineSplit[2]]
            }
        }
    } else if (lineSplit[0] !== "dir") {
        currDir.files.push(lineSplit[0])
        currDir.size += Number(lineSplit[0])
    }
}

currDir = home
currDirPath = []

updateSize(home, home['/'].size)
amountInUse = home['/'].size
let amountAvailable = 70000000 - amountInUse
amountNeeded = 30000000 - amountAvailable
smallestSize = getDirToDelete(home['/'])
console.log(smallestSize)