import React from 'react';

interface SideInnholdNyLayoutProps {
    visittkort: React.ReactElement;
    mao: React.ReactElement;
    aktivitetsplan: React.ReactElement;
}

const SideInnholdNyLayout: React.FunctionComponent<SideInnholdNyLayoutProps> = (props: SideInnholdNyLayoutProps) => {

    const { visittkort, aktivitetsplan, mao } = props;

    return (
        <>
            <p>Ny Layout</p>
            {visittkort}
            {mao}
            {aktivitetsplan}
        </>
    );

};

export default SideInnholdNyLayout;
