import { Navigate, Route, Routes } from 'react-router-dom';
import AktivitetsplanPage from './page/AktivitetsplanPage';
import DialogPage from './page/DialogPage';
import OverblikkPage from './page/OverblikkPage';
import OppfolgingsvedtakPage from './page/OppfolgingsvedtakPage';
import ArbeidsmarkedstiltakPage from './page/ArbeidsmarkedstiltakPage';
import FinnStillingerPage from './page/FinnStillingerPage';
import TiltakPage from './page/tiltak/TiltakPage';

export const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<AktivitetsplanPage />} />
            <Route path="/aktivitetsplan/*" element={<AktivitetsplanPage />} />
            <Route path="/dialog/*" element={<DialogPage />} />
            <Route path="/overblikk/*" element={<OverblikkPage />} />
            <Route path="/vedtaksstotte" element={<OppfolgingsvedtakPage />} />
            <Route path="/arbeidsmarkedstiltak/*" element={<ArbeidsmarkedstiltakPage />} />
            <Route path="/finn-stillinger/*" element={<FinnStillingerPage />} />
            <Route path="/tiltak/*" element={<TiltakPage />} />
            <Route path="*" element={<Navigate replace to={'/'} />} />
        </Routes>
    );
};
