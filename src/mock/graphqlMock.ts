import { HttpResponse } from 'msw'

export const graphqlMock = (
	kanFlytteBrukerTilEgetKontor: boolean,
	brukerHarAktiveTiltaksdeltakelser: boolean,
	kanStarteOppfolging: boolean
) => {
	return HttpResponse.json({
		data: {
			veilederTilgang: {
				harVeilederTilgangFlytteBrukerTilEgetKontor: kanFlytteBrukerTilEgetKontor,
				harAktiveTiltaksdeltakelserVedFlyttingTilEgetKontor: brukerHarAktiveTiltaksdeltakelser,
				harVeilederTilgangStarteOppfolging: kanStarteOppfolging
			}
		}
	});
};
