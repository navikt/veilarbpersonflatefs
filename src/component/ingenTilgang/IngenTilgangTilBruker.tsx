import { IngenTilgangTilBrukerAlertStripe } from '../alertstriper/alertstriper';
import { getHarVeilederTilgangFlytteBrukerTilEgetKontor } from '../../api/veilarboppfolging';
import { useEffect, useState } from 'react';
import { Alert, BodyShort, Button, Checkbox, Heading, InlineMessage, Skeleton } from '@navikt/ds-react';
import './ingen-tilgang-til-bruker.less';
import { useModiaContext } from '../../store/modia-context-store';
import { EnvType, getEnv } from '../../util/utils';
import { logAnalyticsEvent } from '../../analytics/analytics';
import { hentVeilederOgEnheter, HentVeilederOgEnheterResponse, settKontor } from '../../api/api';
import useHarFlyttetBrukerTilEgetKontor from '../../hooks/useHarFlyttetBrukerTilEgetKontor';

enum Steg {
	IKKE_STARTET,
	HAR_IKKE_ENDRET_KONTOR,
	ENDRER_KONTOR,
	HAR_ENDRET_KONTOR
}

export const IngenTilgangTilBruker = () => {
	const { aktivBrukerFnr, aktivEnhetId } = useModiaContext();
	const { harFlyttetBrukerTilEgetKontor, settAtVeilederHarFlyttetBrukerTilEgetKontor } = useHarFlyttetBrukerTilEgetKontor(aktivBrukerFnr);
	const [harHuketAvForAtBrukerSkalFlyttes, setHarHuketAvForAtBrukerSkalFlyttes] = useState<boolean>(false);
	const [tilgangFlytteBrukerEgetKontor, setTilgangFlytteBrukerEgetKontor] = useState<boolean | undefined>();
	const [harAktiveTiltaksdeltakelser, setHarAktiveTiltaksdeltakelser] = useState<boolean | undefined>();
	const [veilederOgEnheter, setVeilederOgEnheter] = useState<HentVeilederOgEnheterResponse | undefined>();
	const [steg, setSteg] = useState<Steg>(Steg.IKKE_STARTET);

	useEffect(() => {
		if (steg === Steg.IKKE_STARTET) {
			setSteg(Steg.HAR_IKKE_ENDRET_KONTOR);

			getHarVeilederTilgangFlytteBrukerTilEgetKontor(aktivBrukerFnr).then(response => {
				if (response.ok) {
					setTilgangFlytteBrukerEgetKontor(
						response.data.data.veilederTilgang.harVeilederTilgangFlytteBrukerTilEgetKontor
					);
					setHarAktiveTiltaksdeltakelser(
						response.data.data.veilederTilgang.harAktiveTiltaksdeltakelserVedFlyttingTilEgetKontor
					);
				} else {
					throw new Error('Kunne ikke hente oppfølgingstatus');
				}
			});

			hentVeilederOgEnheter().then(response => {
				if (response) {
					setVeilederOgEnheter(response);
				} else {
					throw new Error('Kunne ikke hente veileder og enheter');
				}
			});
		}
	}, []);

	if (!aktivEnhetId) return;

	const settKontorButtonClicked = async () => {
		setSteg(Steg.ENDRER_KONTOR);
		const result = await settKontor(aktivBrukerFnr, aktivEnhetId);
		if (result) {
			setSteg(Steg.HAR_ENDRET_KONTOR);
			settAtVeilederHarFlyttetBrukerTilEgetKontor();
			logAnalyticsEvent('knapp klikket', { tekst: 'flyttet-bruker-til-veileders-kontor' });
		}
	};

	const featureErSkruddPaa = getEnv().type === EnvType.dev || getEnv().type === EnvType.local
	const aktivEnhetNavn = veilederOgEnheter?.enheter.find(enhet => enhet.enhetId === aktivEnhetId)?.navn;
	const lasterAktivEnhetNavn = aktivEnhetNavn === undefined;
	const skalViseMeldingOmAtBrukerAlleredeErFlyttetTilEgetKontor = harFlyttetBrukerTilEgetKontor && steg !== Steg.HAR_ENDRET_KONTOR;

	return (
		<div className="ingen-tilgang-container">
			<IngenTilgangTilBrukerAlertStripe />

			{ skalViseMeldingOmAtBrukerAlleredeErFlyttetTilEgetKontor  ?
				<div className="ingen-tilgang">
					Du har allerede flyttet bruker til eget kontor. Det vil ta minst en halvtime før du får tilgang til bruker.
				</div>
			:
				<div className="ingen-tilgang">
					{featureErSkruddPaa && tilgangFlytteBrukerEgetKontor && (
						<div>
							{(steg === Steg.ENDRER_KONTOR || steg === Steg.HAR_IKKE_ENDRET_KONTOR) &&
								(lasterAktivEnhetNavn ? (
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
										<Heading
											size={'medium'}
											className={'ingen-tilgang-heading'}
										>
											Ikke tilgang til bruker
										</Heading>
										<BodyShort>
											Du har ikke tilgang til bruker, men kan flytte bruker til {aktivEnhetNavn} dersom brukeren skal følges opp av {aktivEnhetNavn}.
											Dersom du velger å flytte bruker vil det ta minst en halvtime før du får tilgang til bruker.
										</BodyShort>
										{harAktiveTiltaksdeltakelser && <Alert variant={'info'} className={'ingen-tilgang-alert'}>
											Bruker deltar på tiltak. Hvis du flytter brukeren må du undersøke om dette kan
											få konsekvenser for tiltaksdeltakelsen.
										</Alert>}
										<Checkbox
											onChange={() => setHarHuketAvForAtBrukerSkalFlyttes(!harHuketAvForAtBrukerSkalFlyttes)}
											className={'flytt-bruker-checkbox'}
										>
											Ja, bruker skal følges opp av {aktivEnhetNavn}
										</Checkbox>
										<Button
											disabled={!harHuketAvForAtBrukerSkalFlyttes}
											className="ingen-tilgang-knapp"
											loading={steg === Steg.ENDRER_KONTOR}
											onClick={settKontorButtonClicked}
											variant={'secondary'}
										>
											Flytt bruker til {aktivEnhetNavn}
										</Button>
									</div>
								))}
							{steg === Steg.HAR_ENDRET_KONTOR && (
								<div>
									<InlineMessage status="success" size="medium">
										Brukers arbeidsoppfølgingskontor er nå {aktivEnhetNavn}. Det vil ta minst en halvtime før du får tilgang til bruker.
									</InlineMessage>
								</div>
							)}
						</div>
					)}
				</div>
			}
		</div>
	);
};
