import React from 'react';
import NavFrontendSpinner from 'nav-frontend-spinner';
import './page-spinner.less';

const PageSpinner: React.FunctionComponent = () => {
    return (
        <div className="page-spinner">
            <NavFrontendSpinner type="XL"/>
        </div>
    );
};

export default PageSpinner;
