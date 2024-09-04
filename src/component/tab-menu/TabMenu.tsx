import { Tabs } from '@navikt/ds-react';
import { logAmplitudeEvent } from '../../amplitude/amplitude';
import { applications } from '../../data/applications';
import { AppId, appIdToTabId, TabId } from '../../data/tab-id';
import { useAppContext } from '../../SupAppContext';
import { logEvent } from '../../util/frontend-logger';
import { UlesteDialoger } from './dialog-tab/UlesteDialoger';
import './tab-menu.less';

const TabMenu = () => {
	const { currentAppId } = useAppContext();

	const changeApplication = (appId: AppId) => {
		const application = applications.find(app => app.id === appId);

		if (!application) throw Error('Det finnes ikke en side for ' + appId);

		if (application.id === currentAppId) return;

		dispatchTabClickedEvent(application.tabId);

		dispatchNavigateEvent(application.pathEntrypoint);
	};

	return (
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
				<Tabs.Tab
					label="Arbeidsmarkedstiltak"
					key={TabId.ARBEIDSMARKEDSTILTAK}
					value={TabId.ARBEIDSMARKEDSTILTAK}
					onClick={() => changeApplication(AppId.ARBEIDSMARKEDSTILTAK)}
				/>
				<Tabs.Tab
					label="Finn stillinger"
					key={TabId.FINN_STILLING_INNGANG}
					value={TabId.FINN_STILLING_INNGANG}
					onClick={() => changeApplication(AppId.FINN_STILLING_INNGANG)}
				/>
			</Tabs.List>
		</Tabs>
	);
};

function dispatchTabClickedEvent(tabId: TabId) {
	logEvent('veilarbpersonflatefs.valgt-fane', { tabId });
	logAmplitudeEvent('tab åpnet', { tabId });
	window.dispatchEvent(new CustomEvent('veilarbpersonflatefs.tab-clicked', { detail: { tabId } }));
}

function dispatchNavigateEvent(path: string) {
	window.history.pushState(null, '', path);
	window.dispatchEvent(new CustomEvent('veilarbpersonflate.navigate'));
}

export default TabMenu;
