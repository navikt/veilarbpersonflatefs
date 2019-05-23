import React from 'react';
import TabMenu, { Tab } from './tab-menu/tab-menu';
import TourModal from './tour-modal/tour-modal';
import { Features, TOUR_MODAL_TOGGLE, VIS_VEDTAKSSTOTTE } from '../utils/featue-utils';
import TilbakemeldingFab from './tilbakemelding/fab/tilbakemelding-fab';
import './side-innhold.less';
import { hentSistBesokteTab } from './tab-menu/siste-tab';

interface SideInnholdLayoutProps {
    visittkort: React.ReactElement;
    mao: React.ReactElement;
    aktivitetsplan: React.ReactElement;
    vedtaksstotte?: React.ReactElement;
    features: Features;
    fnr: string;
}

export const TAG_AKTIVITETSPLAN = 'aktivitetsplan';
export const TAG_VEDTAKSSTOTTE = 'vedtaksstotte';
export const TAG_DETALJER = 'detaljer';

class SideInnhold extends React.Component<SideInnholdLayoutProps> {

    render () {
        const { visittkort, aktivitetsplan, vedtaksstotte, mao, features, fnr } = this.props;

        const tabs: Tab[] = [
            { tag: TAG_AKTIVITETSPLAN, title: 'Aktivitetsplan og dialog', content: aktivitetsplan },
        ];

        tabs.push({ tag: TAG_DETALJER, title: 'Detaljer', content: <div className="tab-content__mao">{mao}</div> });

        if (vedtaksstotte && features[VIS_VEDTAKSSTOTTE]) {
            tabs.push({ tag: TAG_VEDTAKSSTOTTE, title: 'Oppfølgingsvedtak', content: vedtaksstotte });
        }

        const visDetaljer = window.location.search.indexOf('visRegistreringDetaljer') >= 0;
        const sisteBesokteTab = hentSistBesokteTab(fnr);
        let defaultSelectedTab = TAG_AKTIVITETSPLAN;

        if (visDetaljer) {
            defaultSelectedTab = TAG_DETALJER;
        } else if (sisteBesokteTab) {
            defaultSelectedTab = sisteBesokteTab;
        }

        return (
            <>
                <div className="visittkort-wrapper">
                    {visittkort}
                </div>
                <TabMenu fnr={fnr} tabs={tabs} defaultSelectedTab={defaultSelectedTab}/>
                { features[TOUR_MODAL_TOGGLE] && <TourModal /> }
                <TilbakemeldingFab features={features} />
            </>
        );
    }
}

export default SideInnhold;
