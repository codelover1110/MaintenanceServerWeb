import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Select from "react-select";
import { userService } from '../_services/user.service';
import MultiSelect from "react-multi-select-component";

import { alertService } from '../_services/alert.service';
import { metadataService } from '../_services/metadata_service';
import { CSVLink, CSVDownload } from 'react-csv';
import useOutsideClick from "./useOutsideClick";


function AddEdit({ history, match }) {
    const { id } = match.params;
    const isAddMode = !id;
    const [defaultAuthorityValue, setDefaultAuthoritcitveValue] = useState()
    const [defaultActiveValue, setDefaultAcitveValue] = useState()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [techicalOptions, setTechicalOptions] = useState([]);
    const [defaultTechnicalValue, setDefaultTechnicalValue] = useState()

    const [selectedOptions, setSelectedOptions] = useState([])
    const [checked, setChecked] = useState(false)

    const [activeLog, setActiveLog] = useState('')
    const [showActive, setShowActive] = useState(false)
    const [show, setShow] = useState(false)
    const [csvActiveData, setCsvActiveData] = useState([])
    const [activeData, setActiveData] = useState()
    const ref = useRef();

    const initialValues = {
        // user_id: '',
        company: '',
        name: '',
        user_name: '',
        phone: '',
        password: '',
        email: '',
        user_authority: 'Mobile',
        active: 'Inactive',
        technical_authority: ''
    };

    useEffect(() => {
        userService.getTechnicalCatetory()
            .then((x) => {
                const transformed = x.map(({ id, name }) => ({ label: name, value: id }));
                console.log(transformed)
                setTechicalOptions(transformed)
            })
    }, []);

    useOutsideClick(ref, () => {
        if (show == true) {
            setShow(false)
        }
        if (showActive == true) {
            setShowActive(false)
        }
    });

    const options = [
        { value: "Admin", label: "Admin" },
        { value: "Mobile", label: "Mobile" },
    ]

    const acitveOptions = [
        { value: "Active", label: "Active" },
        { value: "Inactive", label: "Inactive" },
    ]

    const validationSchema = Yup.object().shape({
        // user_id: Yup.string()
        //     .required('value  is required'),
        company: Yup.string()
            .required('value  is required'),
        name: Yup.string()
            .required('value  is required'),
        user_name: Yup.string()
            .required('value  is required'),
        email: Yup.string()
            .required('value  is required'),
        password: Yup.string()
            .required('value  is required'),
        phone: Yup.string()
            .required('value  is required')
    });

    function onSubmit(fields, { setStatus, setSubmitting }) {
        const uploadData = new FormData();
        let by_user = JSON.parse(localStorage.getItem('user'));
        fields["technical_authority"] = JSON.stringify(selectedOptions)
        fields["by_user"] = by_user.user_name

        uploadData.append('content', JSON.stringify(fields));
        console.log(fields)
        if (isAddMode) {
            createUser(uploadData, setSubmitting);
        } else {
            updateUser(id, uploadData, setSubmitting);
        }
    }

    function createUser(fields, setSubmitting) {
        userService.create(fields)
            .then((res) => {
                if (res.success == "false") {
                    setSubmitting(false);
                    alert("This username is taken. Try again!")
                } else if (res.success == "email_false") {
                    setSubmitting(false);
                    alert("This email is taken. Try again!")
                } else {
                    alertService.success('User added', { keepAfterRouteChange: true });
                    history.push('.');
                }

            })
            .catch(() => {
                setSubmitting(false);
                alertService.error(error);
            });
    }

    function updateUser(id, fields, setSubmitting) {
        userService.updateUser(id, fields)
            .then((res) => {
                console.log(res)
                if (res.success == "false") {
                    setSubmitting(false);
                    alert("This username is taken. Try again!")
                } else if (res.success == "email_false") {
                    setSubmitting(false);
                    alert("This email is taken. Try again!")
                } else {
                    alertService.success('User updated', { keepAfterRouteChange: true });
                    history.push('../');
                }

            })
            .catch(error => {
                setSubmitting(false);
                alertService.error(error);
            });
    }

    const handleChange = (selectedOptions) => {
        setSelectedOptions(selectedOptions)
    }

    const onChangeCheckbox = e => {
        const isChecked = !checked;
        setChecked(isChecked)
        if (isChecked) {
            setSelectedOptions(techicalOptions)
        } else {
            setSelectedOptions([])
        }
    }

    return (
        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
            {({ errors, touched, isSubmitting, setFieldValue }) => {
                useEffect(() => {
                    if (!isAddMode) {
                        // get user and set form fields
                        userService.getUser(id).then(user => {
                            const fields = ['company', 'name', 'user_name', 'phone', 'email', 'password', 'user_authority', 'active', 'technical_authority'];
                            (JSON.parse(user['active_log']).length > 0) && setActiveLog((((JSON.parse(user['active_log']))[0].fields.modify_date).replace('T', ' ')).replace('Z', ''));
                            setFieldValue('name', user['name'], false);
                            setFieldValue('company', user['company'], false);
                            setFieldValue('user_name', user['user_name'], false);
                            setFieldValue('email', user['email'], false);
                            setFieldValue('phone', user['phone'], false);
                            setFieldValue('technical_authority', user['technical_authority'], false);
                            setFieldValue('password', user['password'], false);
                            setFieldValue('user_authority', user['user_authority'], false);
                            setFieldValue('active', user['active'], false);
                            setDefaultAuthoritcitveValue(user['user_authority']);
                            setDefaultAcitveValue(user['active']);
                            setDefaultTechnicalValue(user['technical_authority']);
                            setSelectedOptions(JSON.parse(user['technical_authority']))
                        });
                        const uploadData = new FormData();
                        uploadData.append('content', 'AdminPage');
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
                                <h1>{isAddMode ? 'Add User' : 'Edit User'}</h1>
                                {!isAddMode && (<div className="btn-class" onClick={() => setShowActive(true)}>
                                    Latest Changed: {activeLog}
                                </div>)}
                            </div>
                            <div className="form-row">
                                <div className="form-group col-6">
                                    <div>
                                        <label>Name</label>
                                        <Field name="name" type="text" className={'form-control' + (errors.name && touched.name ? ' is-invalid' : '')} />
                                        <ErrorMessage name="name" component="div" className="invalid-feedback" />
                                    </div>
                                    <div>
                                        <label>User name</label>
                                        <Field name="user_name" type="text" className={'form-control' + (errors.user_name && touched.user_name ? ' is-invalid' : '')} />
                                        <ErrorMessage name="user_name" component="div" className="invalid-feedback" />
                                    </div>
                                    <div>
                                        <label>Company</label>
                                        <Field name="company" type="text" className={'form-control' + (errors.company && touched.company ? ' is-invalid' : '')} />
                                        <ErrorMessage name="company" component="div" className="invalid-feedback" />
                                    </div>
                                    <div>
                                        <label>Phone</label>
                                        <Field name="phone" type="text" className={'form-control' + (errors.phone && touched.phone ? ' is-invalid' : '')} />
                                        <ErrorMessage name="phone" component="div" className="invalid-feedback" />
                                    </div>
                                    <div>
                                        <label>Email</label>
                                        <Field name="email" type="email" className={'form-control' + (errors.email && touched.email ? ' is-invalid' : '')} />
                                        <ErrorMessage name="email" component="div" className="invalid-feedback" />
                                    </div>
                                    <div>
                                        <label>Password</label>
                                        <Field name="password" type="password" className={'form-control' + (errors.password && touched.password ? ' is-invalid' : '')} />
                                        <ErrorMessage name="password" component="div" className="invalid-feedback" />
                                    </div>
                                </div>
                                <div className="form-group col-6" >
                                    <div>
                                        <label>Authority</label>
                                        <Select
                                            name="user_authority"
                                            onChange={(opt, e) => {
                                                setDefaultAuthoritcitveValue(opt.value)
                                                setFieldValue("user_authority", opt.value);
                                                if (opt.value == "Admin") {
                                                    setDefaultAcitveValue("Active")
                                                    setFieldValue("active", "Active");
                                                } else {
                                                    setDefaultAcitveValue("Active")
                                                    setFieldValue("active", "Active");
                                                }
                                            }}
                                            options={options}
                                            error={errors.state}
                                            touched={touched.state}
                                            value={options ? options.find(option => option.value === defaultAuthorityValue) : ''}
                                        />
                                    </div>
                                    <div>
                                        <label>Acitve</label>
                                        <Select
                                            name="active"
                                            onChange={(opt, e) => {
                                                setDefaultAcitveValue(opt.value)
                                                setFieldValue("active", opt.value);
                                            }}
                                            options={acitveOptions}
                                            error={errors.state}
                                            touched={touched.state}
                                            value={acitveOptions ? acitveOptions.find(option => option.value === defaultActiveValue) : ''}
                                        />
                                    </div>
                                    <div>
                                        <label>Technical Catetory</label>
                                        <Select
                                            isMulti
                                            value={selectedOptions}
                                            onChange={handleChange}
                                            options={techicalOptions}
                                        />
                                        {/* <ErrorMessage name="technical" component="div" className="invalid-feedback" /> */}
                                    </div>
                                    <div onClick={() => onChangeCheckbox()}>
                                        <label htmlFor="selectAll">Select all</label>
                                        <input
                                            onChange={onChangeCheckbox}
                                            type="checkbox"
                                            id="selectAll"
                                            // value="selectAll"
                                            name="selectAll"
                                            checked={checked}
                                        /></div>
                                </div>
                            </div>
                            <div className="form-group">
                                <button type="submit" disabled={isSubmitting} className="btn btn-success">
                                    {isSubmitting && <span className="spinner-border spinner-border-sm mr-1"></span>}
                                Save
                            </button>
                                <Link to={isAddMode ? '.' : '..'} className="btn btn-link">Cancel</Link>
                            </div>
                        </Form>
                        <div className={showActive ? "modal display-block" : "modal display-none"} >
                            <section className="modal-main" ref={ref}>
                                <div>
                                    <CSVLink data={csvActiveData} filename={"ative_log.csv"} className="btn btn-sm btn-primary mb-2"><i className="fa fa-print" style={{ fontSize: '20px' }}></i></CSVLink>
                                </div>
                                <table className="table table-striped" style={{ tableLayout: "fixed" }}>
                                    <thead>
                                        <tr>
                                            <th style={{ width: '14%', wordBreak: 'break-word', textAlign: "center" }}>
                                                Page </th>
                                            <th style={{ width: '14%', wordBreak: 'break-word', textAlign: "center" }}>
                                                Column Name </th>
                                            <th style={{ width: '14%', wordBreak: 'break-word', textAlign: "center" }}>
                                                Column ID</th>
                                            <th style={{ width: '14%', wordBreak: 'break-word', textAlign: "center" }}>
                                                From</th>
                                            <th style={{ width: '14%', wordBreak: 'break-word', textAlign: "center" }}>
                                                To</th>
                                            <th style={{ width: '14%', wordBreak: 'break-word', textAlign: "center" }}>
                                                By</th>
                                            <th style={{ width: '14%', wordBreak: 'break-word', textAlign: "center" }}>
                                                Date/Time </th>
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