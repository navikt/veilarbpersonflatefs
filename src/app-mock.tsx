import React from 'react';
import SpaMock from './components/spa-mock/spa-mock';
import SideInnhold from './components/side-innhold/side-innhold';
import { Features, lagFeatureToggleUrl } from './utils/featue-utils';
import Datalaster from './components/datalaster';
import PageSpinner from './components/page-spinner/page-spinner';
import brukerFnr from './mock/bruker-fnr';

const AppMock: React.FunctionComponent = () => {
    const visittkort        = <SpaMock name="Visittkort" className="spa-mock__visitt-kort"/>;
    const mao               = <SpaMock name="MAO" className="spa-mock__mao"/>;
    const aktivitetsplan    = <SpaMock name="Aktivitetsplan" className="spa-mock__aktivitetsplan"/>;
    const vedtaksstotte     = <SpaMock name="Vedtaksstøtte" className="spa-mock__vedtaksstotte"/>;

    return (
        <Datalaster<Features> url={lagFeatureToggleUrl()} spinner={<PageSpinner/>}>
            {(data: Features) =>
                <SideInnhold
                    fnr={brukerFnr}
                    features={data}
                    visittkort={visittkort}
                    mao={mao}
                    aktivitetsplan={aktivitetsplan}
                    vedtaksstotte={vedtaksstotte}
                />
            }
        </Datalaster>
    );
};

export default AppMock;

