/***********************************
 * Code in part derived from https://github.com/martinlackner/apportionment
 * 
 * provided under the MIT License
 * Copyright (c) 2019 Martin Lackner
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 * 
 * This code is a modified version, Copyright (c) 2024 Dominik Peters
 * provided under the MIT License as above.
 ***********************************/


const METHODS = ["quota", "largest_remainder", "dhondt", "saintelague",
    "modified_saintelague", "huntington", "adams", "dean"];

const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

const modal = document.getElementById("explanation-modal-content");

export function compute(method, parties, seats, buildExplanation=false) {
    if (buildExplanation) {
        modal.innerHTML = "";
        modal.innerHTML = method;
        if (method == "quota") {
            modal.innerHTML = `<h2>Balinski and Young's Quota Method</h2>
            <p>This method is a variation of the D'Hondt/Jefferson method that is house monotone and that satisfies lower and upper quota.</p>
            <p>For this method, this webpage cannot yet display full details of the computation. 
            However, the following table contains a row for each party, containing its vote count divided by 1, 2, 3, and so on.
            The quota method works by repeatedly taking the largest number in this table and given the party it corresponds to a seat.
            However, the method never gives a party more seats than its upper quota; if the party has already reached its upper quota,
            the method instead looks for the next-largest number in the table, until it finds one belonging to a party that has not yet
            reached its upper quota.
            </p>
            <p>In the table, each green cell corresponds to a seat handed out according to the procedure described above.</p>`;
        } else if (method == "hamilton") {
            modal.innerHTML = `<h2>Hamilton's Method / Largest Remainder Method / Hare-Niemeyer Method</h2>
            <p>This method works by computing the exact <i>quota</i> of each party (the fractional number of seats it is entitled to).
            It then rounds this down to the <i>lower quota</i> and gives each party that many seats.
            Any remaining seats are given to the parties with the largest remainders (i.e. fractional part, or quota minus lower quota). 
            [<a href="https://en.wikipedia.org/wiki/Largest_remainder_method">Wikipedia]</p>`;
        } else if (method == "dhondt") {
            modal.innerHTML = `<h2>D'Hondt Method / Jefferson's Method / Greatest Divisors Method</h2>
            <p>This is a divisor method that satsified the lower quota requirement, but has a bias in favor of large parties. 
            It is used in a large number of countries. 
            [<a href="https://en.wikipedia.org/wiki/D%27Hondt_method">Wikipedia]</p>`;
        } else if (method == "saintelague") {
            modal.innerHTML = `<h2>Sainte-Laguë's Method / Webster's Method / Major Fractions Method</h2>
            <p>This is a divisor method that is not biased towards large or small parties. 
            It is used in several countries, including Germany and New Zealand. 
            [<a href="https://en.wikipedia.org/wiki/Sainte-Lagu%C3%AB_method">Wikipedia]</p>`;
        } else if (method == "huntington") {
            modal.innerHTML = `<h2>Huntington-Hill Method</h2>
            <p>This method is a divisor method used in the United States to apportion seats in the House of Representatives to states. 
            It is slightly biased in favor of smaller parties. It uses geometric means of consecutive divisors to allocate seats. 
            By its choice of divisors, it guarantees that every party receives at least 1 seat. 
            [<a href="https://en.wikipedia.org/wiki/Huntington%E2%80%93Hill_method">Wikipedia]</p>`;
        } else if (method == "dean") {
            modal.innerHTML = `<h2>Dean's Method</h2>
            <p>This is a divisor method that uses harmonic means of consecutive divisors to allocate seats. 
            By its choice of divisors, it guarantees that every party receives at least 1 seat.</p>`;
        } else if (method == "adams") {
            modal.innerHTML = `<h2>Adams' Method</h2>
            <p>This is a divisor method that is very favorable to smaller parties. 
            By its choice of divisors, it guarantees that every party receives at least 1 seat.</p>`;
        }

    }
    if (method == "quota") {
        return quota(parties, seats, buildExplanation);
    } else if (["lrm", "hamilton", "largest_remainder"].includes(method)) {
        return largest_remainder(parties, seats, buildExplanation)
    } else if (["dhondt", "jefferson", "saintelague", "webster",
                    "modified_saintelague",
                    "huntington", "hill", "adams", "dean",
                    "smallestdivisor", "harmonicmean", "equalproportions",
                    "majorfractions", "greatestdivisors"].includes(method)) {
        return divisor(parties, seats, method, buildExplanation);
    } else {
        throw "apportionment method " + method + " not known";
    }
}

function sum(xs) {
    const r = (x, y) => x + y;
    return xs.reduce(r, 0);
}

// Largest remainder method (Hamilton method)
function largest_remainder(parties, seats, buildExplanation) {
    const votes = Object.values(parties).map(party => party.votes)
    const q = sum(votes) / seats;
    const quotas = votes.map(p => p * seats / sum(votes));
    var lower_quotas = votes.map(p => Math.floor(p/q)); // initialize lower quotas
    var representatives = votes.map(p => Math.floor(p/q)); // initialize lower quotas

    var ties = false;
    const remainders = [...votes.keys()].map(i => quotas[i] - representatives[i]);
    var atCutoff = [];
    var numAtCutoffReceivingSeat = 0;
    if (sum(representatives) < seats) {
        const cutoff = [...remainders].sort((a, b) => b - a)[seats-sum(representatives)-1];
        for (var i of votes.keys()) {
            if (sum(representatives) == seats && remainders[i] >= cutoff) {
                ties = true;
                atCutoff.push(i);
            } else if (sum(representatives) < seats && remainders[i] > cutoff) {
                representatives[i] += 1;
            } else if (sum(representatives) < seats && remainders[i] == cutoff) {
                representatives[i] += 1
                numAtCutoffReceivingSeat += 1;
                atCutoff.push(i);
            }
        }
    }
    if (buildExplanation) {
        let table = document.createElement("table");
        table.innerHTML = "<thead><tr><th></th><th></th><th>Quota</th><th>Lower quota</th><th>Remainder</th><th>Seats</th></tr></thead>";
        let tbody = document.createElement("tbody");
        let index = 0;
        for (var party of Object.values(parties)) {
            let style = "";
            if (representatives[index] > lower_quotas[index]) {
                style = ' style="font-weight:bold"';
            } else if (atCutoff.includes(index)) {
                style = ' style="font-style:italic"';
            }
            let tr = document.createElement("tr");
            tr.innerHTML = `
                <td><span class="party-name" style="background-color: ${party.color}">${party.name}</span></td>
                <td>${party.votes}</td>
                <td>${quotas[index].toFixed(2)}</td>
                <td>${lower_quotas[index]}</td>
                <td${style}>${remainders[index].toFixed(2)}</td>
                <td>${representatives[index]}</td>
            `;
            tbody.appendChild(tr);
            index++;
        }
        table.appendChild(tbody);
        modal.appendChild(table);
        if (ties) {
            let p = document.createElement("p");
            p.innerHTML = `There were ties. The possible Hamilton apportionments can be obtained by giving out seats as in the table above, except for the following parties: ${atCutoff.map(i => Object.values(parties)[i].name).join(", ")}. From these parties, exactly ${numAtCutoffReceivingSeat} parties (arbitrarily selected) receive one seat more than their lower quota, and the remaining ${atCutoff.length - numAtCutoffReceivingSeat} receive their lower quota.`;
            modal.appendChild(p);
        }
    }
    return {
        "representatives": representatives,
        "ties": ties
    };
}

// Divisor methods
function divisor(parties, seats, method, buildExplanation) {
    const votes = Object.values(parties).map(party => party.votes)
    const seatsRange = [...Array(seats).keys()];
    var representatives = votes.map(p => 0);
    var fewerseatsthanparties = false;
    var divisors;
    if (["dhondt", "jefferson", "greatestdivisors"].includes(method)) {
        divisors = seatsRange.map(i => i+1);
    } else if (["saintelague", "webster", "majorfractions"].includes(method)) {
        divisors = seatsRange.map(i => 2*i+1);
    } else if (["modified_saintelague"].includes(method)) {
        divisors = seatsRange.map(i => i == 0 ? 1.4 : 2*i+1);
    } else if (["huntington", "hill", "equalproportions"].includes(method)) {
        if (seats < votes.length) {
            representatives = __divzero_fewerseatsthanparties(votes, seats, parties).representatives;
            fewerseatsthanparties = true;
        } else {
            representatives = votes.map(p => p > 0 ? 1 : 0);
            divisors = seatsRange.map(i => Math.sqrt((i+1)*(i+2)));
        }
    } else if (["adams", "smallestdivisor"].includes(method)) {
        if (seats < votes.length) {
            representatives = __divzero_fewerseatsthanparties(votes, seats, parties).representatives;
            fewerseatsthanparties = true;
        } else {
            representatives = votes.map(p => p > 0 ? 1 : 0);
            divisors = seatsRange.map(i => i+1);
        }
    } else if (["dean", "harmonicmean"].includes(method)) {
        if (seats < votes.length) {
            representatives = __divzero_fewerseatsthanparties(votes, seats, parties).representatives;
            fewerseatsthanparties = true;
        } else {
            representatives = votes.map(p => p > 0 ? 1 : 0);
            divisors = seatsRange.map(i => 2 * (i+1) * (i+2) / (2 * (i+1) + 1));
        }
    } else {
        throw "divisor method " + method + " not known";
    }

    // assigning representatives
    if (seats > sum(representatives)) {
        var weights = [];
        var flatweights = [];
        for (var p of votes) {
            weights.push(divisors.map(d => p/d));
            for (var d of divisors) {
                flatweights.push(p/d);
            }
        }
        flatweights.sort((a, b) => b - a); // descending order
        var minweight = flatweights[seats - sum(representatives) - 1];
        var lowerBoundDivisor = minweight;
        if (seats > sum(representatives) + 1) {
            lowerBoundDivisor = flatweights[seats - sum(representatives)];
        }

        for (var i of votes.keys()) {
            for (var w of weights[i]) {
                if (w > minweight) {
                    representatives[i] += 1;
                }
            }
        }
    }

    var ties = false;
    var atCutoff = [];
    var atCutoffReceivingSeats = [];
    var numAtCutoffReceivingSeat = 0;
    if (seats > sum(representatives)) {
        for (var i of votes.keys()) {
            if (sum(representatives) == seats && weights[i].includes(minweight)) {
                ties = true;
                atCutoff.push(i);
            }
            if (sum(representatives) < seats && weights[i].includes(minweight)) {
                representatives[i] += 1;
                numAtCutoffReceivingSeat += 1;
                atCutoffReceivingSeats.push(i);
                atCutoff.push(i);
            }
        }
    }

    if (buildExplanation && fewerseatsthanparties) {
        let p = document.createElement("p");
        p.innerHTML = `In the special case where the number of available seats (${seats}) is smaller than the number of parties (${votes.length}), then this divisor method gives 1 seat to the ${seats} parties with the highest votes, and 0 seats to the other parties.`;
        modal.appendChild(p);
    } else if (buildExplanation) {
        let divisor = minweight;
        if (method == "saintelague") {
            divisor = divisor*2;
            lowerBoundDivisor = lowerBoundDivisor*2;
        }
        // find an integer in the interval [lowerBoundDivisor, minweight] if exists, otherwise take minweight
        for (var d = 0; d < divisor; d++) {
            if (lowerBoundDivisor < d) {
                divisor = d;
                break;
            }
        }

        //////////////////////////
        ///// rounding table /////
        //////////////////////////
        let divisorForPresentation = divisor;
        if (divisor > Math.floor(divisor)) {
            divisorForPresentation = divisor.toFixed(2);
        }

        let p = document.createElement("p");
        p.innerHTML = `<b>Computation.</b> For each party, we take its votes and divide it by ${divisorForPresentation.toLocaleString()}. (This number was chosen for this input so that the final seat numbers sum up to the correct house size.) The resulting number is the <i>quotient</i>. `;
        if (method =="dhondt") {
            p.innerHTML += `The  quotient is then rounded down (i.e., we take the floor), to obtain the number of seats for the party.`;
        } else if (method == "saintelague") {
            p.innerHTML += `The  quotient is then rounded to the nearest integer (so we round up if the fractional part is more than 0.5, and we round down if it is less than 0.5), to obtain the number of seats for the party.`;
        } else if (method == "huntington") {
            p.innerHTML += `The  quotient is then rounded using "geometric rounding": suppose the quotient lies between the integers <i>n</i> and <i>n</i>+1. Then we take their geometric mean <i>x</i>&nbsp;=&nbsp;sqrt(<i>n</i>(<i>n</i>+1)), and round the quotient up if it is greater than <i>x</i>, and down if it is less than <i>x</i>.`;
        } else if (method == "dean") {
            p.innerHTML += `The  quotient is then rounded using "harmonic rounding": suppose the quotient lies between the integers <i>n</i> and <i>n</i>+1. Then we take their harmonic mean <i>x</i>&nbsp;=&nbsp;<i>n</i>(<i>n</i>+1)/(<i>n</i> + 0.5), and round the quotient up if it is greater than <i>x</i>, and down if it is less than <i>x</i>.`;
        } else if (method == "adams") {
            p.innerHTML += `The  quotient is then rounded up (i.e., we take the ceiling), to obtain the number of seats for the party.`;
        }
        modal.appendChild(p);

        let table = document.createElement("table");
        let thead = document.createElement("thead");
        let tr = document.createElement("tr");
        let th = document.createElement("th");
        th.innerHTML = "Party";
        tr.appendChild(th);
        th = document.createElement("th");
        th.innerHTML = "Votes";
        tr.appendChild(th);
        th = document.createElement("th");
        // th.innerHTML = `Divide by ${divisorForPresentation}`;
        th.innerHTML = "Quotient";
        tr.appendChild(th);
        th = document.createElement("th");
        th.innerHTML = "Rounded to";
        tr.appendChild(th);
        thead.appendChild(tr);
        table.appendChild(thead);
        let tbody = document.createElement("tbody");
        let index = 0;
        for (var party of Object.values(parties)) {
            tr = document.createElement("tr");
            let td = document.createElement("td");
            let span = document.createElement("span");
            span.innerHTML = party.name;
            span.style.backgroundColor = party.color;
            span.className = "party-name";
            td.appendChild(span);
            tr.appendChild(td);
            td = document.createElement("td");
            td.innerHTML = party.votes;
            td.style.textAlign = "right";
            tr.appendChild(td);
            td = document.createElement("td");
            td.innerHTML = (party.votes/divisor).toFixed(2);
            td.style.textAlign = "right";
            tr.appendChild(td);
            td = document.createElement("td");
            td.innerHTML = representatives[index];
            td.style.textAlign = "right";
            tr.appendChild(td);
            tbody.appendChild(tr);
            index++;
        }
        // Total row
        tr = document.createElement("tr");
        let td = document.createElement("td");
        td.innerHTML = "Total";
        td.colSpan = 3;
        tr.appendChild(td);
        td = document.createElement("td");
        td.innerHTML = sum(representatives);
        td.style.textAlign = "right";
        td.style.fontWeight = "bold";
        tr.appendChild(td);
        tbody.appendChild(tr);
        table.appendChild(tbody);
        modal.appendChild(table);

        //////////////////////////
        ////// table method //////
        //////////////////////////

        let divisorsForPresentation = [...divisors];
        if (method == "huntington" || method == "dean" || method == "adams") { // start with divisor 0
            divisorsForPresentation.unshift(0);
        }
        let maxRepresentatives = Math.max(...representatives);
        // only show first maxRepresentatives+1 divisors
        divisorsForPresentation = divisorsForPresentation.slice(0, maxRepresentatives+1);

        p = document.createElement("p");
        p.innerHTML = `<b>Alternative computation.</b> There is another method for computing the seat numbers. We make a big table, where each party occupies a row. In its row, we write the number of the party's votes divided by `;
        // show the first 5 divisors (with at most 2 decimal digits, or as an integer if it is integral) separated by commas
        if (method == "huntington" || method == "dean") {
            p.innerHTML += divisorsForPresentation.slice(0, 5).map(d => d.toFixed(2)).join(", ");
        } else {
            p.innerHTML += divisorsForPresentation.slice(0, 5).map(d => d).join(", ");
        }
        p.innerHTML += `, and so on. `
        if (method == "huntington") {
            p.innerHTML += `These numbers are specific to the Huntington-Hill method, and they are obtained as sqrt(t(t+1)). `;
        } else if (method == "dean") {
            p.innerHTML += `These numbers are specific to the Dean method, and they are obtained by the formula t(t+1)/(t+0.5). `;
        }
        p.innerHTML += `We then highlight in green the ${seats} largest numbers appearing in the table (because that is the target number of seats). Finally, for each party, we count the number of green cells in its row. It receives 1 seat for each green cell.`
        modal.appendChild(p);
        
        table = document.createElement("table");
        thead = document.createElement("thead");
        tr = document.createElement("tr");
        th = document.createElement("th");
        th.innerHTML = "Party";
        tr.appendChild(th);
        for (var d of divisorsForPresentation) {
            th = document.createElement("th");
            // show 2 decimals if divisor is not an integer
            if (d > Math.floor(d)) {
                th.innerHTML = d.toFixed(2);
            } else {
                th.innerHTML = d;
            }
            tr.appendChild(th);
        }
        thead.appendChild(tr);
        table.appendChild(thead);
        tbody = document.createElement("tbody");
        for (var j of Object.values(parties).keys()) {
            let tr = document.createElement("tr");
            let td = document.createElement("td");
            let span = document.createElement("span");
            console.log(parties[j]);
            span.innerHTML = parties[j].name;
            span.style.backgroundColor = parties[j].color;
            span.className = "party-name";
            td.appendChild(span);
            tr.appendChild(td);
            for (var i of divisorsForPresentation.keys()) {
                let td = document.createElement("td");
                let weight;
                if (method == "huntington" || method == "dean" || method == "adams") {
                    if (i == 0 && votes[j] == 0) {
                        weight = 0;
                    } else if (i == 0) {
                        weight = Infinity;
                    } else {
                        weight = weights[j][i - 1];
                    }
                } else {
                    weight = weights[j][i];
                }
                if (weight == Infinity) {
                    td.innerText = "∞";
                    td.style.textAlign = "center";
                } else {
                    td.innerText = weight.toFixed(2);
                    td.style.textAlign = "right";
                }
                if (representatives[j] >= i + 1) {
                    td.style.backgroundColor = "lightgreen";
                } else if (weight == minweight) {
                    td.style.backgroundColor = "yellow";
                }
                tr.appendChild(td);
            }
            tbody.appendChild(tr);
        }
        table.appendChild(tbody);
        let wrapper = document.createElement("div");
        wrapper.appendChild(table);
        wrapper.style.overflowX = "auto";
        wrapper.style.maxWidth = "100%";
        modal.appendChild(wrapper);

        //////////////////////////
        //////// tiebreak ////////
        //////////////////////////

        if (ties) {
            let p = document.createElement("p");
            let receivingPartyOrParties = numAtCutoffReceivingSeat == 1 ? "party" : "parties";
            let eachOfThemOrIt = numAtCutoffReceivingSeat == 1 ? "it" : "each of them";
            if (atCutoffReceivingSeats.length == 1) {
                p.innerHTML = `There were ties. The possible apportionments can be obtained by giving out seats as in the table above, 
                except giving one seat fewer to party
                ${Object.values(parties)[atCutoffReceivingSeats[0]].name}. 
                Then, choose exactly ${numAtCutoffReceivingSeat} ${receivingPartyOrParties} from the following list 
                and give ${eachOfThemOrIt} one additional seat: 
                ${atCutoff.map(i => Object.values(parties)[i].name).join(", ")}`;
            } else {
                p.innerHTML = `There were ties. The possible apportionments can be obtained by giving out seats as in the table above, 
                except giving one seat fewer to each of the following parties: 
                ${atCutoffReceivingSeats.map(i => Object.values(parties)[i].name).join(", ")}. 
                Then, choose exactly ${numAtCutoffReceivingSeat} ${receivingPartyOrParties} from the following list 
                and give ${eachOfThemOrIt} one additional seat: 
                ${atCutoff.map(i => Object.values(parties)[i].name).join(", ")}`;
            }
            modal.appendChild(p);
        }
    }

    return {
        "representatives": representatives,
        "ties": ties
    };
}

// required for methods with 0 divisors (Adams, Dean, Huntington-Hill)
function __divzero_fewerseatsthanparties(parties, seats) {
    const votes = parties;
    var representatives = votes.map(p => 0);
    // tiebreaking_message = "  ties broken in favor of: "
    var ties = false;
    const mincount = [...votes].sort((a, b) => b - a)[seats-1];
    for (var i of votes.keys()) {
        if (sum(representatives) < seats && votes[i] >= mincount) {
            if (votes[i] == mincount) {
                // tiebreaking_message += parties[i] + ", "
            }
            representatives[i] = 1;
        } else if (sum(representatives) == seats && votes[i] >= mincount) {
            if (!ties) {
                // tiebreaking_message = tiebreaking_message[:-2]
                // tiebreaking_message += "\n  to the disadvantage of: "
                ties = true;
            }
            // tiebreaking_message += parties[i] + ", "
        }
    }
    return {
        "representatives": representatives,
        "ties": ties
    };
}

// The quota method
//  ( see Balinski, M. L., & Young, H. P. (1975).
//        The quota method of apportionment.
//        The American Mathematical Monthly, 82(7), 701-730.)
function quota(parties, seats, buildExplanation) {
    const votes = Object.values(parties).map(party => party.votes)
    var representatives = votes.map(p => 0);
    while (sum(representatives) < seats) {
        var quotas = [...votes.keys()].map(i => votes[i] / (representatives[i]+1));
        // check if upper quota is violated
        for (var i of votes.keys()) {
            var upperquota = Math.ceil(votes[i] * (sum(representatives)+1) / sum(votes));
            if (representatives[i] >= upperquota) {
                quotas[i] = 0;
            }
        }
        var maxQuota = Math.max(...quotas);
        for (var i of votes.keys()) {
            if (quotas[i] == maxQuota) {
                representatives[i] += 1;
                break;
            }
        }
    }

    // if len(maxquotas) > 1 and not tiesallowed:
    //     print("Tie occurred")

    // print tiebreaking information
    // if verbose and len(maxquotas) > 1:
    //     quotas_now = [Fraction(votes[i], representatives[i]+1)
    //                   for i in range(len(votes))]
    //     tiebreaking_message = ("  tiebreaking in order of: " +
    //                            str(parties[:len(votes)]) +
    //                            "\n  ties broken in favor of: ")
    //     ties_favor = [i for i in range(len(votes))
    //                   if quotas_now[i] == quotas_now[nextrep]]
    //     for i in ties_favor:
    //         tiebreaking_message += str(parties[i]) + ", "
    //     tiebreaking_message = (tiebreaking_message[:-2] +
    //                            "\n  to the disadvantage of: ")
    //     for i in maxquotas[1:]:
    //         tiebreaking_message += str(parties[i]) + ", "
    //     print(tiebreaking_message[:-2])

    if (buildExplanation) {
        let maxRepresentatives = Math.max(...representatives);
        // numbers from 1 to maxRepresentatives + 1
        let divisorsForPresentation = [...Array(maxRepresentatives + 1).keys()].slice(1);

        let table = document.createElement("table");
        let thead = document.createElement("thead");
        let tr = document.createElement("tr");
        let th = document.createElement("th");
        th.innerHTML = "Party";
        tr.appendChild(th);
        for (var d of divisorsForPresentation) {
            th = document.createElement("th");
            // show 2 decimals if divisor is not an integer
            if (d > Math.floor(d)) {
                th.innerHTML = d.toFixed(2);
            } else {
                th.innerHTML = d;
            }
            tr.appendChild(th);
        }
        thead.appendChild(tr);
        table.appendChild(thead);
        let tbody = document.createElement("tbody");
        for (var j of Object.values(parties).keys()) {
            let tr = document.createElement("tr");
            let td = document.createElement("td");
            let span = document.createElement("span");
            span.innerHTML = parties[j].name;
            span.style.backgroundColor = parties[j].color;
            span.className = "party-name";
            td.appendChild(span);
            tr.appendChild(td);
            for (var i of divisorsForPresentation.keys()) {
                let td = document.createElement("td");
                let weight = parties[j].votes / (i + 1);
                td.innerText = weight.toFixed(2);
                td.style.textAlign = "right";
                if (representatives[j] >= i + 1) {
                    td.style.backgroundColor = "lightgreen";
                }
                tr.appendChild(td);
            }
            tbody.appendChild(tr);
        }
        table.appendChild(tbody);
        let wrapper = document.createElement("div");
        wrapper.appendChild(table);
        wrapper.style.overflowX = "auto";
        wrapper.style.maxWidth = "100%";
        modal.appendChild(wrapper);
    }


    return {
        "representatives": representatives,
        "ties": false
    };
}

function arrayEquals(a, b) {
  return Array.isArray(a) &&
    Array.isArray(b) &&
    a.length === b.length &&
    a.every((val, index) => val === b[index]);
}

function test() {
    var votes, seats, RESULTS;
    // test_weak_proportionality
    votes = [14, 28, 7, 35];
    seats = 12;
    for (var method of METHODS) {
        console.assert(arrayEquals(compute(method, votes, seats), [2, 4, 1, 5]),
                       "test_weak_proportionality failed for method " + method);
    }
    // test_zero_parties
    votes = [0, 14, 28, 0, 0];
    seats = 6;
    for (var method of METHODS) {
        console.assert(arrayEquals(compute(method, votes, seats), [0, 2, 4, 0, 0]),
                       "test_zero_parties failed for method " + method);
    }
    // test_fewerseatsthanparties
    votes = [10, 9, 8, 8, 11, 12];
    seats = 3;
    for (var method of METHODS) {
        console.assert(arrayEquals(compute(method, votes, seats), [1, 0, 0, 0, 1, 1]),
                       "test_fewerseatsthanparties failed for method " + method);
    }
    console.log("test finished");
    // test_balinski_young_example1
    RESULTS = {"quota": [52, 44, 2, 1, 1],
                "largest_remainder": [51, 44, 2, 2, 1],
                "dhondt": [52, 45, 1, 1, 1],
                "saintelague": [51, 43, 2, 2, 2],
                "modified_saintelague": [51, 43, 2, 2, 2],
                "huntington": [51, 43, 2, 2, 2],
                "adams": [51, 43, 2, 2, 2],
                "dean": [51, 43, 2, 2, 2]
                };

    votes = [5117, 4400, 162, 161, 160];
    seats = 100;
    for (var method of METHODS) {
        console.assert(arrayEquals(compute(method, votes, seats), RESULTS[method]),
                       "test_balinski_young_example1 failed for method " + method);
    }
    // test_balinski_young_example2
    RESULTS = {"quota": [10, 7, 5, 3, 1],
                "largest_remainder": [9, 7, 5, 4, 1],
                "dhondt": [10, 7, 5, 3, 1],
                "saintelague": [9, 8, 5, 3, 1],
                "modified_saintelague": [9, 8, 5, 3, 1],
                "huntington": [9, 7, 6, 3, 1],
                "adams": [9, 7, 5, 3, 2],
                "dean": [9, 7, 5, 4, 1]
                };

    votes = [9061, 7179, 5259, 3319, 1182];
    seats = 26;
    for (var method of METHODS) {
        console.assert(arrayEquals(compute(method, votes, seats), RESULTS[method]),
                       "test_balinski_young_example2 failed for method " + method);
    }
    // test_saintelague_difference
    votes = [6, 1];
    seats = 4;
    console.assert(!arrayEquals(compute("saintelague", votes, seats), compute("modified_saintelague", votes, seats)),
                       "test_saintelague_difference failed");
}