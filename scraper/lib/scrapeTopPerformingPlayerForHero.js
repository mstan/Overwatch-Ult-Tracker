var request = require('request');
var cheerio = require('cheerio');

module.exports = function scrapeTopPerformingPlayerForHero(params,cb) {
    var region = params.region || 'global';
    var mode = params.mode || 'ranked';
    var platform = params.platform || 'pc';
    var performance = params.performance || 'averagedamage';

    var heroToken = params.heroToken;
    var heroName = params.heroName;

    var url = `https://masteroverwatch.com/leaderboards/${platform}/${region}/hero/${heroToken}/mode/${mode}/category/averagedamage`
    console.log(url);
    request(url, function(err,response,body) {
        var $ = cheerio.load(body);
        var response = {
            heroName: heroName,
            battletag: '',
            healingPerMinute: 0,
            selfHealingPerMinute: 0,
            damagePerMinute: 0,
            damageBoostedPerMinute: 0
        }
        //Start by grabbing all divs with class stats-label in them.
        // Iterate through each
        var topPerformers = [];
        var topDamageValues = [];
        // not logging for some reason?
        var damagePerMinute = $('div.table-main-value.col-xs-3').children('strong').first().text().trim();
        var damagePerMinuteNum = parseInt(damagePerMinute.replace('/min', '') );
        response.damagePerMinute = damagePerMinuteNum

        var profileURL = $('a.table-row-link')[1].attribs.href; //index offset 1 contains top player 
        var battletag = profileURL.split('/')[4]; //battletag is not displayed, thus we splice it from href at index 4 of "/profile/pc/us/player#1234"
        response.battletag = battletag;

        cb(null,response);
    });

}