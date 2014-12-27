/**
 * Plugin dependencies.
 *
 * @type {exports}
 */
var helpers = require('unibot-helpers');
var cheerio = require('cheerio');

/**
 * Kyny plugin for UniBot.
 *
 * This plugin fetches event information from http://www.mustakynnys.com/ website.
 *
 * Also note that this plugin relies heavily to HTML structure of that site. So there will be times, when this plugin
 * doesn't work right.
 *
 * @param   {Object} options Plugin options object, description below.
 *   db: {mongoose} the mongodb connection
 *   bot: {irc} the irc bot
 *   web: {connect} a connect + connect-rest webserver
 *   config: {object} UniBot configuration
 *
 * @return  {Function}  Init function to access shared resources
 */
module.exports = function init(options) {
    // Actual plugin implementation.
    return function plugin(channel) {
        // Regex rules for plugin
        return {
            '^!kyny$': function kyny(from, matches) {
                helpers.download('http://www.mustakynnys.com/', function success(data) {
                    var $ = cheerio.load(data);

                    $('#boxleft p.pvm').each(function iterator(i, elem) {
                        if (i < 3) {
                            var event = $(this);

                            channel.say(event.text().trim() + " " + event.next().text().split('\n')[1]);
                        }
                    });
                });
            }
        };
    };
};
