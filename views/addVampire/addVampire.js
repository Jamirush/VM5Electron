// jshint esnext: true
const { ipcRenderer} = require('electron');
$('#addItem').on('submit', (evt) => {
    evt.preventDefault(); 

    const newITem = $('#addItem').serializeArray().reduce((obj, item) => {
        obj[item.name] = item.value;
        return obj;
    }, {});
    ipcRenderer.send('add-new-vampire', newITem);
});


ipcRenderer.on('clans-with-addVampire', (evt, data) => {
    data.clans.forEach(clan => {
        const option = $('<option value="' + clan.name + '">' + clan.name + '</option>');
        $('#clan').append(option);
    });
});


