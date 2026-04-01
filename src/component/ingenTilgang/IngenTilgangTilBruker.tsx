import { IngenTilgangTilBrukerAlertStripe } from '../alertstriper/alertstriper';
import { getHarVeilederTilgangFlytteBrukerTilEgetKontor } from '../../api/veilarboppfolging';
import { useState } from 'react';
import { Alert, BodyShort, Button, Checkbox, Heading, InlineMessage, Skeleton } from '@navikt/ds-react';
import './ingen-tilgang-til-bruker.less';
import { useModiaContext } from '../../store/modia-context-store';
import { EnvType, getEnv } from '../../util/utils';
import { logAnalyticsEvent } from '../../analytics/analytics';
import { hentVeilederOgEnheter, settKontor } from '../../api/api';
import useHarFlyttetBrukerTilEgetKontor from '../../store/flyttet-bruker-store';
import { useMutation, useQuery } from '@tanstack/react-query';

type KontorEndretSteg = 'ingen' | 'endret' | 'endretTilSamme';

export const IngenTilgangTilBruker = () => {
	const { aktivBrukerFnr, aktivEnhetId } = useModiaContext();
	const { harFlyttetBrukerTilEgetKontor, setHarFlyttetBrukerTilEgetKontor } = useHarFlyttetBrukerTilEgetKontor(aktivBrukerFnr);
	const [harHuketAvForAtBrukerSkalFlyttes, setHarHuketAvForAtBrukerSkalFlyttes] = useState(false);
	const [kontorEndretSteg, setKontorEndretSteg] = useState<KontorEndretSteg>('ingen');

	const tilgangQuery = useQuery({
		queryKey: ['tilgangFlytteBrukerTilEgetKontor', aktivBrukerFnr],
		queryFn: async () => {
			const response = await getHarVeilederTilgangFlytteBrukerTilEgetKontor(aktivBrukerFnr);
			if (!response.ok) throw response.error;
			return response.data.data.veilederTilgang;
		},
		enabled: !!aktivBrukerFnr,
	});

	const veilederQuery = useQuery({
		queryKey: ['veilederOgEnheter'],
		queryFn: hentVeilederOgEnheter,
	});

	const settKontorMutation = useMutation({
		mutationFn: () => settKontor(aktivBrukerFnr, aktivEnhetId!),
		onSuccess: (result) => {
			const nyttSteg: KontorEndretSteg =
				result.fraKontor?.kontorId === result.tilKontor.kontorId ? 'endretTilSamme' : 'endret';
			setKontorEndretSteg(nyttSteg);
			if (nyttSteg === 'endret') {
				setHarFlyttetBrukerTilEgetKontor();
			}
			logAnalyticsEvent('knapp klikket', { tekst: 'flyttet-bruker-til-veileders-kontor' });
		},
	});

	if (!aktivEnhetId) return null;

	const hentingFeilet = tilgangQuery.isError || veilederQuery.isError;
	const featureErSkruddPaa = getEnv().type === EnvType.dev || getEnv().type === EnvType.local;
	const aktivEnhetNavn = veilederQuery.data?.enheter.find(enhet => enhet.enhetId === aktivEnhetId)?.navn;
	const skalViseMeldingOmAtBrukerAlleredeErFlyttetTilEgetKontor =
		harFlyttetBrukerTilEgetKontor && kontorEndretSteg !== 'endret';

	return (
		<div className="ingen-tilgang-container">
			<IngenTilgangTilBrukerAlertStripe />

			{skalViseMeldingOmAtBrukerAlleredeErFlyttetTilEgetKontor ? (
				<div className="ingen-tilgang">
					Du har allerede flyttet bruker til eget kontor. Det vil ta minst en halvtime før du får tilgang til bruker.
				</div>
			) : (
				<div className="ingen-tilgang">
					{hentingFeilet && (
						<Alert variant="error" className="ingen-tilgang-alert">
							Kunne ikke hente nødvendig informasjon. Prøv å laste siden på nytt.
						</Alert>
					)}
					{settKontorMutation.isError && (
						<Alert variant="error" className="ingen-tilgang-alert">
							Kunne ikke flytte bruker til kontor. Prøv igjen.
						</Alert>
					)}
					{featureErSkruddPaa && tilgangQuery.data?.harVeilederTilgangFlytteBrukerTilEgetKontor && (
						<div>
							{kontorEndretSteg === 'ingen' && (
								veilederQuery.isPending ? (
									<div className="ingen-tilgang-innhold">
										<Skeleton variant="rectangle" height={60} />
										<Skeleton
											variant="rounded"
											className="ingen-tilgang-knapp"
											height={40}
											width={240}
										/>
									</div>
								) : (
									<div className="ingen-tilgang-innhold">
										<Heading size="medium" className="ingen-tilgang-heading">
											Ikke tilgang til bruker
										</Heading>
										<BodyShort>
											Du har ikke tilgang til bruker, men kan flytte bruker til {aktivEnhetNavn} dersom brukeren skal følges opp av {aktivEnhetNavn}.
											Dersom du velger å flytte bruker vil det ta minst en halvtime før du får tilgang til bruker.
										</BodyShort>
										{tilgangQuery.data.harAktiveTiltaksdeltakelserVedFlyttingTilEgetKontor && (
											<Alert variant="info" className="ingen-tilgang-alert">
												Bruker deltar på tiltak. Hvis du flytter brukeren må du undersøke om dette kan
												få konsekvenser for tiltaksdeltakelsen.
											</Alert>
										)}
										<Checkbox
											onChange={() => setHarHuketAvForAtBrukerSkalFlyttes(!harHuketAvForAtBrukerSkalFlyttes)}
											className="flytt-bruker-checkbox"
										>
											Ja, bruker skal følges opp av {aktivEnhetNavn}
										</Checkbox>
										<Button
											disabled={!harHuketAvForAtBrukerSkalFlyttes}
											className="ingen-tilgang-knapp"
											loading={settKontorMutation.isPending}
											onClick={() => settKontorMutation.mutate()}
											variant="secondary"
										>
											Flytt bruker til {aktivEnhetNavn}
										</Button>
									</div>
								)
							)}
							{kontorEndretSteg === 'endret' && (
								<div>
									<InlineMessage status="success" size="medium">
										Brukers arbeidsoppfølgingskontor er nå {aktivEnhetNavn}. Det vil ta minst en halvtime før du får tilgang til bruker.
									</InlineMessage>
								</div>
							)}
							{kontorEndretSteg === 'endretTilSamme' && (
								<div>
									<InlineMessage status="info" size="medium">
										Brukers arbeidsoppfølgingskontor er allerede {aktivEnhetNavn}. Det vil ta minst en halvtime før du får tilgang til bruker.
									</InlineMessage>
								</div>
							)}
						</div>
					)}
				</div>
			)}
		</div>
	);
};
