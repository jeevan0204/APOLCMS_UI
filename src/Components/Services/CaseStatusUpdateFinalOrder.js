import React, { useEffect, useRef, useState } from 'react'
import * as bst from "react-bootstrap"
import { CommonFormHeader } from '../../CommonUtils/CommonFormHeader'
import { useNavigate } from 'react-router-dom';
import { ErrorMessage, Field, Form, FormikProvider, useFormik } from 'formik';
import { viewBucketImage } from '../../CommonUtils/ViewImagelm';
import { BsEye } from 'react-icons/bs';
import ImagePdfBucket from '../../CommonUtils/ImagePdfBase64';
import * as Yup from "yup"
import { config } from '../../CommonUtils/CommonApis';
import { CommonAxiosGet, CommonAxiosPost } from '../../CommonUtils/CommonAxios';
import { failureAlert, successAlert2 } from '../../CommonUtils/SweetAlerts';
import Swal from 'sweetalert2';

function CaseStatusUpdateFinalOrder() {
    const [caseDetails, setcaseDetails] = useState([]);
    const [HEADING, setHEADING] = useState([]);
    const [judgementFileExist, setjudgementFileExist] = useState("");
    const [finalOrderFileExist, setfinalOrderFileExist] = useState("");
    const [actionTakenFileExist, setactionTakenFileExist] = useState("");
    const [appealFileExist, setappealFileExist] = useState("");
    const [dismissedFileExist, setdismissedFileExist] = useState("");
    const [errmsg, seterrmsg] = useState(false);


    const navigate = useNavigate();
    const hasFetchedData = useRef(false);

    const cino = JSON.parse(localStorage.getItem("cino"));

    useEffect(() => {
        if (!hasFetchedData.current) {
            showGetData();
            hasFetchedData.current = true
        }
    }, []);

    function showGetData() {
        let Url = config.url.local_URL + "HCFinalOrdersImplementedCaseStatusUpdate?fileCino=" + cino;
        CommonAxiosGet(Url).then((res) => {
            if (res?.data?.status === true) {
                setcaseDetails(res?.data?.data);
                setHEADING(res.data?.data?.HEADING);
                alert("hlo--")
                if (res?.data?.data?.OLCMSCASEDATA?.length > 0) {
                    alert("hlo")
                    const CaseDetailsData = res?.data?.data?.OLCMSCASEDATA[0];
                    console.log("jfhjg----", CaseDetailsData);
                    formIk.setFieldValue('ecourtsCaseStatus', CaseDetailsData.final_order_status || "");
                    formIk.setFieldValue('implementedDt', CaseDetailsData.cordered_impl_date || "");
                    formIk.setFieldValue('appealFiledDt', CaseDetailsData.appeal_filed_date || "");
                    formIk.setFieldValue('remarks', CaseDetailsData.remarks || "");

                    setjudgementFileExist(CaseDetailsData.judgement_order || "");
                    setactionTakenFileExist(CaseDetailsData.action_taken_order || "");
                    setappealFileExist(CaseDetailsData.appeal_filed_copy || "");
                    setdismissedFileExist(CaseDetailsData.dismissed_copy || "");

                }
            }
            else {
                setcaseDetails([]);
                seterrmsg(true);
            }
        })
    }


    const userValidations = Yup.object().shape({
        ecourtsCaseStatus: Yup.string().required("Required"),
        judgementOrder: Yup.mixed().when(['ecourtsCaseStatus'],
            {
                is: (ecourtsCaseStatus) =>
                    ecourtsCaseStatus === 'final' && !judgementFileExist,
                then: (schema) =>
                    schema
                        .required('File is required')
                        .test('file-size', 'File size should be ≤ 2MB', function (value) {
                            return (
                                typeof value === 'string' ||
                                (value instanceof File && value.size <= 2 * 1024 * 1024)
                            )
                        }),
                otherwise: (schema) => schema.notRequired(),

            }),
        actionTakenOrder: Yup.mixed().when(['ecourtsCaseStatus'],
            {
                is: (ecourtsCaseStatus) =>
                    ecourtsCaseStatus === 'final' && !actionTakenFileExist,
                then: (schema) =>
                    schema
                        .required('File is required')
                        .test('file-size', 'File size should be ≤ 2MB', function (value) {
                            return (
                                typeof value === 'string' ||
                                (value instanceof File && value.size <= 2 * 1024 * 1024)
                            )
                        }),
                otherwise: (schema) => schema.notRequired(),

            }),
        implementedDt: Yup.string().when("ecourtsCaseStatus", {
            is: (val) => val === "final",
            then: (schema) => schema.required("Required"),
            otherwise: (schema) => schema.notRequired(),
        }),
        appealFileCopy: Yup.mixed().when(['ecourtsCaseStatus'],
            {
                is: (ecourtsCaseStatus) =>
                    ecourtsCaseStatus === 'appeal' && !appealFileExist,
                then: (schema) =>
                    schema
                        .required('File is required')
                        .test('file-size', 'File size should be ≤ 2MB', function (value) {
                            return (
                                typeof value === 'string' ||
                                (value instanceof File && value.size <= 2 * 1024 * 1024)
                            )
                        }),
                otherwise: (schema) => schema.notRequired(),

            }),
        appealFiledDt: Yup.string().when("ecourtsCaseStatus", {
            is: (val) => val === "appeal",
            then: (schema) => schema.required("Required"),
            otherwise: (schema) => schema.notRequired(),
        }),

        dismissedFileCopy: Yup.mixed().when(['ecourtsCaseStatus'],
            {
                is: (ecourtsCaseStatus) =>
                    ecourtsCaseStatus === 'dismissed' && !dismissedFileExist,
                then: (schema) =>
                    schema
                        .required('File is required')
                        .test('file-size', 'File size should be ≤ 2MB', function (value) {
                            return (
                                typeof value === 'string' ||
                                (value instanceof File && value.size <= 2 * 1024 * 1024)
                            )
                        }),
                otherwise: (schema) => schema.notRequired(),

            }),
        remarks: Yup.string().required("Required"),

    })
    const formIk = useFormik({
        initialValues: {
            ecourtsCaseStatus: "",
            judgementOrder: "",
            actionTakenOrder: "",
            implementedDt: "",
            appealFileCopy: "",
            appealFiledDt: "",
            dismissedFileCopy: "",
            remarks: ""
        },
        validationSchema: userValidations,
        onSubmit: (values) => {
            values.fileCino = cino;
            const url = config.url.local_URL + "HCFinalOrdersImplementedUpdateCaseDetails";
            CommonAxiosPost(url, values, {
                headers: { "Content-Type": "application/json" }
            }).then((res) => {
                if (res?.data?.scode === '01') {
                    Swal.fire({
                        title: res?.data?.data,
                        icon: "success",
                        backdrop: false
                    }).then((resforalert) => {
                        if (resforalert?.isConfirmed === true) {
                            navigate("/HCFinalOrdersImplementedCaseStatusUpdate");
                        }
                    });


                } else {
                    failureAlert(res?.data?.data);
                }
            });

        }
    })

    return (
        <>
            {caseDetails && <>
                <CommonFormHeader heading={HEADING} />
                <bst.Container className="outer-page-content-container">
                    {Array.isArray(caseDetails.USERSLIST) && <>
                        <div className="card">
                            <div className="card-body RowColorForLeave">

                                <table className="table  table-bordered  table-responsive" style={{ width: "100%" }}>

                                    <tbody style={{ textAlign: "left" }}>
                                        <tr>

                                            <td>Date of filing :
                                                <i style={{ textAlign: "justify", color: 'red' }}><b>
                                                    {caseDetails.USERSLIST[0]?.date_of_filing}</b>
                                                </i>

                                            </td>

                                            <td>
                                                <b>Case Type :</b>&nbsp;
                                                {caseDetails.USERSLIST[0]?.type_name_reg}

                                            </td>
                                            <td>
                                                <b>Filing No. :</b>&nbsp;
                                                {caseDetails.USERSLIST[0]?.fil_no}
                                            </td>
                                        </tr>
                                        <tr>

                                            <td>
                                                <b>Filing Year :</b>&nbsp;
                                                {caseDetails.USERSLIST[0]?.fil_year}
                                            </td>

                                            <td>
                                                <b>Main Case No :</b>&nbsp;

                                                <i style={{ textAlign: "justify" }}>
                                                    {caseDetails.USERSLIST?.[0]?.type_name_reg}/
                                                    {caseDetails.USERSLIST?.[0]?.reg_no}/
                                                    {caseDetails.USERSLIST?.[0]?.reg_year}
                                                </i>

                                            </td>

                                            <td>
                                                <b>Est Code :</b>&nbsp;
                                                {caseDetails.USERSLIST[0]?.est_code}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <b>Case Type :</b>&nbsp;
                                                {caseDetails.USERSLIST[0]?.case_type_id}
                                            </td>
                                            <td>
                                                <b>Cause List Type :</b>&nbsp;
                                                {caseDetails.USERSLIST[0]?.causelist_type}
                                            </td>

                                            <td>
                                                <b>Bench Name :</b>&nbsp;
                                                {caseDetails.USERSLIST[0]?.bench_name}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <b>Judicial Branch :</b>&nbsp;
                                                {caseDetails.USERSLIST[0]?.judicial_branch}
                                            </td>
                                            <td>
                                                <b>Coram :</b>&nbsp;
                                                {caseDetails.USERSLIST[0]?.coram}
                                            </td>
                                            <td>
                                                <b>Court Est Name:</b>&nbsp;
                                                {caseDetails.USERSLIST[0]?.court_est_name}
                                            </td>
                                        </tr>

                                        <tr>
                                            <td>
                                                <b>State Name :</b>&nbsp;
                                                {caseDetails.USERSLIST[0]?.state_name}
                                            </td>
                                            <td>
                                                <b>District :</b>&nbsp;
                                                {caseDetails.USERSLIST[0]?.dist_name}
                                            </td>

                                            <td>
                                                <b>Date Of First List :</b>&nbsp;
                                                {caseDetails.USERSLIST[0]?.date_first_list}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <b>Date Of Next List :</b>&nbsp;
                                                {caseDetails.USERSLIST[0]?.date_next_list}
                                            </td>

                                            <td>
                                                <b>Date Of Decision :</b>&nbsp;
                                                {caseDetails.USERSLIST[0]?.date_of_decision}
                                            </td>

                                            <td>
                                                <b>Purpose  :</b>&nbsp;
                                                {caseDetails.USERSLIST[0]?.purpose_name}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <b>Petitioner Name :</b>&nbsp;
                                                {caseDetails.USERSLIST[0]?.pet_name}
                                            </td>
                                            <td>
                                                <b>Petitioner Advocate:</b>&nbsp;
                                                {caseDetails.USERSLIST[0]?.pet_adv}
                                            </td>

                                            <td>
                                                <b>Petitioner Legal Heir :</b>&nbsp;
                                                {caseDetails.USERSLIST[0]?.pet_legal_heir}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <b>Respondent Name :</b>&nbsp;
                                                {caseDetails.USERSLIST[0]?.res_name}
                                            </td>

                                            <td>
                                                <b>Respondent Advocate :</b>&nbsp;
                                                {caseDetails.USERSLIST[0]?.res_adv}
                                            </td>
                                            <td></td>

                                        </tr>

                                    </tbody>
                                </table>
                            </div>

                            <bst.Row>
                                <bst.Col xs={12} sm={12} md={12} lg={11} xl={11} xxl={11}>
                                    <label className="w-100" style={{ marginLeft: '10px', marginRight: '10px' }}>
                                        <b>Prayer :</b>
                                        {caseDetails.USERSLIST[0]?.prayer}

                                    </label>
                                </bst.Col>
                            </bst.Row>
                        </div>&nbsp;

                    </>}

                    <bst.Row className="pt-2 pt-2 ">
                        <FormikProvider value={formIk}>
                            <Form onSubmit={formIk?.handleSubmit} onChange={formIk?.handleChange} >
                                <div className="border px-13 pb-13 mb-4 pt-1">
                                    <bst.Row className="px-4 pt-4">
                                        <bst.Col xs={12} sm={12} md={12} lg={4} xl={4} xxl={4}>
                                            <label className="mb-0">Select Action  <span style={{ color: 'red' }}>*</span></label>
                                            <Field as="select" className='form-control mt-3 mb-2' name="ecourtsCaseStatus" >
                                                <option value="0">--SELECT--</option>
                                                <option value="final">Final order implemented</option>
                                                <option value="appeal">Appeal filed</option>
                                                <option value="dismissed">Dismissed/No Action Required</option>

                                            </Field>
                                            <ErrorMessage name="ecourtsCaseStatus" component="div" className="text-danger" ></ErrorMessage>
                                        </bst.Col>

                                        {formIk?.values?.ecourtsCaseStatus === "final" ? (<>
                                            <bst.Col xs={12} sm={12} md={12} lg={4} xl={4} xxl={4}>
                                                <label className="mb-0">Upload Judgement Order <span style={{ color: 'red' }}>*</span></label>
                                                <Field name="judgementOrder">
                                                    {({ field, form }) => (
                                                        <input
                                                            type="file"
                                                            className="form-control mt-3"
                                                            accept="application/pdf,image/jpeg,image/jpg"
                                                            onChange={(e) => {
                                                                const file = e.target.files[0];
                                                                if (file) {
                                                                    let fileVal = "judgementorder_" + cino;
                                                                    let filename = fileVal;
                                                                    let path = "apolcms/uploads/judgementorder/";
                                                                    formIk.setFieldValue("judgementOrder", file);
                                                                    ImagePdfBucket(e, form, path, `judgementOrder`, filename);
                                                                }
                                                            }}
                                                        />
                                                    )}
                                                </Field>
                                                {judgementFileExist && judgementFileExist !== "" && <>
                                                    <button type="button" onClick={() => { viewBucketImage(judgementFileExist); }}
                                                        className='btn btn-primary btn-sm d-flex align-items-center px-2 py-1'><BsEye /> judgement order</button>&nbsp;
                                                </>}
                                                {finalOrderFileExist && finalOrderFileExist !== "" && <>
                                                    <button type="button" onClick={() => { viewBucketImage(finalOrderFileExist); }}
                                                        className='btn btn-primary btn-sm d-flex align-items-center px-2 py-1'><BsEye /> Final Order</button>&nbsp;
                                                </>}
                                                <ErrorMessage name="judgementOrder" component="div" className="text-danger" ></ErrorMessage>
                                            </bst.Col>
                                            <bst.Col xs={6} sm={6} md={6} lg={4} xl={4} xxl={4}>
                                                <label className="mb-0">Action Taken Report<span style={{ color: 'red' }}>*</span></label>
                                                <Field name="actionTakenOrder">
                                                    {({ field, form }) => (
                                                        <input
                                                            type="file"
                                                            className="form-control mt-3"
                                                            accept="application/pdf,image/jpeg,image/jpg"
                                                            onChange={(e) => {
                                                                const file = e.target.files[0];
                                                                if (file) {
                                                                    let fileVal = "actionorder_" + cino;
                                                                    let filename = fileVal;
                                                                    let path = "apolcms/uploads/actionorder/";
                                                                    formIk.setFieldValue("actionTakenOrder", file);
                                                                    ImagePdfBucket(e, form, path, `actionTakenOrder`, filename);
                                                                }
                                                            }}
                                                        />
                                                    )}
                                                </Field>
                                                {actionTakenFileExist && actionTakenFileExist !== "" && <>
                                                    <button type="button" onClick={() => { viewBucketImage(actionTakenFileExist); }}
                                                        className='btn btn-primary btn-sm d-flex align-items-center px-2 py-1'><BsEye /> View</button>&nbsp;
                                                </>}
                                                <ErrorMessage name="actionTakenOrder" component="div" className="text-danger" ></ErrorMessage>
                                            </bst.Col>

                                            <bst.Col xs={6} sm={6} md={6} lg={4} xl={4} xxl={4}>
                                                <label className="mb-2"> Order Implemented Date <span style={{ color: 'red' }}>*</span></label>
                                                <Field type="date" name="implementedDt" className="form-control" />
                                                <ErrorMessage name="implementedDt" component="div" className="text-danger" ></ErrorMessage>
                                            </bst.Col>
                                        </>) :
                                            formIk?.values?.ecourtsCaseStatus === "appeal" ? (<>
                                                <bst.Col xs={6} sm={6} md={6} lg={4} xl={4} xxl={4}>
                                                    <label className="mb-0">Upload Appeal Copy <span style={{ color: 'red' }}>*</span></label>
                                                    <Field name="appealFileCopy">
                                                        {({ field, form }) => (
                                                            <input
                                                                type="file"
                                                                className="form-control mt-3"
                                                                accept="application/pdf,image/jpeg,image/jpg"
                                                                onChange={(e) => {
                                                                    const file = e.target.files[0];
                                                                    if (file) {
                                                                        let fileVal = "appealfile_" + cino;
                                                                        let filename = fileVal;
                                                                        let path = "apolcms/uploads/appeal_filed_copy/";
                                                                        form.setFieldValue("appealFileCopy", file);
                                                                        ImagePdfBucket(e, form, path, `appealFileCopy`, filename);
                                                                    }
                                                                }}
                                                            />
                                                        )}
                                                    </Field>
                                                    {appealFileExist && appealFileExist !== "" && <>
                                                        <button type="button" onClick={() => { viewBucketImage(appealFileExist); }}
                                                            className='btn btn-primary btn-sm d-flex align-items-center px-2 py-1'><BsEye /> View</button>
                                                    </>}
                                                    <ErrorMessage name="appealFileCopy" component="div" className="text-danger" ></ErrorMessage>
                                                </bst.Col>
                                                <bst.Col xs={6} sm={6} md={6} lg={4} xl={4} xxl={4}>
                                                    <label className="mb-3"> Appeal Date  <span style={{ color: 'red' }}>*</span></label>
                                                    <Field type="date" name="appealFiledDt" className="form-control" />
                                                    <ErrorMessage name="appealFiledDt" component="div" className="text-danger" ></ErrorMessage>
                                                </bst.Col>
                                            </>) :
                                                formIk?.values?.ecourtsCaseStatus === "dismissed" ? (<>
                                                    <bst.Col xs={6} sm={6} md={6} lg={4} xl={4} xxl={4}>
                                                        <label className="mb-0">Upload Copy <span style={{ color: 'red' }}>*</span></label>
                                                        <Field name="dismissedFileCopy">
                                                            {({ field, form }) => (
                                                                <input
                                                                    type="file"
                                                                    className="form-control mt-3"
                                                                    accept="application/pdf,image/jpeg,image/jpg"
                                                                    onChange={(e) => {
                                                                        const file = e.target.files[0];
                                                                        if (file) {
                                                                            let fileVal = "appealfile_" + cino;
                                                                            let filename = fileVal;
                                                                            let path = "apolcms/uploads/dismissedFileCopy/";
                                                                            form.setFieldValue("dismissedFileCopy", file);
                                                                            ImagePdfBucket(e, form, path, `dismissedFileCopy`, filename);
                                                                        }
                                                                    }}
                                                                />
                                                            )}
                                                        </Field>
                                                        {dismissedFileExist && dismissedFileExist !== "" && <>
                                                            <button type="button" onClick={() => { viewBucketImage(dismissedFileExist); }}
                                                                className='btn btn-primary btn-sm d-flex align-items-center px-2 py-1'><BsEye /> View</button>
                                                        </>}
                                                        <ErrorMessage name="dismissedFileCopy" component="div" className="text-danger" ></ErrorMessage>
                                                    </bst.Col>

                                                </>) : (<></>)}

                                        <bst.Row className="px-2 pt-4">
                                            <bst.Col xs={6} sm={6} md={6} lg={4} xl={4} xxl={4}>
                                                <label className="mb-2"> Remarks <span style={{ color: 'red' }}>*</span></label>
                                                <Field as='textarea' className='form-control' name="remarks" />
                                                <ErrorMessage name="remarks" component="div" className="text-danger" ></ErrorMessage>
                                            </bst.Col>
                                        </bst.Row>
                                        <bst.Col xs={4} sm={4} md={4} lg={3} xl={3} xxl={3}>
                                            <button type="submit" className='btn btn-success mt-4 mb-4' >Update Case Details</button>
                                        </bst.Col>

                                    </bst.Row>
                                </div>
                            </Form>
                        </FormikProvider>
                    </bst.Row>
                </bst.Container>
            </>}

        </>)
}

export default CaseStatusUpdateFinalOrder