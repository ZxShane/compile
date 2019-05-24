const { app, Menu, ipcMain, dialog } = require('electron')
const fs = require('fs')
const os = require('os')
const sd = require('silly-datetime')
const exec = require('child_process').exec
const appRoot = require('app-root-path')
const path = require('path')
const iconv = require('iconv-lite')
const { resolve } = require('path')
// const CACHE_PATH = path.resolve(`${appRoot}\\cache`)
function getCodingInfo() {
    return `//由${os.userInfo().username}创建
//时间: ${sd.format(new Date(), 'YYYY-MM-DD HH:mm')}
`
}
function removeExtName(name) {
    let tmp = name.split('.')
    tmp.pop()
    return tmp.join('.')
}
function genExtName(name) {
    return os.platform() === 'win32' ? removeExtName(name) + '.exe' : removeExtName(name)
}

module.exports = (win) => {
    let currentOpenFile;
    const template = [
        {
            label: '文件',
            submenu: [
                {
                    label: '新建',
                    accelerator: 'CmdOrCtrl+N',
                    click() {
                        currentOpenFile = undefined
                        win.webContents.send('create-file', getCodingInfo())
                    }
                },
                {
                    label: '打开',
                    accelerator: 'CmdOrCtrl+O',
                    click() {
                        dialog.showOpenDialog({
                            properties: ['openFile'],
                            filters: [
                                { name: 'C 文件/txt 文件', extensions: ['c', 'txt'] }
                            ]
                        }, (file) => {
                            if (file === undefined || file[0] === undefined) {
                                win.webContents.send('save-error', '没有选择文件')
                                return
                            }
                            currentOpenFile = file[0]
                            //console.log(currentOpenFile)
                            fs.readFile(file[0], 'utf8', (err, data) => {
                                if (err) {
                                    win.webContents.send('save-error', '打开文件时出现错误: ' + err)
                                    console.error(err)
                                    return
                                }
                                console.log(data)
                                win.webContents.send('open-file-data', data);
                            })
                        })
                    }
                },
                {
                    label: '保存',
                    accelerator: 'CmdOrCtrl+S',
                    click() {
                        console.log('----------------------------------')
                        console.log(currentOpenFile)
                        win.webContents.send('to-save-file', currentOpenFile)
                        ipcMain.on('save-file', (event, content) => {
                            fs.writeFile(currentOpenFile, content, (err) => {
                                if (err) {
                                    win.webContents.send('save-error', '在保存文件时遇到错误: ' + err)
                                    console.error(err)
                                    return
                                }
                                event.sender.send('save-sucessfully', '保存成功')
                            })
                        })

                    }
                },
                {
                    label: '另存为',
                    accelerator: 'CmdOrCtrl+Shift+S',
                    click() {
                        win.webContents.send('to-save-as-file', 'to-save-as-file')
                    }
                }
            ]
        },
        {
            label: '编辑',
            submenu: [
                {
                    label: '撤销',
                    accelerator: 'CmdOrCtrl+Z',
                    click() {
                        win.webContents.send('editor-undo', 'editor-undo')
                    }
                },
                {
                    label: '恢复',
                    accelerator: 'CmdOrCtrl+Shift+Z',
                    click() {
                        win.webContents.send('editor-redo', 'editor-redo')
                    }
                },
                { type: 'separator' },
                { label: '剪切', role: 'cut' },
                { label: '复制', role: 'copy' },
                { label: '粘贴', role: 'paste' },
                { label: '粘贴和匹配样式', role: 'pasteandmatchstyle' },
                { label: '删除', role: 'delete' },
                { label: '全选', role: 'selectall' }
            ]
        }, {
            label: '编译',
            submenu: [
                {
                    label: '词法分析',
                    accelerator: 'CmdOrCtrl+1',
                    click() {
                           if(!currentOpenFile)
                           {
                            console.log(currentOpenFile)
                            win.webContents.send('to-get-editor-value', 'lex')
                            ipcMain.on('get-editor-value', (event, msg) => {
                                if (msg.code !== 'lex') {
                                    return
                                }
                                const data = msg.data
                                const c_cache_file_path = `${resolve('./')}\\main.c`
                                fs.writeFile(c_cache_file_path, data, (err) => {
                                    if (err) {
                                        win.webContents.send('save-error', '在保存文件时遇到错误: ' + err)
                                        console.error(err)
                                        return
                                    }
                                    //console.log(c_cache_file_path)
                                    exec('java -jar ./s.jar -lex ' + c_cache_file_path + '', { encoding: 'buffer' }, (err, stdout, stderr) => {

                                        stdout = iconv.decode(stdout, 'utf8')
                                        stderr = iconv.decode(stderr, 'utf8')
                                        fs.writeFile("./cifa.txt", stdout, (err) => {
                                            if (err) {
                                                win.webContents.send('save-error', '在保存文件时遇到错误: ' + err)
                                                console.error(err)
                                                return
                                            }
                                        });
                                        //console.log(stdout)
                                        if (stderr) {
                                            win.webContents.send('analysis-err', { code: 'lex', data: stderr })
                                        } else {
                                            win.webContents.send('analysis-done', { code: 'lex', data: stdout })
                                        }

                                    })
                                })
                            })

                           }
                            
                        
                        else {
                            exec('java -jar ./s.jar -lex ' + currentOpenFile + '', { encoding: 'buffer' }, (err, stdout, stderr) => {
                                console.log(currentOpenFile);
                                stdout = iconv.decode(stdout, 'utf8')
                                stderr = iconv.decode(stderr, 'utf8')
                                fs.writeFile('./cifa.txt', stdout, (err) => {
                                    if (err) {
                                        win.webContents.send('save-error', '在保存文件时遇到错误: ' + err)
                                        console.error(err)
                                        return
                                    }
                                });
                                if (stderr) {
                                    win.webContents.send('analysis-err', { code: 'lex', data: stderr })
                                } else {
                                    win.webContents.send('analysis-done', { code: 'lex', data: stdout })
                                }

                            })
                        }

                    }
                },
                {
                    label: '语法分析',
                    accelerator: 'CmdOrCtrl+2',
                    click() {
                        if (!currentOpenFile) {
                            win.webContents.send('to-get-editor-value', 'parse')
                            ipcMain.on('get-editor-value', (event, msg) => {
                                if (msg.code !== 'parse') {
                                    return
                                }
                                const data = msg.data
                                const c_cache_file_path = `${resolve('./')}\\main.c`
                                fs.writeFile(c_cache_file_path, data, (err) => {
                                    if (err) {
                                        win.webContents.send('save-error', '在保存文件时遇到错误: ' + err)
                                        console.error(err)
                                        return
                                    }
                                    exec('java -jar ./s.jar -syn ' + c_cache_file_path + '', { encoding: 'buffer' }, (err, stdout, stderr) => {

                                        fs.writeFile("./yufa.txt", stdout, (err) => {
                                            if (err) {
                                                win.webContents.send('save-error', '在保存文件时遇到错误: ' + err)
                                                console.error(err)
                                                return
                                            }
                                        });
                                        stdout = iconv.decode(stdout, 'gbk')
                                        stderr = iconv.decode(stderr, 'gbk')
                                        if (stderr) {
                                            win.webContents.send('analysis-err', { code: 'parse', data: stderr })
                                        } else {
                                            win.webContents.send('analysis-done', { code: 'parse', data: stdout })
                                        }

                                    })
                                })
                            })
                        } else {
                            exec('java -jar ./s.jar -syn ' + currentOpenFile + '', { encoding: 'buffer' }, (err, stdout, stderr) => {

                                fs.writeFile("./yufa.txt", stdout, (err) => {
                                    if (err) {
                                        win.webContents.send('save-error', '在保存文件时遇到错误: ' + err)
                                        console.error(err)
                                        return
                                    }
                                })
                                stdout = iconv.decode(stdout, 'gbk')
                                stderr = iconv.decode(stderr, 'gbk')
                                if (stderr) {
                                    win.webContents.send('analysis-err', { code: 'parse', data: stderr })
                                } else {
                                    win.webContents.send('analysis-done', { code: 'parse', data: stdout })
                                }

                            })
                        }

                    }
                },
                {
                    label: '语义分析',
                    accelerator: 'CmdOrCtrl+3',
                    click() {
                        if (!currentOpenFile) {
                            win.webContents.send('to-get-editor-value', 'sem')
                            ipcMain.on('get-editor-value', (event, msg) => {
                                if (msg.code !== 'sem') {
                                    return
                                }
                                const data = msg.data
                                const c_cache_file_path = `${resolve('./')}\\main.c`
                                fs.writeFile(c_cache_file_path, data, (err) => {
                                    if (err) {
                                        win.webContents.send('save-error', '在保存文件时遇到错误: ' + err)
                                        console.error(err)
                                        return
                                    }
                                    exec('java -jar ./s.jar -int ' + c_cache_file_path + '', { encoding: 'buffer' }, (err, stdout, stderr) => {
                                        fs.writeFile("./yuyi.txt", stdout, (err) => {
                                            if (err) {
                                                win.webContents.send('save-error', '在保存文件时遇到错误: ' + err)
                                                console.error(err)
                                                return
                                            }
                                        })
                                        stdout = iconv.decode(stdout, 'gbk')
                                        stderr = iconv.decode(stderr, 'gbk')
                                        if (stderr) {
                                            win.webContents.send('analysis-err', { code: 'sem', data: stderr })
                                        } else {
                                            // console.log('analysis-done')
                                            win.webContents.send('analysis-done', { code: 'sem', data: stdout })
                                        }

                                    })
                                })
                            })
                        } else {
                            exec('java -jar ./s.jar -int ' + currentOpenFile + '', { encoding: 'buffer' }, (err, stdout, stderr) => {
                                fs.writeFile("./yuyi.txt", stdout, (err) => {
                                    if (err) {
                                        win.webContents.send('save-error', '在保存文件时遇到错误: ' + err)
                                        console.error(err)
                                        return
                                    }
                                })
                                stdout = iconv.decode(stdout, 'gbk')
                                stderr = iconv.decode(stderr, 'gbk')
                                if (stderr) {
                                    win.webContents.send('analysis-err', { code: 'sem', data: stderr })
                                } else {
                                    win.webContents.send('analysis-done', { code: 'sem', data: stdout })
                                }

                            })
                        }

                    }
                },
                {
                    label: '生成汇编代码',
                    accelerator: 'CmdOrCtrl+4',
                    click() {
                        // console.log('asm')
                        if (!currentOpenFile) {
                            win.webContents.send('to-get-editor-value', 'asm')
                            ipcMain.on('get-editor-value', (event, msg) => {
                                if (msg.code !== 'asm') {
                                    return
                                }
                                const data = msg.data
                                const c_cache_file_path = `${resolve('./')}\\main.c`
                                fs.writeFile(c_cache_file_path, data, (err) => {
                                    if (err) {
                                        win.webContents.send('save-error', '在保存文件时遇到错误: ' + err)
                                        console.error(err)
                                        return
                                    }
                                    exec('java -jar ./s.jar -com ' + c_cache_file_path + '', { encoding: 'buffer' }, (err, stdout, stderr) => {
                                        stdout = iconv.decode(stdout, 'gbk')
                                        stderr = iconv.decode(stderr, 'gbk')
                                        fs.writeFile("./huibian.txt", stdout, (err) => {
                                            if (err) {
                                                win.webContents.send('save-error', '在保存文件时遇到错误: ' + err)
                                                console.error(err)
                                                return
                                            }
                                        })
                                        if (stderr) {
                                            win.webContents.send('analysis-err', { code: 'asm', data: stderr })
                                        } else {
                                            win.webContents.send('analysis-done', { code: 'asm', path: removeExtName(c_cache_file_path) + '.s', data: stdout })
                                        }

                                    })
                                })
                            })
                        } else {
                            exec('java -jar ./s.jar -com ' + currentOpenFile + '', { encoding: 'buffer' }, (err, stdout, stderr) => {
                                fs.writeFile("./huibian.txt", stdout, (err) => {
                                    if (err) {
                                        win.webContents.send('save-error', '在保存文件时遇到错误: ' + err)
                                        console.error(err)
                                        return
                                    }
                                })
                                stdout = iconv.decode(stdout, 'gbk')
                                stderr = iconv.decode(stderr, 'gbk')
                                if (stderr) {
                                    win.webContents.send('analysis-err', { code: 'asm', data: stderr })
                                } else {
                                    win.webContents.send('analysis-done', { code: 'asm', path: removeExtName(currentOpenFile) + '.s', data: stdout })
                                }

                            })
                        }

                    }
                },
                {
                    label: '生成二进制文件',
                    accelerator: 'CmdOrCtrl+5',
                    click() {
                        if (!currentOpenFile) {
                            win.webContents.send('to-get-editor-value', 'target')
                            ipcMain.on('get-editor-value', (event, msg) => {
                                if (msg.code !== 'target') {
                                    return
                                }
                                const data = msg.data
                                const c_cache_file_path = `${resolve('./')}\\MinGW\\bin`
                                exec('cd ' + c_cache_file_path + '&&java -jar ./bin.jar -bin', { encoding: 'buffer' }, (err, stdout, stderr) => {
                                    stdout = iconv.decode(stdout, 'gbk')
                                    stderr = iconv.decode(stderr, 'gbk')
                                    if (stderr) {
                                        win.webContents.send('analysis-err', { code: 'target', data: stderr })
                                    } else {
                                        win.webContents.send('analysis-done', { code: 'target', path: `${resolve('./')}\\result\\bin.exe`, data: stdout })
                                    }

                                })
                            })

                        } else {
                            const c_cache_file_path = `${resolve('./')}\\MinGW\\bin`
                            exec('cd ' + c_cache_file_path + '&&java -jar ./bin.jar -bin', { encoding: 'buffer' }, (err, stdout, stderr) => {

                                stdout = iconv.decode(stdout, 'gbk')
                                stderr = iconv.decode(stderr, 'gbk')
                                if (stderr) {
                                    win.webContents.send('analysis-err', { code: 'target', data: stderr })
                                } else {
                                    win.webContents.send('analysis-done', { code: 'target', path: `${resolve('./')}\\result\\bin.exe`, data: stdout })
                                }

                            })
                        }

                    }
                },
                {
                    label: '运行',
                    accelerator: 'F5',
                    click() {
                        let i = 0;
                        if (!currentOpenFile) {
                            win.webContents.send('to-get-editor-value', 'run')
                            ipcMain.on('get-editor-value', (event, msg) => {
                                if (msg.code !== 'run' || i > 0) {
                                    return
                                }
                                i++;
                                const data = msg.data
                                const c_cache_file_path = `${resolve('./')}\\main.c`
                                fs.writeFile(c_cache_file_path, data, (err) => {
                                    if (err) {
                                        win.webContents.send('save-error', '在保存文件时遇到错误: ' + err)
                                        console.error(err)
                                        return
                                    }
                                    exec('cd result&& start cmd /k bin.exe&&pause&&exit', { encoding: 'buffer' }, (err, stdout, stderr) => {
                                        stdout = iconv.decode(stdout, 'gbk')
                                        stderr = iconv.decode(stderr, 'gbk')
                                        if (stderr) {

                                            win.webContents.send('analysis-err', { code: 'run', data: stderr })
                                        } else {
                                            win.webContents.send('analysis-done', { code: 'run', data: stdout })
                                        }

                                    })
                                })
                            })
                        } else {
                            exec('cd result&& start cmd /k bin.exe&&pause&&exit', { encoding: 'buffer' }, (err, stdout, stderr) => {
                                stdout = iconv.decode(stdout, 'gbk')
                                stderr = iconv.decode(stderr, 'gbk')
                                if (stderr) {
                                    win.webContents.send('analysis-err', { code: 'run', data: stderr })
                                } else {
                                    win.webContents.send('analysis-done', { code: 'run', data: stdout })
                                }

                            })
                        }

                    }
                }
            ]
        }, {
            label: '视图',
            submenu: [
                { label: '重新加载', role: 'reload' },
                { label: '强制重载', role: 'forcereload' },
                { label: '切换开发者工具', role: 'toggledevtools' },
                { type: 'separator' },
                { label: '重置缩放', role: 'resetzoom' },
                { label: '放大', role: 'zoomin' },
                { label: '缩小', role: 'zoomout' },
                { type: 'separator' },
                { label: '切换全屏', role: 'togglefullscreen' }
            ]
        },
        {
            label: '窗口',
            role: 'window',
            submenu: [
                { label: '关闭窗口', role: 'close' },
                { label: '最小化窗口', role: 'minimize' },
                { label: '缩放', role: 'zoom' },
                { type: 'separator' },
                { label: '前置所有窗口', role: 'front' }
            ]
        },
        {
            label: '关于我们',
            role: 'help',
            click() {
                const { BrowserWindow } = require('electron')
                const win = new BrowserWindow({ width: 1000, height: 600, frame: true })
                win.loadURL(path.join('file://', __dirname, '../render-process/about/index.html'))
                win.show()
            }

        }
    ]

    if (process.platform === 'darwin') {
        template.unshift({
            label: app.getName(),
            submenu: [
                { role: 'about' },
                { type: 'separator' },
                { role: 'services', submenu: [] },
                { type: 'separator' },
                { role: 'hide' },
                { role: 'hideothers' },
                { role: 'unhide' },
                { type: 'separator' },
                { role: 'quit' }
            ]
        })

        // Edit menu
        template[1].submenu.push(
            { type: 'separator' },
            {
                label: '语音',
                submenu: [
                    { label: '开始听写...', role: 'startspeaking' },
                    { label: '停止听写', role: 'stopspeaking' }
                ]
            }
        )
    }
    ipcMain.on('save-as-file', (event, content) => {
        dialog.showSaveDialog({
            title: '保存文件',
            filters: [
                { name: 'C 文件', extensions: ['c'] }
            ]
        }, (filename) => {
            if (!filename) {
                event.sender.send('save-error', '没有选择位置')
                return
            }
            fs.writeFile(filename, content, (err) => {
                if (err) {
                    event.sender.send('save-error', '在保存文件时遇到错误: ' + err)
                    console.error(err)
                    return
                }
                currentOpenFile = filename
                event.sender.send('save-sucessfully', filename + '保存成功')
            })
        })
    })
    const menu = Menu.buildFromTemplate(template)
    Menu.setApplicationMenu(menu)
}