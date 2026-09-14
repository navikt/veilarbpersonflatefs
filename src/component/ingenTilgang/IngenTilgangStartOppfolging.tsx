import { useState } from 'react';
import { BodyShort, Button, Checkbox, Heading } from '@navikt/ds-react';
import { logAnalyticsEvent } from '../../analytics/analytics';
import { EnvType, getEnv } from '../../util/utils';

interface IngenTilgangStartOppfolgingProps {
	aktivEnhetNavn: string;
}

export const IngenTilgangStartOppfolging = ({ aktivEnhetNavn }: IngenTilgangStartOppfolgingProps) => {
	const [harHuketAvForAStarteOppfolging, setHarHuketAvForAStarteOppfolging] = useState(false);

	return (
		<div className="ingen-tilgang-innhold">
			<Heading size="medium" className="ingen-tilgang-heading">
				Ikke tilgang til bruker
			</Heading>
			<BodyShort>
				Du har ikke tilgang til bruker, men kan starte oppfølging ved {aktivEnhetNavn} dersom brukeren skal
				følges opp av {aktivEnhetNavn}.
			</BodyShort>
			<Checkbox
				onChange={() => setHarHuketAvForAStarteOppfolging(!harHuketAvForAStarteOppfolging)}
				className="flytt-bruker-checkbox"
			>
				Ja, bruker skal følges opp av {aktivEnhetNavn} (det tar minst en halvtime før du får tilgang til bruker)
			</Checkbox>
			<Button
				disabled={!harHuketAvForAStarteOppfolging}
				className="ingen-tilgang-knapp"
				onClick={() => {
					logAnalyticsEvent('knapp klikket', {
						tekst: 'start-arbeidsoppfolging'
					});
					window.location.assign(startArbeidsoppfolgingUrl);
				}}
				variant="secondary"
			>
				Gå videre
			</Button>
		</div>
	);
};

const env = getEnv();
const startArbeidsoppfolgingUrlPerMiljo: Record<`${EnvType}-${'ansatt' | 'intern'}`, string> = {
	[`${EnvType.prod}-ansatt`]: '??',
	[`${EnvType.dev}-ansatt`]: 'https://start-arbeidsoppfolging.ansatt.dev.nav.no',
	[`${EnvType.local}-ansatt`]: 'https://start-arbeidsoppfolging.ansatt.dev.nav.no',
	[`${EnvType.prod}-intern`]: 'https://start-arbeidsoppfolging.intern.nav.no',
	[`${EnvType.dev}-intern`]: 'https://inngar.intern.dev.nav.no',
	[`${EnvType.local}-intern`]: 'https://inngar.intern.dev.nav.no'
};
const startArbeidsoppfolgingUrl = startArbeidsoppfolgingUrlPerMiljo[`${env.type}-${env.ingressType}`];
