var request = require('request');
var cheerio = require('cheerio');

module.exports = function scrapeHeroByBattletag(params,cb) {
        var battletag = params.battletag.replace(/#/i, '-');
        var heroToken = params.heroToken;
        var heroName = params.heroName;
        var platform = params.platform || 'pc';

        var url = `https://masteroverwatch.com/profile/${platform}/global/${battletag}/heroes/${heroToken}`;
        console.log(`Scraping data for ${heroName} at ${url}`);

        request(url, function(err,response,body) {
            var $ = cheerio.load(body);
            var response = {
                heroName: heroName,
                healingPerMinute: 0,
                selfHealingPerMinute: 0,
                damagePerMinute: 0,
                damageBoostedPerMinute: 0
            }
            //Start by grabbing all divs with class stats-label in them.
            // Iterate through each
            var damagePerMinuteValues = [];
            var healingPerMinuteValues = [];
            $('div.stats-label').each(function(index,value) {
                // Get the type of each in this webpage.
                var type = value.children[0].data;


                //Right now, we're interested in the damage one, specifically.
                if(type == 'Damage') {
                    var parent = value.parent; // col-xs-4
                    var statsBar = parent.children[1];
                    var barValue = statsBar.children[0];
                    var damagePerMinute = 0;

                    //If the value is somehow undefined
                    if(barValue.children[0].data) {
                        damagePerMinute = parseInt( barValue.children[0].data.replace(/[,]+/g, "").trim() );
                    }



                    //There are multiple showcases here. We want the first one on the page always.
                    // So, as a shitty hack, we're going to push everything to an array and just
                    // assign index 0.
                    damagePerMinuteValues.push(damagePerMinute);
                }

                if(type == 'Healing') {
                    var parent = value.parent; // col-xs-4
                    var statsBar = parent.children[1];
                    var barValue = statsBar.children[0];
                    var healingPerMinute = 0;

                    //If the value is somehow undefined
                    if(barValue.children[0].data) {
                        healingPerMinute = parseInt( barValue.children[0].data );
                    }

                    healingPerMinuteValues.push(healingPerMinute);
                }

                // Unfortunately, MasterOverwatch does not have any self-healing nor damage boost stats for us to scrape
                // this may be because blizzard does not provide this data
            });
            response.damagePerMinute = damagePerMinuteValues[0];
            response.healingPerMinute = healingPerMinuteValues[0];

            cb(null,response);
        });
    }