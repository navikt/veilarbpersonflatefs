import { HttpResponse } from 'msw'
import { TilgangResultat } from '../api/veilarboppfolging';

export const graphqlMock = (
	kanFlytteBrukerTilEgetKontor: boolean,
	brukerHarAktiveTiltaksdeltakelser: boolean,
	kanStarteOppfolging: boolean,
	tilgangResultat: TilgangResultat
) => {
	return HttpResponse.json({
		data: {
			veilederTilgang: {
				harVeilederTilgangFlytteBrukerTilEgetKontor: kanFlytteBrukerTilEgetKontor,
				tilgang: tilgangResultat,
				harAktiveTiltaksdeltakelserVedFlyttingTilEgetKontor: brukerHarAktiveTiltaksdeltakelser,
				harVeilederTilgangStarteOppfolging: kanStarteOppfolging
			}
		}
	});
};
