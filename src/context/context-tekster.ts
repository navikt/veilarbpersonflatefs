import { defineMessages, FormattedMessage } from 'react-intl';

export type Tekst = FormattedMessage.MessageDescriptor;

export const tekster = defineMessages({
	behold: {
		defaultMessage: 'Behold',
		id: 'context.nybruker.modal.behold'
	},
	endre: {
		defaultMessage: 'Endre',
		id: 'context.nybruker.modal.endre'
	},
	feilmodalBekreft: {
		defaultMessage: 'Ok',
		id: 'context.feilmodal.bekreft'
	},
	feilmodalOverskrift: {
		defaultMessage: 'Bruker i context feilet',
		id: 'context.feilmodal.overskrift'
	},
	feilmodalTekst: {
		defaultMessage:
			'Kommunikasjonen med bruker i context feilet. Dette betyr at det er fare for at du kan ha forskjellige brukere i de ulike flatene.',
		id: 'context.feilmodal.tekst'
	},
	ingenTilgangBruker: {
		defaultMessage: 'Du har ikke tilgang til å se aktivitetsplanen',
		id: 'context.ingen.tilgang.til.bruker'
	},
	manglerFnr: {
		defaultMessage: 'Du må søke opp en person for å vise aktivitetsplanen',
		id: 'context.mangler.fnr'
	},
	modalAlert: {
		defaultMessage:
			'Du har endret bruker i et annet vindu. Du kan ikke jobbe med 2 brukere samtidig. Velger du å endre bruker mister du arbeidet du ikke har lagret.',
		id: 'context.nybruker.modal.alertmelding'
	},
	modalOverskrift: {
		defaultMessage: 'Du har endret bruker',
		id: 'context.nybruker.modal.overskrift'
	},
	modalTekst: {
		defaultMessage: 'Ønsker du å endre bruker til {bruker}?',
		id: 'context.nybruker.modal.sporsmal'
	},
	wsfeilmelding: {
		defaultMessage:
			'Det er fare for at du kan ha forskjellige brukere i forskjellige flater/vinduer. Systemet feiler og klarer ikke oppfatte endringer du eventuelt har gjort i andre vinuer.',
		id: 'context.nybruker.alertmelding'
	}
});
