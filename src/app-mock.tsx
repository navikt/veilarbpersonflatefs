import * as React from 'react';
import SpaMock from './components/spa-mock/spa-mock';
import SideInnholdNyLayout from './components/side-innhold-ny-layout';
import { Features, lagFeatureToggleUrl, NY_LAYOUT_TOGGLE } from './utils/api';
import SideInnhold from './components/side-innhold';
import Datalaster from './components/datalaster';
import PageSpinner from './components/page-spinner/page-spinner';

const AppMock: React.FunctionComponent = () => {
    const visittkort        = <SpaMock name="Visittkort" className="spa-mock__visitt-kort"/>;
    const mao               = <SpaMock name="MAO" className="spa-mock__mao"/>;
    const aktivitetsplan    = <SpaMock name="Aktivitetsplan" className="spa-mock__aktivitetsplan"/>;

    return (
        <Datalaster<Features> url={lagFeatureToggleUrl()} spinner={<PageSpinner/>}>
            {(data: Features) =>
                data[NY_LAYOUT_TOGGLE] ?
                    <SideInnholdNyLayout features={data} visittkort={visittkort} mao={mao} aktivitetsplan={aktivitetsplan}/>
                    :
                    <SideInnhold mao={mao} aktivitetsplan={aktivitetsplan}/>
            }
        </Datalaster>
    );
};

export default AppMock;

