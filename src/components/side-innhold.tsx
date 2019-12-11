import React from 'react';
import TabMenu, { Tab } from './tab-menu/tab-menu';
import {Features, VIS_NY_DIALOG, VIS_VEDTAKSSTOTTE} from '../utils/featue-utils';
import TilbakemeldingFab from './tilbakemelding/fab/tilbakemelding-fab';
import { hentSistBesokteTab } from './tab-menu/siste-tab';
import { TourModalController } from './tour-modal/tour-modal-controller';
import './side-innhold.less';

interface SideInnholdLayoutProps {
    visittkort: React.ReactElement;
    mao: React.ReactElement;
    aktivitetsplan: React.ReactElement;
    dialog?: React.ReactElement
    vedtaksstotte?: React.ReactElement;
    features: Features;
    fnr: string;
}

export const TAG_AKTIVITETSPLAN = 'aktivitetsplan';
export const TAG_DIALOG = 'dialog';
export const TAG_VEDTAKSSTOTTE = 'vedtaksstotte';
export const TAG_DETALJER = 'detaljer';

class SideInnhold extends React.Component<SideInnholdLayoutProps> {

    render () {
        const { visittkort, aktivitetsplan, dialog, vedtaksstotte, mao, features, fnr } = this.props;

        const tabs: Tab[] = [{ tag: TAG_AKTIVITETSPLAN, title: 'Aktivitetsplan og dialog', content: aktivitetsplan }];

        if (dialog && features[VIS_NY_DIALOG]) {
            tabs.push({
                tag: TAG_DIALOG,
                title: 'Dialog',
                content: dialog
            });
        }

        tabs.push({ tag: TAG_DETALJER, title: 'Detaljer', content: mao});

        if (vedtaksstotte && features[VIS_VEDTAKSSTOTTE]) {
            tabs.push({
                tag: TAG_VEDTAKSSTOTTE,
                title: 'Oppfølgingsvedtak',
                className: "tab-content__vedtaksstotte",
                content: vedtaksstotte
            });
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
                <TourModalController features={features}/>
                <TilbakemeldingFab features={features} />
            </>
        );
    }
}

export default SideInnhold;
