import React from 'react';
import { Features } from '../../utils/featue-utils';
import TourModal from './tour-modal';
import { lastNedCvModalConfig } from './last-ned-cv/config';

interface TourModalControllerProps {
	features: Features;
}

const tourModalConfigs = [lastNedCvModalConfig];

export const  TourModalController = (props: TourModalControllerProps) => {
	return (
		<>
			{tourModalConfigs.map(config => {
				if (!props.features[config.toggleName]) {
					return null;
				}
				return <TourModal key={config.storageName} config={config} />;
			})}
		</>
	);
};
