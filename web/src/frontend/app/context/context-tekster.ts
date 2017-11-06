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
            defaultMessage: 'Du har endret bruker i et annet vindu. Du kan ikke jobbe med 2 brukere samtidig. Velger du avbryt mister du arbeidet du ikke har lagret.'
        },
        modalTekst: {
            id: 'context.nybruker.modal.sporsmal',
            defaultMessage: 'Vil du fortsette å jobbe med bruker som har fødselsnummer {bruker}'
        },
        bekreft: {
            id: 'context.nybruker.modal.bekreft',
            defaultMessage: 'Bekreft'
        },
        avbryt: {
            id: 'context.nybruker.modal.avbryt',
            defaultMessage: 'Avbryt'
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
        }
    }
);
