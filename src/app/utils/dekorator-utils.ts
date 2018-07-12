import {Fnr} from '../model-interfaces'
import { hentFodselsnummerFraURL } from './../eventhandtering';

const handlePersonsokSubmit = (fnr: Fnr): void => {
    window.location.pathname = `veilarbpersonflatefs/${fnr}`;
};
interface Config {
    config: {
        dataSources: {
            veileder: string,
            enheter: string
        },
        toggles: {
            visEnhet: boolean,
            visEnhetVelger: boolean,
            visSokefelt: boolean,
            visVeileder: boolean,
        },
        handlePersonsokSubmit: (fnr: Fnr) => void,
        applicationName: string,
        initiellEnhet?: string,
        fnr?: string
    };
}

const config = (): Config => ({
    config: {
        dataSources: {
            veileder: '/veilarbveileder/api/veileder/me',
            enheter: '/veilarbveileder/api/veileder/enheter'
        },
        toggles: {
            visEnhet: true,
            visEnhetVelger: false,
            visSokefelt: true,
            visVeileder: true
        },
        handlePersonsokSubmit,
        applicationName: 'Arbeidsrettet oppfølging',
        fnr: hentFodselsnummerFraURL()
    }
});

export const initialiserToppmeny = (): void => {
    (window as any).renderDecoratorHead(config());
};
