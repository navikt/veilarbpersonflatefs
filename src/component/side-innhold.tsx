import React from 'react';
import TabMenu, { Tab } from './tab-menu/tab-menu';
import {ARBEIDSMARKEDSTILTAK_LANSERING, Features, VEILARBDETALJERFS_ENABLED} from '../api/features';
import TilbakemeldingFab from './tilbakemelding/fab/tilbakemelding-fab';
import { hentSistBesokteTab } from './tab-menu/siste-tab';
import { TourModalController } from './tour-modal/tour-modal-controller';
import { hasHashParam, hasQueryParam } from '../util/url-utils';
import { Aktivitetsplan, Arbeidsmarkedstiltak, Detaljer, DetaljerNy, Dialog, Vedtaksstotte, Visittkort } from './spa';
import { ModiaContext } from '../store/modia-context-store';

interface SideInnholdLayoutProps {
	features?: Features;
}

export enum TabId {
	AKTIVITETSPLAN = 'AKTIVITETSPLAN',
	DIALOG = 'DIALOG',
	VEDTAKSSTOTTE = 'VEDTAKSSTOTTE',
	DETALJER = 'DETALJER',
	DETALJER_NY = 'DETALJER_NY',
	ARBEIDSMARKEDSTILTAK = 'ARBEIDSMARKEDSTILTAK'
}

/*
	Contains the mapping between hash param keys and the TabId that will be selected
	Ex: http://<domain>/<path>#visDetaljer
*/
const showTabMap: { [k: string]: TabId } = {
	visAktivitetsplan: TabId.AKTIVITETSPLAN,
	visDialog: TabId.DIALOG,
	visVedtaksstotte: TabId.VEDTAKSSTOTTE,
	visDetaljer: TabId.DETALJER,
    visDetaljerNy: TabId.DETALJER_NY,
	visArbeidsmarkedstiltak: TabId.ARBEIDSMARKEDSTILTAK
};

const apps = {
	mao: Detaljer,
    detaljer_ny: DetaljerNy,
	aktivitetsplan: Aktivitetsplan,
	vedtaksstotte: Vedtaksstotte,
	dialog: Dialog,
	arbeidsmarkedstiltak: Arbeidsmarkedstiltak
};

class SideInnhold extends React.Component<SideInnholdLayoutProps> {
	static contextType = ModiaContext;
	context!: React.ContextType<typeof ModiaContext>;

	getTabFromHashParam(): TabId | undefined {
		const tabKey = Object.keys(showTabMap).find(key => hasHashParam(key));
		return tabKey ? showTabMap[tabKey] : undefined;
	}

	getDefaultTab() {
		const { aktivBrukerFnr: fnr } = this.context;
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

		window.defaultSelectedTab = defaultSelectedTab;

		return defaultSelectedTab;
	}

	render() {
		const { aktivBrukerFnr, aktivEnhetId } = this.context;
		const { features } = this.props;
		const tabs: Tab[] = [];

		tabs.push({
			id: TabId.AKTIVITETSPLAN,
			title: 'Aktivitetsplan',
			content: apps.aktivitetsplan
		});
		tabs.push({
			id: TabId.DIALOG,
			title: 'Dialog',
			content: apps.dialog
		});
		tabs.push({ id: TabId.DETALJER, title: 'Detaljer', content: apps.mao });
		tabs.push({
			id: TabId.VEDTAKSSTOTTE,
			title: 'Oppfølgingsvedtak',
			content: apps.vedtaksstotte,
			className: 'tab-menu__tab-content--vedtaksstotte'
		});

		if (features?.[ARBEIDSMARKEDSTILTAK_LANSERING]) {
			tabs.push({
				id: TabId.ARBEIDSMARKEDSTILTAK,
				title: 'Arbeidsmarkedstiltak',
				content: apps.arbeidsmarkedstiltak
			});
		}

		if(features?.[VEILARBDETALJERFS_ENABLED]) {
			tabs.push({
				id: TabId.DETALJER_NY,
				title: 'Detaljer (NY)',
				content: apps.detaljer_ny
			});
		}

		return (
			<>
				<Visittkort
					enhet={aktivEnhetId ?? undefined}
					fnr={aktivBrukerFnr}
					visVeilederVerktoy={true}
					tilbakeTilFlate="veilarbportefoljeflatefs"
				/>
				<TabMenu tabs={tabs} defaultSelectedTab={this.getDefaultTab()} />
				<TourModalController features={features} />
				<TilbakemeldingFab features={features} />
			</>
		);
	}
}

export default SideInnhold;
