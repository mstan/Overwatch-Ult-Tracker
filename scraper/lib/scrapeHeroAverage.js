var request = require('request');
var cheerio = require('cheerio');

module.exports = function scrapeHeroAverage(params,cb) {
    var heroToken = params.heroToken;
    var heroName = params.heroName;
    var platform = params.platform || 'pc';
    var region = params.region || 'us';
    var mode = params.mode || 'ranked' // 'ranked' or 'quick'

    var url = `https://masteroverwatch.com/heroes/${heroToken}/${platform}/${region}/mode/${mode}`;
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
        $('div.stats-label').each(function(index,value) {
            // Get the type of each in this webpage.
            var type = value.children[0].data;

            //Right now, we're interested in the damage one, specifically.
            if(type == 'Damage') {
                //This one matched damage! By how MasterOverwatch format, we know that the sixth element left
                // is our value. So shift left six times (this isn't very clean);
                // Once we move left six times, grab 
                var valueNode = value.prev.prev.prev.prev.prev.prev;
                //It is the first child element of the valueNode
                // Get the data of that first one
                var value = parseInt( valueNode.children[0].data.replace(/[,]+/g, "").trim() ); //And trim whitespace

                response.damagePerMinute = value;
            }

            if(type == 'Healing') {
                //This one matched healing! By how MasterOverwatch format, we know that the sixth element left
                // is our value. So shift left six times (this isn't very clean);
                // Once we move left six times, grab 
                var valueNode = value.prev.prev.prev.prev.prev.prev;
                //It is the first child element of the valueNode
                // Get the data of that first one
                var value = parseInt(valueNode.children[0].data.replace(/[,]+/g, "").trim() ); //And trim whitespace

                response.healingPerMinute = value;
            }

            // Unfortunately, MasterOverwatch does not have any self-healing nor damage boost stats for us to scrape
            // this may be because blizzard does not provide this data
        });

        cb(null,response);
    });
}