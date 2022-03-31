import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';

import { metadataService } from '../_services/metamain_service';
import { userService } from '../_services/user.service';
import { alertService } from '../_services/alert.service';
import useOutsideClick from "./useOutsideClick";
import Select from "react-select";
import { noConflict } from 'lodash';
import { CSVLink, CSVDownload } from 'react-csv';



function AddEdit({ history, match }) {
  const { id } = match.params;
  const isAddMode = !id;
  const ref = useRef();


  const initialValues = {
    technical_category: '',
    equipment_name: '',
    nfc_tag: '',
    service_interval: '',
    legit: '',
    expected_service: '',
    latest_service: '',
    contacts: '',
    longitude: '',
    latitude: '',
    reminder_month: '',
    reminder_week: ''

  };


  const [file, setFile] = useState('');
  const [imagePreviewUrl, setImagePreviewUrl] = useState('');
  const [longitude, setLongitude] = useState('')
  const [latitude, setLatitude] = useState('')
  const [show, setShow] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [techicalOptions, setTechicalOptions] = useState([]);
  const [defaultTechnicalValue, setDefaultTechnicalValue] = useState()
  const [defaultLegalValue, setDefaultLegalValue] = useState()

  const [latestServiceDate, setLatestServiceDate] = useState('')
  const [serviceIntervalMonth, setServiceIntervalMonth] = useState('')
  const [expectedServiceDate, setExpectedServiceDate] = useState('')
  const [usersOptions, setUsersOptions] = useState([])
  const [defaultUser, setDefaultUser] = useState()
  const [selectedOptions, setSelectedOptions] = useState([])

  const [technicalVail, setTechnicalVali] = useState(false)
  const [equipVali, setEquipVali] = useState(false)
  const [nfcVali, setNfcVali] = useState(false)
  const [legalVali, setLegalVali] = useState(false)
  const [intervalVali, setIntervalVali] = useState(false)
  const [latestServiceVali, setLatestServiceVali] = useState(false)
  const [contactsVali, setContactsVali] = useState(false)
  const [longitudeVali, setLongitudeVali] = useState(false)
  const [latitudeVali, setLatitudeVali] = useState(false)

  const [showActive, setShowActive] = useState(false)
  const [activeLog, setActiveLog] = useState('')
  const [csvActiveData, setCsvActiveData] = useState([])
  const [activeData, setActiveData] = useState()

  const [equipmentName, setEquipmentName] = useState('')
  const [serviceRepair, setServiceRepair] = useState('')
  const [equipmentId, setEquipmentId] = useState('')

  const escFunction = (event) => {
    if (event.keyCode === 27) {
      setShow(false)
    }
  }

  useOutsideClick(ref, () => {
    if (show == true) {
      setShow(false)
    }
    if (showActive == true) {
      setShowActive(false)
    }
  });


  useEffect(() => {
    document.addEventListener("keydown", escFunction, false);
    userService.getTechnicalCatetory()
      .then((x) => {
        const transformed = x.map(({ id, name }) => ({ value: id, label: name }));
        setTechicalOptions(transformed)
      })

    userService.getAll()
      .then((x) => {
        const transformed = x.map(({ id, email, user_name }) => ({ label: email, value: id, user_name: user_name }));
        setUsersOptions(transformed)
      })
  }, []);

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

  const validationSchema = Yup.object().shape({
    // nfcTag: Yup.string()
    //   .required('value is required'),
    // longitude: Yup.string()
    //   .required('value is required'),
    // latitude: Yup.string()
    //   .required('value is required'),
    // technical: Yup.string()
    //   .required('value is required'),
    // equipmentName: Yup.string()
    //   .required('value is required'),
    // legal: Yup.string()
    //   .required('value is required'),
    // expectedService: Yup.string()
    //   .required('value is required'),
    // latestService: Yup.string()
    //   .required('value is required'),
    // serviceInterval: Yup.string()
    //   .required('value is required'),
    // contact_email: Yup.string()
    //   .required('value is required'),
  });



  function onSubmit(fields, { setStatus, setSubmitting }) {

    const uploadData = new FormData();
    let by_user = JSON.parse(localStorage.getItem('user'));
    fields["by_user"] = by_user.user_name
    fields["contacts"] = JSON.stringify(selectedOptions)
    fields["service_interval"] = serviceIntervalMonth
    fields["expected_service"] = expectedServiceDate
    fields["latest_service"] = latestServiceDate
    if (fields["technical_category"] == "") {
      setTechnicalVali(true)
    } else {
      setTechnicalVali(false)
    }
    if (fields["equipment_name"] == "") {
      setEquipVali(true)
    } else {
      setEquipVali(false)
    }
    if (fields["nfc_tag"] == "") {
      setNfcVali(true)
    } else {
      setNfcVali(false)
    }
    if (fields["service_interval"] == "") {
      setIntervalVali(true)
    } else {
      setIntervalVali(false)
    }
    if (fields["legit"] == "") {
      setLegalVali(true)
    } else {
      setLegalVali(false)
    }
    if (fields["latest_service"] == "") {
      setLatestServiceVali(true)
    } else {
      setLatestServiceVali(false)
    }
    if (fields["longitude"] == "") {
      setLongitudeVali(true)
    } else {
      setLongitudeVali(false)
    }
    if (fields["latitude"] == "") {
      setLatitudeVali(true)
    } else {
      setLatitudeVali(false)
    }
    if (fields["contacts"] == "[]") {
      setContactsVali(true)
    } else {
      setContactsVali(false)
    }

    if (fields["technical_category"] != "" && fields["equipment_name"] != "" && fields["nfc_tag"] != "" && fields["service_interval"] != "" && fields["legit"] != "" && fields["latest_service"] != "" && fields["longitude"] != "" && fields["latitude"] != "" && contactsVali != "[]") {
      uploadData.append('content', JSON.stringify(fields));
      if (file != '') {
        uploadData.append('cover', file);
      }
      if (isAddMode) {
        createUser(uploadData, setSubmitting);
        setIsSubmitting(false)
      } else {
        updateUser(id, uploadData, setSubmitting);
        setIsSubmitting(false)
      }
    }


  }

  function createUser(fields, setSubmitting) {
    metadataService.create(fields)
      .then((res) => {
        if (res.success == 'equipment') {
          alert(`Equipment Name: ${res.equipment_name}, already exists`)
        } else if (res.success == 'nfc') {
          alert(`NFC Tag:${res.nfc_tag}, already exists`)
        } else {
          alertService.success('Meta data added', { keepAfterRouteChange: true });
          history.push('.');
        }
      })
      .catch(() => {
        console.log(false)
        setSubmitting(false);
        alertService.error(error);
      });
  }

  function updateUser(id, fields, setSubmitting) {
    metadataService.update(id, fields)
      .then(() => {
        alertService.success('Meta data updated', { keepAfterRouteChange: true });
        history.push('../');
      })
      .catch(error => {
        setIsSubmitting(false)
        setSubmitting(false);
        alertService.error(error);
      });
  }

  const showModal = () => {
    setShow(true)
  };

  const hideModal = () => {
    setShow(false)
  };

  const leqalOption = [
    { value: "Yes", label: "Yes" },
    { value: "No", label: "No" },
  ]

  const calculateExpectedValue = (e) => {
    if (e.target.value != "" && serviceIntervalMonth != "") {
      let dt = new Date(e.target.value);
      let service_date = (new Date(dt.setMonth(dt.getMonth() + parseInt(serviceIntervalMonth)))).toISOString()
      let convertString = (service_date.split('T'))[0]
      setLatestServiceDate(e.target.value)
      setExpectedServiceDate(convertString);
    } else {
      setLatestServiceDate(e.target.value)
      setExpectedServiceDate(e.target.value);
    }

  }

  const calculateExpectedValueWithService = (e) => {
    if (e.target.value != "" && latestServiceDate != "") {
      let dt = new Date(latestServiceDate);
      let service_date = (new Date(dt.setMonth(dt.getMonth() + parseInt(e.target.value)))).toISOString()
      let convertString = (service_date.split('T'))[0]
      setServiceIntervalMonth(e.target.value)
      setExpectedServiceDate(convertString)
    } else {
      setServiceIntervalMonth(e.target.value)
    }
  }

  const handleChange = (selectedOptions) => {
    setSelectedOptions(selectedOptions)
  }

  const onFileChange = event => {
    
    // Update the state
    // this.setState({ selectedFile: event.target.files[0] });
    alert(event)
  
  };

  return (
    <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
      {({ errors, touched, setFieldValue }) => {
        useEffect(() => {
          if (!isAddMode) {
            // get user and set form fields
            metadataService.getById(id).then(metaData => {
              (JSON.parse(metaData['active_log']).length > 0) && setActiveLog((((JSON.parse(metaData['active_log']))[0].fields.modify_date).replace('T', ' ')).replace('Z', ''));
              const fields = ['technical_category', 'equipment_name', 'nfc_tag', 'service_interval', 'legit', 'expected_service', 'latest_service', 'contacts', 'longitude', 'latitude', 'reminder_month', 'reminder_week'];
              setDefaultUser(metaData['contacts'])
              setDefaultTechnicalValue(metaData['technical_category']);
              setDefaultLegalValue(metaData['legit']);
              setFieldValue('technical_category', metaData['technical_category'], false);
              setFieldValue('equipment_name', metaData['equipment_name'], false);
              setFieldValue('nfc_tag', metaData['nfc_tag'], false);
              setFieldValue('service_interval', metaData['service_interval'], false);
              setFieldValue('legit', metaData['legit'], false);
              setFieldValue('latest_service', ((metaData['latest_service']).replace('Z', '')), false);
              setFieldValue('contacts', metaData['contacts'], false);
              setFieldValue('expected_service', ((metaData['expected_service']).replace('Z', '')), false);
              setFieldValue('longitude', metaData['longitude'], false);
              setFieldValue('latitude', metaData['latitude'], false);
              setFieldValue('reminder_week', metaData['reminder_week'], false);
              setFieldValue('reminder_month', metaData['reminder_month'], false);
              setImagePreviewUrl('http://13.80.147.178:8082/media/' + metaData['meta_data_picture']);
              setExpectedServiceDate(((metaData['expected_service']).split('T'))[0])
              setLatestServiceDate(((metaData['latest_service']).split('T'))[0])
              setServiceIntervalMonth(metaData['service_interval'])
              setSelectedOptions(JSON.parse(metaData['contacts']))

              setEquipmentName(metaData['equipment_name'])
              setEquipmentId(id)
              setServiceRepair('service')
              setLongitude(metaData['longitude'])
              setLatitude( metaData['latitude'])

            });
            const uploadData = new FormData();
            uploadData.append('content', 'MetadataPage');
            metadataService.getActiveLog(id, uploadData).then(activeData => {
              let result = (JSON.parse(activeData)).reverse()
              setActiveData(result)
              let csvConvertData = []
              result.forEach(element => csvConvertData.push(element["fields"]))
              setCsvActiveData(csvConvertData)
            });
          }
        }, []);

        return (
          <div>
            <Form className="addedit-form" encType="multipart/form-data">
              <div className="title-container">
                <h1>{isAddMode ? 'Add MetaData' : 'Edit MetaData'}</h1>
                {!isAddMode && (<div className="btn-class" onClick={() => setShowActive(true)}>
                  Latest Changed: {activeLog}
                </div>)}
              </div>
              <div className="form-row">
                <div className="form-group col-7">
                  <div className="form-row">
                    <div className="form-group col-6">
                      <div>
                        <label>Technical Catetory</label>
                        <div className={technicalVail ? 'valid-select' : null}>
                          <Select
                            name="technical_category"
                            onChange={(opt, e) => {
                              setDefaultTechnicalValue(opt.label)
                              setFieldValue("technical_category", opt.label);
                            }}
                            options={techicalOptions}
                            error={errors.state}
                            touched={touched.state}
                            value={techicalOptions ? techicalOptions.find(option => option.label === defaultTechnicalValue) : ''}
                            disabled
                          />
                        </div>
                        <ErrorMessage name="technical_category" component="div" className="invalid-feedback" />
                      </div>
                      <div>
                        <label>Equipment Name</label>
                        <div className={equipVali ? 'valid-select' : null}>
                          <Field name="equipment_name" type="text" className={'form-control' + (errors.equipment_name && touched.equipment_name ? ' is-invalid' : '')} />
                          <ErrorMessage name="equipment_name" component="div" className="invalid-feedback" />
                        </div>
                      </div>
                      <div>
                        <label>NFCTag</label>
                        <div className={nfcVali ? 'valid-select' : null}>
                          <Field name="nfc_tag" type="text" className={'form-control' + (errors.nfc_tag && touched.nfc_tag ? ' is-invalid' : '')} />
                          <ErrorMessage name="nfc_tag" component="div" className="invalid-feedback" />
                        </div>
                      </div>
                      <div>
                        <label>Legal</label>
                        <div className={legalVali ? 'valid-select' : null}>
                          <Select
                            name="legit"
                            onChange={(opt, e) => {
                              setDefaultLegalValue(opt.value)
                              setFieldValue("legit", opt.value);
                            }}
                            options={leqalOption}
                            error={errors.state}
                            touched={touched.state}
                            value={leqalOption ? leqalOption.find(option => option.value === defaultLegalValue) : ''}
                          />
                        </div>
                      </div>
                      <div>
                        <label>Service Interval[Month]</label>
                        <div className={intervalVali ? 'valid-select' : null}>
                          <Field name="service_interval" type="text" className={'form-control' + (errors.service_interval && touched.service_interval ? ' is-invalid' : '')} onChange={(e) => calculateExpectedValueWithService(e)} value={serviceIntervalMonth} />
                          <ErrorMessage name="service_interval" component="div" className="invalid-feedback" />
                        </div>
                      </div>
                      <div>
                        <label>Latest Service</label>
                        <div className={latestServiceVali ? 'valid-select' : null}>
                          <Field name="latest_service" type="date" className={'form-control' + (errors.latest_service && touched.latest_service ? ' is-invalid' : '')} onChange={(e) => calculateExpectedValue(e)} value={latestServiceDate} />
                          <ErrorMessage name="latest_service" component="div" className="invalid-feedback" />
                        </div>
                      </div>
                      <div>
                        <label>Expected Service</label>
                        <Field name="expected_service" type="date" className={'form-control' + (errors.expected_service && touched.expected_service ? ' is-invalid' : '')} value={expectedServiceDate} readOnly />
                        <ErrorMessage name="expected_service" component="div" className="invalid-feedback" />
                      </div>
                      <div>
                        <label>Contacts</label>
                        <div className={contactsVali ? 'valid-select' : null}>
                          <Select
                            isMulti
                            value={selectedOptions}
                            onChange={handleChange}
                            options={usersOptions}
                            name="contacts"
                          />
                          {errors.contacts}
                        </div>
                      </div>
                    </div>
                    <div className="form-group col-6">
                      <div>
                        <label>Longitude</label>
                        <div className={longitudeVali ? 'valid-select' : null}>
                          <Field name="longitude" type="text" className={'form-control' + (errors.longitude && touched.longitude ? ' is-invalid' : '')} />
                          <ErrorMessage name="longitude" component="div" className="invalid-feedback" />
                        </div>
                      </div>
                      <div>
                        <label>Latitude</label>
                        <div className={latitudeVali ? 'valid-select' : null}>
                          <Field name="latitude" type="text" className={'form-control' + (errors.latitude && touched.latitude ? ' is-invalid' : '')} />
                          <ErrorMessage name="latitude" component="div" className="invalid-feedback" />
                        </div>
                      </div>
                      <div>
                        <label>Reminder[Month]</label>
                        <Field name="reminder_month" type="text" className={'form-control' + (errors.reminder_month && touched.reminder_month ? ' is-invalid' : '')} />
                        <ErrorMessage name="reminder_month" component="div" className="invalid-feedback" />
                      </div>
                      <div>
                        <label>Reminder[Week]</label>
                        <Field name="reminder_week" type="text" className={'form-control' + (errors.reminder_week && touched.reminder_week ? ' is-invalid' : '')} />
                        <ErrorMessage name="reminder_week" component="div" className="invalid-feedback" />
                      </div>
                    </div>
                  </div>

                </div>
                <div className="form-group col-5">
                  <div className="form-group col-9">
                    <label>PICTURE</label>
                    <Field name="picture" type="file" className={'form-control' + (errors.picture && touched.picture ? ' is-invalid' : '')} onChange={(e) => _handleImageChange(e)} />
                    <ErrorMessage name="picture" component="div" className="invalid-feedback" />
                  </div>
                  <div className="meter-image-container">
                    <img src={imagePreviewUrl} className="imgPreview" alt="Please select the image." onClick={showModal} />
                  </div>
                </div>
              </div>

              <div className="form-button-group">
                <div>
                  <button type="submit" disabled={isSubmitting} className="btn btn-success tranform-none">
                    {isSubmitting && <span className="spinner-border spinner-border-sm mr-1"></span>}
                                  Save
                  </button>
                </div>
              
                <div className="report-button">
                  <Link to={isAddMode ? '.' : '..'} >Cancel</Link>
                </div>
                {!isAddMode ? <div className="report-button"><Link to={{ pathname: '/location',  state: { longtitude: longitude, latitude: latitude, equipment_name: equipmentName } }} >Map Location</Link></div> : <div></div>}
                {!isAddMode ? 
                  <div className="report-button">
                      <Link to = {{ pathname: `../allreport/:${equipmentId}`, state: { equipment_name: equipmentName, service_repair: serviceRepair, equipment_id: equipmentId }}}>Equipment/Service <br/>Report List</Link>
                  </div> : <div></div>
                }
              </div>
            </Form>
            <div className={show ? "modal display-block" : "modal display-none"} >
              <section className="modal-main" ref={ref}>
                <img src={imagePreviewUrl} className="modal-image" alt="Please select the image." />
                <button onClick={hideModal} className="cancel-button-modal">X</button>
              </section>
            </div>
            <div className={showActive ? "modal display-block" : "modal display-none"} >
              <section className="modal-main" ref={ref}>
                <div>
                  <CSVLink data={csvActiveData} filename={"ative_log.csv"} className="btn btn-sm btn-primary mb-2"><i className="fa fa-print" style={{ fontSize: '20px' }}></i></CSVLink>
                </div>
                <table className="table table-striped" style={{ tableLayout: "fixed" }}>
                  <thead>
                    <tr>
                      <th style={{ width: '14%', wordBreak: 'break-word', textAlign: "center" }}>
                        Page
                      </th>
                      <th style={{ width: '14%', wordBreak: 'break-word', textAlign: "center" }}>
                        Column Name
                      </th>
                      <th style={{ width: '14%', wordBreak: 'break-word', textAlign: "center" }}>
                        Column ID
                      </th>
                      <th style={{ width: '14%', wordBreak: 'break-word', textAlign: "center" }}>
                        From
                      </th>
                      <th style={{ width: '14%', wordBreak: 'break-word', textAlign: "center" }}>
                        To
                      </th>
                      <th style={{ width: '14%', wordBreak: 'break-word', textAlign: "center" }}>
                        By
                      </th>
                      <th style={{ width: '14%', wordBreak: 'break-word', textAlign: "center" }}>
                        Date/Time
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {activeData && activeData.map(data =>
                      <tr key={data.pk}>
                        <td>{data.fields.page}</td>
                        <td>{data.fields.column_name}</td>
                        <td>{data.fields.column_id}</td>
                        <td>{data.fields.from_by}</td>
                        <td>{data.fields.to_by}</td>
                        <td>{data.fields.user_by}</td>
                        <td>{((data.fields.modify_date).replace('T', ' ')).replace('Z', '')}</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </section>
            </div>
          </div>
        );
      }}
    </Formik>
  );
}



export { AddEdit };