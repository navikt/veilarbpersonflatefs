import React from 'react';
import { SpaName } from '../../component/spa';
import NAVSPA from '@navikt/navspa';
import { SpaMock, SpaMockProps } from '../component/spa-mock';

export const internflateDecoratorSpaMockProps: SpaMockProps = {
	name: SpaName.INTERNARBEIDSFLATEFS_DECORATOR,
	tekst: 'Dekoratør',
	className: 'spa-mock__content--internflatedecorator'
};

export const visittkortSpaMockProps: SpaMockProps = {
	name: SpaName.VEILARBVISITTKORTFS,
	tekst: 'Visittkort',
	className: 'spa-mock__content--visittkort'
};

export const detaljerSpaMockProps: SpaMockProps = {
	name: SpaName.VEILARBMAOFS,
	tekst: 'Detaljer',
	className: 'spa-mock__content--mao'
};

export const aktivitetsplanSpaMockProps: SpaMockProps = {
	name: SpaName.AKTIVITETSPLAN,
	tekst: 'Aktivitetsplan',
	className: 'spa-mock__content--aktivitetsplan'
};

export const dialogSpaMockProps: SpaMockProps = {
	name: SpaName.DIALOG,
	tekst: 'Dialog',
	className: 'spa-mock__content--dialog'
};

export const vedtaksstotteSpaMockProps: SpaMockProps = {
	name: SpaName.VEILARBVEDTAKSSTOTTEFS,
	tekst: 'Vedtaksstøtte',
	className: 'spa-mock__content--vedtaksstotte'
};

export function eksporterSpaMock(props: SpaMockProps) {
	NAVSPA.eksporter(props.name, () => {
		return <SpaMock name={props.name} tekst={props.tekst} className={props.className} />;
	});
}
