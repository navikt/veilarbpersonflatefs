import { TourModalConfig } from '../tour-modal';
import step1Bilde from './step-1.png';
import step2Bilde from './step-2.png';
import step3Bilde from './step-3.png';
import {TOUR_MODAL_VEDTAKSSTOTTE_LANSERING_TOGGLE} from "../../../api/features";

export const vedtaksstotteLanseringConfig: TourModalConfig = {
	storageName: 'TOUR_MODAL-VEDTAKSSTOTTE_LANSERNG',
	toggleName: TOUR_MODAL_VEDTAKSSTOTTE_LANSERING_TOGGLE,
	metricName: 'veilarbpersonflatefs.metrikker.tour_modal.vedtaksstotte_lansering',
	modalName: 'Ny løsning for oppfølgingsvedtak',
	steps: [
		{
			tittel: 'Arbeidsevnevurdering i vedtak',
			bilde: step1Bilde,
			bildeAlt: 'Skjermbilde av feltet hvor begrunnelsen blir utfylt',
			tekst: 'Vurdering av arbeidsevne skriver du i begrunnelsen i oppfølgingsvedtaket.'
		},
		{
			tittel: 'Endringer lagres automatisk',
			bilde: step2Bilde,
			bildeAlt: 'Skjermbilde av "sist endret" visning',
			tekst: 'Det du skriver i skjemaet lagres automatisk. Du kan lagre og gå tilbake uten å miste noe.'
		},
		{
			tittel: 'Vises kun for veiledere',
			bilde: step3Bilde,
			bildeAlt: 'Skjermbilde av den nye fanen hvor den nye løsningen ligger',
			tekst: 'Fanen for oppfølgingsvedtak er kun synlig for veiledere. Brukerne får vedtaket som brev i posten eller digitalt.'
		}
	]
};
