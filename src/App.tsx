import { SWRConfig } from 'swr';
import StoreProvider from './store/store-provider';
import { PersonflatePage } from './page/personflate';
import { ErrorBoundary } from './component/error-boundary/ErrorBoundary';
import { HttpError } from './api/utils';
import './sentry';

const App = () => {
	return (
		<ErrorBoundary>
			<SWRConfig
				value={{
					onErrorRetry: (error, _key, _config, revalidate, { retryCount }) => {
						if (error instanceof HttpError && error.status >= 400 && error.status < 500) return; // Dont retry on 4xx errors
						if (retryCount >= 2) return;
						setTimeout(() => revalidate({ retryCount }), 5000);
					}
				}}
			>
				<StoreProvider>
					<PersonflatePage />
				</StoreProvider>
			</SWRConfig>
		</ErrorBoundary>
	);
};

export default App;
