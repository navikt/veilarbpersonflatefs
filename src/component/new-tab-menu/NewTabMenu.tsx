import { Tabs } from '@navikt/ds-react';
import { useNavigate } from 'react-router-dom';
import { TabId } from '../side-innhold';
import { useAppContext } from '../../AppContext';
import { UlesteDialoger } from '../tab-menu/dialog-tab/UlesteDialoger';
import { useModiaContext } from '../../store/modia-context-store';

const NewTabMenu = () => {
	const navigate = useNavigate();

	const {
		currentTabId,
		setCurrentTabId
	} = useAppContext();

	const {
		aktivEnhetId
	} = useModiaContext();

	const getUrlForTab = (tabId: TabId): string => {
		switch (tabId) {
			case TabId.AKTIVITETSPLAN:
				return '/aktivitetsplan';
			case TabId.DIALOG:
				return '/dialog';
			case TabId.VEDTAKSSTOTTE:
				return '/vedtaksstotte';
			case TabId.DETALJER:
				return '/detaljer';
			case TabId.OVERBLIKK:
				return '/overblikk';
			case TabId.ARBEIDSMARKEDSTILTAK:
				return '/arbeidsmarkedstiltak';
			case TabId.FINN_STILLING_INNGANG:
				return '/finn-stillinger';
			default:
				throw Error('Det finnes ikke en side for ' + tabId);

		}
	};

	const changeTab = (newTabId: TabId) => {
		setCurrentTabId(newTabId);
		navigate(getUrlForTab(newTabId));
	};


	// Et lite unntak mens Team Valp venter på PVO
	const vikafossenIkkeErValgtSomEnhet = () => {
		const vikafossen = '2103';
		return aktivEnhetId && aktivEnhetId !== vikafossen;
	};


	return (
		<div className="tab-menu">
			<Tabs size="small" className="tab-menu__content" value={currentTabId}>
				<Tabs.List className="tab-menu__tablist-element">
					<Tabs.Tab
						label="Aktivitetsplan"
						key={TabId.AKTIVITETSPLAN}
						value={TabId.AKTIVITETSPLAN}
						onClick={() => changeTab(TabId.AKTIVITETSPLAN)}
					/>
					<Tabs.Tab
						label="Dialog"
						key={TabId.DIALOG}
						value={TabId.DIALOG}
						onClick={() => changeTab(TabId.DIALOG)}
						icon={<UlesteDialoger />}
					/>
					<Tabs.Tab
						label="Overblikk"
						key={TabId.OVERBLIKK}
						value={TabId.OVERBLIKK}
						onClick={() => changeTab(TabId.OVERBLIKK)}
					/>
					<Tabs.Tab
						label="Oppfølgingsvedtak"
						key={TabId.VEDTAKSSTOTTE}
						value={TabId.VEDTAKSSTOTTE}
						onClick={() => changeTab(TabId.VEDTAKSSTOTTE)}
					/>

					{vikafossenIkkeErValgtSomEnhet() && (
						<Tabs.Tab
							label="Arbeidsmarkedstiltak"
							key={TabId.ARBEIDSMARKEDSTILTAK}
							value={TabId.ARBEIDSMARKEDSTILTAK}
							onClick={() => changeTab(TabId.ARBEIDSMARKEDSTILTAK)}
						/>
					)}

					<Tabs.Tab
						label="Finn stillinger"
						key={TabId.FINN_STILLING_INNGANG}
						value={TabId.FINN_STILLING_INNGANG}
						onClick={() => changeTab(TabId.FINN_STILLING_INNGANG)}
					/>
				</Tabs.List>
			</Tabs>
		</div>
	);
};

export default NewTabMenu;
