import { useEffect, useState } from 'react';
import { useEventListener } from './util/utils';
import { Application, applications, defaultApplication } from './data/applications';
import { useAppContext } from './AppContext';

export const Router = () => {
	const { setCurrentTabId } = useAppContext();

	const [application, setApplication] = useState<undefined | Application>(undefined);

	const changeApplication = (path: string) => {
		const newApp = applications.find((it) => path.startsWith(it.pathEntrypoint));
		if (newApp) {
			setCurrentTabId(newApp.tabId);
			setApplication(newApp);
		} else {
			setCurrentTabId(defaultApplication.tabId);
			setApplication(defaultApplication);
		}
	};

	useEffect(() => {
		changeApplication(window.location.pathname);
	}, []);

	useEventListener('popstate', () => {
		console.log('POPSTATE', window.location.pathname);
		changeApplication(window.location.pathname);
	});

	return (
		<div>
			<div>Current Path: {window.location.pathname}</div>
			{application && <application.component />}
		</div>
	);


};
