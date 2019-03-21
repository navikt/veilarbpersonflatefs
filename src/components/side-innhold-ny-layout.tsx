import React from 'react';
import TabMenu, { Tab } from './tab-menu/tab-menu';
import TourModal from './tour-modal/tour-modal';
import { Features, TOUR_MODAL_TOGGLE } from '../utils/api';
import TilbakemeldingFab from './tilbakemelding/fab/tilbakemelding-fab';
import './side-innhold-ny-layout.less';

interface SideInnholdNyLayoutProps {
    visittkort: React.ReactElement;
    mao: React.ReactElement;
    aktivitetsplan: React.ReactElement;
    features: Features;
}

class SideInnholdNyLayout extends React.Component<SideInnholdNyLayoutProps> {

    constructor(props: SideInnholdNyLayoutProps) {
        super(props);
        this.setPageBackground();
    }

    setPageBackground = () => {
        const page = document.getElementsByClassName("veilarbpersonflatefs")[0];
        page.classList.add("grey-background");
    };

    render () {
        const { visittkort, aktivitetsplan, mao, features } = this.props;

        const tabs: Tab[] = [
            { title: 'Aktivitetsplan og dialog', content: aktivitetsplan },
            { title: 'Detaljer', content: <div className="tab-content__mao">{mao}</div> }
        ];

        const visDetaljer = window.location.search.indexOf('visRegistreringDetaljer') >= 0;
        const defaultSelectedTab = visDetaljer ? 1 : 0;

        return (
            <>
                <div className="visittkort-wrapper">
                    {visittkort}
                </div>
                <TabMenu tabs={tabs} defaultSelectedTab={defaultSelectedTab}/>
                { features[TOUR_MODAL_TOGGLE] && <TourModal /> }
                <TilbakemeldingFab features={features} />
            </>
        );
    }
}

export default SideInnholdNyLayout;
