import React, { useEffect, useState, useRef } from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';

import { metadataService } from '../_services/metamain_service';
import { userService } from '../_services/user.service';
import { alertService } from '../_services/alert.service';
import useOutsideClick from "./useOutsideClick";
import Select from "react-select";
import { noConflict } from 'lodash';
import { CSVLink, CSVDownload } from 'react-csv';
import { Link, useLocation } from 'react-router-dom';




function Fileupload({ history, match }) {
  const { id } = match.params;
  const isAddMode = !id;
  const ref = useRef();
  const location = useLocation();


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
 
  });

  function onSubmit(fields, { setStatus, setSubmitting }) {

    const uploadData = new FormData();
    let by_user = JSON.parse(localStorage.getItem('user'));
    fields["by_user"] = by_user.user_name
    fields["equipment_name"] = location.state.equipment_name
    fields["service_repair"] = location.state.service_repair
    fields["equipment_id"] = location.state.equipment_id
    console.log(fields)

    if (file != '') {
        uploadData.append('content', JSON.stringify(fields));
        uploadData.append('cover', file);
        createUser(uploadData, setSubmitting);
        setIsSubmitting(false)
    } else {
        alert("Please select report file.")
    }
     

  }

  function createUser(fields, setSubmitting) {
    metadataService.uploadReport(fields)
      .then(() => {
        alertService.success('Report file uploaded.', { keepAfterRouteChange: true });
        history.push('.');
      })
      .catch(() => {
        setSubmitting(false);
        alertService.error(error);
      });
  }


  return (
    <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
      {({ errors, touched, setFieldValue }) => {
        return (
          <div>
           
            <Form className="addedit-form" encType="multipart/form-data">
                <div className="title-container">
                    <h1>{`Equipment Name:  ${location.state.equipment_name}, ${location.state.service_repair} Report`}</h1>
                </div>
              <div className="form-row" style={{marginTop: 100}}>
                <div className="form-group col-5">
                  <div className="form-group col-9">
                    <Field name="picture" type="file" className={'form-control' + (errors.picture && touched.picture ? ' is-invalid' : '')} onChange={(e) => _handleImageChange(e)} />
                    <ErrorMessage name="picture" component="div" className="invalid-feedback" />
                  </div>
                  {/* <div className="meter-image-container">
                    <img src={imagePreviewUrl} className="imgPreview" alt="Please select the image." onClick={showModal} />
                  </div> */}
                </div>
              </div>

              <div className="form-button-group" style={{marginTop: 50}}>
                <div>
                  <button type="submit" disabled={isSubmitting} className="btn btn-success tranform-none">
                    {isSubmitting && <span className="spinner-border spinner-border-sm mr-1"></span>}
                                  Save
                  </button>
                </div>
              
                <div className="report-button">
                  <Link to={isAddMode ? '.' : '..'} >Cancel</Link>
                </div>
              </div>
            </Form>
          </div>
        );
      }}
    </Formik>
  );
}



export { Fileupload };