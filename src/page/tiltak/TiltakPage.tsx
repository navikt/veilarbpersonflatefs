const TiltakPage = () => {

	// const getTiltaksgjennomforingIdFraUrl = () => {
	//     const { id } = useParams();
	//     if (!id) throw new Error('id ikke satt');
	//
	//     return id?.includes('_')
	//         ? id?.replace('_', '.')
	//         : id;
	// };

	// const DeltakerRegistreringApp = () => {
	//     useLoadDeltakerRegistreringApp();
	//
	//     const tiltaksgjennomforingId = getTiltaksgjennomforingIdFraUrl();
	//
	//     const { aktivBrukerFnr, aktivEnhetId } = useModiaContext();
	//
	//     return createElement('arbeidsmarkedstiltak-deltaker', {
	//         'data-personident': aktivBrukerFnr,
	//         'data-deltakerlisteId': tiltaksgjennomforingId,
	//         'data-enhetId': aktivEnhetId
	//     });
	// };

	return (<div>Tiltak Page</div>
		// <Suspense fallback="Laster...">
		//     <ErrorBoundary
		//         FallbackComponent={({ resetErrorBoundary }) => {
		//             return (
		//                 <div
		//                     style={{
		//                         display: 'flex',
		//                         flexDirection: 'column',
		//                         gap: '1rem'
		//                     }}
		//                 >
		//                     <Alert variant="error">Klarte ikke laste deltakerregistrering</Alert>
		//                     <Button onClick={resetErrorBoundary}>Prøv på nytt</Button>
		//                 </div>
		//             );
		//         }}
		//     >
		//         <DeltakerRegistreringApp />
		//     </ErrorBoundary>
		// </Suspense>
	);
};

export default TiltakPage;
