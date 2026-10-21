import { FormEvent, useState } from 'react';
import {
	Alert, BodyShort,
	Button,
	DatePicker,
	DateValidationT,
	Modal,
	Radio,
	RadioGroup,
	Textarea,
	TextField,
	useDatepicker,
	VStack
} from '@navikt/ds-react';
import { beOmEnkelttilgang } from '../../api/tilgangsmaskinen';

type Varighet = 'UT_DAGEN' | 'TRE_DAGER' | 'EGENDEFINERT';

const MIN_BEGRUNNELSE = 10;
const MAKS_BEGRUNNELSE = 255;

interface EnkelttilgangSkjemaProps {
	open: boolean;
	onClose: () => void;
	onSendt: () => void;
	aktivBrukerFnr: string;
}

const tosifret = (tall: number): string => (tall < 10 ? `0${tall}` : `${tall}`);

const tilIsoDato = (dato: Date): string =>
	`${dato.getFullYear()}-${tosifret(dato.getMonth() + 1)}-${tosifret(dato.getDate())}`;

const leggTilDager = (dato: Date, dager: number): Date => {
	const ny = new Date(dato);
	ny.setDate(ny.getDate() + dager);
	return ny;
};

const leggTilMaaneder = (dato: Date, maaneder: number): Date => {
	const ny = new Date(dato);
	ny.setMonth(ny.getMonth() + maaneder);
	return ny;
};

export const EnkelttilgangSkjema = ({ open, onClose, onSendt, aktivBrukerFnr }: EnkelttilgangSkjemaProps) => {
	const [varighet, setVarighet] = useState<Varighet | undefined>();
	const [begrunnelse, setBegrunnelse] = useState('');
	const [egendefinertDato, setEgendefinertDato] = useState<Date | undefined>();
	const [visValideringsfeil, setVisValideringsfeil] = useState(false);
	const [senderInn, setSenderInn] = useState(false);
	const [innsendingsfeil, setInnsendingsfeil] = useState<string | undefined>();

	const [datoValidering, setDatoValidering] = useState<DateValidationT | undefined>();

	const iDag = new Date();
	const tidligsteDato = leggTilDager(iDag, 1);
	const senesteDato = leggTilMaaneder(iDag, 3);
	const { datepickerProps, inputProps, reset } = useDatepicker({
		fromDate: tidligsteDato,
		toDate: senesteDato,
		onDateChange: setEgendefinertDato,
		onValidate: setDatoValidering
	});

	const gyldigTil = (): Date | undefined => {
		switch (varighet) {
			case 'UT_DAGEN':
				return iDag;
			case 'TRE_DAGER':
				return leggTilDager(iDag, 3);
			case 'EGENDEFINERT':
				return egendefinertDato;
			default:
				return undefined;
		}
	};

	const varighetFeil = visValideringsfeil && !varighet ? 'Du må velge varighet på tilgangen' : undefined;
	const finnDatoFeil = (): string | undefined => {
		if (varighet !== 'EGENDEFINERT') return undefined;
		if (datoValidering?.isBefore) return 'Tidligste mulige dato er i morgen';
		if (datoValidering?.isAfter) return 'Datoen kan ikke være mer enn 3 måneder frem i tid';
		if (datoValidering?.isInvalid) return 'Datoen må ha formatet dd.mm.åååå';
		if (visValideringsfeil && !egendefinertDato) return 'Du må velge en dato';
		return undefined;
	};
	const datoFeil = finnDatoFeil();
	const finnBegrunnelseFeil = (): string | undefined => {
		const lengde = begrunnelse.trim().length;
		if (lengde > MAKS_BEGRUNNELSE) return `Begrunnelsen kan ikke være lengre enn ${MAKS_BEGRUNNELSE} tegn`;
		if (!visValideringsfeil) return undefined;
		if (lengde === 0) return 'Du må skrive en begrunnelse';
		if (lengde < MIN_BEGRUNNELSE) return `Begrunnelsen må være minst ${MIN_BEGRUNNELSE} tegn`;
		return undefined;
	};
	const begrunnelseErGyldig = (): boolean => {
		const lengde = begrunnelse.trim().length;
		return lengde >= MIN_BEGRUNNELSE && lengde <= MAKS_BEGRUNNELSE;
	};
	const begrunnelseFeil = finnBegrunnelseFeil();

	const lukk = () => {
		setVarighet(undefined);
		setBegrunnelse('');
		setEgendefinertDato(undefined);
		setDatoValidering(undefined);
		setVisValideringsfeil(false);
		setInnsendingsfeil(undefined);
		reset();
		onClose();
	};

	const handleSubmit = async (event: FormEvent) => {
		event.preventDefault();
		setVisValideringsfeil(true);
		setInnsendingsfeil(undefined);

		const dato = gyldigTil();
		if (!dato || datoFeil || !begrunnelseErGyldig()) return;

		setSenderInn(true);
		try {
			await beOmEnkelttilgang(aktivBrukerFnr, begrunnelse.trim(), tilIsoDato(dato));
			lukk();
			onSendt();
		} catch {
			setInnsendingsfeil('Noe gikk galt ved lagring av tilgang. Prøv igjen senere.');
		} finally {
			setSenderInn(false);
		}
	};

	return (
		<Modal open={open} onClose={lukk} header={{ heading: 'Enkelttilgang' }} width="medium">
			<form onSubmit={handleSubmit}>
				<Modal.Body>
					<VStack gap="space-24">
						<TextField label="Bruker" value={aktivBrukerFnr} readOnly />
						<RadioGroup
							legend="Varighet på tilgangen"
							value={varighet ?? ''}
							onChange={(verdi: Varighet) => setVarighet(verdi)}
							error={varighetFeil}
						>
							<Radio value="UT_DAGEN">Ut dagen</Radio>
							<Radio value="TRE_DAGER">3 dager</Radio>
							<Radio value="EGENDEFINERT">Egendefinert</Radio>
						</RadioGroup>
						{varighet === 'EGENDEFINERT' && (
							<DatePicker {...datepickerProps}>
								<DatePicker.Input {...inputProps} label="Gyldig til og med" error={datoFeil} />
							</DatePicker>
						)}
						<Textarea
							label="Hvorfor trenger du tilgang til brukeren?"
							value={begrunnelse}
							onChange={e => setBegrunnelse(e.target.value)}
							maxLength={MAKS_BEGRUNNELSE}
							error={begrunnelseFeil}
						/>
						<BodyShort size="small">
							Alle enkelttilganger og begrunnelser loggføres. Begrunnelsene blir sjekket for å avdekke
							bruk uten tjenestelig behov.
						</BodyShort>
						{innsendingsfeil && <Alert variant="error">{innsendingsfeil}</Alert>}
					</VStack>
				</Modal.Body>
				<Modal.Footer>
					<Button type="submit" loading={senderInn}>
						Lagre
					</Button>
					<Button type="button" variant="secondary" onClick={lukk}>
						Avbryt
					</Button>
				</Modal.Footer>
			</form>
		</Modal>
	);
};
