// jshint esnext: true
const {
    ipcRenderer
} = require('electron');

const dotNumber = 5; //Can show more dot
const maxDot = 5;
let clans = null;
let abilitys = null;
let skills = null;
let disciplines = null;
let avantages = null;
let flaws = null;

let abilitysRules = null;
let abilitysRulesRespected = false;

let jackOfAllTradesSkills = null;
let balancedSkills = null;
let specialistskills = null;
let skillsRulesRespected = false;
let skillsTypeSelected = 'jackOfAllTradesSkills';





$('#addItem').on('submit', (evt) => {
    evt.preventDefault();

    const newITem = $('#addItem').serializeArray().reduce((obj, item) => {
        obj[item.name] = item.value;
        return obj;
    }, {});
    ipcRenderer.send('add-new-vampire', newITem);
});

ipcRenderer.on('clans-with-addVampire', (evt, data) => {
    clans = data.clans;
    abilitys = data.abilitys;
    skills = data.skills;
    disciplines = data.disciplines;
    avantages = data.avantages;
    flaws = data.flaws;
    abilitysRules = data.abilitysRules;
    jackOfAllTradesSkills = data.jackOfAllTradesSkills;
    balancedSkills = data.balancedSkills;
    specialistskills = data.specialistskills;

    

    data.clans.forEach(clan => {
        const option = $('<option value="' + clan.name + '">' + clan.description + '</option>');
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

    data.disciplines.forEach(discipline => {

        const disciplineToCreate = $('<div id="m5-d_' +  discipline.name + '" class="form-group">');
        disciplineToCreate.append('<label>' + discipline.description + '</label>' );
        disciplineToCreate.append('<div id="' + discipline.name + '" class="form-group float-end"></div></div>');
        
        $('#disciplines').append(disciplineToCreate);

        let i = 1;
        while (i <= dotNumber) {
            const check = i <= discipline.value ? 'dot-check' : '';
            const specialDot = i > maxDot ? 'specialDot' : '';
            const option = $('<span id=' + discipline.name + '_' + i + ' class="m5-circle m5-circle-discipline' + check + ' ' + specialDot + '"></span>');
            
            $('#'+ discipline.name).append(option);
            i++;
        }
    });


    let index = 1;
    data.avantages.forEach(avantage => {

        const avantageToCreate = $( '<div class="form-group">' +
            '<input type="text" class="form-control" id="avantageDescription' + index + '" placeholder="Avantage" value="' + avantage.description + '">' +
            '<div id="' + avantage.name + '" class="form-group float-end"></div></div>'
        );
        
        $('#avantages').append(avantageToCreate);
        let i = 1;
        while (i <= dotNumber) {
            const check = i <= avantage.value ? 'dot-check' : '';
            const specialDot = i > maxDot ? 'specialDot' : '';
            const option = $('<span id=' + avantage.name + '_' + i + ' class="m5-circle m5-circle-avantage' + check + ' ' + specialDot + '"></span>');
            $('#' +avantage.name).append(option);
            i++;
        }
        index++;
    });

    index = 1;
    data.flaws.forEach(flaw => {
        const flawToCreate = $( '<div class="form-group">' +
            '<input type="text" class="form-control" id="flawDescription' + index + '" placeholder="Handicap" value="' + flaw.description + '">' +
            '<div id="' + flaw.name + '" class="form-group float-end"></div></div>'
            );
            $('#flaws').append(flawToCreate);
        let i = 1;
        while (i <= dotNumber) {
            const check = i <= flaw.value ? 'dot-check' : '';
            const specialDot = i > maxDot ? 'specialDot' : '';
            const option = $('<span id=' + flaw.name + '_' + i + ' class="m5-circle m5-circle-flaw' + check + ' ' + specialDot + '"></span>');
            $('#' + flaw.name).append(option);
            i++;
        }
        index++;
    });
    index = 1;
    data.abilitysRules.forEach(rule => {
        $('#abilitysRules').append($('<i id="abilitysRules_' + index + '" class="me-1">' + rule.value + '</i>'));
        index++;
    });
    
    renderSkillRules(data.jackOfAllTradesSkills, skillsTypeSelected);

    $('.m5-circle-ability').on('click', (evt) => {
        const words = evt.target.id.split('_');
        setDotValue('ability', words[0], words[1], abilitys, maxDot, 1);
    });

    $('.m5-circle-skill').on('click', (evt) => {
        const words = evt.target.id.split('_');
        setDotValue('skill', words[0], words[1], skills, maxDot);
    });

    $('.m5-circle-avantage').on('click', (evt) => {
        const words = evt.target.id.split('_');
        setDotValue(avantage, words[0], words[1], avantages, maxDot);
    });

    $('.m5-circle-discipline').on('click', (evt) => {
        const words = evt.target.id.split('_');
        setDotValue('discipline', words[0], words[1], disciplines, maxDot);
    });

    $('.m5-circle-flaw').on('click', (evt) => {
        const words = evt.target.id.split('_');
        setDotValue('flaw', words[0], words[1], flaws, maxDot);
    });

    $('#clan').on('change', (evt) => {      
        setDisciplinesByClan($('#clan').val());
    });
});


$('input[name=skillTypeChoice]').on('click', (evt) => {
    const type = $('input[name=skillTypeChoice]:checked').val();
    skillsTypeSelected = type;

    switch (type) {
        case 'jackOfAllTradesSkills':
            renderSkillRules(jackOfAllTradesSkills, type);
            break;
        case 'balancedSkills':
            renderSkillRules(balancedSkills, type);
            break;
        case 'specialistskills':
            renderSkillRules(specialistskills, type);
            break;
        default:
            break;
    }
});

function renderSkillRules(rulesArray, type) {
    let index = 1;
    $('#skillRules').text("");
    rulesArray.forEach(rule => {
        $('#skillRules').append($('<i id="skillRules_' + index + '" class="me-1">' + rule.value + '</i>'));
        index++;
    });    
    rulesIsRespected('skill', jackOfAllTradesSkills);
}

function selectSkillsArrayByType(type){
    if(type === 'jackOfAllTradesSkills'){
        return  resetArrayValues(jackOfAllTradesSkills);
    } else if (type === 'balancedSkills'){
        return resetArrayValues(balancedSkills);
    } else {
        return resetArrayValues(specialistskills);
    }
}

function setDotValue(type, name, value, array, max, min = 0) {
    for (let i = 0; i < array.length; i++) {
        if (array[i].name === name) {
            const startValue = array[i].value;
            array[i].value = array[i].value >= value ?
            array[i].value === min ? min : array[i].value - 1 :
            array[i].value === max ? max : array[i].value + 1;
            renderDot(startValue, array[i].name, array[i].value);
            if(array[i].value !== value){
                rulesIsRespected(type, array);
            }
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
    let selectorValue = value + 4;
    if (valueChange && value < lastDotCheckValue) {
        $('#heal_' + selectorValue).removeClass('dot-obtain');
    } else if (valueChange && value > lastDotCheckValue) {
        selectorValue = value + 3;
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

function resetArrayValues(array){
    array.forEach(element => {
        element.value = false;
    });
    return array;
}

function rulesIsRespected(type, array){
    console.log(array);
    let rules = null;
    let allRulesIsTrue = true;
    let id = '';
    switch (type) {
        case 'ability':
            rules = resetArrayValues(abilitysRules);
            id = 'abilitysRules';
            break;
        case 'skill':
            rules= selectSkillsArrayByType(skillsTypeSelected);
            console.log('a');
            console.log(rules);
            id = 'skillRules';
            break;
        default:
            return;
    }
    console.log(rules);
    
    $("[id^='"+ id +"_']").removeClass('badge bg-secondary');
    array.forEach(item => {
        let ruleSet = false;
        for (let i = 0; i < rules.length; i++) {
            const atIndex = i+1;
            if( ruleSet === false && rules[i].value === item.value && rules[i].use === false){
                rules[i].use = true;
                ruleSet = true;
            }
            if(rules[i].use === false){
                allRulesIsTrue = false;
            } else {
                $("#" + id + " i:nth-child(" + atIndex + ")" ).addClass('badge bg-secondary');
            } 
        }
    });
    console.log(rules);    

    if(allRulesIsTrue === true){
        abilitysRulesRespected = true;
    }else{
        abilitysRulesRespected = false;
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

function setDisciplinesByClan(clan){

    let clanDiciplines = null;
    for (let i = 0; i < clans.length; i++) {
        if (clans[i].name === clan) {
            clanDiciplines = clans[i].disciplines;
            console.log(clanDiciplines);
            break;
        }
    }

    disciplines.forEach(discipline => {
        if(clanDiciplines.indexOf(discipline.name) === -1){
            $("#m5-d_" + discipline.name).hide();
        }else{
            $("#m5-d_" + discipline.name).show();
        }    
    });
}

