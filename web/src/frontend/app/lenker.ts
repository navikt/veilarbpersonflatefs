export const modiaTemplateUrl = 'https://modapp{{miljoStreng}}.adeo.no/modiabrukerdialog/person/{{fodselsnummer}}';
export const miaUrl = 'https://modapp{{miljoStreng}}.adeo.no/mia';

export const veilarbpersonflatefsLenker = {
    lenker:
        [
            [miaUrl, 'Arbeidsmarkedet'],
            ['/veilarbportefoljeflatefs/enhet?enhet={{enhet}}&clean', 'Enhetens oversikt'],
            ['/veilarbportefoljeflatefs/portefolje?enhet={{enhet}}&clean', 'Min oversikt'],
            [modiaTemplateUrl, 'Personoversikt']
        ],
    tittel: ''
};
