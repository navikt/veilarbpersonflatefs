# VeilArbPersonFlateFS

Første gang prosjektet bygger kan det bygges med `mvn clean install` i prosjekt-rotmappen. Etter det kan prosjektet bygges ved å kjøre `npm run build` fra mappen `web/src/frontend`.

Java-klienten kjøres ved å starte filen `web/src/test/java/no/nav/fo/veilarbpersonflatefs/StartJetty.java`, da serves inneholdet som `npm` har lagt i `web/src/main/webapp/`.

For å kontinuerlig bygge javascripten kan man kjøre npm run watch. Dette bygger kun javascript, så endringer i html, css eller bilder må bygges med `npm run build` (evt. ved å kjøre `gulp`).