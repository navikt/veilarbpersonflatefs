import React from 'react';
import { OboUnleashFeatures, VIS_GAMLE_DETALJER_FANE } from '../api/features';
import { ModiaContext } from '../store/modia-context-store';
import { hasHashParam, hasQueryParam } from '../util/url-utils';
import {
	Aktivitetsplan,
	Arbeidsmarkedstiltak,
	Detaljer,
	DetaljerNy,
	Dialog,
	FinnStillingInngang,
	Vedtaksstotte,
	Visittkort
} from './spa';
import { hentSistBesokteTab } from './tab-menu/siste-tab';
import TabMenu, { Tab } from './tab-menu/tab-menu';

interface SideInnholdLayoutProps {
	oboUnleashFeatures?: OboUnleashFeatures;
}

export enum TabId {
	AKTIVITETSPLAN = 'AKTIVITETSPLAN',
	DIALOG = 'DIALOG',
	VEDTAKSSTOTTE = 'VEDTAKSSTOTTE',
	DETALJER = 'DETALJER',
	OVERBLIKK = 'OVERBLIKK',
	ARBEIDSMARKEDSTILTAK = 'ARBEIDSMARKEDSTILTAK',
	FINN_STILLING_INNGANG = 'FINN_STILLING_INNGANG'
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
	visDetaljerNy: TabId.OVERBLIKK,
	visArbeidsmarkedstiltak: TabId.ARBEIDSMARKEDSTILTAK,
	visFinnStillingInngang: TabId.FINN_STILLING_INNGANG
};

const apps = {
	mao: Detaljer,
	detaljer_ny: DetaljerNy,
	aktivitetsplan: Aktivitetsplan,
	vedtaksstotte: Vedtaksstotte,
	dialog: Dialog,
	arbeidsmarkedstiltak: Arbeidsmarkedstiltak,
	finnStillingInngang: FinnStillingInngang
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
			defaultSelectedTab = TabId.OVERBLIKK;
		} else if (sisteBesokteTab) {
			defaultSelectedTab = sisteBesokteTab;
		}

		// @ts-ignore
		window.defaultSelectedTab = defaultSelectedTab;

		return defaultSelectedTab;
	}

	render() {
		const { aktivBrukerFnr, aktivEnhetId } = this.context;
		const { oboUnleashFeatures } = this.props;
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

		tabs.push({
			id: TabId.OVERBLIKK,
			title: 'Overblikk',
			content: apps.detaljer_ny
		});

		if (oboUnleashFeatures?.[VIS_GAMLE_DETALJER_FANE]) {
			tabs.push({ id: TabId.DETALJER, title: 'Detaljer', content: apps.mao });
		}

		tabs.push({
			id: TabId.VEDTAKSSTOTTE,
			title: 'Oppfølgingsvedtak',
			content: apps.vedtaksstotte,
			className: 'tab-menu__tab-content--vedtaksstotte'
		});

		if (vikafossenIkkeErValgtSomEnhet(aktivEnhetId)) {
			tabs.push({
				id: TabId.ARBEIDSMARKEDSTILTAK,
				title: 'Arbeidsmarkedstiltak',
				content: apps.arbeidsmarkedstiltak
			});
		}

		tabs.push({
			id: TabId.FINN_STILLING_INNGANG,
			title: 'Finn stillinger',
			content: apps.finnStillingInngang
		});

		return (
			<>
				<Visittkort
					enhet={aktivEnhetId ?? undefined}
					fnr={aktivBrukerFnr}
					visVeilederVerktoy={true}
					tilbakeTilFlate="veilarbportefoljeflatefs"
				/>
				<TabMenu tabs={tabs} defaultSelectedTab={this.getDefaultTab()} />
			</>
		);
	}
}

function vikafossenIkkeErValgtSomEnhet(enhet: string | null) {
	// Et lite unntak mens Team Valp venter på PVO
	const vikafossen = '2103';
	return enhet && enhet !== vikafossen;
}

export default SideInnhold;
