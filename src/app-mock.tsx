import * as React from 'react';
import SpaMock from './components/spa-mock/spa-mock';
import SideInnhold from './components/side-innhold';
import { Features, lagFeatureToggleUrl } from './utils/api';
import Datalaster from './components/datalaster';
import PageSpinner from './components/page-spinner/page-spinner';

const AppMock: React.FunctionComponent = () => {
    const visittkort        = <SpaMock name="Visittkort" className="spa-mock__visitt-kort"/>;
    const mao               = <SpaMock name="MAO" className="spa-mock__mao"/>;
    const aktivitetsplan    = <SpaMock name="Aktivitetsplan" className="spa-mock__aktivitetsplan"/>;

    return (
        <Datalaster<Features> url={lagFeatureToggleUrl()} spinner={<PageSpinner/>}>
            {(data: Features) =>
                <SideInnhold features={data} visittkort={visittkort} mao={mao} aktivitetsplan={aktivitetsplan}/>
            }
        </Datalaster>
    );
};

export default AppMock;

