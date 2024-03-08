import axios from "axios";

export const pullMatches = async (eventKeyInput) => {
    // https://regex101.com/ - test regex here!
    let reg = eventKeyInput.match(/^(\d{4}.*)([RB])([1-3])$/);
    const eventKey = reg[1];
    const alliance = reg[2] === "B" ? "blue" : "red";
    const number = parseInt(reg[3]) - 1;
    console.log(`https://www.thebluealliance.com/api/v3/event/${eventKey}/matches/simple`)
    let data = await axios.get(`https://www.thebluealliance.com/api/v3/event/${eventKey}/matches/simple`, {
        headers: {
            "X-TBA-Auth-Key": "fLKsnM61nLrIA7CDpmFybAXvRYFeCQbIRrPYm5sKSSrs77vsUhL2whnLIHizc3iU"
            }
        }
    )
    data = data.data
    let matches = [];
    if (data["Errors"] == null) {
        data = data.sort(function (a, b) {
           return a.match_number - b.match_number;
        })
        for (var match in data) {
            let rawMatchData = data[match];
            if (rawMatchData.comp_level != "qm") continue;
            let matchData = alliance === "blue" ? { team: rawMatchData.alliances.blue.team_keys[number].replace("frc", ""), matchNo: rawMatchData.key.replace(`${eventKey}_`, "").replace("m", "").toUpperCase(), scouted: false, scouter: "" } : { team: rawMatchData.alliances.red.team_keys[number].replace("frc", ""), matchNo: rawMatchData.key.replace(`${eventKey}_`, "").replace("m", "").toUpperCase(), scouted: false, scouter: "" }
            matches.push(matchData);
        }
    }
    return matches;
}