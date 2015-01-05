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
 * @todo    Make shown event count configurable
 * @todo    Make bot say founded events in one message (need more opinions about this)
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
                    if (data == null) {
                        channel.say(from, 'Did not get any data from http://www.mustakynnys.com/ - Site down?');
                    } else {
                        var $ = cheerio.load(data);
                        var found = false;

                        $('#boxleft').find('p.pvm').each(function iterator(i, elem) {
                            if (i < 3) {
                                var event = $(this);
                                var text = event.text().trim() + " " + event.next().text().split('\n')[1];

                                if (text) {
                                    found = true;

                                    channel.say(text);
                                }
                            }
                        });

                        if (!found) {
                            channel.say(from, 'Did not found any event data...');
                        }
                    }
                });
            }
        };
    };
};
