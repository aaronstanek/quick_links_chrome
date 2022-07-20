var fs = require('fs')
var platform = require('os').platform()
var path = require('path')
var piebuilder = require('piebuilder')

var init = new piebuilder.Project()

function npmInstallEachPage() {
    var pageList = fs.readdirSync(path.join('src','pages'))
    for (let i = 0; i < pageList.length; ++i) {
        var pageName = pageList[i]
        var directory = path.join(path.join('src','pages',pageName))
        init.beforeTask('cd ' + directory + ' && npm install')
    }
}

npmInstallEachPage()

init.target(piebuilder.makeVirtualPath('init_target'))

init.build(piebuilder.makeVirtualPath('init_target'))
