import { IngenTilgangTilBrukerAlertStripe } from '../alertstriper/alertstriper';
import { getHarVeilederTilgangFlytteBrukerTilEgetKontor } from '../../api/veilarboppfolging';
import { useEffect, useState } from 'react';
import { BodyShort, Button, InlineMessage, Link, Skeleton } from '@navikt/ds-react';
import './ingen-tilgang-til-bruker.less';
import { useModiaContext } from '../../store/modia-context-store';
import { dispatchNavigateEvent } from '../../Router';
import { EnvType, getEnv } from '../../util/utils';
import { logAnalyticsEvent } from '../../analytics/analytics';
import { settKontor, useVeilederOgEnheter } from '../../api/api';

enum Steg {
	IKKE_STARTET,
	HAR_IKKE_ENDRET_KONTOR,
	ENDRER_KONTOR,
	HAR_ENDRET_KONTOR
}

export const IngenTilgangTilBruker = () => {
	const { aktivBrukerFnr, aktivEnhetId } = useModiaContext();
	const veilederOgEnheter = useVeilederOgEnheter();
	const [tilgangFlytteBrukerEgetKontor, setTilgangFlytteBrukerEgetKontor] = useState<boolean | undefined>();
	const [steg, setSteg] = useState<Steg>(Steg.IKKE_STARTET);
	if (!aktivEnhetId) return;

	useEffect(() => {
		if (steg === Steg.IKKE_STARTET) {
			setSteg(Steg.HAR_IKKE_ENDRET_KONTOR);

			getHarVeilederTilgangFlytteBrukerTilEgetKontor(aktivBrukerFnr).then(response => {
				if (response.ok) {
					setTilgangFlytteBrukerEgetKontor(
						response.data.data.veilederTilgang.harVeilederTilgangFlytteBrukerTilEgetKontor
					);
				} else {
					throw Error('Kunne ikke hente oppfølgingstatus');
				}
			});
		}
	}, []);

	const settKontorButtonClicked = async () => {
		setSteg(Steg.ENDRER_KONTOR);
		const result = await settKontor(aktivBrukerFnr, aktivEnhetId);
		if (result) {
			setSteg(Steg.HAR_ENDRET_KONTOR);
			logAnalyticsEvent('flyttet bruker til veileders eget kontor');
		}
	};

	const aktivEnhetNavn = veilederOgEnheter.data?.enheter.find(enhet => enhet.enhetId === aktivEnhetId)?.navn;
	const skalViseFunksjonalitetForAaFlytteBruker = tilgangFlytteBrukerEgetKontor && getEnv().type !== EnvType.prod;
	const lasterAktivEnhetNavn = aktivEnhetNavn === undefined;

	return (
		<div className="ingen-tilgang-container">
			<IngenTilgangTilBrukerAlertStripe />

			<div className="ingen-tilgang">
				{skalViseFunksjonalitetForAaFlytteBruker && (
					<div>
						{ (steg === Steg.ENDRER_KONTOR || steg === Steg.HAR_IKKE_ENDRET_KONTOR) && (

							lasterAktivEnhetNavn ?
								<div className="ingen-tilgang-innhold">
									<Skeleton variant="rectangle" height={60} />
									<Skeleton variant="rounded" className="ingen-tilgang-knapp" height={40} width={240}/>
								</div>
							:
								<div className="ingen-tilgang-innhold">
									<BodyShort>
										Du har ikke tilgang til bruker, men kan flytte bruker til {aktivEnhetNavn}. Du vil
										da få tilgang til bruker.
									</BodyShort>
									<Button className="ingen-tilgang-knapp" loading={steg === Steg.ENDRER_KONTOR} onClick={settKontorButtonClicked}>
										Flytt bruker til {aktivEnhetNavn}
									</Button>
								</div>
						)}
						{steg === Steg.HAR_ENDRET_KONTOR && (
							<div>
								<InlineMessage status="success" size="medium">
									Brukers arbeidsoppfølgingskontor er nå {aktivEnhetNavn}
								</InlineMessage>
								<Link
									className="ingen-tilgang-link"
									to="/aktivitetsplan"
									onClick={() => dispatchNavigateEvent('/aktivitetsplan')}
								>
									Gå til aktivitetsplanen
								</Link>
							</div>
						)}
					</div>
				)}
			</div>
		</div>
	);
};
