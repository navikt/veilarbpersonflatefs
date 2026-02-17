import { useAxios, UseAxiosResponseValue } from './utils';

export function useSettKontor(kontorId: string, fnr: string): UseAxiosResponseValue<boolean> {
    return useAxios<boolean>(
        {
            url: `/ao-oppfolgingskontor/api/kontor`,
            method: 'POST',
            data: { kontorId, ident: fnr }
        }
    );
}