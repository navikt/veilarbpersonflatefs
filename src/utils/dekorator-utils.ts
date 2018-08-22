import { hentFodselsnummerFraURL } from './url-utils';

const handlePersonsokSubmit = (fnr: string): void => {
    window.location.pathname = `veilarbpersonflatefs/${fnr}`;
};
interface Config {
    config: {
        dataSources: {
            veileder: string;
            enheter: string;
        };
        toggles: {
            visEnhet: boolean;
            visEnhetVelger: boolean;
            visSokefelt: boolean;
            visVeileder: boolean;
        };
        handlePersonsokSubmit: (fnr: string) => void;
        applicationName: string;
        initiellEnhet?: string;
        fnr?: string;
    };
}

const config = (): Config => ({
    config: {
        applicationName: 'Arbeidsrettet oppfølging',
        dataSources: {
            enheter: '/veilarbveileder/api/veileder/enheter',
            veileder: '/veilarbveileder/api/veileder/me',
        },
        fnr: hentFodselsnummerFraURL(),
        handlePersonsokSubmit,
        toggles: {
            visEnhet: true,
            visEnhetVelger: false,
            visSokefelt: true,
            visVeileder: true,
        },
    },
});

export const initialiserToppmeny = (): void => {
    (window as any).renderDecoratorHead(config());
};
