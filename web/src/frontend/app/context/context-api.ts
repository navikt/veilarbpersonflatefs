import {fetchToJson} from '../utils/rest-utils';

interface AktivEnhetModell {
    aktivEnhet: string;
}

interface AktivBrukerModell {
    aktivBruker: string;
}

export function hentAktivEnhet(): Promise<string> {
    return fetchToJson<AktivEnhetModell>(`/modiacontextholder/api/context/aktivenhet`)
        .then((data) => {
                return data.aktivEnhet;
            }
        );
}

export function hentAktivBruker(): Promise<string> {
    return fetchToJson<AktivBrukerModell>(`/modiacontextholder/api/context/aktivbruker`)
        .then((data) => {
                return data.aktivBruker;
            }
        );
}

export function oppdaterAktivEnhet(enhet: string): Promise<Response> {
    return fetch(`/modiacontextholder/api/context`, {
        method: 'post',
        body: JSON.stringify({
            verdi: enhet,
            eventType: 'NY_AKTIV_ENHET'
        })
    });
}

export function oppdaterAktivBruker(bruker: string): Promise<Response> {
    return fetch(`/modiacontextholder/api/context`, {
        method: 'post',
        body: JSON.stringify({
            verdi: bruker,
            eventType: 'NY_AKTIV_BRUKER'
        })
    });
}
