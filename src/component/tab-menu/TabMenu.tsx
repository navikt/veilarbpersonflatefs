import { Tabs } from '@navikt/ds-react';
import { useAppContext } from '../../SupAppContext';
import { UlesteDialoger } from './dialog-tab/UlesteDialoger';
import { useModiaContext } from '../../store/modia-context-store';
import { AppId, appIdToTabId, TabId } from '../../data/tab-id';
import { applications } from '../../data/applications';
import { logEvent } from '../../util/frontend-logger';
import { logValgtFane } from '../../amplitude/amplitude';

const vikafossenIkkeErValgtSomEnhet = (aktivEnhetId: string | null) => {
	const vikafossen = '2103';
	return aktivEnhetId && aktivEnhetId !== vikafossen;
};

const TabMenu = () => {
	const { currentAppId } = useAppContext();
	const { aktivEnhetId } = useModiaContext();

	const changeApplication = (appId: AppId) => {
		const application = applications.find(app => app.id === appId);

		if (!application) throw Error('Det finnes ikke en side for ' + appId);
		if (application.id === currentAppId) return;

		logEvent('veilarbpersonflatefs.valgt-fane', { tabId: application.tabId });
		logValgtFane(application.tabId);
		window.dispatchEvent(new CustomEvent('veilarbpersonflatefs.tab-clicked', { detail: { tabId: application.tabId } }));

		window.history.pushState(null, '', application.pathEntrypoint);
		window.dispatchEvent(new CustomEvent('veilarbpersonflate.navigate'))
	};

	return (
		<div className="tab-menu">
			<Tabs size="small" className="tab-menu__content" value={appIdToTabId[currentAppId]}>
				<Tabs.List className="tab-menu__tablist-element">
					<Tabs.Tab
						label="Aktivitetsplan"
						key={TabId.AKTIVITETSPLAN}
						value={TabId.AKTIVITETSPLAN}
						onClick={() => changeApplication(AppId.AKTIVITETSPLAN)}
					/>
					<Tabs.Tab
						label="Dialog"
						key={TabId.DIALOG}
						value={TabId.DIALOG}
						onClick={() => changeApplication(AppId.DIALOG)}
						icon={<UlesteDialoger />}
					/>
					<Tabs.Tab
						label="Overblikk"
						key={TabId.OVERBLIKK}
						value={TabId.OVERBLIKK}
						onClick={() => changeApplication(AppId.OVERBLIKK)}
					/>
					<Tabs.Tab
						label="Oppfølgingsvedtak"
						key={TabId.VEDTAKSSTOTTE}
						value={TabId.VEDTAKSSTOTTE}
						onClick={() => changeApplication(AppId.VEDTAKSSTOTTE)}
					/>

					{vikafossenIkkeErValgtSomEnhet(aktivEnhetId) && (
						<Tabs.Tab
							label="Arbeidsmarkedstiltak"
							key={TabId.ARBEIDSMARKEDSTILTAK}
							value={TabId.ARBEIDSMARKEDSTILTAK}
							onClick={() => changeApplication(AppId.ARBEIDSMARKEDSTILTAK)}
						/>
					)}

					<Tabs.Tab
						label="Finn stillinger"
						key={TabId.FINN_STILLING_INNGANG}
						value={TabId.FINN_STILLING_INNGANG}
						onClick={() => changeApplication(AppId.FINN_STILLING_INNGANG)}
					/>
				</Tabs.List>
			</Tabs>
		</div>
	);
};

export default TabMenu;
