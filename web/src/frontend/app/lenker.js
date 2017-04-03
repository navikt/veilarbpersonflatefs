export const modiaTemplateUrl = 'https://modapp{{miljoStreng}}.adeo.no/modiabrukerdialog/person/{{fodselsnummer}}';

export const veilarbpersonflatefsLenker =
    {
        lenker:
        [
                ['/mia/ledigestillinger', 'Arbeidsmarkedet'],
                ['/veilarbportefoljeflatefs/enhet?enhet={{enhet}}&clean', 'Enhetens oversikt'],
                ['/veilarbportefoljeflatefs/portefolje?enhet={{enhet}}&clean', 'Min oversikt'],
                [modiaTemplateUrl, 'Modia']
        ],
        tittel: ''
    };
