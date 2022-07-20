var fs = require('fs')
var path = require('path')
var piebuilder = require('piebuilder')

var project = new piebuilder.Project()

var pageList = fs.readdirSync(path.join('src','pages'))

function makeDir(directory) {
    return () => {
        if (fs.existsSync(directory)) {
            return 0;
        }
        else {
            fs.mkdirSync(directory);
            if (fs.existsSync(directory)) {
                return 0;
            }
            else {
                return 1;
            }
        }
    }
}

project.beforeTask(makeDir('out'))
for (let i = 0; i < pageList.length; ++i) {
    project.beforeTask(makeDir(path.join('out',pageList[i])))
}

var projectContext = project.dependencyContext()
projectContext.fileDependency('build.js')
    .fileDependency('initialize.js')
    .fileDependency('package.json')
    .fileDependency('package-lock.json')


function createRootTarget() {
    var t = projectContext.target(piebuilder.makeVirtualPath('root_target'))
    t.fileDependency(piebuilder.makeVirtualPath('global'))
    for (let i = 0; i < pageList.length; ++i) {
        t.fileDependency(piebuilder.makeVirtualPath('page_' + pageList[i]))
    }
}

createRootTarget()

function copyContent(source,destination) {
    if (piebuilder.sys.family === 'unix') {
        return 'cp -R \"' + source + '\"/* \"' + destination + '\"'
    }
    else {
        return 'xcopy \"' + source + '\" \"' + destination + '\\\" /E/Y'
    }
}

function globalCopy() {
    var t = projectContext.target(piebuilder.makeVirtualPath('global'))
    t.directorySourcesDependency(path.join('src','global'))
    t.task(copyContent(
        path.join('src','global'),
        path.join('out')
    ))
}

globalCopy()

function pageTarget(pageName) {
    var t = projectContext.target(piebuilder.makeVirtualPath('page_'+pageName))
    t.directorySourcesDependency(
        path.join('src','pages',pageName,'src')
    )
    var staticFiles = fs.readdirSync(path.join('src','pages',pageName,'public'))
    for (let i = 0; i < staticFiles.length; ++i) {
        if (staticFiles[i] !== 'build') {
            t.fileDependency(path.join('src','pages',pageName,'public',staticFiles[i]))
        }
    }
    t.task('cd \"' + path.join('src','pages',pageName) + '\" && npm run build')
    t.task(copyContent(
        path.join('src','pages',pageName,'public'),
        path.join('out',pageName)
    ))
}

for (let i = 0; i < pageList.length; ++i) {
    pageTarget(pageList[i])
}

var buildOutput = project.build(piebuilder.makeVirtualPath('root_target'))

console.log('')

let fileList = Object.keys(buildOutput.files)
for (let i = 0; i < fileList.length; ++i) {
    let fileName = fileList[i]
    console.log(fileName,buildOutput.files[fileName])
}

console.log('')

console.log('built sucessfully in ' + buildOutput.duration + ' milliseconds')

console.log('')
