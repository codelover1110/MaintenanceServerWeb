import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CSVLink, CSVDownload } from 'react-csv';
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css

import { metadataService } from '../_services/metadata_service';

const useSortableData = (items, config = null) => {
    const [sortConfig, setSortConfig] = useState(config);

    const sortedItems = React.useMemo(() => {
        let sortableItems = items;
        if (sortConfig !== null) {
            sortableItems.sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? -1 : 1;
                }
                if (a[sortConfig.key] > b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? 1 : -1
                }
                return 0;
            });
        }
        return sortableItems;
    }, [items, sortConfig]);

    const requestSort = (key) => {
        let direction = 'ascending';
        if (
            sortConfig &&
            sortConfig.key === key &&
            sortConfig.direction === 'ascending'
        ) {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    return { items: sortedItems, requestSort, sortConfig };
};

function ActiveLog({ match }) {
    const { path } = match;
    const [activeData, setActiveLogData] = useState(null);
    const [checkValue, setCheckValue] = useState('');
    const [tempActiveData, setTempActiveData] = useState(activeData)

    const { items, requestSort, sortConfig } = useSortableData(activeData);
    const [csvData, setCsvData] = useState([])

    const getClassNamesFor = (name) => {
        if (!sortConfig) {
            return;
        }
        return sortConfig.key === name ? sortConfig.direction : undefined;
    };

    useEffect(() => {
        metadataService.getActiveDataAll()
            .then((x) => {
                setActiveLogData(x)
                setTempActiveData(x)
                setCsvData(x)
            })
    }, []);

    function searchActiveData() {
        if (checkValue == '') {
            return
        }
        setActiveLogData(tempActiveData)
        setActiveLogData(activeData => activeData.filter(x => (x.page).toLowerCase() == checkValue.toLowerCase() || (x.column_name).toLowerCase() == checkValue.toLowerCase() || (x.column_id).toLowerCase() == checkValue.toLowerCase()
        || (x.from_by).toLowerCase() == checkValue.toLowerCase() || (x.to_by).toLowerCase() == checkValue.toLowerCase() || (x.user_by).toLowerCase() == checkValue.toLowerCase() || (x.modify_date).toLowerCase() == checkValue.toLowerCase()));
        const filtered_value = activeData.filter(x => (x.page).toLowerCase() == checkValue.toLowerCase() || (x.column_name).toLowerCase() == checkValue.toLowerCase() || (x.column_id).toLowerCase() == checkValue.toLowerCase()
            || (x.from_by).toLowerCase() == checkValue.toLowerCase() || (x.to_by).toLowerCase() == checkValue.toLowerCase() || (x.user_by).toLowerCase() == checkValue.toLowerCase() || (x.modify_date).toLowerCase() == checkValue.toLowerCase())
        console.log(filtered_value)
        setCsvData(filtered_value)

    }

    function _handleInput(e) {
        if (e.target.value == '') {
            setActiveLogData(tempActiveData)
            setCsvData(tempActiveData)
        }
        setCheckValue(e.target.value);
        setActiveLogData(tempActiveData)
        _handleRealtimeSearch(e.target.value);

    }

    function _handleRealtimeSearch(searchKey) {
        const filteredValue = activeData.filter(x => ((x.page).toLowerCase()).includes(searchKey.toLowerCase()) || ((x.column_name).toLowerCase()).includes(searchKey.toLowerCase()) || ((x.column_id).toLowerCase()).includes(searchKey.toLowerCase())
        || ((x.from_by).toLowerCase()).includes(searchKey.toLowerCase()) || ((x.to_by).toLowerCase()).includes(searchKey.toLowerCase()) || ((x.user_by).toLowerCase()).includes(searchKey.toLowerCase()) || ((x.modify_date).toLowerCase()).includes(searchKey.toLowerCase())
        )
        setActiveLogData(filteredValue)
        setCsvData(filteredValue)
    }


    function _handleKeydown(e) {
        // searchActiveData()
        setActiveLogData(tempActiveData)
        if (e.key === 'Enter') {
            searchActiveData()
        }
    }

    return (
        <div>
            <div className="flex-container">
                <img src="/src/assets/new_active_log1.png" className="title-image" />
                <h3 className="title-text">Activity Log</h3>
            </div>
            <div className="flex-space-around-container">
                <div>
                    <input type="text" placeholder="Search..." className="search-input" value={checkValue} onChange={(e) => _handleInput(e)} onKeyDown={(e) => _handleKeydown(e)} />
                    <button className="search-button" onClick={() => searchActiveData()} ><i className="fa fa-search" style={{ fontSize: '20px' }}></i></button>
                </div>
                <div>
                    <CSVLink data={csvData} filename={"active_logs.csv"} className="btn btn-sm btn-primary mb-2"><i className="fa fa-print" style={{ fontSize: '20px' }}></i></CSVLink>
                </div>
            </div>
            <table className="table table-striped" style={{ tableLayout: "fixed" }}>
                <thead>
                    <tr>
                        <th style={{ width: '14%', wordBreak: 'break-word', textAlign: "center" }}>
                            <button
                                type="button"
                                onClick={() => requestSort('page')}
                                className={getClassNamesFor('page')}
                            >Page</button>
                        </th>
                        <th style={{ width: '14%', wordBreak: 'break-word', textAlign: "center" }}>
                            <button
                                type="button"
                                onClick={() => requestSort('column_name')}
                                className={getClassNamesFor('column_name')}
                            >Column Name</button>
                        </th>
                        <th style={{ width: '14%', wordBreak: 'break-word', textAlign: "center" }}>
                            <button
                                type="button"
                                onClick={() => requestSort('column_id')}
                                className={getClassNamesFor('column_id')}
                            >Column ID</button>
                        </th>
                        <th style={{ width: '14%', wordBreak: 'break-word', textAlign: "center" }}>
                            <button
                                type="button"
                                onClick={() => requestSort('from_by')}
                                className={getClassNamesFor('from_by')}
                            >From</button>
                        </th>
                        <th style={{ width: '14%', wordBreak: 'break-word', textAlign: "center" }}>
                            <button
                                type="button"
                                onClick={() => requestSort('to_by')}
                                className={getClassNamesFor('to_by')}
                            >To</button>
                        </th>
                        <th style={{ width: '14%', wordBreak: 'break-word', textAlign: "center" }}>
                            <button
                                type="button"
                                onClick={() => requestSort('user_by')}
                                className={getClassNamesFor('user_by')}
                            >By</button>
                        </th>
                        <th style={{ width: '14%', wordBreak: 'break-word', textAlign: "center" }}>
                            <button
                                type="button"
                                onClick={() => requestSort('modify_date')}
                                className={getClassNamesFor('modify_date')}
                            >Date/Time</button>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {activeData && (activeData.reverse()).map(activeLog =>
                        <tr key={activeLog.id}>
                            <td>{activeLog.page}</td>
                            <td>{activeLog.column_name}</td>
                            <td>{activeLog.column_id}</td>
                            <td>{((activeLog.from_by).replace('T', ' ')).replace('Z', '')}</td>
                            <td>{((activeLog.to_by).replace('T', ' ')).replace('Z', '')}</td>
                            <td>{activeLog.user_by}</td>
                            <td>{((activeLog.modify_date).replace('T', ' ')).replace('Z', '')}</td>
                        </tr>
                    )}
                    {!activeData &&
                        <tr>
                            <td colSpan="12" className="text-center">
                                <div className="spinner-border spinner-border-lg align-center"></div>
                            </td>
                        </tr>
                    }
                    {activeData && !activeData.length &&
                        <tr>
                            <td colSpan="18" className="text-center">
                                <div className="p-2">No ActiveLog To Display</div>
                            </td>
                        </tr>
                    }
                </tbody>
            </table>
        </div>
    );
}

export { ActiveLog };