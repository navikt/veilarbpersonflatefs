import React from 'react';
import TabMenu, { Tab } from './tab-menu/tab-menu';
import { Features } from '../api/features';
import TilbakemeldingFab from './tilbakemelding/fab/tilbakemelding-fab';
import { hentSistBesokteTab } from './tab-menu/siste-tab';
import { TourModalController } from './tour-modal/tour-modal-controller';
import { hasHashParam, hasQueryParam } from '../util/url-utils';

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

/*
	Contains the mapping between hash param keys and the TabId that will be selected
	Ex: http://<domain>/<path>#visDetaljer
*/
const showTabMap: { [k: string]: TabId } = {
	visAktivitetsplan: TabId.AKTIVITETSPLAN,
	visDialog: TabId.DIALOG,
	visVedtaksstotte: TabId.VEDTAKSSTOTTE,
	visDetaljer: TabId.DETALJER
};

class SideInnhold extends React.Component<SideInnholdLayoutProps> {
	getTabFromHashParam(): TabId | undefined {
		const tabKey = Object.keys(showTabMap).find(key => hasHashParam(key));
		return tabKey ? showTabMap[tabKey] : undefined;
	}

	getDefaultTab() {
		const { fnr } = this.props;
		const tabFromHashParam = this.getTabFromHashParam();
		// TODO: Remove when arbeidssokerregistrering uses hash params
		//  https://github.com/navikt/arbeidssokerregistrering/blob/208caec7acda07cf896b822edc6f466637dabd07/src/utils/url-utils.ts
		const visDetaljer = hasQueryParam('visRegistreringDetaljer');
		const sisteBesokteTab = hentSistBesokteTab(fnr);
		let defaultSelectedTab = TabId.AKTIVITETSPLAN;

		if (tabFromHashParam) {
			defaultSelectedTab = tabFromHashParam;
		} else if (visDetaljer) {
			defaultSelectedTab = TabId.DETALJER;
		} else if (sisteBesokteTab) {
			defaultSelectedTab = sisteBesokteTab;
		}

		return defaultSelectedTab;
	}

	render() {
		const { visittkort, aktivitetsplan, dialog, vedtaksstotte, mao, features, fnr } = this.props;
		const tabs: Tab[] = [];

		const aktivitet = {
			id: TabId.AKTIVITETSPLAN,
			title: 'Aktivitetsplan',
			content: aktivitetsplan,
			className: 'tab-menu__tab-content--aktivitetsplan' // TODO: Aktivitetsplan burde sette margin-top selv
		};

		if (dialog) {
			tabs.push(aktivitet);
			tabs.push({
				id: TabId.DIALOG,
				title: 'Dialog',
				content: dialog
			});
		} else {
			tabs.push({ ...aktivitet, title: 'Aktivitetsplan og dialog' });
		}

		tabs.push({ id: TabId.DETALJER, title: 'Detaljer', content: mao });

		tabs.push({
			id: TabId.VEDTAKSSTOTTE,
			title: 'Oppfølgingsvedtak',
			content: vedtaksstotte,
			className: 'tab-menu__tab-content--vedtaksstotte'
		});

		return (
			<>
				{visittkort}
				<TabMenu fnr={fnr} tabs={tabs} defaultSelectedTab={this.getDefaultTab()} skulGammelDialog={!!dialog} />
				<TourModalController features={features} />
				<TilbakemeldingFab features={features} />
			</>
		);
	}
}

export default SideInnhold;
