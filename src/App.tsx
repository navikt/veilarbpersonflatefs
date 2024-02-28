import StoreProvider from './store/store-provider';
import { PersonflatePage } from './page/personflate';
import './sentry';

const App = () => {
	return (
		<StoreProvider>
				<PersonflatePage />
		</StoreProvider>
	);
};

export default App;
