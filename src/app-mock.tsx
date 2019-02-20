import * as React from 'react';
import SpaMock from './components/spa-mock/spa-mock';
import SideLayout from './side-layout';

const AppMock: React.FunctionComponent = () => {
    const visittkort        = <SpaMock name="Visittkort" className="spa-mock__visitt-kort"/>;
    const mao               = <SpaMock name="MAO" className="spa-mock__mao"/>;
    const aktivitetsplan    = <SpaMock name="Aktivitetsplan" className="spa-mock__aktivitetsplan"/>;

    return <SideLayout visittkort={visittkort} mao={mao} aktivitetsplan={aktivitetsplan} />;
};

export default AppMock;
