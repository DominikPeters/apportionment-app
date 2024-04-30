import { compute } from './apportionment.js';
import { ApportionmentInstance } from './apportionmentInstance.js';
import { methodDescriptions, trashIcon, color, lighterColors, darkerColors, census2020 } from './data.js';
import { parseClipboardText } from './parseClipboard.js'

function range(n) {
    return [...new Array(n).keys()];
}

function sum(xs) {
    return xs.reduce((a, b) => a + b, 0);
}

let instance = new ApportionmentInstance(
    5,
    [0, 1, 2, 3, 4],
    () => { }
);
window.instance = instance; // for debugging

const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

let bigHouseSizeAllowed = false;

function instanceUpdated(lightRefresh = false) {
    document.getElementById("house-size-input").value = instance.seats;
    document.getElementById("house-size-range").value = instance.seats;
    buildPartyInputs(lightRefresh);
    calculateMechanisms();
    buildMechanismDisplays();
}

function buildPartyInputs(lightRefresh) {
    let partyInputs = document.getElementById("party-inputs");
    if (lightRefresh) {
        for (let party of Object.values(instance.parties)) {
            let tooltip = document.getElementById(`party-tooltip-${party.index}`);
            tooltip.innerHTML = `Lower quota: ${lowerQuota(party.index)}<br>Upper quota: ${upperQuota(party.index)}`;
        }
        return;
    }
    partyInputs.innerHTML = "";
    for (let party of Object.values(instance.parties)) {
        let input = document.createElement("div");
        input.className = "input-size";
        let label = document.createElement("label");
        label.style.backgroundColor = party.color;
        label.style.color = "white";
        label.id = `party-label-${party.index}`;
        label.innerHTML = `<span class="party-name">${party.name}</span>${trashIcon}`;
        label.onclick = () => removeParty(party.index);
        input.appendChild(label);
        let inputField = document.createElement("input");
        inputField.type = "number";
        inputField.value = party.votes;
        inputField.min = "1";
        inputField.onchange = () => {
            party.votes = parseInt(inputField.value);
            instanceUpdated(true);
        };
        input.appendChild(inputField);
        let tooltip = document.createElement("div");
        tooltip.id = `party-tooltip-${party.index}`;
        tooltip.className = "tooltip";
        tooltip.innerHTML = `Lower quota: ${lowerQuota(party.index)}<br>Upper quota: ${upperQuota(party.index)}`;
        input.appendChild(tooltip);
        partyInputs.appendChild(input);
    }
    let addPartyButton = document.createElement("div");
    addPartyButton.id = "add-party-button";
    addPartyButton.innerHTML = "＋";
    addPartyButton.onclick = addParty;
    partyInputs.appendChild(addPartyButton);
}

function buildMechanismDisplays() {
    let tabular = document.getElementById("tabular");
    tabular.innerHTML = "";
    for (let method of methods) {
        let methodBar = document.createElement("div");
        methodBar.className = "method-bar";
        methodBar.id = `method-${method.id}`;
        methodBar.dataset.hystmodal = "#explanation-modal";
        methodBar.onclick = () => {
            instance.compute(method.id, true);
        };
        let columnHeader = document.createElement("div");
        columnHeader.className = "column-header";
        columnHeader.innerHTML = method.name;
        methodBar.appendChild(columnHeader);
        let slices = document.createElement("div");
        slices.className = "slices";
        Object.assign(slices.style, sliceContainerStyle);
        for (let party of Object.values(instance.parties)) {
            let slice = document.createElement("div");
            slice.className = "slice";
            Object.assign(slice.style, party.slicestyle[method.id]);
            if (party.seats[method.id] > 0) {
                let span = document.createElement("span");
                span.innerHTML = party.seats[method.id];
                if (party.seats[method.id] == 1) {
                    span.className = "few-seats";
                }
                slice.appendChild(span);
            }
            slices.appendChild(slice);
        }
        methodBar.appendChild(slices);
        tabular.appendChild(methodBar);
    }
}

var lastIndex = 0;
function newParty(i, votes = 0) {
    // var usedColors = Object.values(instance.parties).map((p) => p.color);
    // var partyColor = color.find((c) => !usedColors.includes(c));
    const partyColor = color[lastIndex];
    lastIndex += 1;
    return {
        index: i,
        name: letters[lastIndex - 1],
        votes: votes,
        color: partyColor,
        style: { backgroundColor: partyColor },
        seats: {},
        slicestyle: {},
    }
}

function setUp() {
    var defaultVotes = [9061, 7179, 5259, 3319, 1182];
    instance.seats = 26;
    instance.parties = {};
    for (var i = 0; i < defaultVotes.length; i++) {
        var party = newParty(i, defaultVotes[i]);
        instance.parties[i] = party;
    }
    instance.onUpdate = instanceUpdated;
    // initialize to uniform
    for (let method of methods) {
        for (let party of Object.values(instance.parties)) {
            party["seats"][method.id] = 1;
            party["slicestyle"][method.id] = {
                "height": 100 * parseInt(party["seats"][method.id]) + "%",
                "backgroundColor": party["color"],
            };
        }
    }
    instanceUpdated();
}

let methods = [
    { id: "hamilton", name: "Hamilton" },
    { id: "quota", name: "Quota" },
    { id: "dhondt", name: "D'Hondt" },
    { id: "saintelague", name: "S. Laguë" },
    { id: "huntington", name: "H.-Hill" },
    { id: "dean", name: "Dean" },
    { id: "adams", name: "Adams" },
];

function addParty() {
    let index = instance.nextAvailableIndex();
    instance.parties[index] = newParty(index);
    instanceUpdated();
    // todo: if needed add a new color
};

function removeParty(index) {
    if (Object.keys(instance.parties).length === 1) {
        return;
    }
    delete instance.parties[index];
    instanceUpdated();
};

function lowerQuota(index) {
    var quota = instance.seats * instance.parties[index].votes / sum(instance.votes);
    return Math.floor(quota);
}

function upperQuota(index) {
    var quota = instance.seats * instance.parties[index].votes / sum(instance.votes);
    return Math.ceil(quota);
}

document.getElementById("random-button").onclick = function () {
    let numParties = Object.values(instance.parties).length;
    // make a list of random numbers then sort it
    let votes = [];
    for (let i = 0; i < numParties; i++) {
        votes.push(Math.floor(Math.random() * 1000));
    }
    votes.sort((a, b) => b - a);
    // assign the votes to the parties
    var index = 0;
    for (let party of Object.values(instance.parties)) {
        party.votes = votes[index];
        index += 1;
    }
    instanceUpdated();
};

function updateSeats() {
    instance.seats = this.value;
}
document.getElementById("house-size-range").oninput = updateSeats;
document.getElementById("house-size-input").onblur = updateSeats;
document.getElementById("house-size-input").addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        updateSeats.call(this);
    }
});


let sliceContainerStyle = {
    "maxHeight": "100%",
};
function calculateMechanisms() {
    sliceContainerStyle = {
        "height": instance.seats + "em",
        "maxHeight": "calc(100vh - var(--content-padding-top) - 3em)",
    };
    if (Object.keys(instance.parties).length > 10) {
        sliceContainerStyle["height"] = 0.4 * instance.seats + "em",
            sliceContainerStyle["maxHeight"] = "none";
    }
    for (let method of methods) {
        instance.compute(method.id);
        for (let party of Object.values(instance.parties)) {
            // build css gradient
            var seat_percent = 100 / party.seats[method.id];
            var lighter = lighterColors[party.color];
            var darker = darkerColors[party.color];
            var gradient = `linear-gradient(to bottom, 
                rgba(0,0,0,0), 
                rgba(0,0,0,0) calc(100% - 1px), 
                ${darker} calc(100% - 1px), 
                ${darker} calc(100%)),
            repeating-linear-gradient(to bottom, 
                ${party["color"]}, 
                ${party["color"]} calc(${seat_percent}% - 1px),
                ${lighter} calc(${seat_percent}% - 1px),
                ${lighter} calc(${seat_percent}%))`;
            party["slicestyle"][method.id] = {
                "height": `${100 * party.seats[method.id] / instance.seats}%`,
                "background": gradient,
            };
        }
    }
};

function handlePasteEvent(event) {
    const activeElement = document.activeElement;
    if (activeElement && activeElement.tagName.toLowerCase() === 'input') {
        // Do not handle paste event if an input or textarea is in focus
        return;
    }

    event.preventDefault();
    const clipboardText = event.clipboardData.getData('text');
    const { names, integers } = parseClipboardText(clipboardText);
    if (integers.length === 0) {
        return;
    }
    const namesFound = names.length > 0;
    let newParties = {};
    lastIndex = 0; // restart lettering and coloring
    for (var i = 0; i < integers.length; i++) {
        var party = newParty(i, integers[i]);
        if (namesFound) {
            party.name = names[i];
        }
        newParties[i] = party;
    }
    instance.parties = newParties;
    instanceUpdated();
    console.log('Parsed names:', names);
    console.log('Parsed integers:', integers);
}
document.addEventListener('paste', handlePasteEvent);

setUp();

const modals = new HystModal({
    linkAttributeName: "data-hystmodal",
});