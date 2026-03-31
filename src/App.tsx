import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import StoreProvider from './store/store-provider';
import { PersonflatePage } from './page/personflate';
import './sentry';

const queryClient = new QueryClient();

const App = () => {
	return (
		<QueryClientProvider client={queryClient}>
			<StoreProvider>
				<PersonflatePage />
			</StoreProvider>
		</QueryClientProvider>
	);
};

export default App;
