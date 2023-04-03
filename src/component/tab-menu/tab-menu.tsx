import { ComponentType, useEffect, useState } from 'react';
import { TabId } from '../side-innhold';
import { lagreSistBesokteTab } from './siste-tab';
import { useEventListener } from '../../util/utils';
import useUlesteDialoger from './dialog-tab/useAntalUlesteDialoger';
import './tab-menu.less';
import { useModiaContext } from '../../store/modia-context-store';
import { logEvent } from '../../util/frontend-logger';
import { Tabs } from '@navikt/ds-react';
import { SpaProps } from '../spa';

export interface Tab {
	id: TabId;
	title: string;
	content: ComponentType<SpaProps>;
	className?: string;
}

interface TabsProps {
	tabs: Tab[];
	defaultSelectedTab?: TabId;
}

const tabMap = (tabs: Tab[]): Record<TabId, Tab> =>
	tabs.reduce((acc, tab) => ({ ...acc, [tab.id]: tab }), {} as Record<TabId, Tab>);

const UlesteDialoger = () => {
	const { aktivBrukerFnr } = useModiaContext();
	const antallUleste = useUlesteDialoger(aktivBrukerFnr);

	if (!antallUleste) {
		return null;
	}

	return (
		<span className="tab__title__notification">
			{antallUleste}
			<span className="sr-only"> uleste</span>
		</span>
	);
};

function TabMenu(props: TabsProps) {
	const { tabs, defaultSelectedTab } = props;
	const { aktivBrukerFnr: fnr, aktivEnhetId, renderKey } = useModiaContext();
	const mappedTabs = tabMap(tabs);

	const [currentTab, setCurrentTab] = useState(defaultSelectedTab ? mappedTabs[defaultSelectedTab] : tabs[0]);
	const [tabsSeen, setTabsSeen] = useState<TabId[]>([currentTab.id]);

	useEffect(() => {
		document.title = currentTab.title;
	}, [currentTab, tabs]);

	const changeTab = (id: TabId, extraDetails?: Event) => {
		const selectedTab = mappedTabs[id];
		lagreSistBesokteTab({ fnr, tab: id });
		if (!tabsSeen.includes(selectedTab.id)) {
			setTabsSeen([...tabsSeen, selectedTab.id]);
		}
		setCurrentTab(selectedTab);

		logEvent('veilarbpersonflatefs.valgt-fane', { tabId: id });
		const extra = !!extraDetails ? (extraDetails as CustomEvent).detail : {};
		window.dispatchEvent(new CustomEvent('veilarbpersonflatefs.tab-clicked', { detail: { tabId: id, ...extra } }));
	};

	useEventListener('visAktivitetsplan', () => changeTab(TabId.AKTIVITETSPLAN));
	useEventListener('visDialog', event => changeTab(TabId.DIALOG, event));

	console.log({ renderKey });

	return (
		<div className="tab-menu">
			<Tabs onChange={tabId => changeTab(tabId as TabId)} value={currentTab.id} defaultValue={tabs[0].id}>
				<div className="tab-menu__headers--wrapper">
					<div className="tab-menu__headers ">
						<Tabs.List className="tab-menu__headers--hoire">
							{tabs.map(tab =>
								tab.id === TabId.DIALOG ? (
									<Tabs.Tab label={tab.title} key={tab.id} value={tab.id} icon={<UlesteDialoger />} />
								) : (
									<Tabs.Tab label={tab.title} key={tab.id} value={tab.id} />
								)
							)}
						</Tabs.List>
					</div>
				</div>
				{tabs.map(tab => {
					return (
						<Tabs.Panel key={tab.id} value={tab.id}>
							<tab.content key={`${tab.id}-${renderKey}`} fnr={fnr} enhet={aktivEnhetId ?? undefined} />
						</Tabs.Panel>
					);
				})}
			</Tabs>
		</div>
	);
}

export default TabMenu;
