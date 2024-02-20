import StoreProvider from './store/store-provider';
import { PersonflatePage } from './page/personflate';
import './sentry';
import { AppContextProvider } from './AppContext';

//TODO add to existing store
const App = () => {
	return (
		<StoreProvider>
			<AppContextProvider>
				<PersonflatePage />
			</AppContextProvider>
		</StoreProvider>
	);
};

export default App;
