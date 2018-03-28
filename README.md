#Overwatch Ultimates Timer Application

## Concept

This is a Polymer application built with the intent to approximate ultimate for heroes based on data from MasterOverwatch. A node.js web API scraper exists here to scrape information from Masteroverwatch to use in the system.

### Scraper

Setup by changing directory to the app (found in /app/scraper/) and run ``npm install``

By default, you can scrape global average statistics by running the base command ``node index.js``. However, for additional information points,
you can also add other criteria.

If you want to scrape global leaderboards for damage, use ``LEADERBOARD=true node index.js``
If you want to scrape information for a particular player, use ``BATTLETAG=Gamemaster1k#1868 node index.js``*

### Polymer App

Setup by running bower install in the /app directory

In order to run the application, simply run ``polymer serve``

The page loads onto an all heroes page which shows the default values for all "global" average stats loaded in.

Stats can be changed to any other JSON in the /app/data directory by typing in the new JSON file name at the bottom of the page at "source".


## Known Bugs

* Currently, the scraper tool for specific players only can grab quick play. This is a limitation with Masteroverwatch's site by how it loads stats for comeptitive. Unfortunately the scraper can only see QP statistics for individual people.

- When updating a new JSON file, the system does not immediately update the time, and it will jump a significant timeperiod during the next time. This is to adjust for the new calculated approximate time. This is due to a bug in nested JSON elements not being observed when hero changes in Polymer. As of right now, a hotfix is in place to stop unexpected timer behavior