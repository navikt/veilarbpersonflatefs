declare module 'react' {
	namespace JSX {
		interface IntrinsicElements {
			'internarbeidsflate-decorator': React.DetailedHTMLProps<
				React.HTMLAttributes<HTMLElement> &
					React.RefAttributes<HTMLElement> & {
						'app-name': string;
						'enhet-sync-mode'?: 'sync' | 'writeOnly' | 'ignore';
						environment: 'q0' | 'q1' | 'q2' | 'q3' | 'q4' | 'prod' | 'local' | 'mock';
						enhet?: string;
						'fetch-active-enhet-on-mount'?: boolean;
						'fetch-active-user-on-mount'?: boolean;
						fnr?: string;
						'fnr-sync-mode'?: 'sync' | 'writeOnly' | 'ignore';
						proxy?: string;
						'show-enheter'?: boolean;
						'show-search-area'?: boolean;
						'url-format': 'LOCAL' | 'NAV_NO' | 'ANSATT';
					},
				HTMLElement
			>;
		}
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'internarbeidsflate-decorator': HTMLElement;
	}
}

export {};
