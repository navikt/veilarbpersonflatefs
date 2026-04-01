import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import StoreProvider from './store/store-provider';
import { PersonflatePage } from './page/personflate';
import { ErrorBoundary } from './component/error-boundary/ErrorBoundary';
import { HttpError } from './api/utils';
import './sentry';

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			retry: (failureCount, error) => {
				if (error instanceof HttpError && error.status >= 400 && error.status < 500) return false;
				return failureCount < 2;
			},
		},
	},
});

const App = () => {
	return (
		<ErrorBoundary>
			<QueryClientProvider client={queryClient}>
				<StoreProvider>
					<PersonflatePage />
				</StoreProvider>
			</QueryClientProvider>
		</ErrorBoundary>
	);
};

export default App;
