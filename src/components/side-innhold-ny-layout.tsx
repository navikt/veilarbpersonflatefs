import React from 'react';
import TabMenu, { Tab } from './tabs/tab-menu';

interface SideInnholdNyLayoutProps {
    visittkort: React.ReactElement;
    mao: React.ReactElement;
    aktivitetsplan: React.ReactElement;
}

const SideInnholdNyLayout: React.FunctionComponent<SideInnholdNyLayoutProps> = (props: SideInnholdNyLayoutProps) => {

    const { visittkort, aktivitetsplan, mao } = props;

    const tabs: Tab[] = [
        { title: 'Aktivitetsplan', content: aktivitetsplan },
        { title: 'Detaljer', content: mao }
    ];

    return (
        <>
            {visittkort}
            <TabMenu tabs={tabs}/>
        </>
    );

};

export default SideInnholdNyLayout;
