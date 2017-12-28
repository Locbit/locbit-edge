/**
 * preprocess
 *
 * process the data so that it will attach API key to the request before sending to octoprint
 * @param payload - contain API Key
 * @param data - contain REST JSON that will send it to octoprint
 * @returns payload: processed data of JSON
 */
function preprocess(payload, data) {
    if (!data.hasOwnProperty('headers')) {
        data['headers'] = {}
    }
    data['headers']["X-Api-Key"] = payload;
    return data;
}

var octoprint = {};

octoprint.preprocess = preprocess;

module.exports = octoprint;