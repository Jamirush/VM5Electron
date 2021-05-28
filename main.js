// jshint esnext: true

const {app, BrowserWindow, ipcMain, Menu} = require('electron'),
    Store = require('electron-store'),
    store = new Store();

// DATAS M5 //
let vampires = store.has('vampires') ? store.get('vampires') : [];

let mainWindow = null;

function createWindow(pathFile, widthWin = 1000, heightWin = 800) {
    let win = new BrowserWindow({
        width: widthWin,
        height: heightWin,
        webPreferences: {
            nodeIntegration: true, 
            contextIsolation: false,
            enableRemoteModule: true
        },
    });

    win.loadFile(pathFile);
    
    win.on('closed', () => {
        win = null;
    });

    return win;
}

app.whenReady().then(() => {
    mainWindow = createWindow('views/m5/m5.html');
    mainWindow.webContents.once('did-finish-load', () => {
        mainWindow.send('store-data', {
            vampires: vampires
        });
    });
});

// Add vampire windows //
ipcMain.on('open-new-vampire-window', (evt, data) => {
    const win = createWindow('views/addVampire/addVampire.html');
    win.webContents.once('did-finish-load', () => {
        win.send('clans-with-addVampire', {
            clans: clanArray
        });
    });
});

ipcMain.on('add-new-vampire', (evt, newVampire) => {
    console.log(newVampire);
    let arrayForAdd = vampires;
    newVampire.id = setId(arrayForAdd);
    arrayForAdd.push(newVampire);

    store.set('vampires', arrayForAdd);
    
    mainWindow.webContents.send('update-with-new-vampire', {
        vampires: vampires,
    });
});

//COMMON FUNCTIONS
function setId(array){
    return array.length > 0 ? array[array.length-1].id + 1 : 1;
}

// MENU //
const templateMenu = [
    {
        label: 'Fenêtre',
        submenu:[
            {role: 'reload'},
            {role: 'toggledevtools'},
            {type: 'separator'},
            {role: 'togglefullscreen'},
            {role: 'minimize'},
            {type: 'separator'},
            {role: 'close'}
        ]
    },
    {
        label: 'Développement',
        submenu:[
            {
                label: 'Supprimer BDD',
                click() {
                    store.clear();
                }
            }
        ]
    }
];

//ligne pour les MAC
if (process.platform === 'darwin') {
    template.unshift({
        label: app.name,
        submenu: [
            {role: 'quit'}
        ]
    });
}

const menu = Menu.buildFromTemplate(templateMenu);
Menu.setApplicationMenu(menu);

// DATA //

const clanArray = [
    {
        name: "Brutjah",
        value: 1
    },
    {
        name: "Gangrel",
        value: 2
    },
    {
        name: "Malkavien",
        value: 3
    },
    {
        name: "Nosferatu",
        value: 4
    },
    {
        name: "Toréador",
        value: 5
    },
    {
        name: "Tremere",
        value: 6
    },
    {
        name: "Ventrue",
        value: 7
    },
    {
        name: "Caïtif",
        value: 8
    },
    {
        name: "Sang Clair",
        value: 9
    },
]