/*
    This is a simple scraper module in order to scrape data statistics for players or player averages
    from MasterOverwatch. This function is run from the commandline, specifying environment variables.

    If not arguments are given, they are defaulted. The primary argument is battletag.
    If battletag is not provided, we default to scraping the "global" statistics.
*/

var battletag = process.env.BATTLETAG || null; // Battletag of the designated user we wish to scrape for
var leaderboard = process.env.LEADERBOARD || false;

var region = process.env.REGION || 'us';
var platform = process.env.PLATFORM || 'pc';

var params = {
    battletag,
    region,
    platform
}

var scraper = require('./lib/');

if(battletag && !leaderboard) {
    scraper.scrapeAllHeroesByBattletag(params);
} else if(!battletag && !leaderboard) {
    scraper.scrapeAllHeroesAverages();
} else if (!battletag && leaderboard) {
    params.heroToken = '18-genji';
    //scraper.scrapeTopPerformingPlayerForHero(params, function() {});
    scraper.scrapeAllHeroesByLeaderboard();
}
