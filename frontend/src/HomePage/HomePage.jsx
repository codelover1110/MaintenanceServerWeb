import React from 'react';
import { Navbar } from '../Navbar';
import { BrowserRouter as Router, Route, Switch, Redirect, useLocation } from "react-router-dom";
import { AdminPage } from '../AdminPage';
import { Alert } from '../_components/Alert';
import { DashPage } from '../DashPage';
import {MataMain} from '../MetaMainPage';
import {LocationPage} from '../LocationPage';
import {MetaArchivePage} from '../MetaArchivePage';
import {MaintenancePage} from '../MaintenancePage';
import {ActiveLog} from '../ActiveLog';
import {ReportPage} from '../ReportPage';
import {ReportlistPage} from '../ReportlistPage';

function HomePage() {
  const { pathname } = useLocation();  
  console.log(pathname)
  return (
    <Router>
      <div className="app-container">
        <Navbar />
        <Alert />
        <div className="container mt-5">
          <div className="row">
            <div className="data-table-shop">
              <Switch>
                {/* <Redirect from="/:url*(/+)" to={pathname.slice(0, -1)} /> */}
                <Route path="/" exact component={DashPage} />
                <Route path="/adminuser" component={AdminPage} />
                <Route path="/metadata_main" component={MataMain} />
                <Route path="/location" component={LocationPage} />
                <Route path="/metadata_archive" component={MetaArchivePage} />
                <Route path="/maintenance" component={MaintenancePage} />
                <Route path="/active-log" component={ActiveLog} />
                <Route path="/report" component={ReportPage} />
                <Route path="/reportlistPage" component={ReportlistPage} />
                {/* <Redirect from="*" to="/" /> */}
              </Switch>
            </div>
          </div>
        </div>
      </div>
    </Router>
  )
}

export { HomePage };
