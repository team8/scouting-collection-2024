let keys = require('../assets/keys.json'); // list of keys for data encoding (ex: "team" maps to "t")

export const encodeStringData = (data) => {
    data = JSON.stringify(data);
    let autoEventsReached = false;
    Object.keys(keys).forEach(function(oldKey) {
        let newKey = keys[oldKey];
        if (oldKey == "autoEvents") autoEventsReached = true;
        /* once autoEvents key is reached, then multiple event keys can be replaced 
        (replaceAll for all keys makes the wrong unnecessarily removes some keys meant for others) */
        data = !autoEventsReached ? data.replace(oldKey, newKey) : data.replaceAll(oldKey, newKey); 
    })
    return (data.replaceAll(`"`, '').replaceAll(" ", ''));
}

String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};
