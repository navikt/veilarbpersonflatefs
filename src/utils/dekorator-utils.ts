import { enhetFraUrl, hentFodselsnummerFraURL } from './url-utils';
import getWindow from './window';

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
        initiellEnhet: enhetFraUrl(),
        toggles: {
            visEnhet: true,
            visEnhetVelger: false,
            visSokefelt: true,
            visVeileder: true,
        },
    },
});

export const initialiserToppmeny = (): void => {
    getWindow().renderDecoratorHead(config());
};
