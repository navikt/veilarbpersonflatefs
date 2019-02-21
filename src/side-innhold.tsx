import React from 'react';

interface SideInnholdProps {
    mao: React.ReactElement;
    aktivitetsplan: React.ReactElement;
}

const SideInnhold: React.FunctionComponent<SideInnholdProps> = (props: SideInnholdProps) => {

    const { aktivitetsplan, mao } = props;

    return (
        <>
            <div className="hovedinnhold">
                {mao}
            </div>
            <div className="hovedinnhold">
                {aktivitetsplan}
            </div>
        </>
    );

};

export default SideInnhold;
