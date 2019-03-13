import React from 'react';
import TabMenu, { Tab } from './tab-menu/tab-menu';
import TourModal, { Step } from './tour-modal/tour-modal';
import step1Bilde from './tour-modal/step-1.jpg';
import step2Bilde from './tour-modal/step-2.jpg';
import step3Bilde from './tour-modal/step-3.jpg';
import './side-innhold-ny-layout.less';

interface SideInnholdNyLayoutProps {
    visittkort: React.ReactElement;
    mao: React.ReactElement;
    aktivitetsplan: React.ReactElement;
}

const steps: Step[] = [
    { tittel: 'Visittkort', bilde: step1Bilde, tekst: 'tekst1'},
    { tittel: 'Veilederverktøy', bilde: step2Bilde, tekst: 'tekst2'},
    { tittel: 'Fane', bilde: step3Bilde, tekst: 'tekst3'},
];

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
        const { visittkort, aktivitetsplan, mao } = this.props;

        const tabs: Tab[] = [
            { title: 'Aktivitetsplan', content: aktivitetsplan },
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
                <TourModal open={true} steps={steps}/>
            </>
        );
    }
}

export default SideInnholdNyLayout;
