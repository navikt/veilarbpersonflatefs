declare module 'react' {
	namespace JSX {
		interface IntrinsicElements {
			'internarbeidsflate-decorator': {
				'app-name': string;
				'enhet-sync-mode'?: 'sync' | 'writeOnly' | 'ignore';
				environment: 'q0' | 'q1' | 'q2' | 'q3' | 'q4' | 'prod' | 'local' | 'mock';
				'fnr-sync-mode'?: 'sync' | 'writeOnly' | 'ignore';
				fnr?: string;
				proxy?: string;
				'url-format': 'LOCAL' | 'NAV_NO' | 'ANSATT';
			};
		}
	}
}

export {};
