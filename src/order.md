# Script operation order

0. (ideally this'll do everything eventually)
~ main.js ~ 

1. Load to Mongo
loader.js > puller.js > api.js

2. Filter to CSVs
filter.js

3. Analyse to JSONs
analyer.js

4. Graph month's activity
grapher.js

5. Map Regions
mapper.js

6. Render HTML Emails
renderer.js