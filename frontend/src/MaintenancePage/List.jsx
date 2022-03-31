import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

import { metadataService } from '../_services/metamain_service';
import { CSVLink, CSVDownload } from 'react-csv';
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import { useHistory } from "react-router-dom";
import ReactTooltip from "react-tooltip";
import useOutsideClick from "./useOutsideClick";
import { alertService } from '../_services/alert.service';


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


function List({ match }) {
  const { path } = match;
  const [metaDatas, setMetaDatas] = useState(null);
  const [checkValue, setCheckValue] = useState('');
  const [tempMetaDatas, setTempMetaDatas] = useState(metaDatas)
  const [csvData, setCsvData] = useState([])
  const { items, requestSort, sortConfig } = useSortableData(metaDatas);
  const history = useHistory()
  const [consumptionData, setConsumptionData] = useState(null);
  const [consumptionShow, setConsumptionShow] = useState(false)
  const [csvMataActivity, setCsvMataActivity] = useState([])
  const [show, setShow] = useState(false)
  const [modalNoteShow, setModalNoteShow] = useState(false)
  const [noteContent, setNoteContent] = useState("")
  const ref = useRef();

  
  const [equipmentName, setEquipmentName] = useState("")
  const [metaDataID, setMetadataID] = useState("")
  const [serviceRepair, setServiceRepair] = useState("")

  const [initialReportData, setInitialReportData] = useState([])
  const [resetReoprt, setResetReport] = useState(false)

  const [showReportList, setShowReportList] = useState(false)
  const [reportDatas, setReportDatas] = useState(null);
  const [reportModalShow, setReportModalShow] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [file, setFile] = useState('');
  const [imagePreviewUrl, setImagePreviewUrl] = useState('')


  useOutsideClick(ref, () => {
    if (show == true) {
      setShow(false)
    }

    if (consumptionShow == true) {
      setConsumptionShow(false)
    }

    if (modalNoteShow == true) {
      setModalNoteShow(false)
    }

    if (showReportList == true) {
      setShowReportList(false)
      setResetReport(!resetReoprt)
    }
  });

  const _handleReportView = (equipment_id) => {
    console.log(equipment_id)
    setShowReportList(true)
    metadataService.getAllReport()
    .then((x) => {
      const tempReportData = x.filter(metaDataItem => (metaDataItem.equipment_id == equipment_id && metaDataItem.active_flag == 'true' && (metaDataItem.service_repair) != ('Equipment')))
      setReportDatas(tempReportData)
    })
  }
  
  const _handleImageChange = (e) => {
    e.preventDefault();

    let reader = new FileReader();
    let file = e.target.files[0];

    reader.onloadend = () => {
      setImagePreviewUrl(reader.result);
      setFile(file);
    }

    reader.readAsDataURL(file)
  }



  useEffect(() => {
    metadataService.getMaintenance()
      .then((x) => {
        console.log(x)
        setMetaDatas(x)
        setTempMetaDatas(x)
        setCsvData(x)
      })

      metadataService.getAllReport()
      .then((x) => {
        const tempReportData = x.filter(metaDataItem => (metaDataItem.active_flag == 'true' && (metaDataItem.equipment_id - 1 ) >= 0 && (metaDataItem.service_repair) != ('Equipment') ))
        setInitialReportData(tempReportData)
      })

  }, [resetReoprt]);


  function searchMetaData() {
    if (checkValue == '') {
      setCsvData(tempMetaDatas)

      return
    }
    setMetaDatas(tempMetaDatas)
    setMetaDatas(metaDatas => metaDatas.filter(x => (x.service_repair) && (x.service_repair).toLowerCase() == checkValue.toLocaleLowerCase() || (x.equipment_name) && (x.equipment_name).toLowerCase() == checkValue.toLocaleLowerCase() || (x.date) && (x.date).toLowerCase() == checkValue.toLocaleLowerCase()
      || (x.due_time) && (x.due_time).toLowerCase() == checkValue.toLocaleLowerCase() || (x.serviced_by) && (x.serviced_by).toLowerCase() == checkValue.toLocaleLowerCase() || (x.comment) && (x.comment).toLowerCase() == checkValue.toLocaleLowerCase()
    ));

    const filtered_value = metaDatas.filter(x => (x.service_repair) && (x.service_repair).toLowerCase() == checkValue.toLocaleLowerCase() || (x.equipment_name) && (x.equipment_name).toLowerCase() == checkValue.toLocaleLowerCase() || (x.date) && (x.date).toLowerCase() == checkValue.toLocaleLowerCase()
      || (x.due_time) && (x.due_time).toLowerCase() == checkValue.toLocaleLowerCase() || (x.serviced_by) && (x.serviced_by).toLowerCase() == checkValue.toLocaleLowerCase() || (x.comment) && (x.comment).toLowerCase() == checkValue.toLocaleLowerCase()
    )

    setCsvData(filtered_value)

  }

  function _handleRealtimeSearch(searchKey) {
    const filteredValue = metaDatas.filter(x => (x.service_repair) && ((x.service_repair).toLowerCase()).includes(searchKey.toLocaleLowerCase()) || (x.equipment_name) && ((x.equipment_name).toLowerCase()).includes(searchKey.toLocaleLowerCase()) || (x.date) && ((x.date).toLowerCase()).includes(searchKey.toLocaleLowerCase())
      || (x.due_time) && ((x.due_time).toLowerCase()).includes(searchKey.toLocaleLowerCase()) || (x.serviced_by) && ((x.serviced_by).toLowerCase()).includes(searchKey.toLocaleLowerCase()) || (x.comment) && ((x.comment).toLowerCase()).includes(searchKey.toLocaleLowerCase())
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

  const goUserPage = (user_id) => {
    history.push({
      pathname: `../adminuser`,
      state: { detail: user_id }
    });

  }

  function showMaintainModal(equipment_name) {
    metadataService.getMetaActivity(equipment_name)
      .then((x) => {
        if (x.success == "false") {
          alert("There is no consumption data.")
        } else {
          setConsumptionShow(true)
          let result = JSON.parse(x)
          setConsumptionData(result)
          let csvConvertData = []
          result.forEach(element => csvConvertData.push(element["fields"]))
          setCsvMataActivity(csvConvertData)
        }
      })
  };

  function showNoteModal(content) {
    setModalNoteShow(true)
    setNoteContent(content)
  }

  
  function showReportModal(equipment_name) {
    setReportModalShow(true)
  };

  
  
  function deleteReportData(id, active_flag) {
    metadataService.deleteReportdata(id, active_flag).then(() => {
     let tempData = reportDatas.filter(metaDataItem => ((metaDataItem.id) != id))
     setReportDatas(tempData)
   });

 }

 const checkReport = (equipment_id) => {
  let tempReportData = initialReportData.filter(metaDataItem => ((metaDataItem.equipment_id).toLowerCase()).includes(equipment_id))
  if (tempReportData.length > 0) {
    return true
  } else {
    return false
  }
}


function onSubmit() {
  const uploadData = new FormData();
  let fields = {}
  let by_user = JSON.parse(localStorage.getItem('user'));
  fields["by_user"] = by_user.user_name
  fields["equipment_name"] = equipmentName
  fields["service_repair"] = serviceRepair
  fields["equipment_id"] = metaDataID
  console.log(fields)
  console.log((JSON.stringify(fields)))
  if (file != '') {
      uploadData.append('content', JSON.stringify(fields));
      uploadData.append('cover', file);
      metadataService.uploadReport(uploadData)
      .then(() => {
        alertService.success('Report file uploaded.', { keepAfterRouteChange: true });
        setReportModalShow(false)
        setResetReport(!resetReoprt)
      })
      .catch(() => {
        alertService.error(error);
      });
     
  } else {
      alert("Please select report file.")
  }
   

}


  return (
    <div>
      <div className="flex-container" >
        <img src="/src/assets/maintenance_logo.png" className="title-image" />
        <h3 className="title-text">Maintenance</h3>
      </div>
      <div className="flex-space-around-container">
        <div>
          <input type="text" placeholder="Search..." className="search-input" value={checkValue} onChange={(e) => _handleInput(e)} onKeyDown={(e) => _handleKeydown(e)} />
          <button className="search-button" onClick={(e) => searchMetaData()} ><i className="fa fa-search" style={{ fontSize: '20px' }}></i></button>
        </div>
        <div>
          <CSVLink data={csvData} filename={"maintenance.csv"} className="btn btn-sm btn-primary mb-2"><i className="fa fa-print" style={{ fontSize: '20px' }}></i></CSVLink>
        </div>
      </div>
      <table className="table table-striped" style={{ tableLayout: "fixed" }}>
        <thead>
          <tr>
            <th style={{ width: '4%', wordBreak: 'break-word', textAlign: "center"}}><button
              type="button"
              onClick={() => requestSort('equipment_name')}
              className={getClassNamesFor('equipment_name')}
            >Equipment Name</button></th>
            <th style={{ width: '4%', wordBreak: 'break-word', textAlign: "center"}}><button
              type="button"
              onClick={() => requestSort('service_repair')}
              className={getClassNamesFor('service_repair')}
            >Service/Repair</button></th>
            <th style={{ width: '4%', wordBreak: 'break-word', textAlign: "center"}}><button
              type="button"
              onClick={() => requestSort('latest_service')}
              className={getClassNamesFor('latest_service')}
            >Date</button></th>
            <th style={{ width: '4%', wordBreak: 'break-word', textAlign: "center"}}><button
              type="button"
              onClick={() => requestSort('due_time')}
              className={getClassNamesFor('due_time')}
            >Due Time</button></th>
            <th style={{ width: '4%', wordBreak: 'break-word', textAlign: "center"}}><button
              type="button"
              onClick={() => requestSort('serviced_by')}
              className={getClassNamesFor('serviced_by')}
            > Serviced By</button></th>
            <th style={{ width: '4%', wordBreak: 'break-word', textAlign: "center"}}><button
              type="button"
              onClick={() => requestSort('comment')}
              className={getClassNamesFor('comment')}
            >Note</button></th>
             <th style={{ width: '5%', wordBreak: 'break-word', textAlign: "center" }}><button>Report</button></th>
          </tr>
        </thead>
        <tbody>
          {metaDatas && metaDatas.map(metaData =>
            <tr key={metaData.id}>
              <td style={{ width: '4%', wordBreak: 'break-word', textAlign: "center"}} onClick={() => showMaintainModal(metaData.equipment_name)}><button>{metaData.equipment_name}</button></td>
              <td style={{ width: '4%', wordBreak: 'break-word', textAlign: "center"}}>{metaData.service_repair}</td>
              <td style={{ width: '4%', wordBreak: 'break-word', textAlign: "center"}}>{((metaData.latest_service).replace('T', ' ')).replace('Z', '')}</td>
              <td style={{ width: '4%', wordBreak: 'break-word', textAlign: "center"}}>{metaData.due_time}</td>
              <td style={{ width: '4%', wordBreak: 'break-word', textAlign: "center"}}><button onClick={() => goUserPage(metaData.serviced_by)}>{metaData.serviced_by}</button></td>
              <td style={{ width: '4%', wordBreak: 'break-word', textAlign: "center"}} onClick={() => showNoteModal(metaData.comment)}><button>{(metaData.comment).slice(0, 5)}.... </button></td>
              <td style={{ width: '5%', wordBreak: 'break-word', textAlign: "center"}}>
                <Link onClick={() => {showReportModal(metaData.equipment_name); setEquipmentName(metaData.equipment_name); setMetadataID(metaData.id); setServiceRepair(metaData.service_repair)}} className="btn btn-sm btn-primary mr-1 edit-button">Add</Link>
                { checkReport(metaData.id) &&
                  <Link onClick={() => _handleReportView(metaData.id) } className="btn btn-sm btn-primary mr-1 edit-button">View</Link>
                }
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
                <div className="p-2">No Maintenance To Display</div>
              </td>
            </tr>
          }
        </tbody>
      </table>
      <div className={consumptionShow ? "modal display-block" : "modal display-none"}>
        <section className="modal-main" ref={ref}>
          <div>
            <CSVLink data={csvMataActivity} filename={"filter_metaActivity.csv"} className="btn btn-sm btn-primary mb-2"><i className="fa fa-print" style={{ fontSize: '20px' }}></i></CSVLink>
          </div>
          <table className="table table-striped" style={{ tableLayout: "fixed" }}>
            <thead>
              <tr>
                <th style={{ width: '16%', wordBreak: 'break-word', textAlign: "center" }}>
                  Equipment Name
                </th>
                <th style={{ width: '16%', wordBreak: 'break-word', textAlign: "center" }}>
                  Service/Repair
                </th>
                <th style={{ width: '16%', wordBreak: 'break-word', textAlign: "center" }}>
                  Date
                </th>
                <th style={{ width: '16%', wordBreak: 'break-word', textAlign: "center" }}>
                  Due Time
                </th>
                <th style={{ width: '16%', wordBreak: 'break-word', textAlign: "center" }}>
                  Serviced By
                </th>
                <th style={{ width: '16%', wordBreak: 'break-word', textAlign: "center" }}>
                  Note
                </th>
              </tr>
            </thead>
            <tbody>
              {consumptionData && consumptionData.map(data =>
                <tr key={data.pk}>
                  <td>{data.fields.equipment_name}</td>
                  <td>{data.fields.service_repair}</td>
                  <td>{((data.fields.latest_service).replace('T', ' ')).replace('Z', '')}</td>
                  <td>{data.fields.due_time}</td>
                  <td><button onClick={() => goUserPage(data.fields.serviced_by)} className="link-button">{data.fields.serviced_by}</button></td>
                  <td onClick={() => showNoteModal(data.fields.comment)}><button>{(data.fields.comment).slice(0, 5)}.... </button></td>
                </tr>
              )}
            </tbody>
          </table>
        </section>
      </div>
      <div className={modalNoteShow ? "modal display-block" : "modal display-none"}>
        <section className="note-modal-main" ref={ref}>
          <div><textarea value={noteContent} /></div>
          <div>
            <button onClick={() => setModalNoteShow(false)}>Done</button>
          </div>
        </section>
      </div>
    
      <div className={reportModalShow ? "modal display-block" : "modal display-none"}>
        <section className="note-modal-main" ref={ref}>
        <div>
            <div>
              <div className="addedit-form-modal" encType="multipart/form-data">
                  <div className="title-container">
                  </div>
                <div className="form-row" style={{marginTop: 100}}>
                  <div className="form-group col-12">
                    <div className="form-group col-9">
                      <input name="picture" type="file" className={'form-control'} onChange={(e) => _handleImageChange(e)} style={{marginLeft: 90}} />
                    </div>
                  </div>
                </div>

                <div className="form-button-group" style={{marginTop: 50, display: 'flex', justifyContent: 'center'}}>
                  <div>
                    <button onClick={onSubmit} className="btn btn-success tranform-none">
                      {isSubmitting && <span className="spinner-border spinner-border-sm mr-1"></span>}
                                    Save
                    </button>
                  </div>
                
                  <div>
                    <button className="btn btn-success tranform-none" onClick={() => setReportModalShow(false)}>Cancel</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
      <div className={showReportList ? "modal display-block" : "modal display-none"}>
        <section className="modal-main" ref={ref}>
          <table className="table table-striped" style={{ tableLayout: "fixed" }}>
            <thead>
              <tr>
                  <th style={{ width: '4%', wordBreak: 'break-word', textAlign: "center"}}>Report Data</th>
                  <th style={{ width: '3%', wordBreak: 'break-word', textAlign: "center"}}>Created Date</th>
                  {/* <th style={{ width: '3%', wordBreak: 'break-word', textAlign: "center"}}>Update Date</th> */}
                  <th style={{ width: '4%', wordBreak: 'break-word', textAlign: "center" }}><button>Action</button></th>
                </tr>
              </thead>
            <tbody>
                {reportDatas && reportDatas.map(reportData =>
                  <tr key={reportData.id}>
                    <td style={{ width: '4%', wordBreak: 'break-word', textAlign: "center"}}>{reportData.report_data}</td>
                    <td style={{ width: '3%', wordBreak: 'break-word', textAlign: "center"}}>{((reportData.created_date).replace('T', ' ')).replace('Z', '')}</td>
                    {/* <td style={{ width: '3%', wordBreak: 'break-word', textAlign: "center"}}>{((reportData.update_date).replace('T', ' ')).replace('Z', '')}</td> */}
                    <td style={{ width: '4%', wordBreak: 'break-word', textAlign: "center"}}>
                      <button className="btn btn-sm btn-primary mr-1 edit-button" onClick={() => window.open(`http://13.80.147.178:8082/media/${reportData.report_data}`, "_blank")} disabled={reportData.active_flag == 'true' ? false : true}>View</button>
                      <button style={{width: 50}} onClick={() => deleteReportData(reportData.id, reportData.active_flag)} className={`btn btn-sm ${reportData.active_flag == 'true' ? 'btn-danger' : 'btn-success'} btn-delete-user`}>
                        {reportData.active_flag == 'true'
                          ? <span>Delete</span>
                          : <span>Restore</span>
                        }
                      </button>
                    </td>
                  </tr>
        
                )}
                {!reportDatas &&
                  <tr>
                    <td colSpan="12" className="text-center">
                      <div className="spinner-border spinner-border-lg align-center"></div>
                    </td>
                  </tr>
                }
                {reportDatas && !reportDatas.length &&
                  <tr>
                    <td colSpan="18" className="text-center">
                      <div className="p-2">No Report To Display</div>
                    </td>
                  </tr>
                }
              </tbody>
          </table>
        </section>
      </div>
    </div>
  );
}

export { List };