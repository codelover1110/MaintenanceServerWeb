import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';

import { metadataService } from '../_services/metamain_service';
import useOutsideClick from "./useOutsideClick";
import { CSVLink, CSVDownload } from 'react-csv';
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import { useHistory } from "react-router-dom";
import ReactTooltip from "react-tooltip";


const useSortableData = (items, config = null) => {
  const [sortConfig, setSortConfig] = React.useState(config);

  const sortedItems = React.useMemo(() => {
    let sortableItems = items;
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {

        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
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


function ReportList({ match }) {
  const { path } = match;
  const [metaDatas, setMetaDatas] = useState(null);
  const [checkValue, setCheckValue] = useState('');
  const [tempMetaDatas, setTempMetaDatas] = useState(metaDatas)
  const [show, setShow] = useState(false)
  const [imagePreviewUrl, setImagePreviewUrl] = useState('')

  const [csvData, setCsvData] = useState([])
  const [csvMataActivity, setCsvMataActivity] = useState([])
  const [consumptionShow, setConsumptionShow] = useState(false)
  const [consumptionData, setConsumptionData] = useState(null);

  const ref = useRef();
  const history = useHistory()

  const [modalNoteShow, setModalNoteShow] = useState(false)
  const [noteContent, setNoteContent] = useState("")
  const location = useLocation();


  useOutsideClick(ref, () => {
    if (show == true) {
      setShow(false)
    }

    if (consumptionShow == true) {
      setConsumptionShow(false)
    }
  });



  const { items, requestSort, sortConfig } = useSortableData(metaDatas);

  useEffect(() => {
    metadataService.getAllReport()
      .then((x) => {
        console.log(x)
        let printData;
        const initialSearch = x.filter(metaDataItem => ((metaDataItem.active_flag).toLowerCase()).includes(('false') && (metaDataItem.service_repair == 'matadata')))
        setTempMetaDatas(initialSearch)
        setMetaDatas(initialSearch)
        printData = initialSearch
        setCsvData(printData)
        setCheckValue(location.state.equipment_name)

      })
    document.addEventListener("keydown", escFunction, false);

  }, []);

  const escFunction = (event) => {
    if (event.keyCode === 27) {
      setShow(false)
    }
  }


  function deleteData(id, active_flag) {
    confirmAlert({
      title: 'REPORT',
      message: 'Are you sure?.',
      buttons: [
        {
          label: 'Yes',
          onClick: () => deleteConfirm(id, active_flag)
        },
        {
          label: 'No',
          onClick: () => console.log("delete")
        }
      ]
    });

  }

  function deleteConfirm(id, active_flag) {

    metadataService.deleteReportdata(id, active_flag).then(() => {
      const initialSearch = metaDatas.filter(metaDataItem => ((metaDataItem.id) != id))
      setMetaDatas(initialSearch)
    });
  }

  function searchMetaData() {
    if (checkValue == '') {
      setCsvData(tempMetaDatas)

      return
    }
    setMetaDatas(tempMetaDatas)
    setMetaDatas(metaDatas => metaDatas.filter(x => (x.technical_category) && (x.technical_category).toLowerCase() == checkValue.toLocaleLowerCase() || (x.equipment_name) && (x.equipment_name).toLowerCase() == checkValue.toLocaleLowerCase() || (x.service_interval) && (x.service_interval).toLowerCase() == checkValue.toLocaleLowerCase()
      || (x.legit) && (x.legit).toLowerCase() == checkValue.toLocaleLowerCase() || (x.latest_service) && (x.latest_service).toLowerCase() == checkValue.toLocaleLowerCase() || (x.expected_service) && (x.expected_service).toLowerCase() == checkValue.toLocaleLowerCase()
    ));

    const filtered_value = metaDatas.filter(x => (x.technical_category) && (x.technical_category).toLowerCase() == checkValue.toLocaleLowerCase() || (x.equipment_name) && (x.equipment_name).toLowerCase() == checkValue.toLocaleLowerCase() || (x.service_interval) && (x.service_interval).toLowerCase() == checkValue.toLocaleLowerCase()
      || (x.legit) && (x.legit).toLowerCase() == checkValue.toLocaleLowerCase() || (x.latest_service) && (x.latest_service).toLowerCase() == checkValue.toLocaleLowerCase() || (x.expected_service) && (x.expected_service).toLowerCase() == checkValue.toLocaleLowerCase()
    )

    setCsvData(filtered_value)

  }

  function _handleRealtimeSearch(searchKey) {
    const filteredValue = metaDatas.filter(x => (x.technical_category) && ((x.technical_category).toLowerCase()).includes(searchKey.toLocaleLowerCase()) || (x.equipment_name) && ((x.equipment_name).toLowerCase()).includes(searchKey.toLocaleLowerCase()) || (x.service_interval) && ((x.service_interval).toLowerCase()).includes(searchKey.toLocaleLowerCase())
      || (x.legit) && ((x.legit).toLowerCase()).includes(searchKey.toLocaleLowerCase()) || (x.latest_service) && ((x.latest_service).toLowerCase()).includes(searchKey.toLocaleLowerCase()) || (x.expected_service) && ((x.expected_service).toLowerCase()).includes(searchKey.toLocaleLowerCase())
    )
    setMetaDatas(filteredValue)
    setCsvData(filteredValue)
  }


  function _handleInput(e) {
    if (e.target.value == '') {
      setMetaDatas(tempMetaDatas)
      setCsvData(tempMetaDatas)
    }
    setMetaDatas(tempMetaDatas)
    _handleRealtimeSearch(e.target.value);
    setCheckValue(e.target.value);
  }

  function _handleKeydown(e) {
    setMetaDatas(tempMetaDatas)

    if (e.key === 'Enter') {
      searchMetaData()
    }

  }

  function getClassNamesFor(name) {
    if (!sortConfig) {
      return;
    }
    return sortConfig.key === name ? sortConfig.direction : undefined;
  }

  return (
    <div>
      <div className="flex-container" >
        <img src="/src/assets/metadata.png" className="title-image" />
        <h3 className="title-text">Deleted Report List</h3>
      </div>
      <div className="flex-space-around-container">
        <div>
          <input type="text" placeholder="Search..." className="search-input" value={checkValue} onChange={(e) => _handleInput(e)} onKeyDown={(e) => _handleKeydown(e)} />
          <button className="search-button" onClick={(e) => searchMetaData()} ><i className="fa fa-search" style={{ fontSize: '20px' }}></i></button>
        </div>
        <div>
          <CSVLink data={csvData} filename={"meta_data.csv"} className="btn btn-sm btn-primary mb-2"><i className="fa fa-print" style={{ fontSize: '20px' }}></i></CSVLink>
        </div>
      </div>
      <table className="table table-striped" style={{ tableLayout: "fixed" }}>
        <thead>
          <tr>
            <th style={{ width: '3%', wordBreak: 'break-word', textAlign: "center"}}><button
              type="button"
              onClick={() => requestSort('report_data')}
              className={getClassNamesFor('report_data')}
            >Report Data</button></th>
            <th style={{ width: '3%', wordBreak: 'break-word', textAlign: "center"}}><button
              type="button"
              onClick={() => requestSort('equipment_name')}
              className={getClassNamesFor('equipment_name')}
            >Equipment Name</button></th>
            <th style={{ width: '3%', wordBreak: 'break-word', textAlign: "center"}}><button
              type="button"
              onClick={() => requestSort('service_repair')}
              className={getClassNamesFor('service_repair')}
            >Equipment/Service/Repair</button></th>
            <th style={{ width: '3%', wordBreak: 'break-word', textAlign: "center"}}><button
              type="button"
              onClick={() => requestSort('created_date')}
              className={getClassNamesFor('created_date')}
            >Created Date</button></th>
            <th style={{ width: '3%', wordBreak: 'break-word', textAlign: "center"}}><button
              type="button"
              onClick={() => requestSort('update_date')}
              className={getClassNamesFor('update_date')}
            >Update Date</button></th>
            <th style={{ width: '6%', wordBreak: 'break-word', textAlign: "center" }}><button>Action</button></th>
          </tr>
        </thead>
        <tbody>
          {metaDatas && metaDatas.map(metaData =>
            <tr key={metaData.id}>
              <td style={{ width: '3%', wordBreak: 'break-word', textAlign: "center"}}>{metaData.report_data}</td>
              <td style={{ width: '3%', wordBreak: 'break-word', textAlign: "center"}}>{metaData.equipment_name}</td>
              <td style={{ width: '3%', wordBreak: 'break-word', textAlign: "center"}}>{metaData.service_repair}</td>
              <td style={{ width: '3%', wordBreak: 'break-word', textAlign: "center"}}>{((metaData.created_date).replace('T', ' ')).replace('Z', '')}</td>
              <td style={{ width: '3%', wordBreak: 'break-word', textAlign: "center"}}>{((metaData.update_date).replace('T', ' ')).replace('Z', '')}</td>
              <td style={{ width: '6%', wordBreak: 'break-word', textAlign: "center"}}>
                <button className="btn btn-sm btn-primary mr-1 edit-button" onClick={() => window.open(`http://13.80.147.178:8082/media/${metaData.report_data}`, "_blank")}>View</button>
                <button style={{width: 50}} onClick={() => deleteData(metaData.id, metaData.active_flag)} className={`btn btn-sm ${metaData.active_flag == 'true' ? 'btn-danger' : 'btn-success'} btn-delete-user`}>
                  {metaData.active_flag == 'true'
                    // ? <span className="spinner-border spinner-border-sm"></span>
                    ? <span>Delete</span>
                    : <span>Restore</span>
                  }
                </button>
              </td>
            </tr>
   
          )}
          {!metaDatas &&
            <tr>
              <td colSpan="12" className="text-center">
                <div className="spinner-border spinner-border-lg align-center"></div>
              </td>
            </tr>
          }
          {metaDatas && !metaDatas.length &&
            <tr>
              <td colSpan="18" className="text-center">
                <div className="p-2">No Report To Display</div>
              </td>
            </tr>
          }
        </tbody>
      </table>
    </div>
  );
}

export { ReportList };