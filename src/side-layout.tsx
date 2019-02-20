import React from 'react';

interface SideLayoutProps {
    visittkort: React.ReactElement;
    mao: React.ReactElement;
    aktivitetsplan: React.ReactElement;
}

class SideLayout extends React.Component<SideLayoutProps> {


    render() {
        return (
            <div>
                {this.props.visittkort}
                {this.props.mao}
                {this.props.aktivitetsplan}
            </div>
        );
    }

}

export default SideLayout;
