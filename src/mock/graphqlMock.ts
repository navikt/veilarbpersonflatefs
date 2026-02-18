import { HttpResponse } from 'msw'

export const graphqlMock = (kanFlytteBrukerTilEgetKontor: boolean) => {
    return HttpResponse.json({
        data: {
			veilederTilgang: {
				harVeilederTilgangFlytteBrukerTilEgetKontor: kanFlytteBrukerTilEgetKontor
            },
        },
    })
}
