import { useEventListener } from './util/utils';
import { Application, applications, defaultApplication } from './data/applications';
import { useAppContext } from './AppContext';
import { AppId } from './data/tab-id';

export const NAVIGATE_EVENT = 'veilarbpersonflate.navigate';

const appFromPath = (path: string): Application => {
	return applications.find(it => path.startsWith(it.pathEntrypoint)) || defaultApplication;
};

export const Router = () => {
	const { setCurrentAppId, currentAppId } = useAppContext();

	const changeApplication = (path: string) => {
		const newApp = appFromPath(path);
		if (currentAppId === newApp.id) return;
		setCurrentAppId(newApp.id);
	};

	useEventListener(NAVIGATE_EVENT, () => changeApplication(window.location.pathname));
	useEventListener('visAktivitetsplan', () => setCurrentAppId(AppId.AKTIVITETSPLAN));
	useEventListener('visDialog', event => setCurrentAppId(AppId.DIALOG));

	const application = applications.find(app => app.id === currentAppId) || defaultApplication;
	return <application.component />;
};
