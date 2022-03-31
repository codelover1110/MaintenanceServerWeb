import React from 'react';
import { Route, Switch } from 'react-router-dom';

import { List } from './List';
import { AddEdit } from './AddEdit';
import { Fileupload } from './Fileupload';
import { ReportList } from './ReportList';
import { AllReport } from './AllReport';

function MataMain({ match }) {
    const { path } = match;
    
    return (
        <Switch>
            <Route exact path={path} component={List} />
            <Route path={`${path}/add`} component={AddEdit} />
            <Route path={`${path}/edit/:id`} component={AddEdit} />
            <Route path={`${path}/reportupload`} component={Fileupload} />
            <Route path={`${path}/reportlist/:id`} component={ReportList} />
            <Route path={`${path}/allreport/:id`} component={AllReport} />
        </Switch>
    );
}

export { MataMain };