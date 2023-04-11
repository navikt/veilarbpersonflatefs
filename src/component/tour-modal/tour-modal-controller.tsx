import { Features } from '../../api/features';
import TourModal from './tour-modal';
import { lastNedCvModalConfig } from './last-ned-cv/config';
import { vedtaksstotteLanseringConfig } from './vedtaksstotte-lansering/config';

interface TourModalControllerProps {
	features?: Features;
}

const tourModalConfigs = [lastNedCvModalConfig, vedtaksstotteLanseringConfig];

export const TourModalController = (props: TourModalControllerProps) => {
	return (
		<>
			{tourModalConfigs.map(config => {
				if (!props?.features?.[config.toggleName]) {
					return null;
				}
				return <TourModal key={config.storageName} config={config} />;
			})}
		</>
	);
};
