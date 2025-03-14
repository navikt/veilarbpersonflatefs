# Veilarbpersonflatefs

[![CircleCI](https://circleci.com/gh/navikt/veilarbpersonflatefs.svg?style=svg)](https://circleci.com/gh/navikt/veilarbpersonflatefs)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=navikt_veilarbpersonflatefs&metric=alert_status)](https://sonarcloud.io/dashboard?id=navikt_veilarbpersonflatefs)
[![Maintainability Rating](https://sonarcloud.io/api/project_badges/measure?project=navikt_veilarbpersonflatefs&metric=sqale_rating)](https://sonarcloud.io/dashboard?id=navikt_veilarbpersonflatefs)
[![Reliability Rating](https://sonarcloud.io/api/project_badges/measure?project=navikt_veilarbpersonflatefs&metric=reliability_rating)](https://sonarcloud.io/dashboard?id=navikt_veilarbpersonflatefs)
[![Security Rating](https://sonarcloud.io/api/project_badges/measure?project=navikt_veilarbpersonflatefs&metric=security_rating)](https://sonarcloud.io/dashboard?id=navikt_veilarbpersonflatefs)
[![Vulnerabilities](https://sonarcloud.io/api/project_badges/measure?project=navikt_veilarbpersonflatefs&metric=vulnerabilities)](https://sonarcloud.io/dashboard?id=navikt_veilarbpersonflatefs)
[![Bugs](https://sonarcloud.io/api/project_badges/measure?project=navikt_veilarbpersonflatefs&metric=bugs)](https://sonarcloud.io/dashboard?id=navikt_veilarbpersonflatefs)
[![Code Smells](https://sonarcloud.io/api/project_badges/measure?project=navikt_veilarbpersonflatefs&metric=code_smells)](https://sonarcloud.io/dashboard?id=navikt_veilarbpersonflatefs)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=navikt_veilarbpersonflatefs&metric=coverage)](https://sonarcloud.io/dashboard?id=navikt_veilarbpersonflatefs)
Flate applikasjonen for veiledere som viser informasjon og aktivitetsplanen til brukerne

Denne appen er "host" app for følgende "micro"-frontends:
- Tab-apper (Åpnes inni et tab-område)
  - AKTIVITETSPLAN
  - DIALOG
  - VEDTAKSSTOTTE
  - OVERBLIKK (VEILARBDETALJERFS)
  - ARBEIDSMARKEDSTILTAK
  - FINN STILLING ([Team Toi](https://teamkatalog.nav.no/team/76f378c5-eb35-42db-9f4d-0e8197be0131) sin app [finn-stilling-inngang](https://github.com/navikt/finn-stilling-inngang))
- Navbar-apps 
  - INTERNARBEIDSFLATEFS_DECORATOR (søke på person og linker til andre nav apper)
  - VEILARBVISITTKORTFS (div info om en person + "veilederverktøy")

Alt dette er limt sammen med [NAVSPA](https://github.com/navikt/navspa) 

Appen inneholder følgende:
- En tab-bar med de forskjellige appene

## Kjøre appen
```console
$ npm install
$ npm run dev
```
Bruk dev-proxyen for å få opp et miljø appen kan kjøres i

## Konfigurere git blame til å ignorere spesifikke commits

Om du ønsker er det mulig å konfigurere git blame til å ignorere spesifikke commits definert i [.git-blame-ignore-revs](.git-blame-ignore-revs) (naviger til filen for å se hvilke commits som er ignorert for dette prosjektet).
Commits definert i denne filen vil ikke dukke opp i git blame. Det anbefales å konfigurere dette per git prosjekt da git blame vil feile dersom man feks. har konfigurert dette globalt men det ikke eksisterer en
ignore-fil med riktig navn i det gitte git prosjektet du står i. Se forøvrig git sin dokumentasjon for hvordan git blame og ignoring fungerer: [https://git-scm.com/docs/git-blame#Documentation/git-blame.txt---ignore-revltrevgt](https://git-scm.com/docs/git-blame#Documentation/git-blame.txt---ignore-revltrevgt).

### Fremgangsmåte

`git config --local blame.ignoreRevsFile .git-blame-ignore-revs`

### Resette git blame dersom man har konfigurert regelen globalt ved et uhell

`git config --global --unset blame.ignoreRevsFile`

## Bruk av Amplitude

Det er mulig å sende eventer til Amplitude gjennom personflatens Amplitude-klient. Eventene  Det finnes foreløpig ikke noen
pakke som eksponerer funksjonen, men du kan legge til en deklarasjon som ser sånn her ut:

```typescript
interface Window {
	veilarbpersonflatefsAmplitude: ({
		origin,
		eventName,
		eventData
	}?: {
		origin: string;
		eventName: string;
		eventData?: Record<string, unknown>;
	}) => Promise<void>;
}
```

Eksempel på bruk:

```typescript
window.veilarbpersonflatefsAmplitude('aktivitetsplan', 'accordion åpnet', { tekst: 'Historikk' });
```

Se [https://github.com/navikt/analytics-taxonomy](https://github.com/navikt/analytics-taxonomy) for taksonomi.

# Henvendelser

Spørsmål knyttet til koden eller prosjektet kan stilles via issues her på github.

## For Nav-ansatte

Interne henvendelser kan sendes via Slack i kanalen #po-arbeidsoppfølging.


