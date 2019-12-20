import React from 'react';
import TabMenu, { Tab } from './tab-menu/tab-menu';
import { Features } from '../utils/feature-utils';
import TilbakemeldingFab from './tilbakemelding/fab/tilbakemelding-fab';
import { hentSistBesokteTab } from './tab-menu/siste-tab';
import { TourModalController } from './tour-modal/tour-modal-controller';

interface SideInnholdLayoutProps {
	visittkort: React.ReactElement;
	mao: React.ReactElement;
	aktivitetsplan: React.ReactElement;
	dialog?: React.ReactElement;
	vedtaksstotte: React.ReactElement;
	features: Features;
	fnr: string;
}

export enum TabId {
	AKTIVITETSPLAN = 'AKTIVITETSPLAN',
	DIALOG = 'DIALOG',
	VEDTAKSSTOTTE = 'VEDTAKSSTOTTE',
	DETALJER = 'DETALJER'
}

class SideInnhold extends React.Component<SideInnholdLayoutProps> {
	render() {
		const { visittkort, aktivitetsplan, dialog, vedtaksstotte, mao, features, fnr } = this.props;

		const tabs: Tab[] = [
			{
				id: TabId.AKTIVITETSPLAN,
				title: 'Aktivitetsplan og dialog',
				content: aktivitetsplan,
				className: 'tab-menu__tab-content--aktivitetsplan' // TODO: Aktivitetsplan burde sette margin-top selv
			}
		];

		if (dialog) {
			tabs.push({
				id: TabId.DIALOG,
				title: 'Dialog',
				content: dialog
			});
		}

		tabs.push({ id: TabId.DETALJER, title: 'Detaljer', content: mao });

		tabs.push({
			id: TabId.VEDTAKSSTOTTE,
			title: 'Oppfølgingsvedtak',
			content: vedtaksstotte
		});

		const visDetaljer = window.location.search.indexOf('visRegistreringDetaljer') >= 0;
		const sisteBesokteTab = hentSistBesokteTab(fnr);
		let defaultSelectedTab = TabId.AKTIVITETSPLAN;

		if (visDetaljer) {
			defaultSelectedTab = TabId.DETALJER;
		} else if (sisteBesokteTab) {
			defaultSelectedTab = sisteBesokteTab;
		}

		return (
			<>
				{visittkort}
				<TabMenu fnr={fnr} tabs={tabs} defaultSelectedTab={defaultSelectedTab} />
				<TourModalController features={features} />
				<TilbakemeldingFab features={features} />
			</>
		);
	}
}

export default SideInnhold;
