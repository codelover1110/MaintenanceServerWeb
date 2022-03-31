import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';

import { metadataService } from '../_services/metamain_service';
import useOutsideClick from "./useOutsideClick";
import { CSVLink, CSVDownload } from 'react-csv';
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import { useHistory } from "react-router-dom";
import ReactTooltip from "react-tooltip";
import { Formik, Field, Form, ErrorMessage } from 'formik';
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
  const [reportDatas, setReportDatas] = useState(null);
  const [checkValue, setCheckValue] = useState('');
  const [tempMetaDatas, setTempMetaDatas] = useState(metaDatas)
  const [show, setShow] = useState(false)
  const [imagePreviewUrl, setImagePreviewUrl] = useState('')

  const [csvData, setCsvData] = useState([])
  const [csvMataActivity, setCsvMataActivity] = useState([])
  const [consumptionShow, setConsumptionShow] = useState(false)
  const [consumptionData, setConsumptionData] = useState(null);

  const [reportModalShow, setReportModalShow] = useState(false)
  const [showReportList, setShowReportList] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [file, setFile] = useState('');

  const ref = useRef();
  const ref_report = useRef();
  const history = useHistory()

  const [modalNoteShow, setModalNoteShow] = useState(false)
  const [noteContent, setNoteContent] = useState("")
  const location = useLocation();

  const [equipmentName, setEquipmentName] = useState("")
  const [metaDataID, setMetadataID] = useState("")

  const [serviceRepair, setServiceRepair] = useState("")

  const [initialReportData, setInitialReportData] = useState([])
  const [initialReportMaintanceData, setInitialReportMaintanceData] = useState([])
  const [resetReoprt, setResetReport] = useState(false)
  const [resetReportMaintance, setResetReportMaintance] = useState(false)


  useOutsideClick(ref, () => {
    if (show == true) {
      setShow(false)
    }

    if (showReportList == true) {
      setShowReportList(false)
      setResetReport(!resetReoprt)
      setReportDatas(null)
    }
  });


  useOutsideClick(ref_report, () => {
    if (show == true) {
      setShow(false)
    }
  });



  const { items, requestSort, sortConfig } = useSortableData(metaDatas);

  useEffect(() => {
    metadataService.getAllArchive()
      .then((x) => {
        setTempMetaDatas(x)
        let printData;
        if ((location.state) && location.state.equipment_name != "") {
          const initialSearch = x.filter(metaDataItem => ((metaDataItem.equipment_name).toLowerCase()).includes((location.state.equipment_name).toLowerCase()))
          setMetaDatas(initialSearch)
          printData = initialSearch
          printData.map((metaData) => {
            delete metaData.contacts
            delete metaData.meta_data_picture
          })
          setCsvData(printData)
          setCheckValue(location.state.equipment_name)

        } else {
          setMetaDatas(x)
          printData = x
          printData.map((metaData) => {
            delete metaData.contacts
            delete metaData.meta_data_picture
          })
          setCsvData(printData)

        }
        metadataService.getAllReport()
        .then((x) => {
          let tempReportData = x.filter(metaDataItem => (metaDataItem.service_repair == 'Equipment' && metaDataItem.active_flag == 'true'))
          let tempRportMaintenceData = x.filter(metaDataItem => (metaDataItem.active_flag == 'true' && metaDataItem.service_repair != 'Equipment'))
          setInitialReportData(tempReportData)
          setInitialReportMaintanceData(tempRportMaintenceData)
        })
      })
    document.addEventListener("keydown", escFunction, false);

  }, [resetReoprt, resetReportMaintance]);

  const escFunction = (event) => {
    if (event.keyCode === 27) {
      setShow(false)
    }
  }

  const checkReport = (equipment_id) => {
    let tempReportData = initialReportData.filter(metaDataItem => ((metaDataItem.equipment_id).toLowerCase()).includes(equipment_id))
    if (tempReportData.length > 0) {
      return true
    } else {
      return false
    }
  }
  const checkReportMaintance = (equipment_id) => {
    let tempReportData = initialReportMaintanceData.filter(metaDataItem => ((metaDataItem.equipment_id).toLowerCase()).includes(equipment_id))
    if (tempReportData.length > 0) {
      return true
    } else {
      return false
    }
  }


  function deleteData(id) {
    confirmAlert({
      title: 'MetaData',
      message: 'Are you sure to delete this data?.',
      buttons: [
        {
          label: 'Yes',
          onClick: () => deleteConfirm(id)
        },
        {
          label: 'No',
          onClick: () => console.log("delete")
        }
      ]
    });

  }

  function deleteConfirm(id) {
    let by_user = JSON.parse(localStorage.getItem('user'));

    setMetaDatas(metaDatas.map(x => {
      if (x.id === id) { x.isDeleting = true; }
      return x;
    }));
    metadataService.delete(id, by_user.user_name).then(() => {
      setMetaDatas(metaDatas => metaDatas.filter(x => x.id !== id));
    });
  }

  
  function deleteReportData(id, active_flag) {
     metadataService.deleteReportdata(id, active_flag).then(() => {
      let tempData = reportDatas.filter(metaDataItem => ((metaDataItem.id) != id))
      setReportDatas(tempData)
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


  function showMaintainModal(equipment_name) {
    metadataService.getMetaActivity(equipment_name)
      .then((x) => {
        if (x.success == "false") {
          alert("There is no consumption data.")
        } else {
          setConsumptionShow(true)
          let result = JSON.parse(x)
          console.log(result)

          setConsumptionData((result).reverse())
          let csvConvertData = []
          result.forEach(element => csvConvertData.push(element["fields"]))
          setCsvMataActivity(csvConvertData)
        }
      })
  };

  function showReportModal(equipment_name) {
    setReportModalShow(true)
  };

  const hideModal = () => {
    setShow(false)
  };

  const goUserPage = (user_id) => {
    history.push({
      pathname: `../adminuser`,
      state: { detail: user_id }
    });
  }

  function showNoteModal(content) {
    setModalNoteShow(true)
    setNoteContent(content)
  }

  function onSubmit() {
    const uploadData = new FormData();
    let fields = {}
    let by_user = JSON.parse(localStorage.getItem('user'));
    fields["by_user"] = by_user.user_name
    fields["equipment_name"] = equipmentName
    fields["service_repair"] = 'Equipment'
    if (consumptionShow) {
      fields["equipment_id"] = metaDataID
      fields["service_repair"] = serviceRepair
    } else {
      fields["service_repair"] = 'Equipment'
      fields["equipment_id"] = metaDataID
    }
    console.log(fields)
    console.log((JSON.stringify(fields)))
    if (file != '') {
        uploadData.append('content', JSON.stringify(fields));
        uploadData.append('cover', file);
        metadataService.uploadReport(uploadData)
        .then(() => {
          alertService.success('Report file uploaded.', { keepAfterRouteChange: true });
          setReportModalShow(false)
          setServiceRepair("")
          setResetReport(!resetReoprt)
          setResetReportMaintance(!resetReportMaintance)
        })
        .catch(() => {
          alertService.error(error);
        });
       
    } else {
        alert("Please select report file.")
    }
     

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

  const _handleReportView = (equipment_id) => {
    setShowReportList(true)
    console.log(equipment_id)
    console.log(consumptionShow)
    metadataService.getAllReport()
    .then((x) => {
      let tempReportData
      if (!consumptionShow) {
        tempReportData = x.filter(metaDataItem => (metaDataItem.equipment_id == equipment_id && metaDataItem.service_repair == 'Equipment' && metaDataItem.active_flag == 'true'))
      } else {
        tempReportData = x.filter(metaDataItem => ((metaDataItem.equipment_id).toLowerCase().includes((equipment_id)) && metaDataItem.active_flag == 'true' && metaDataItem.service_repair != 'Equipment'))
      }
      setReportDatas(tempReportData)
    })
  }

  return (
    <div>
      <div className="flex-container" >
        <img src="/src/assets/metadata.png" className="title-image" />
        <h3 className="title-text">MetaData</h3>
      </div>
      <div className="flex-space-around-container">
        <div>
          <input type="text" placeholder="Search..." className="search-input" value={checkValue} onChange={(e) => _handleInput(e)} onKeyDown={(e) => _handleKeydown(e)} />
          <button className="search-button" onClick={(e) => searchMetaData()} ><i className="fa fa-search" style={{ fontSize: '20px' }}></i></button>
        </div>
        <div>
          <CSVLink data={csvData} filename={"meta_data.csv"} className="btn btn-sm btn-primary mb-2"><i className="fa fa-print" style={{ fontSize: '20px' }}></i></CSVLink>
          <Link to={{ pathname: `${path}/add`, state: { metaDatas: metaDatas } }} className="btn btn-sm btn-default mb-2"><i className="fa far fa-edit" style={{ fontSize: '20px' }}></i></Link>
        </div>
      </div>
      <button className="go-navigate"><Link to="/metadata_main" className="nav-item nav-link">Go MetaData</Link></button>
      <table className="table table-striped" style={{ tableLayout: "fixed" }}>
        <thead>
          <tr>
            <th style={{ width: '3%', wordBreak: 'break-word', textAlign: "center"}}><button
              type="button"
              onClick={() => requestSort('technocal_category')}
              className={getClassNamesFor('technocal_category')}
            >Technical Category</button></th>
            <th style={{ width: '3%', wordBreak: 'break-word', textAlign: "center"}}><button
              type="button"
              onClick={() => requestSort('equipment_name')}
              className={getClassNamesFor('equipment_name')}
            >Equipment Name</button></th>
            <th style={{ width: '4%', wordBreak: 'break-word', textAlign: "center"}}><button
              type="button"
              onClick={() => requestSort('service_interval')}
              className={getClassNamesFor('service_interval')}
            >Service Interval [Month]</button></th>
            <th style={{ width: '2%', wordBreak: 'break-word', textAlign: "center"}}><button
              type="button"
              onClick={() => requestSort('legit')}
              className={getClassNamesFor('legit')}
            >Legal</button></th>
            <th style={{ width: '3%', wordBreak: 'break-word', textAlign: "center"}}><button
              type="button"
              onClick={() => requestSort('latest_service')}
              className={getClassNamesFor('latest_service')}
            >Latest Service</button></th>
            <th style={{ width: '3%', wordBreak: 'break-word', textAlign: "center"}}><button
              type="button"
              onClick={() => requestSort('expected_service')}
              className={getClassNamesFor('expected_service')}
            >Expected Service</button></th>
            <th style={{ width: '5%', wordBreak: 'break-word', textAlign: "center" }}><button>Report</button></th>
          </tr>
        </thead>
        <tbody>
          {metaDatas && metaDatas.map(metaData =>
            <tr key={metaData.id}>
              <td style={{ width: '3%', wordBreak: 'break-word', textAlign: "center"}}>{metaData.technical_category}</td>
              <td style={{ width: '3%', wordBreak: 'break-word', textAlign: "center"}} onClick={() => showMaintainModal(metaData.equipment_name)}><button>{metaData.equipment_name}</button></td>
              <td style={{ width: '4%', wordBreak: 'break-word', textAlign: "center"}}>{metaData.service_interval}</td>
              <td style={{ width: '2%', wordBreak: 'break-word', textAlign: "center"}}>{metaData.legit}</td>
              <td style={{ width: '3%', wordBreak: 'break-word', textAlign: "center"}}>{((metaData.latest_service).replace('T', ' ')).replace('Z', '')}</td>
              <td style={{ width: '3%', wordBreak: 'break-word', textAlign: "center"}}>{((metaData.expected_service).replace('T', ' ')).replace('Z', '')}</td>
              <td style={{ width: '5%', wordBreak: 'break-word', textAlign: "center"}}>
                { checkReport(metaData.active_id) &&
                  <Link onClick={() => _handleReportView(metaData.active_id) } className="btn btn-sm btn-primary mr-1 edit-button">View</Link>
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
                <div className="p-2">No MetaData To Display</div>
              </td>
            </tr>
          }
        </tbody>
      </table>
      <div className={show ? "modal display-block" : "modal display-none"} >
        <section className="modal-main" ref={ref}>
          <img src={imagePreviewUrl} className="modal-image" alt="Please select the image." />
          <button onClick={hideModal} className="cancel-button-modal">X</button>
        </section>
      </div>
      <div className={consumptionShow ? "modal display-block" : "modal display-none"}>
        <section className="modal-main" ref={ref_report}>
          <div>
            <CSVLink data={csvMataActivity} filename={"filter_metaActivity.csv"} className="btn btn-sm btn-primary mb-2"><i className="fa fa-print" style={{ fontSize: '20px' }}></i></CSVLink>
            <button onClick={() => setConsumptionShow(false)} className="cancel-button-modal">X</button>
          </div>
          <table className="table table-striped" style={{ tableLayout: "fixed" }}>
            <thead>
              <tr>
                <th style={{ width: '10%', wordBreak: 'break-word', textAlign: "center" }}>
                  Equipment Name
                </th>
                <th style={{ width: '10%', wordBreak: 'break-word', textAlign: "center" }}>
                  Service/Repair
                </th>
                <th style={{ width: '10%', wordBreak: 'break-word', textAlign: "center" }}>
                  Date
                </th>
                <th style={{ width: '10%', wordBreak: 'break-word', textAlign: "center" }}>
                  Due Time
                </th>
                <th style={{ width: '10%', wordBreak: 'break-word', textAlign: "center" }}>
                  Serviced By
                </th>
                <th style={{ width: '10%', wordBreak: 'break-word', textAlign: "center" }}>
                  Note
                </th>
                <th style={{ width: '20%', wordBreak: 'break-word', textAlign: "center" }}>
                  Report
                </th>
              </tr>
            </thead>
            <tbody>
              {consumptionData && consumptionData.map(data =>
                <tr key={data.pk}>
                  <td style={{ width: '10%', wordBreak: 'break-word', textAlign: "center" }}>{data.fields.equipment_name}</td>
                  <td style={{ width: '10%', wordBreak: 'break-word', textAlign: "center" }}>{data.fields.service_repair}</td>
                  <td style={{ width: '10%', wordBreak: 'break-word', textAlign: "center" }}>{((data.fields.latest_service).replace('T', ' ')).replace('Z', '')}</td>
                  <td style={{ width: '10%', wordBreak: 'break-word', textAlign: "center" }}>{data.fields.due_time}</td>
                  <td style={{ width: '10%', wordBreak: 'break-word', textAlign: "center" }}><button onClick={() => goUserPage(data.fields.serviced_by)} className="link-button">{data.fields.serviced_by}</button></td>
                  <td style={{ width: '10%', wordBreak: 'break-word', textAlign: "center" }} onClick={() => showNoteModal(data.fields.comment)}><button>{(data.fields.comment).slice(0, 5)}.... </button></td>
                  <td style={{ width: '20%', wordBreak: 'break-word', textAlign: "center" }}>
                    { checkReportMaintance(data.pk) &&
                      <Link onClick={() => _handleReportView(data.pk) } className="btn btn-sm btn-primary mr-1 edit-button">View</Link>
                    }
                  </td>
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