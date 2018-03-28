var heroes = require('../../lib/heroes.json');
var fs = require('fs');

var scrapeTopPerformingPlayerForHero = require('./scrapeTopPerformingPlayerForHero.js');

module.exports = function scrapeAllHeroesByLeaderboard() {
    var promises = [];
    var data = {};

    for(heroName in heroes) {
        promises.push(
            new Promise((resolve,reject) => {
                var heroToken = heroes[heroName].masterOverwatch.token;
                var params = { 
                    heroToken: heroToken,
                    heroName: heroName // this is bound only to keep the key/value pairing through the loops
                }

                scrapeTopPerformingPlayerForHero(params, function(err,response) {
                    if(err) {
                        console.log(`Unable to retrieve hero data for ${heroName}`)
                    }
                    if(response) {
                        var heroKey = response.heroName;
                        delete response.heroName;
                        data[heroKey] = response;
                    }
                    resolve(response);
                })
            })
        )
    }

    Promise
        .all(promises)
        .then((responses) => {
            return new Promise((resolve,reject) => {
                var output = JSON.stringify(data, null, 4);

                fs.writeFile(__dirname + `/../../data/leaderboards.json`, output, function(err) {
                    if(err) {
                        reject(err);
                    }
                })
            })
        })
        .catch((err) => {
            console.log(err);
        })
}