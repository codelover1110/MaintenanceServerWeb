import React from 'react';
import { Route, Switch } from 'react-router-dom';

import { ReportList } from './List';

function ReportlistPage({ match }) {
    const { path } = match;
    
    return (
        <Switch>
            <Route exact path={path} component={ReportList} />
        </Switch>
    );
}

export { ReportlistPage };