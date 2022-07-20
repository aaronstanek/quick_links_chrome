var fs = require('fs')
var path = require('path')
var tar = require('tar')
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
project.beforeTask(makeDir('intermediate'))
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
    t.fileDependency(piebuilder.makeVirtualPath('out_global'))
    for (let i = 0; i < pageList.length; ++i) {
        t.fileDependency(piebuilder.makeVirtualPath('out_'+pageList[i]))
    }
}

createRootTarget()

projectContext.target(piebuilder.makeVirtualPath('out_global'))
    .fileDependency(path.join('intermediate','global.tar'))
    .task(()=>{
        tar.x({
                sync: true,
                file: path.join('intermediate','global.tar'),
                cwd: 'out'
        })
        return 0
    })

function unTar(pageName) {
    projectContext.target(piebuilder.makeVirtualPath('out_'+pageName))
        .fileDependency(path.join('intermediate',pageName+'.tar'))
        .task(()=>{
            tar.x({
                sync: true,
                file: path.join('intermediate',pageName+'.tar'),
                cwd: path.join('out',pageName)
            })
            return 0
        })
}

for (let i = 0; i < pageList.length; ++i) {
    unTar(pageList[i])
}

projectContext.target(path.join('intermediate','global.tar'))
    .directorySourcesDependency(path.join('src','global'))
    .task(()=>{
        tar.c({
            sync: true,
            file: path.join('intermediate','global.tar'),
            cwd: path.join('src','global')
        },
        fs.readdirSync(path.join('src','global'))
        )
        return 0
    })

function buildPage(pageName) {
    var t = projectContext.target(path.join('intermediate',pageName+'.tar'))
    t.directorySourcesDependency(path.join('src','pages',pageName,'src'))
    var publicFiles = fs.readdirSync(path.join('src','pages',pageName,'public'))
    for (let i = 0; i < publicFiles.length; ++i) {
        if (publicFiles[i] !== 'build') {
            t.fileDependency(path.join('src','pages',pageName,'public',publicFiles[i]))
        }
    }
    t.task('cd \"' + path.join('src','pages',pageName) + '\" && npm run build')
    t.task(()=>{
        tar.c({
            sync: true,
            file: path.join('intermediate',pageName+'.tar'),
            cwd: path.join('src','pages',pageName,'public')
        },
        publicFiles     
        )
        return 0
    })
}

for (let i = 0; i < pageList.length; ++i) {
    buildPage(pageList[i])
}

var buildOutput = project.build(piebuilder.makeVirtualPath('root_target'))

console.log('')

let fileList = Object.keys(buildOutput.files)
fileList.sort()
for (let i = 0; i < fileList.length; ++i) {
    let fileName = fileList[i]
    console.log(fileName,buildOutput.files[fileName])
}

console.log('')

console.log('built sucessfully in ' + buildOutput.duration + ' milliseconds')

console.log('')
