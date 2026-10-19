import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { FeilmeldingManglerFnrAlertStripe } from './alertstriper';

describe('FeilmeldingManglerFnrAlertStripe', () => {
	it('renders the message', () => {
		render(<FeilmeldingManglerFnrAlertStripe />);

		expect(screen.getByText('Du må søke opp en person for å vise aktivitetsplanen')).toBeTruthy();
	});
});
