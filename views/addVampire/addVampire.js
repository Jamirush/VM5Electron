// jshint esnext: true
const {
    ipcRenderer
} = require('electron');

const dotNumber = 7;
const maxDot = 5;
let abilitys = null;
let skills = null;

$('#addItem').on('submit', (evt) => {
    evt.preventDefault();

    const newITem = $('#addItem').serializeArray().reduce((obj, item) => {
        obj[item.name] = item.value;
        return obj;
    }, {});
    ipcRenderer.send('add-new-vampire', newITem);
});

ipcRenderer.on('clans-with-addVampire', (evt, data) => {
    abilitys = data.abilitys;
    skills = data.skills;
    data.clans.forEach(clan => {
        const option = $('<option value="' + clan.name + '">' + clan.name + '</option>');
        $('#clan').append(option);
    });

    data.abilitys.forEach(ability => {
        let i = 1;
        while (i <= dotNumber) {
            const check = i <= ability.value ? 'dot-check' : '';
            const specialDot = i > maxDot ? 'specialDot' : '';
            const option = $('<span id=' + ability.name + '_' + i + ' class="m5-circle m5-circle-ability ' + check + ' ' + specialDot + '"></span>');
            $('#' + ability.name).append(option);
            i++;
        }
    });    

    data.skills.forEach(skill => {
        let i = 1;
        while (i <= dotNumber) {
            const check = i <= skill.value ? 'dot-check' : '';
            const specialDot = i > maxDot ? 'specialDot' : '';
            const option = $('<span id=' + skill.name + '_' + i + ' class="m5-circle m5-circle-skill ' + check + ' ' + specialDot + '"></span>');
            $('#' + skill.name).append(option);
            i++;
        }
    });

    $('.m5-circle-ability').on('click', (evt) => {
        const words = evt.target.id.split('_');
        setDotValue(words[0], words[1], abilitys, maxDot);
    });

    $('.m5-circle-skill').on('click', (evt) => {
        const words = evt.target.id.split('_');
        setDotValue(words[0], words[1], skills, maxDot, 0);
    });
});

function setDotValue(name, value, array, max, min = 1) {
    console.log(name);
    console.log(value);
    console.log(max);
    for (let i = 0; i < array.length; i++) {
        if (array[i].name === name) {
            const startValue = array[i].value;
            array[i].value = array[i].value >= value ?
            array[i].value === min ? min : array[i].value - 1 :
            array[i].value === max ? max : array[i].value + 1;
            renderDot(startValue, array[i].name, array[i].value);
            if (array[i].name === 'vigor') {
                renderHealDot(startValue, array[i].value);
            }
            if (array[i].name === 'selfControl' || array[i].name === 'resoluteness') {
                renderWillpowerDot(startValue, array[i].value);
            }
            break;
        }
    }
}

function renderDot(lastDotCheckValue, name, value) {
    const valueChange = lastDotCheckValue !== value;
    if (valueChange && value < lastDotCheckValue) {
        const selectorValue = value + 1;
        $('#' + name + '_' + selectorValue).removeClass('dot-check');
    } else if (valueChange && value > lastDotCheckValue) {
        $('#' + name + '_' + value).addClass('dot-check');
    }
}

function renderHealDot(lastDotCheckValue, value) {
    const valueChange = lastDotCheckValue != value;
    let selectorValue = value + 3;
    if (valueChange && value < lastDotCheckValue) {
        $('#heal_' + selectorValue).removeClass('dot-obtain');
    } else if (valueChange && value > lastDotCheckValue) {
        selectorValue = value + 2;
        $('#heal_' + selectorValue).addClass('dot-obtain');
    }
}

function renderWillpowerDot(lastDotCheckValue, value) {
    const valueChange = lastDotCheckValue !== value;
    const totalValue = getAbilityValue('selfControl') + getAbilityValue('resoluteness');
    if (valueChange && value < lastDotCheckValue) {
        const selectorValue = totalValue + 1;
        $('#willpower_' + selectorValue).removeClass('dot-obtain');
    } else {
        $('#willpower_' + totalValue).addClass('dot-obtain');
    }
}

function getAbilityValue(name) {
    for (let i = 0; i < abilitys.length; i++) {
        if (abilitys[i].name === name) {
            return abilitys[i].value;
        }
    }
    return 0;
}

// function retreveValue(name){
//     let i = 0;
//     const array = $('[id^=' + name + '_]');
//     array.each( ability => {

//         if(ability.is('.dot-check')){
//             i++;
//         }
//     });
//     return i;
// }
