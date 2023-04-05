import StoreProvider from './store/store-provider';
import { PersonflatePage } from './page/personflate';
import './sentry';

export const App = () => {
	return (
		<StoreProvider>
			<PersonflatePage />
		</StoreProvider>
	);
};
