import { useEffect, useState } from 'react';
import { useEventListener } from './util/utils';
import { Application, applications, defaultApplication } from './data/applications';
import { useAppContext } from './AppContext';
import { TabId, tabIdToAppId } from './data/tab-id';
import { logEvent } from './util/frontend-logger';
import { logValgtFane } from './amplitude/amplitude';

export const NAVIGATE_EVENT = 'veilarbpersonflate.navigate';

export const Router = () => {
	const { setCurrentAppId } = useAppContext();

	const [application, setApplication] = useState<undefined | Application>(undefined);

	const changeApplication = (path: string) => {
		const newApp = applications.find((it) => path.startsWith(it.pathEntrypoint));

		if (newApp === undefined) {
			console.log(path + ' No app found, using ' + defaultApplication.id);
			setCurrentAppId(defaultApplication.id);
			setApplication(defaultApplication);
		}

		if (application === newApp) return;

		if (newApp) {
			console.log(path + ' Changing app to ' + newApp.id);
			setCurrentAppId(newApp.id);
			setApplication(newApp);
		}
	};

	const changeTab = (newTabId: TabId, extraDetails?: Event) => {

		setCurrentAppId(tabIdToAppId[newTabId]);
		logEvent('veilarbpersonflatefs.valgt-fane', { tabId: newTabId });
		logValgtFane(newTabId);

		const extra = !!extraDetails ? (extraDetails as CustomEvent).detail : {};
		window.dispatchEvent(new CustomEvent('veilarbpersonflatefs.tab-clicked', { detail: { tabId: newTabId, ...extra } }));
	};


	useEffect(() => {
		changeApplication(window.location.pathname);
	}, []);

	useEventListener(NAVIGATE_EVENT, () => {
		changeApplication(window.location.pathname);
	});

	useEventListener('visAktivitetsplan', () => changeTab(TabId.AKTIVITETSPLAN));
	useEventListener('visDialog', event => changeTab(TabId.DIALOG, event));

	return (
		<div>
			{application && <application.component />}
		</div>
	);


};
