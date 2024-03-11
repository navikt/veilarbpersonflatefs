import { Tabs } from '@navikt/ds-react';
import { useAppContext } from '../../AppContext';
import { UlesteDialoger } from '../tab-menu/dialog-tab/UlesteDialoger';
import { useModiaContext } from '../../store/modia-context-store';
import { useEventListener } from '../../util/utils';
import { appIdToTabId, TabId, tabIdToAppId } from '../../data/tab-id';
import { applications } from '../../data/applications';
import { logEvent } from '../../util/frontend-logger';
import { logValgtFane } from '../../amplitude/amplitude';

const TabMenu = () => {

	const {
		currentAppId,
		setCurrentAppId
	} = useAppContext();

	const {
		aktivEnhetId
	} = useModiaContext();

	// Et lite unntak mens Team Valp venter på PVO
	const vikafossenIkkeErValgtSomEnhet = () => {
		const vikafossen = '2103';
		return aktivEnhetId && aktivEnhetId !== vikafossen;
	};

	const changeTab = (newTabId: TabId, extraDetails?: Event) => {

		setCurrentAppId(tabIdToAppId[newTabId]);
		logEvent('veilarbpersonflatefs.valgt-fane', { tabId: newTabId });
		logValgtFane(newTabId);

		const extra = !!extraDetails ? (extraDetails as CustomEvent).detail : {};
		window.dispatchEvent(new CustomEvent('veilarbpersonflatefs.tab-clicked', { detail: { tabId: newTabId, ...extra } }));
	};

	const changeApplication = (newTabId: TabId) => {
		const application = applications.find((it) => it.tabId === newTabId);
		if (!application) throw Error('Det finnes ikke en side for ' + newTabId);

		changeTab(newTabId);
		window.history.pushState(null, '', application.pathEntrypoint);
		window.dispatchEvent(new PopStateEvent('popstate'));
	};

	useEventListener('visAktivitetsplan', () => changeTab(TabId.AKTIVITETSPLAN));
	useEventListener('visDialog', event => changeTab(TabId.DIALOG, event));

	useEventListener('veilarbpersonflatefs.setAktivitetsplanTab', () => changeTab(TabId.AKTIVITETSPLAN));
	useEventListener('veilarbpersonflatefs.setDialogTab', event => changeTab(TabId.DIALOG, event));
	useEventListener('veilarbpersonflatefs.setOverblikkTab', () => changeTab(TabId.OVERBLIKK));
	useEventListener('veilarbpersonflatefs.setVedtakstotteTab', () => changeTab(TabId.VEDTAKSSTOTTE));
	useEventListener('veilarbpersonflatefs.setArbeidsmarkedstiltakTab', () => changeTab(TabId.ARBEIDSMARKEDSTILTAK));

	return (
		<div className="tab-menu">
			<Tabs size="small" className="tab-menu__content" value={appIdToTabId[currentAppId]}>
				<Tabs.List className="tab-menu__tablist-element">
					<Tabs.Tab
						label="Aktivitetsplan"
						key={TabId.AKTIVITETSPLAN}
						value={TabId.AKTIVITETSPLAN}
						onClick={() => changeApplication(TabId.AKTIVITETSPLAN)}
					/>
					<Tabs.Tab
						label="Dialog"
						key={TabId.DIALOG}
						value={TabId.DIALOG}
						onClick={() => changeApplication(TabId.DIALOG)}
						icon={<UlesteDialoger />}
					/>
					<Tabs.Tab
						label="Overblikk"
						key={TabId.OVERBLIKK}
						value={TabId.OVERBLIKK}
						onClick={() => changeApplication(TabId.OVERBLIKK)}
					/>
					<Tabs.Tab
						label="Oppfølgingsvedtak"
						key={TabId.VEDTAKSSTOTTE}
						value={TabId.VEDTAKSSTOTTE}
						onClick={() => changeApplication(TabId.VEDTAKSSTOTTE)}
					/>

					{vikafossenIkkeErValgtSomEnhet() && (
						<Tabs.Tab
							label="Arbeidsmarkedstiltak"
							key={TabId.ARBEIDSMARKEDSTILTAK}
							value={TabId.ARBEIDSMARKEDSTILTAK}
							onClick={() => changeApplication(TabId.ARBEIDSMARKEDSTILTAK)}
						/>
					)}

					<Tabs.Tab
						label="Finn stillinger"
						key={TabId.FINN_STILLING_INNGANG}
						value={TabId.FINN_STILLING_INNGANG}
						onClick={() => changeTab(TabId.FINN_STILLING_INNGANG)}
					/>
				</Tabs.List>
			</Tabs>
		</div>
	);
};

export default TabMenu;
