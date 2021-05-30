// jshint esnext: true
const {ipcRenderer, ipcMain} = require('electron');

let clanArray = null;
function generateVampires(vampires){

    $('[id^=vm5-]').remove(); 
    vampires.forEach(vampire => {
        const card = $('<div id="vm5-' + 
                     vampire.id  + '" class="card myVampire">' +
                     '<div class="card-body"><h5 class="card-title">' + 
                     vampire.name + '</h5><p class="card-text">' + 
                     vampire.clan + '</p></div></div>');
        $("#vampires-list").append(card);
        $('.myVampire').on('click', (evt) => {
            ipcRenderer.send('open-update-vampire-window', {vampire: vampire});
        });
    });
}

const openAddVampire = (evt) =>{
    ipcRenderer.send('open-new-vampire-window');
};

$('#new-vampire').on('click', openAddVampire);



ipcRenderer.on('store-data', (evt, data) => {
    generateVampires(data.vampires);
    clanArray = data.clanArray;
});
ipcRenderer.on('update-with-new-vampire', (evt, data) => {
    generateVampires(data.vampires);
});

