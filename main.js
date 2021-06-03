// jshint esnext: true

const {
    app,
    BrowserWindow,
    ipcMain,
    Menu
} = require('electron'),
    Store = require('electron-store'),
    store = new Store();

// DATAS M5 //
let vampires = store.has('vampires') ? store.get('vampires') : [];

let mainWindow = null;

function createWindow(pathFile, widthWin = 1200, heightWin = 800) {
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
            clans: clanArray,
            abilitys: abilitysArray,
            skills: skillsArray,
            disciplines: disciplinesArray,
            avantages : avantagesArray,
            flaws: flawsArray,
            abilitysRules: abilitysRulesArray,
            jackOfAllTradesSkills: jackOfAllTradesSkillsArray,
            balancedSkills: balancedSkillsArray,
            specialistskills: specialistskillsArray
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

ipcMain.on('open-update-vampire-window', (evt, data) => {
    //TODO UPDATE
    console.log(data.vampire);
});

//COMMON FUNCTIONS
function setId(array) {
    return array.length > 0 ? array[array.length - 1].id + 1 : 1;
}

// MENU //
const templateMenu = [{
        label: 'Fenêtre',
        submenu: [{
                role: 'reload'
            },
            {
                role: 'toggledevtools'
            },
            {
                type: 'separator'
            },
            {
                role: 'togglefullscreen'
            },
            {
                role: 'minimize'
            },
            {
                type: 'separator'
            },
            {
                role: 'close'
            }
        ]
    },
    {
        label: 'Développement',
        submenu: [{
            label: 'Supprimer BDD',
            click() {
                store.clear();
            }
        }]
    }
];

//ligne pour les MAC
if (process.platform === 'darwin') {
    template.unshift({
        label: app.name,
        submenu: [{
            role: 'quit'
        }]
    });
}

const menu = Menu.buildFromTemplate(templateMenu);
Menu.setApplicationMenu(menu);

// DATA //

const clanArray = [{
        name: "brutjah",
        description: "Brutjah",
        disciplines: ["celerity","presence","potence"]
    },
    {
        name: "gangrel",
        description: "Gangrel",
        disciplines: ["animalisme","protean","endurance"]
    },
    {
        name: "malkavien",
        description: "Malkavien",
        disciplines: ["auspex","domination","occultation"]
    },
    {
        name: "nosferatu",
        description: "Nosferatu",
        disciplines: ["animalisme","occultation","potence"]
    },
    {
        name: "toreador",
        description: "Toréador",
        disciplines: ["auspex","celerity","presence"]
    },
    {
        name: "tremere",
        description: "Tremere",
        disciplines: ["domination","auspex","thaumaturgy"]
    },
    {
        name: "ventrue",
        description: "Ventrue",
        disciplines: ["domination","endurance","presence"]
    },
    {
        name: "caitif",
        description: "Caïtif",
        disciplines: ["animalisme", "auspex", "celerity", "domination", "endurance", "occultation", "presence", "protean", "potence", "thaumaturgy"]
    },
    {
        name: "sangClair",
        description: "Sang Clair",
        disciplines: ["alchimie"]
    },
];
const abilitysArray = [{
        name: "strength",
        value: 1
    },
    {
        name: "dexterity",
        value: 1
    },
    {
        name: "vigor",
        value: 1
    },
    {
        name: "charisma",
        value: 1
    },
    {
        name: "manipulation",
        value: 1
    },
    {
        name: "selfControl",
        value: 1
    },
    {
        name: "intelligence",
        value: 1
    },
    {
        name: "wit",
        value: 1
    },
    {
        name: "resoluteness",
        value: 1
    },
];
const skillsArray = [{
        name: "firearms",
        value: 0
    },
    {
        name: "artsAndCrafts",
        value: 0
    },
    {
        name: "athletics",
        value: 0
    },
    {
        name: "brawl",
        value: 0
    },
    {
        name: "driving",
        value: 0
    },
    {
        name: "stealth",
        value: 0
    },
    {
        name: "larceny",
        value: 0
    },
    {
        name: "melee",
        value: 0
    },
    {
        name: "survival",
        value: 0
    },
    {
        name: "animals",
        value: 0
    },
    {
        name: "commandment",
        value: 0
    },
    {
        name: "empathy",
        value: 0
    },
    {
        name: "etiquette",
        value: 0
    },
    {
        name: "streetExperience",
        value: 0
    },
    {
        name: "intimidation",
        value: 0
    },
    {
        name: "performance",
        value: 0
    },
    {
        name: "persuasion",
        value: 0
    },
    {
        name: "subterfuge",
        value: 0
    },
    {
        name: "erudition",
        value: 0
    },
    {
        name: "finance",
        value: 0
    },
    {
        name: "investigation",
        value: 0
    },
    {
        name: "medicine",
        value: 0
    },
    {
        name: "occultism",
        value: 0
    },
    {
        name: "politics",
        value: 0
    },
    {
        name: "science",
        value: 0
    },
    {
        name: "technology",
        value: 0
    },
    {
        name: "vigilance",
        value: 0
    },
];
const disciplinesArray = [{
        name: "animalisme",
        description: "Animalisme",
        value: 0
    },
    {
        name: "auspex",
        description: "Auspex",
        value: 0
    }, 
    {
        name: "celerity",
        description: "Célérité",
        value: 0
    }, 
    {
        name: "domination",
        description: "Domination",
        value: 0
    }, 
    {
        name: "endurance",
        description: "Force d’âme",
        value: 0
    }, 
    {
        name: "occultation",
        description: "Occultation",
        value: 0
    }, 
    {
        name: "presence",
        description: "Présence",
        value: 0
    }, 
    {
        name: "protean",
        description: "Protéisme",
        value: 0
    }, 
    {
        name: "potence",
        description: "Puissance",
        value: 0
    }, 
    {
        name: "thaumaturgy",
        description: "Sorcellerie du sang",
        value: 0
    }, 
    {
        name: "alchimie",
        description: "Alchimie du sang clair",
        value: 0
    },
];
const avantagesArray = [{
    name: "avantage1",
    description: "",
    value: 0
},{
    name: "avantage2",
    description: "",
    value: 0
},{
    name: "avantage3",
    description: "",
    value: 0
},{
    name: "avantage4",
    description: "",
    value: 0
},{
    name: "avantage5",
    description: "",
    value: 0
},{
    name: "avantage6",
    description: "",
    value: 0
}
];
const flawsArray = [{
    name: "flaw1",
    description: "",
    value: 0
},{
    name: "flaw2",
    description: "",
    value: 0
},{
    name: "flaw3",
    description: "",
    value: 0
},{
    name: "flaw4",
    description: "",
    value: 0
},{
    name: "flaw5",
    description: "",
    value: 0
},{
    name: "flaw6",
    description: "",
    value: 0
}
];
const abilitysRulesArray = [{
    value : 4,
    use: false
},{
    value : 3,
    use: false
},{
    value : 3,
    use: false
},{
    value : 3,
    use: false
},{
    value : 2,
    use: false
},{
    value : 2,
    use: false
},{
    value : 2,
    use: false
},{
    value : 2,
    use: false
},{
    value : 1,
    use: false 
}
];
const jackOfAllTradesSkillsArray =[{
    value : 3,
    use: false 
},{
    value : 2,
    use: false 
},{
    value : 2,
    use: false 
},{
    value : 2,
    use: false 
},{
    value : 2,
    use: false 
},{
    value : 2,
    use: false 
},{
    value : 2,
    use: false 
},{
    value : 2,
    use: false 
},{
    value : 2,
    use: false 
},{
    value : 1,
    use: false 
},{
    value : 1,
    use: false 
},{
    value : 1,
    use: false 
},{
    value : 1,
    use: false 
},{
    value : 1,
    use: false 
},{
    value : 1,
    use: false 
},{
    value : 1,
    use: false 
},{
    value : 1,
    use: false 
},{
    value : 1,
    use: false 
},{
    value : 1,
    use: false 
}];
const balancedSkillsArray =[{
    value : 3,
    use: false 
},{
    value : 3,
    use: false 
},{
    value : 3,
    use: false 
},{
    value : 2,
    use: false 
},{
    value : 2,
    use: false 
},{
    value : 2,
    use: false 
},{
    value : 2,
    use: false 
},{
    value : 2,
    use: false 
},{
    value : 1,
    use: false 
},{
    value : 1,
    use: false 
},{
    value : 1,
    use: false 
},{
    value : 1,
    use: false 
},{
    value : 1,
    use: false 
},{
    value : 1,
    use: false 
},{
    value : 1,
    use: false 
}];
const specialistskillsArray =[{
    value : 4,
    use: false 
},{
    value : 3,
    use: false 
},{
    value : 3,
    use: false 
},{
    value : 3,
    use: false 
},{
    value : 2,
    use: false 
},{
    value : 2,
    use: false 
},{
    value : 1,
    use: false 
},{
    value : 1,
    use: false 
},{
    value : 1,
    use: false 
}];