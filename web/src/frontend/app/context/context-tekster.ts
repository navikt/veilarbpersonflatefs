import { defineMessages } from 'react-intl';

export const tekster = defineMessages(
    {
        wsfeilmelding: {
            id: 'context.nybruker.alertmelding',
            defaultMessage: 'Det er fare for at du kan ha forskjellige brukere i forskjellige flater/vinduer. Systemet feiler og klarer ikke oppfatte endringer du eventuelt har gjort i andre vinuer.'
        },
        modalOverskrift: {
            id: 'context.nybruker.modal.overskrift',
            defaultMessage: 'Du har endret bruker'
        },
        modalAlert: {
            id: 'context.nybruker.modal.alertmelding',
            defaultMessage: 'Du har endret bruker i et annet vindu. Du kan ikke jobbe med 2 brukere samtidig. Velger du å endre bruker mister du arbeidet du ikke har lagret.'
        },
        modalTekst: {
            id: 'context.nybruker.modal.sporsmal',
            defaultMessage: 'Ønsker du å endre bruker til {bruker}?'
        },
        behold: {
            id: 'context.nybruker.modal.behold',
            defaultMessage: 'Behold'
        },
        endre: {
            id: 'context.nybruker.modal.endre',
            defaultMessage: 'Endre'
        },
        feilmodalOverskrift: {
            id: 'context.feilmodal.overskrift',
            defaultMessage: 'Bruker i context feilet'
        },
        feilmodalTekst: {
            id: 'context.feilmodal.tekst',
            defaultMessage: 'Kommunikasjonen med bruker i context feilet. Dette betyr at det er fare for at du kan ha forskjellige brukere i de ulike flatene.'
        },
        feilmodalBekreft: {
            id: 'context.feilmodal.bekreft',
            defaultMessage: 'Ok'
        },
        manglerFnr: {
            id: 'context.mangler.fnr',
            defaultMessage: 'Du må søke opp en person for å vise aktivitetsplanen'
        }
    }
);
