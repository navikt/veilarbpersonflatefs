import { HttpResponse } from 'msw'
import { KanStarteOppfolging } from '../api/veilarboppfolging';

export const graphqlMock = (kanStarteOppfoling: KanStarteOppfolging, underOppfolging: boolean) => {
    const oppfolging = {
        kanStarteOppfolging: kanStarteOppfoling,
        erUnderOppfolging: underOppfolging,
    }
    return HttpResponse.json({
        data: {
            oppfolging,
            oppfolgingsEnhet: {
                enhet: {
                    kilde: 'ARENA',
                    navn: 'NAV Vest',
                    id: '0420',
                },
            },
        },
    })
}
