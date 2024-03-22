import { useEventListener } from './util/utils';
import { Application, applications, defaultApplication } from './data/applications';
import { useAppContext } from './SupAppContext';
import { AppId } from './data/tab-id';
import { useCallback } from 'react';

export const NAVIGATE_EVENT = 'veilarbpersonflate.navigate';

export const appFromPath = (path: string): Application => {
	return applications.find(it => path.startsWith(it.pathEntrypoint)) || defaultApplication;
};

export const Router = () => {
	const { setCurrentAppId, currentAppId } = useAppContext();

	const changeApplication = () => {
		const newApp = appFromPath(window.location.pathname);
		if (currentAppId === newApp.id) return;
		setCurrentAppId(newApp.id);
	};

	const visAktivitetsplan = useCallback(() => setCurrentAppId(AppId.AKTIVITETSPLAN), [])
	const visDialog = useCallback(() => setCurrentAppId(AppId.DIALOG), [])

	useEventListener(NAVIGATE_EVENT, changeApplication);
	useEventListener('visAktivitetsplan', visAktivitetsplan);
	useEventListener('visDialog', visDialog);

	const application = applications.find(app => app.id === currentAppId) || defaultApplication;
	return <application.component />;
};
