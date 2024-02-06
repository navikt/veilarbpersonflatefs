import { ComponentType, useEffect, useState } from 'react';
import { TabId } from '../side-innhold';
import { lagreSistBesokteTab } from './siste-tab';
import { useEventListener } from '../../util/utils';
import './tab-menu.less';
import { useModiaContext } from '../../store/modia-context-store';
import { logEvent } from '../../util/frontend-logger';
import { Tabs } from '@navikt/ds-react';
import { SpaProps } from '../spa';
import { logValgtFane } from '../../amplitude/amplitude';
import {UlesteDialoger} from "./dialog-tab/UlesteDialoger";

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

function TabMenu(props: TabsProps) {
	const { tabs, defaultSelectedTab } = props;
	const { aktivBrukerFnr: fnr, aktivEnhetId, renderKey } = useModiaContext();
	const mappedTabs = tabMap(tabs);

	const [currentTab, setCurrentTab] = useState(defaultSelectedTab ? mappedTabs[defaultSelectedTab] : tabs[0]);
	const [tabsSeen, setTabsSeen] = useState<TabId[]>([currentTab.id]);

	useEffect(() => {
		document.title = currentTab.title;
	}, [currentTab, tabs]);

	const onClickChangeTab = (tabId: TabId) => () => {
		changeTab(tabId);
	};
	const changeTab = (id: TabId, extraDetails?: Event) => {
		const selectedTab = mappedTabs[id];
		lagreSistBesokteTab({ fnr, tab: id });
		if (!tabsSeen.includes(selectedTab.id)) {
			setTabsSeen([...tabsSeen, selectedTab.id]);
		}
		setCurrentTab(selectedTab);

		logEvent('veilarbpersonflatefs.valgt-fane', { tabId: id });
		logValgtFane(id);
		const extra = !!extraDetails ? (extraDetails as CustomEvent).detail : {};
		window.dispatchEvent(new CustomEvent('veilarbpersonflatefs.tab-clicked', { detail: { tabId: id, ...extra } }));
	};

	useEventListener('visAktivitetsplan', () => changeTab(TabId.AKTIVITETSPLAN));
	useEventListener('visDialog', event => changeTab(TabId.DIALOG, event));

	return (
		<div className="tab-menu">
			<Tabs size="small" className="tab-menu__content" value={currentTab.id} defaultValue={tabs[0].id}>
				<Tabs.List className="tab-menu__tablist-element">
					{tabs.map(tab =>
						tab.id === TabId.DIALOG ? (
							<Tabs.Tab
								onClick={onClickChangeTab(tab.id)}
								label={tab.title}
								key={tab.id}
								value={tab.id}
								icon={<UlesteDialoger />}
							/>
						) : (
							<Tabs.Tab
								onClick={onClickChangeTab(tab.id)}
								label={tab.title}
								key={tab.id}
								value={tab.id}
							/>
						)
					)}
				</Tabs.List>
				{tabs.map(tab => {
					return (
						<Tabs.Panel className="flex flex-grow" key={tab.id} value={tab.id}>
							<div className={'tab-menu__tab-content flex-grow ' + (tab.className ?? '')}>
								<tab.content
									key={`${tab.id}-${renderKey}`}
									fnr={fnr}
									enhet={aktivEnhetId ?? undefined}
								/>
							</div>
						</Tabs.Panel>
					);
				})}
			</Tabs>
		</div>
	);
}

export default TabMenu;
