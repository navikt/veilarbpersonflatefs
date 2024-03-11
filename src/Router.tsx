import { useEffect, useState } from 'react';
import { useEventListener } from './util/utils';
import { Application, applications, defaultApplication } from './data/applications';
import { useAppContext } from './AppContext';

export const Router = () => {
	const { setCurrentAppId } = useAppContext();

	const [application, setApplication] = useState<undefined | Application>(undefined);

	const changeApplication = (path: string) => {
		const newApp = applications.find((it) => path.startsWith(it.pathEntrypoint));

		if (newApp === undefined) {
			setCurrentAppId(defaultApplication.id);
			setApplication(defaultApplication);
		}

		if (application === newApp) return;

		if (newApp) {
			setCurrentAppId(newApp.id);
			setApplication(newApp);
		}
	};

	useEffect(() => {
		changeApplication(window.location.pathname);
	}, []);

	useEventListener('popstate', () => {
		changeApplication(window.location.pathname);
	});

	return (
		<div>
			{application && <application.component />}
		</div>
	);


};
