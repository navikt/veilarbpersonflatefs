import { HttpResponse } from 'msw'
import { TilgangResultat } from '../api/veilarboppfolging';

export const graphqlMock = (
	kanFlytteBrukerTilEgetKontor: boolean,
	brukerHarAktiveTiltaksdeltakelser: boolean,
	kanStarteOppfolging: boolean,
	tilgangResuktat: TilgangResultat
) => {
	return HttpResponse.json({
		data: {
			veilederTilgang: {
				harVeilederTilgangFlytteBrukerTilEgetKontor: kanFlytteBrukerTilEgetKontor,
				tilgang: tilgangResuktat,
				harAktiveTiltaksdeltakelserVedFlyttingTilEgetKontor: brukerHarAktiveTiltaksdeltakelser,
				harVeilederTilgangStarteOppfolging: kanStarteOppfolging
			}
		}
	});
};
