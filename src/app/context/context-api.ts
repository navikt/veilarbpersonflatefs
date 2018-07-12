import { fetchToJson } from '../utils/rest-utils';

interface AktivEnhetModell {
    aktivEnhet: string;
}

interface AktivBrukerModell {
    aktivBruker: string;
}

interface MeModell {
    ident: string;
    navn: string;
    fornavn: string;
    etternavn: string;
}

export function hentIdent(): Promise<string> {
    return fetchToJson<MeModell>('/veilarbveileder/api/veileder/me')
        .then((data) => data.ident);
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

export function oppdaterAktivBruker(bruker: string): Promise<Response> {
    return fetchToJson(`/modiacontextholder/api/context`, {
        method: 'post',
        body: JSON.stringify({
            verdi: bruker,
            eventType: 'NY_AKTIV_BRUKER'
        })
    });
}
