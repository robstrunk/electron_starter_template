const BrowserWindow = require('electron').BrowserWindow;
const debug = /--debug/.test(process.argv[2]);
const ipcMain = require('electron').ipcMain;
const electron = require('electron');
const app = require('electron').app;
const path = require('path');
const glob = require('glob');

var mainWindow = null;

function initialize() {

    var shouldQuit = makeSingleInstance();
    if (shouldQuit) return app.quit();

    function createWindow() {

        var windowOptions = {
            height: 1080,
            width: 1920 ,
            title: app.getName(),
            show: false,
            fullscreen: false
        };

        mainWindow = new BrowserWindow(windowOptions);
        mainWindow.loadURL(path.join('file://', __dirname, './views/index.html'));

        mainWindow.once('ready-to-show', () => {
            mainWindow.maximize();
            mainWindow.show();
            if (debug) {
                mainWindow.webContents.openDevTools();
                require('devtron').install();
            }
        });

        mainWindow.on('closed', function() {
            mainWindow = null;
        });

        mainWindow.webContents.on('crashed', function () {
            //implement
        });
        mainWindow.on('unresponsive', function () {
            //implement
        });
        process.on('uncaughtException', function () {
            //implement
        });
    }

    app.on('ready', function() {
        createWindow();
    });

    app.on('window-all-closed', function() {
        if (process.platform !== 'darwin') {
            app.quit();
        }
    });

    app.on('activate', function() {
        if (mainWindow === null) {
            createWindow();
        }
    });
}

//prevent multiple instances of application running at once
function makeSingleInstance() {
    if (process.mas) return false;

    return app.makeSingleInstance(function() {
        if (mainWindow) {
            if (mainWindow.isMinimized()) mainWindow.restore();
            mainWindow.focus();
        }
    });
}

initialize();