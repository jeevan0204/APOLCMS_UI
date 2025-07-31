import React, { useEffect, useRef, useState } from 'react'
import * as bst from "react-bootstrap";
import { CommonFormHeader } from '../../CommonUtils/CommonFormHeader';
import { config } from '../../CommonUtils/CommonApis';
import { CommonAxiosGet, CommonAxiosPost } from '../../CommonUtils/CommonAxios';
import { viewBucketImage } from '../../CommonUtils/ViewImagelm';
import InstructionPopup from '../Popups/InstructionPopup';
import { ErrorMessage, Field, Form, FormikProvider, useFormik } from 'formik';
import ImagePdfBucket from '../../CommonUtils/ImagePdfBase64';
import { BsEye } from 'react-icons/bs';
import { failureAlert, successAlert2 } from '../../CommonUtils/SweetAlerts';
import ErrorBanner from '../ErrorBanner';
import * as Yup from "yup"
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

function GPReportNewPWR() {
    const [activeTab, setActiveTab] = useState('caseDetails');
    const [HEADING, setHEADING] = useState([]);
    const [caseDetails, setcaseDetails] = useState([]);
    const [showModelPopup, setModelPopup] = useState(false);
    const [PopupData, setPopupData] = useState([]);
    const [regularPopupFlag, setregularPopupFlag] = useState(false);
    const [param, setparam] = useState([]);

    const [errorMsg, setErrorMsg] = useState("");
    const navigate = useNavigate();



    const [petitionFileExist, setpetitionFileExist] = useState('');
    const [judgementFileExist, setjudgementFileExist] = useState([]);
    const [actiontakenFileExist, setactiontakenFileExist] = useState([]);
    const [appealFileExist, setappealFileExist] = useState([]);
    const [parawiseFileExist1, setparawiseFileExist1] = useState([]);
    const [parawiseFileExist2, setparawiseFileExist2] = useState([]);
    const [parawiseFileExist3, setparawiseFileExist3] = useState([]);

    const [counterFileExist1, setcounterFileExist1] = useState([]);
    const [counterFileExist2, setcounterFileExist2] = useState([]);
    const [counterFileExist3, setcounterFileExist3] = useState([]);

    const [caseStatus, setcaseStatus] = useState([]);


    const hasFetchedData = useRef(false)


    function regularPopStatus() { setregularPopupFlag(false); }



    const cino = JSON.parse(localStorage.getItem("caseNo"));
    const caseType = JSON.parse(localStorage.getItem("caseType"));


    useEffect(() => {
        if (!hasFetchedData.current) {
            getAllCaseDetails();
            hasFetchedData.current = true
        }
    }, []);


    const userValidationsCounter = Yup.object().shape({

        counterFiled: Yup.string().required("Required"),

        counterFileCopy: Yup.mixed()
            .test('required-if-no-counterfile1', 'File is required', function (value) {
                const { counterfile1 } = this.parent;
                return counterfile1 || value;
            })
        ,
        actionToPerform: Yup.string().required("Required"),
        remarks: Yup.string().required("Required"),
    });


    const userValidations = Yup.object().shape({
        ecourtsCaseStatus: Yup.string().required("Required"),
        petitionDocument: Yup.mixed()
            .required('File is required')
            .test('file-size', 'File size should be ≤ 2MB', function (value) {
                return (
                    typeof value === 'string' || // in case it's already uploaded
                    (value instanceof File && value.size <= 2 * 1024 * 1024)
                );
            }),
        parawiseRemarksSubmitted: Yup.string().when("ecourtsCaseStatus", {
            is: (val) => val === "Pending",
            then: (schema) => schema.required("Required"),
            otherwise: (schema) => schema.notRequired(),
        }),
        parawiseRemarksDt: Yup.string().when(['ecourtsCaseStatus', 'parawiseRemarksSubmitted'],
            {
                is: (ecourtsCaseStatus, parawiseRemarksSubmitted) =>
                    ecourtsCaseStatus === 'Pending' && parawiseRemarksSubmitted === 'Yes',
                then: (schema) => schema.required('Required'),
                otherwise: (schema) => schema.notRequired(),
            }
        ),

        parawiseRemarksCopy: Yup.array()
            .when(['ecourtsCaseStatus', 'parawiseRemarksSubmitted'], {
                is: (status, submitted) => status === 'Pending' && submitted === 'Yes' && !parawiseFileExist1,
                then: (schema) =>
                    schema
                        .of(
                            Yup.mixed()
                                .required('File is required')
                                .test('file-size', 'File size should be ≤ 2MB', function (value) {
                                    return (
                                        typeof value === 'string' ||
                                        (value instanceof File && value.size <= 2 * 1024 * 1024)
                                    );
                                })
                                .test('file-type', 'Only PDF, JPG, JPEG allowed', function (value) {
                                    return (
                                        typeof value === 'string' ||
                                        (value instanceof File &&
                                            ['application/pdf', 'image/jpeg', 'image/jpg'].includes(value.type))
                                    );
                                })
                        )
                        .test('min-files', 'At least one file is required', function (value) {
                            return Array.isArray(value) && value.length > 0;
                        })
                        .max(3, 'Maximum 3 files are allowed'),
                otherwise: (schema) => schema.notRequired(),
            }),

        pwr_gp_approved: Yup.string().when("ecourtsCaseStatus", {
            is: (val) => val === "Pending",
            then: (schema) => schema.required("Required"),
            otherwise: (schema) => schema.notRequired(),
        }),
        dtPRApprovedToGP: Yup.string().when(["ecourtsCaseStatus", "pwr_gp_approved"], {
            is: (val, isapproved) => val === "Pending" && isapproved === "Yes",
            then: (schema) => schema.required("Required"),
            otherwise: (schema) => schema.notRequired(),
        }),


        dtPRReceiptToGP: Yup.string().when(["ecourtsCaseStatus", "pwr_gp_approved"], {
            is: (val, isapproved) => val === "Pending" && isapproved === "Yes",
            then: (schema) => schema.required("Required"),
            otherwise: (schema) => schema.notRequired(),
        }),
        actionToPerform: Yup.string().required("Required"),
        remarks: Yup.string().required("Required"),
    });

    const formIkc = useFormik({
        initialValues: {
            appealFiled: "",
            appealFileCopy: "",
            appealFiledDt: "",
            counterFiled: "",
            counterFileCopy: [null],
            actionToPerform: "",
            remarks: ""
        },
        validationSchema: userValidationsCounter,
        onSubmit: async (values) => {
            values.fileCino = cino;
            await GPApproval(values);
        }

    }, []);

    const formIk = useFormik({
        initialValues: {
            dtPRReceiptToGP: "",
            dtPRApprovedToGP: "",
            parawiseRemarksSubmitted: "",
            pwr_gp_approved: "",
            ecourtsCaseStatus: "",
            petitionDocument: "",
            parawiseRemarksDt: "",
            parawiseRemarksCopy: [null],
            pwr_gp_approved: "",
            dtPRApprovedToGP: "",
            dtPRReceiptToGP: "",
            actionToPerform: "",
            remarks: ""
        },
        // enableReinitialize: true,
        validationSchema: userValidations,
        onSubmit: async (values) => {
            values.fileCino = cino;
            await GPApproval(values);
        }

    }, []);



    function getAllCaseDetails() {
        let url = config.url.local_URL + "caseStatusUpdateGPReport?caseNo=" + cino + "&caseType=" + caseType;
        CommonAxiosGet(url).then((res) => {
            if (res.data !== undefined) {
                setHEADING(res.data?.HEADING);
                setcaseDetails(res.data);
                setErrorMsg(res?.data?.countererrorMsg);
                //alert("hlooo--------", res?.data?.USERSLIST[0]);
                const maincaseno = res?.data?.USERSLIST[0].maincaseno;

                const str2 = maincaseno?.split('/') || [];
                setparam(str2);
                //  console.log("str-------", param);

                const SetCaseDeailsData = res?.data?.OLCMSCASEDATA[0]
                // console.log("DATA??????????????????", res?.data?.OLCMSCASEDATA[0])

                setcaseStatus(SetCaseDeailsData?.ecourts_case_status);

                formIk.setFieldValue("ecourtsCaseStatus", SetCaseDeailsData?.ecourts_case_status);
                formIk.setFieldValue("parawiseRemarksSubmitted", SetCaseDeailsData?.pwr_uploaded);
                formIk.setFieldValue("parawiseRemarksDt", SetCaseDeailsData?.pwr_submitted_date);
                formIk.setFieldValue("pwr_gp_approved", SetCaseDeailsData?.pwr_approved_gp);
                formIk.setFieldValue("dtPRApprovedToGP", SetCaseDeailsData?.pwr_gp_approved_date);
                formIk.setFieldValue("dtPRReceiptToGP", SetCaseDeailsData?.pwr_received_date);
                formIk.setFieldValue("actionToPerform", SetCaseDeailsData?.action_to_perfom);
                formIk.setFieldValue("remarks", SetCaseDeailsData?.remarks);

                formIkc.setFieldValue("appealFiled", SetCaseDeailsData?.appeal_filed);
                formIkc.setFieldValue("appealFiledDt", SetCaseDeailsData?.appeal_filed_date);
                formIkc.setFieldValue("counterFiled", SetCaseDeailsData?.counter_filed);
                formIkc.setFieldValue("actionToPerform", SetCaseDeailsData?.action_to_perfom);
                formIkc.setFieldValue("remarks", SetCaseDeailsData?.remarks);


                setpetitionFileExist(SetCaseDeailsData.petition_document);
                setparawiseFileExist1(SetCaseDeailsData.pwr_uploaded_copy);
                setparawiseFileExist2(SetCaseDeailsData.pwr_uploaded_copy2);
                setparawiseFileExist3(SetCaseDeailsData.pwr_uploaded_copy3);
                setcounterFileExist1(SetCaseDeailsData.counter_filed_document);
                setcounterFileExist2(SetCaseDeailsData.counter_filed_document2);
                setcounterFileExist3(SetCaseDeailsData.counter_filed_document3);
                setjudgementFileExist(SetCaseDeailsData.judgement_order);
                setactiontakenFileExist(SetCaseDeailsData.action_taken_order);
                setappealFileExist(SetCaseDeailsData.appeal_filed_copy);

            } else {
                setcaseDetails([]);
            }
        }).catch((error) => {
            console.error("Error fetching caseDetails:", error);
        });
    }


    const GPApproval = async (values) => {
        try {
            const url = config.url.local_URL + "ApproveGPNew";
            CommonAxiosPost(url, values
                , {
                    headers: { "Content-Type": "application/json" }
                }
            ).then((res) => {
                if (res?.data?.scode === '01') {
                    Swal.fire({
                        title: res?.data?.sdesc,
                        icon: "success",
                        backdrop: false
                    }).then((resforalert) => {
                        if (resforalert?.isConfirmed === true) {
                            if (values.actionToPerform === "Parawise Remarks") {
                                navigate("/GPReportPWR");
                            }
                            else {
                                navigate("/GPReportCounter");
                            }

                        }
                    });
                } else {
                    failureAlert(res?.data?.sdesc);
                }
            });
        } catch (e) {
            console.log("exception at catch block ===>" + e);
        }
    };


    function gpReject(actiontoperform) {
        let url = config.url.local_URL + "RejectGPNew";
        const values = {
            actionToPerform: actiontoperform,
            fileCino: cino
        };
        CommonAxiosPost(url, values).then((res) => {

            if (res?.data?.scode === '01') {
                Swal.fire({
                    title: res?.data?.sdesc,
                    icon: "success",
                    backdrop: false
                }).then((resforalert) => {
                    if (resforalert?.isConfirmed === true) {
                        if (values.actionToPerform === "Parawise Remarks") {
                            navigate("/GPReportPWR");
                        }
                        else {
                            navigate("/GPReportCounter");
                        }

                    }
                });
            } else {
                failureAlert(res?.data?.sdesc);
            }


        });
    }

    function handlePopupClick(cino, caseNo, serno) {
        let url = config.url.local_URL + "DailyStatusEntryReport?cino=" + cino + "&serno=" + serno + "&caseType=" + caseNo;
        console.log("instructionm popup url-----", url);
        CommonAxiosGet(url).then((res) => {
            if (res.data.status === true) {
                alert("test " + res.data.CASESLISTOLD?.[0]?.cino);
                setModelPopup(true);
                setPopupData(res?.data);
                // setPopupData(res?.data?.CASESLISTNEW?.[0]);

                localStorage.setItem("cino", JSON.stringify(cino));
                localStorage.setItem("caseType", JSON.stringify(caseNo));
                localStorage.setItem("serno", JSON.stringify(serno));
            } else {
                setPopupData([]);
            }
        }).catch((error) => {
            console.error("Error fetching popup:", error);
        });
    }

    const tabs = [
        { key: 'caseDetails', label: 'Case Details', color: '#c2e8be' },
        { key: 'instructions', label: 'Instructions', color: '#c7e6eb' },
        { key: 'paraWise', label: 'Parawise Remarks', color: '#dea0a6' },
        { key: 'counterDetails', label: 'Counter Details', color: '#c2b8bb' },
        { key: 'caseHistory', label: 'Case History', color: '#c9c5c5' },
        { key: 'activities', label: 'OLCMS - Case Activities', color: '#e4e89e' },
        { key: 'finalOrders', label: 'Final Orders', color: '#c3f7c6' },
    ];


    const renderTabContent = () => {
        switch (activeTab) {
            case 'caseDetails':
                return <div>

                    {caseDetails && <>

                        {Array.isArray(caseDetails.USERSLIST) && <>
                            {/* <div className="card">
                                    <div className="card-body RowColorForLeave"> */}

                            <table className="table  table-bordered  table-responsive" style={{ width: "100%", marginTop: "1%" }}>

                                <tbody style={{ textAlign: "left" }}>
                                    <tr>
                                        <td><b>Download Affidavit :</b>
                                            {caseDetails.USERSLIST[0]?.ack_file_path ? <>

                                                <button type="button" class="btn btn-primary btn-sm rounded" onClick={() => { viewBucketImage(caseDetails.USERSLIST[0]?.ack_file_path) }} >
                                                    Acknowledgement
                                                </button>
                                            </> : <>--</>}

                                            {caseDetails.USERSLIST[0]?.barcode_file_path ? <>

                                                <button type="button" class="btn btn-primary btn-sm rounded" onClick={() => { viewBucketImage(caseDetails.USERSLIST[0]?.barcode_file_path) }} >
                                                    Barcode
                                                </button>
                                            </> : <>--</>}
                                        </td>

                                        <td><b>Date of filing :</b>
                                            <i style={{ textAlign: "justify", color: 'red' }}>
                                                {caseDetails.USERSLIST[0]?.date_of_filing}
                                            </i>

                                        </td>

                                        <td>
                                            <b>Case Type :</b>&nbsp;
                                            {caseDetails.USERSLIST[0]?.type_name_reg}

                                        </td>

                                    </tr>
                                    <tr>
                                        <td>
                                            <b>Filing Mode :</b>&nbsp;
                                            {caseDetails.USERSLIST[0]?.mode_filing}
                                        </td>


                                        <td>
                                            <b>Case Category :</b>&nbsp;
                                            {caseDetails.USERSLIST[0]?.case_category}
                                        </td>

                                        <td>
                                            <b>District :</b>&nbsp;
                                            {caseDetails.USERSLIST[0]?.district_name}
                                        </td>

                                    </tr>
                                    <tr>

                                        <td>
                                            <b>Petitioner Name :</b>&nbsp;
                                            {caseDetails.USERSLIST[0]?.petitioner_name}
                                        </td>

                                        <td>
                                            <b>Respondent Advocate :</b>&nbsp;
                                            {caseDetails.USERSLIST[0]?.advocatename}
                                        </td>
                                        <td>
                                            <b>Respondent Advocate No :</b>&nbsp;
                                            {caseDetails.USERSLIST[0]?.advocateccno}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <b>Acknowledgement No :</b>&nbsp;
                                            {caseDetails.USERSLIST[0]?.ack_no},{caseDetails.USERSLIST[0]?.hc_ack_no}
                                        </td>

                                        <td>
                                            Filing Year:&nbsp;
                                            <b>
                                                <span style={{ color: 'red' }}>{param[2]}</span>
                                            </b>
                                        </td>

                                        <td>
                                            Registration No:&nbsp;
                                            <b>{param[1]}</b>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <b>MainCase No:</b>&nbsp;
                                            {caseDetails.USERSLIST[0]?.maincaseno}

                                        </td>
                                    </tr>
                                </tbody>
                            </table>


                            {Array.isArray(caseDetails?.actlist) && <>
                                <div className="card">
                                    <div style={{
                                        backgroundColor: '#989b9c',
                                        color: '#ffffff',
                                        borderRadius: '10px',
                                        boxShadow: '0 4px 6px rgba(41, 18, 18, 0.2)',
                                        display: 'inline-block',
                                        width: '120px',
                                        height: '30px',
                                        marginTop: '20px',
                                        marginLeft: '10px',
                                        textAlign: 'center'
                                    }}>
                                        Act List
                                    </div>
                                    <div className="card-body RowColorForLeave">
                                        <bst.Row>
                                            <bst.Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={12}>
                                                <table className="table  table-bordered  table-responsive" style={{ width: "80%" }}>
                                                    <thead style={{ textAlign: "left", backgroundColor: 'blue', color: 'white' }}>
                                                        <tr>

                                                            <th>S.No</th>
                                                            <th>Act</th>
                                                            <th width="600px" >Act Name</th>
                                                            <th width="600px" >Section</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody style={{ textAlign: "left" }}>
                                                        {Array.isArray(caseDetails?.actlist) &&
                                                            caseDetails?.actlist.map((party, index) => (
                                                                <tr key={index}>
                                                                    <td>{index + 1}</td>
                                                                    <td>{party?.act}</td>
                                                                    <td>{party?.actname}</td>
                                                                    <td>{party?.section}</td>

                                                                </tr>
                                                            ))}
                                                    </tbody>

                                                </table>
                                            </bst.Col>
                                        </bst.Row>
                                    </div>
                                </div>&nbsp;
                            </>}

                            {Array.isArray(caseDetails?.PETEXTRAPARTYLIST) && <>
                                <div className="card">
                                    <div style={{
                                        backgroundColor: '#989b9c',
                                        color: '#ffffff',
                                        borderRadius: '10px',
                                        boxShadow: '0 4px 6px rgba(68, 23, 23, 0.2)',
                                        display: 'inline-block',
                                        width: '150px',
                                        height: '30px',
                                        marginTop: '20px',
                                        marginLeft: '10px',
                                        textAlign: 'center'
                                    }}>
                                        Petitioner's List
                                    </div>
                                    <div className="card-body RowColorForLeave">
                                        <bst.Row>
                                            <bst.Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={12}>
                                                <table className="table  table-bordered  table-responsive" style={{ width: "80%" }}>
                                                    <thead style={{ textAlign: "left", backgroundColor: 'blue', color: 'white' }}>
                                                        <tr>

                                                            <th>S.No</th>
                                                            <th>Party No</th>
                                                            <th width="600px" >Party Name</th>

                                                        </tr>
                                                    </thead>
                                                    <tbody style={{ textAlign: "left" }}>
                                                        {Array.isArray(caseDetails?.PETEXTRAPARTYLIST) &&
                                                            caseDetails?.PETEXTRAPARTYLIST.map((party, index) => (
                                                                <tr key={index}>
                                                                    <td>{index + 1}</td>
                                                                    <td>{party?.party_no}</td>
                                                                    <td>{party?.party_name}</td>
                                                                </tr>
                                                            ))}
                                                    </tbody>

                                                </table>
                                            </bst.Col>
                                        </bst.Row>
                                    </div>
                                </div>&nbsp;
                            </>}

                            {Array.isArray(caseDetails?.RESEXTRAPARTYLIST) && <>
                                <div className="card">
                                    <div style={{
                                        backgroundColor: '#989b9c',
                                        color: '#ffffff',
                                        borderRadius: '10px',
                                        boxShadow: '0 4px 6px rgba(68, 23, 23, 0.2)',
                                        display: 'inline-block',
                                        width: '180px',
                                        height: '30px',
                                        marginTop: '20px',
                                        marginLeft: '10px',
                                        textAlign: 'center'
                                    }}>
                                        Respondent List
                                    </div>
                                    <div className="card-body RowColorForLeave">
                                        <bst.Row>
                                            <bst.Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={12}>
                                                <table className="table  table-bordered  table-responsive" style={{ width: "80%" }}>
                                                    <thead style={{ textAlign: "left", backgroundColor: 'blue', color: 'white' }}>
                                                        <tr>

                                                            <th>S.No</th>
                                                            <th>Party No</th>
                                                            <th width="400px" >Party Name</th>
                                                            <th width="600px" >Address</th>

                                                        </tr>
                                                    </thead>
                                                    <tbody style={{ textAlign: "left" }}>
                                                        {Array.isArray(caseDetails?.RESEXTRAPARTYLIST) &&
                                                            caseDetails?.RESEXTRAPARTYLIST.map((party, index) => (
                                                                <tr key={index}>
                                                                    <td>{index + 1}</td>
                                                                    <td>{party?.party_no}</td>
                                                                    <td>{party?.party_name}</td>
                                                                    <td>{party?.address}</td>
                                                                </tr>
                                                            ))}
                                                    </tbody>

                                                </table>
                                            </bst.Col>
                                        </bst.Row>
                                    </div>
                                </div>&nbsp;

                            </>}


                        </>}

                    </>}

                </div>;
            case 'instructions':
                return <div>
                    {Array.isArray(caseDetails?.DEPTNSTRUCTIONS) && <>
                        <div className="card">
                            <div style={{
                                backgroundColor: '#989b9c',
                                color: '#ffffff',
                                borderRadius: '10px',
                                boxShadow: '0 4px 6px rgba(68, 23, 23, 0.2)',
                                display: 'inline-block',
                                width: '280px',
                                height: '50px',
                                marginTop: '20px',
                                marginLeft: '10px',
                                textAlign: 'center'
                            }}>
                                Instructions Submitted By The Department
                            </div>
                            <div className="card-body RowColorForLeave">
                                <bst.Row>
                                    <bst.Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={12}>
                                        <table className="table  table-bordered  table-responsive" style={{ width: "97%" }}>
                                            <thead style={{ textAlign: "left", backgroundColor: 'blue', color: 'white' }}>
                                                <tr>
                                                    <td>Sl No.</td>
                                                    <th>Description</th>
                                                    <th>Submitted By</th>
                                                    <th>Submitted On</th>
                                                    <th>Uploaded File</th>
                                                    <th>Reply Sent</th>

                                                    <th>Reply Submitted On</th>
                                                    <th>Reply Uploaded File</th>

                                                    <th>Reply to Instructions</th>
                                                </tr>
                                            </thead>
                                            <tbody style={{ textAlign: "left" }}>
                                                {Array.isArray(caseDetails?.DEPTNSTRUCTIONS) &&
                                                    caseDetails?.DEPTNSTRUCTIONS.map((party, index) => (
                                                        <tr key={index}>
                                                            <td>{index + 1}</td>
                                                            <td>{party?.instructions}</td>
                                                            <td>{party?.insert_by}</td>
                                                            <td>{party?.insert_time}</td>
                                                            <td>
                                                                {party?.upload_fileno ? <>
                                                                    <button type="button" class="btn btn-primary btn-sm rounded" onClick={() => { viewBucketImage(party?.upload_fileno) }} >
                                                                        View Document
                                                                    </button>
                                                                </> : <>--</>}
                                                            </td>
                                                            <td>{party?.reply_instructions}</td>

                                                            <td>{party?.reply_insert_time}</td>

                                                            <td>{party?.reply_upload_fileno ? <>
                                                                <button type="button" class="btn btn-primary btn-sm rounded" onClick={() => { viewBucketImage(party?.reply_upload_fileno) }} >
                                                                    View Document
                                                                </button>
                                                            </> : <>--</>}</td>
                                                            <td>{party?.reply_flag === 'N' ? <>
                                                                <button
                                                                    class="btn btn-outline-primary btn-sm mt-2"
                                                                    onClick={() => handlePopupClick(party?.cino, party?.legacy_ack_flag, party?.slno)}
                                                                >
                                                                    Reply to Instructions
                                                                </button>
                                                            </> : <>--</>}</td>

                                                        </tr>
                                                    ))}
                                            </tbody>

                                        </table>
                                    </bst.Col>
                                </bst.Row>
                            </div>
                        </div>&nbsp;
                    </>}

                </div>;

            case 'paraWise':
                return <div>

                    {Array.isArray(caseDetails?.ACTIVITIESDATA) && caseDetails.ACTIVITIESDATA.length > 0 && <>

                        <div className="card">
                            <div style={{
                                backgroundColor: '#989b9c',
                                color: '#ffffff',
                                borderRadius: '10px',
                                boxShadow: '0 4px 6px rgba(68, 23, 23, 0.2)',
                                display: 'inline-block',
                                width: '280px',
                                height: '50px',
                                marginTop: '20px',
                                marginLeft: '10px',
                                textAlign: 'center'
                            }}>
                                Parawise Remarks History
                            </div>
                            <div className="card-body RowColorForLeave">
                                <bst.Row>
                                    <bst.Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={12}>
                                        <table className="table  table-bordered  table-responsive" style={{ width: "97%" }}>
                                            <thead style={{ textAlign: "left", backgroundColor: 'blue', color: 'white' }}>
                                                <tr>
                                                    <th>Sl No.</th>
                                                    <th>Date</th>
                                                    <th>Activity</th>
                                                    <th>Updated By</th>
                                                    <th>Assigned to</th>
                                                    <th>Remarks</th>
                                                    <th>Uploaded Document</th>
                                                </tr>
                                            </thead>
                                            <tbody style={{ textAlign: "left" }}>
                                                {Array.isArray(caseDetails?.ACTIVITIESDATA) &&
                                                    caseDetails.ACTIVITIESDATA.map((party, index) => {
                                                        if (party?.action_type === "Uploaded Parawise Remarks") {
                                                            return (
                                                                <tr key={index}>
                                                                    <td>{index + 1}</td>
                                                                    <td>{party?.inserted_on}</td>
                                                                    <td>{party?.action_type}</td>
                                                                    <td>{party?.inserted_by}</td>
                                                                    <td>{party?.assigned_to}</td>

                                                                    <td>{party?.remarks}</td>
                                                                    <td>
                                                                        {party?.uploaded_doc_path ? <>
                                                                            <button type="button" class="btn btn-primary btn-sm rounded" onClick={() => { viewBucketImage(party?.uploaded_doc_path) }} >
                                                                                View Document
                                                                            </button>
                                                                        </> : <>--</>}
                                                                    </td>


                                                                </tr>
                                                            );
                                                        }
                                                        return null;
                                                    })}
                                            </tbody>

                                        </table>
                                    </bst.Col>
                                </bst.Row>
                            </div>
                        </div>&nbsp;
                    </>
                    }

                    {caseDetails?.PWRSUBMITION === "ENABLE" && <>

                        <bst.Row className="pt-2 pt-2 ">
                            <FormikProvider value={formIk}>
                                <Form onSubmit={formIk?.handleSubmit} onChange={formIk?.handleChange} >
                                    <div className="border px-13 pb-13 mb-4 pt-1">
                                        <bst.Row className="px-4 pt-4">
                                            <bst.Col xs={4} sm={4} md={4} lg={3} xl={3} xxl={3}>
                                                <label className="mb-0">Upload Petition <span style={{ color: 'red' }}>*</span></label>
                                                <Field name="petitionDocument">
                                                    {({ field, form }) => (
                                                        <input
                                                            type="file"
                                                            className="form-control mt-3"
                                                            accept="application/pdf,image/jpeg,image/jpg"
                                                            onChange={(e) => {
                                                                const file = e.target.files[0];
                                                                if (file) {
                                                                    let fileVal = "petitiondocument_" + cino;
                                                                    let filename = fileVal;
                                                                    let path = "apolcms/uploads/petitions/";
                                                                    form.setFieldValue("petitionDocument", file);
                                                                    ImagePdfBucket(e, form, path, `petitionDocument`, filename);
                                                                }
                                                            }}
                                                        />
                                                    )}
                                                </Field>

                                                {petitionFileExist && <>
                                                    <button type="button" onClick={() => { viewBucketImage(petitionFileExist); }}
                                                        className='btn btn-primary btn-sm p-2 pt-1'><BsEye /> View</button>
                                                </>}
                                                <ErrorMessage name="petitionDocument" component="div" className="text-danger" ></ErrorMessage>
                                            </bst.Col>

                                            <bst.Col xs={4} sm={4} md={4} lg={3} xl={3} xxl={3}>
                                                <label className="mb-0"> Case Status  <span style={{ color: 'red' }}>*</span></label>
                                                <Field as="select" className='form-control mt-3' name="ecourtsCaseStatus" >
                                                    <option value="0">--SELECT--</option>
                                                    <option value="Pending">Pending</option>
                                                    <option value="Closed">Closed</option>

                                                </Field>
                                                <ErrorMessage name="ecourtsCaseStatus" component="div" className="text-danger" ></ErrorMessage>
                                            </bst.Col>
                                        </bst.Row>
                                        {formIk?.values?.ecourtsCaseStatus === "Closed" && (<>
                                            <bst.Row className="px-4 pt-4">

                                                <bst.Col xs={6} sm={6} md={6} lg={4} xl={4} xxl={4}>
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
                                                                        form.setFieldValue("judgementOrder", file);
                                                                        ImagePdfBucket(e, form, path, `judgementOrder`, filename);
                                                                    }
                                                                }}
                                                            />
                                                        )}
                                                    </Field>
                                                    {judgementFileExist && <>
                                                        <button type="button" onClick={() => { viewBucketImage(judgementFileExist); }}
                                                            className='btn btn-primary btn-sm p-2 pt-1'><BsEye /> View</button>
                                                    </>}
                                                    <ErrorMessage name="judgementOrder" component="div" className="text-danger" ></ErrorMessage>
                                                </bst.Col>
                                                <bst.Col xs={6} sm={6} md={6} lg={4} xl={4} xxl={4}>
                                                    <label className="mb-0">Action Taken Order<span style={{ color: 'red' }}>*</span></label>
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
                                                                        form.setFieldValue("actionTakenOrder", file);
                                                                        ImagePdfBucket(e, form, path, `actionTakenOrder`, filename);
                                                                    }
                                                                }}
                                                            />
                                                        )}
                                                    </Field>
                                                    {actiontakenFileExist && <>
                                                        <button type="button" onClick={() => { viewBucketImage(actiontakenFileExist); }}
                                                            className='btn btn-primary btn-sm p-2 pt-1'><BsEye /> View</button>
                                                    </>}
                                                    <ErrorMessage name="actionTakenOrder" component="div" className="text-danger" ></ErrorMessage>
                                                </bst.Col>
                                            </bst.Row>
                                        </>)}
                                        <bst.Row className="px-4 pt-4">
                                            {formIk?.values?.ecourtsCaseStatus === "Pending" && (<>
                                                <bst.Col xs={4} sm={4} md={4} lg={3} xl={3} xxl={3}>
                                                    <label className="mb-10">Parawise Remarks Submitted <span style={{ color: 'red' }}>*</span></label>
                                                    <Field as="select" className='form-control mt-3' name="parawiseRemarksSubmitted" >
                                                        <option value="0">--SELECT--</option>
                                                        <option value="No">No</option>
                                                        <option value="Yes">Yes</option>

                                                    </Field>
                                                    <ErrorMessage name="parawiseRemarksSubmitted" component="div" className="text-danger" ></ErrorMessage>
                                                </bst.Col>
                                                {formIk?.values?.parawiseRemarksSubmitted === "Yes" && <>
                                                    <bst.Col xs={4} sm={4} md={4} lg={3} xl={3} xxl={3}>
                                                        <label className="mb-0"> Date of Submission of Parawise Remarks to GP/SC  <span style={{ color: 'red' }}>*</span></label>
                                                        <Field type="date" name="parawiseRemarksDt" className="form-control" />
                                                        <ErrorMessage name="parawiseRemarksDt" component="div" className="text-danger" ></ErrorMessage>
                                                    </bst.Col>

                                                    <bst.Col xs={4} sm={4} md={4} lg={3} xl={3} xxl={3}>
                                                        <label className="mb-0">Upload Parawise Remarks<span style={{ color: 'red' }}>*</span></label>
                                                        <Field name="parawiseRemarksCopy">
                                                            {({ field, form }) => (
                                                                <input
                                                                    type="file"
                                                                    className="form-control mt-3"
                                                                    accept="application/pdf,image/jpeg,image/jpg"
                                                                    onChange={(e) => {
                                                                        const file = e.target.files[0];
                                                                        if (file) {
                                                                            let fileVal = "parawiseremarks";
                                                                            let filename = fileVal;
                                                                            let path = "jnbNivas/apolcms/uploads/parawiseremarks/";
                                                                            form.setFieldValue("parawiseRemarksCopy", file);
                                                                            ImagePdfBucket(e, form, path, `parawiseRemarksCopy`, filename);
                                                                        }
                                                                    }}
                                                                />
                                                            )}
                                                        </Field>

                                                        {parawiseFileExist1 && <>
                                                            <button type="button" onClick={() => { viewBucketImage(parawiseFileExist1); }}
                                                                className='btn btn-primary btn-sm p-2 pt-1'><BsEye /> View</button>
                                                        </>}
                                                        {parawiseFileExist2 && <>
                                                            <button type="button" onClick={() => { viewBucketImage(parawiseFileExist2); }}
                                                                className='btn btn-primary btn-sm p-2 pt-1'><BsEye /> View</button>
                                                        </>}
                                                        {parawiseFileExist3 && <>
                                                            <button type="button" onClick={() => { viewBucketImage(parawiseFileExist3); }}
                                                                className='btn btn-primary btn-sm p-2 pt-1'><BsEye /> View</button>
                                                        </>}
                                                        <ErrorMessage name="parawiseRemarksCopy" component="div" className="text-danger" ></ErrorMessage>
                                                    </bst.Col>

                                                    <bst.Col xs={4} sm={4} md={4} lg={3} xl={3} xxl={3}>
                                                        <label className="mb-0">Parawise Remarks Approved by GP <span style={{ color: 'red' }}>*</span></label>
                                                        <Field as="select" className='form-control' name="pwr_gp_approved"
                                                            onChange={(e) => {
                                                                const value = e.target.value;
                                                                if (value === "No") {
                                                                    formIk.setFieldValue("dtPRApprovedToGP", "");
                                                                    formIk.setFieldValue("dtPRReceiptToGP", "");

                                                                }
                                                            }} >
                                                            <option value="0">--SELECT--</option>
                                                            <option value="No">No</option>
                                                            <option value="Yes">Yes</option>

                                                        </Field>
                                                        <ErrorMessage name="pwr_gp_approved" component="div" className="text-danger" ></ErrorMessage>
                                                    </bst.Col>

                                                </>}
                                            </>)}

                                        </bst.Row>
                                        <bst.Row className="px-4 pt-4">
                                            {formIk?.values?.pwr_gp_approved === "Yes" && (<>

                                                <bst.Col xs={4} sm={4} md={4} lg={3} xl={3} xxl={3}>
                                                    <label className="mb-0"> Date of Approval of Parawise Remarks by GP/SC  <span style={{ color: 'red' }}>*</span></label>
                                                    <Field type="date" name="dtPRApprovedToGP" className="form-control" />
                                                    <ErrorMessage name="dtPRApprovedToGP" component="div" className="text-danger" ></ErrorMessage>
                                                </bst.Col>

                                                <bst.Col xs={4} sm={4} md={4} lg={3} xl={3} xxl={3}>
                                                    <label className="mb-0"> Date of Receipt of Approved Parawise Remarks from GP/SC <span style={{ color: 'red' }}>*</span></label>
                                                    <Field type="date" name="dtPRReceiptToGP" className="form-control" />
                                                    <ErrorMessage name="dtPRReceiptToGP" component="div" className="text-danger" ></ErrorMessage>
                                                </bst.Col>

                                            </>)}
                                        </bst.Row>

                                        <bst.Row className="px-4 pt-4">
                                            <bst.Col xs={6} sm={6} md={6} lg={4} xl={4} xxl={4}>
                                                <label className="mb-0"> Action <span style={{ color: 'red' }}>*</span></label>
                                                <Field as="select" className='form-control' name="actionToPerform" >
                                                    <option value="0">--SELECT--</option>
                                                    <option value="Parawise Remarks">Parawise Remarks</option>

                                                </Field>
                                                <ErrorMessage name="actionToPerform" component="div" className="text-danger" ></ErrorMessage>
                                            </bst.Col>
                                        </bst.Row>


                                        <bst.Row className="px-4 pt-4">
                                            <bst.Col xs={6} sm={6} md={6} lg={4} xl={4} xxl={4}>
                                                <label className="mb-0"> Remarks <span style={{ color: 'red' }}>*</span></label>
                                                <Field as='textarea' className='form-control' name="remarks" />
                                                <ErrorMessage name="remarks" component="div" className="text-danger" ></ErrorMessage>
                                            </bst.Col>
                                        </bst.Row>

                                        <bst.Row className="px-2 pt-2">
                                            <bst.Col xs={4} sm={4} md={4} lg={3} xl={3} xxl={3}>
                                                <button type="submit" className='btn btn-success mt-4' style={{ marginLeft: "40px" }} >Approve</button>
                                            </bst.Col>

                                            <bst.Col xs={2} sm={2} md={2} lg={2} xl={2} xxl={2}>
                                                <button type="button" className='btn btn-success mt-4' onClick={() => gpReject('Parawise Remarks')}
                                                >Return</button>
                                            </bst.Col>
                                        </bst.Row>&nbsp;
                                    </div>
                                </Form>
                            </FormikProvider>
                        </bst.Row>

                    </>}
                </div >;
            case 'counterDetails':
                return <div>
                    <ErrorBanner message={errorMsg} onClose={() => setErrorMsg('')} />

                    {Array.isArray(caseDetails?.ACTIVITIESDATA) && <>
                        <div className="card">
                            <div style={{
                                backgroundColor: '#989b9c',
                                color: '#ffffff',
                                borderRadius: '10px',
                                boxShadow: '0 4px 6px rgba(68, 23, 23, 0.2)',
                                display: 'inline-block',
                                width: '280px',
                                height: '50px',
                                marginTop: '20px',
                                marginLeft: '10px',
                                textAlign: 'center'
                            }}>
                                Counter Affidavit History
                            </div>
                            <div className="card-body RowColorForLeave">
                                <bst.Row>
                                    <bst.Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={12}>
                                        <table className="table  table-bordered  table-responsive" style={{ width: "97%" }}>
                                            <thead style={{ textAlign: "left", backgroundColor: 'blue', color: 'white' }}>
                                                <tr>
                                                    <th>Sl No.</th>
                                                    <th>Date</th>
                                                    <th>Activity</th>
                                                    <th>Updated By</th>
                                                    <th>Assigned to</th>
                                                    <th>Remarks</th>
                                                    <th>Uploaded Document</th>
                                                </tr>
                                            </thead>
                                            <tbody style={{ textAlign: "left" }}>
                                                {Array.isArray(caseDetails?.ACTIVITIESDATA) &&
                                                    caseDetails.ACTIVITIESDATA.map((party, index) => {
                                                        if (party?.action_type === "Uploaded Counter") {
                                                            return (
                                                                <tr key={index}>
                                                                    <td>{index + 1}</td>
                                                                    <td>{party?.inserted_on}</td>
                                                                    <td>{party?.action_type}</td>
                                                                    <td>{party?.inserted_by}</td>
                                                                    <td>{party?.assigned_to}</td>

                                                                    <td>{party?.remarks}</td>
                                                                    <td>
                                                                        {party?.uploaded_doc_path ? <>
                                                                            <button type="button" class="btn btn-primary btn-sm rounded" onClick={() => { viewBucketImage(party?.uploaded_doc_path) }} >
                                                                                View Document
                                                                            </button>
                                                                        </> : <>--</>}
                                                                    </td>


                                                                </tr>
                                                            );
                                                        }
                                                        return null;
                                                    })}
                                            </tbody>

                                        </table>
                                    </bst.Col>
                                </bst.Row>
                            </div>
                        </div>&nbsp;
                    </>
                    }

                    {console.log("---------", caseDetails?.COUNTERSUBMITION)}

                    {caseDetails?.COUNTERSUBMITION === "ENABLE" && <>
                        <bst.Row className="pt-2 pt-2 ">
                            <FormikProvider value={formIkc}>
                                <Form onSubmit={formIkc?.handleSubmit} onChange={formIkc?.handleChange} >
                                    <div className="border px-13 pb-13 mb-4 pt-1">
                                        <bst.Row className="px-4 pt-4">
                                            {caseStatus === "Closed" && (<>
                                                <bst.Col xs={6} sm={6} md={6} lg={4} xl={4} xxl={4}>
                                                    <label className="mb-0"> Appeal Filed  <span style={{ color: 'red' }}>*</span></label>
                                                    <Field as="select" className='form-control' name="appealFiled" >
                                                        <option value="0">--SELECT--</option>
                                                        <option value="No">No</option>
                                                        <option value="Yes">Yes</option>
                                                    </Field>
                                                    <ErrorMessage name="appealFiled" component="div" className="text-danger" ></ErrorMessage>
                                                </bst.Col>

                                                {formIkc?.values?.appealFiled === "Yes" && (<>
                                                    <bst.Row className="px-4 pt-4">
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
                                                            {appealFileExist && <>
                                                                <button type="button" onClick={() => { viewBucketImage(appealFileExist); }}
                                                                    className='btn btn-primary btn-sm p-2 pt-1'><BsEye /> View</button>
                                                            </>}
                                                            <ErrorMessage name="appealFileCopy" component="div" className="text-danger" ></ErrorMessage>
                                                        </bst.Col>
                                                        <bst.Col xs={6} sm={6} md={6} lg={4} xl={4} xxl={4}>
                                                            <label className="mb-0"> Appeal Date  <span style={{ color: 'red' }}>*</span></label>
                                                            <Field type="date" name="appealFiledDt" className="form-control" />
                                                            <ErrorMessage name="appealFiledDt" component="div" className="text-danger" ></ErrorMessage>
                                                        </bst.Col>
                                                    </bst.Row>
                                                </>)}
                                            </>)}

                                            <bst.Row className="px-4 pt-4">
                                                <bst.Col xs={4} sm={4} md={4} lg={3} xl={3} xxl={3}>
                                                    <label className="mb-0">Counter Filed <span style={{ color: 'red' }}>*</span></label>
                                                    <Field as="select" className='form-control' name="counterFiled" >
                                                        <option value="0">--SELECT--</option>
                                                        <option value="No">No</option>
                                                        <option value="Yes">Yes</option>

                                                    </Field>
                                                    <ErrorMessage name="counterFiled" component="div" className="text-danger" ></ErrorMessage>
                                                </bst.Col>
                                                {formIkc?.values?.counterFiled === "Yes" && (<>

                                                    <bst.Col xs={6} sm={6} md={6} lg={4} xl={4} xxl={4}>
                                                        <label className="mb-0">Counter File Upload<span style={{ color: 'red' }}>*</span></label>
                                                        <Field name="counterFileCopy">
                                                            {({ field, form }) => (
                                                                <input
                                                                    type="file"
                                                                    className="form-control mt-3"
                                                                    accept="application/pdf,image/jpeg,image/jpg"
                                                                    onChange={(e) => {
                                                                        const file = e.target.files[0];
                                                                        if (file) {
                                                                            let fileVal = "counters";
                                                                            let filename = fileVal;
                                                                            let path = "jnbNivas/apolcms/uploads/counters/";
                                                                            form.setFieldValue("counterFileCopy", file);
                                                                            ImagePdfBucket(e, form, path, `counterFileCopy`, filename);
                                                                        }
                                                                    }}
                                                                />
                                                            )}
                                                        </Field>

                                                        {counterFileExist1 && <>
                                                            <button type="button" onClick={() => { viewBucketImage(counterFileExist1); }}
                                                                className='btn btn-primary btn-sm p-2 pt-1'><BsEye /> View</button>&nbsp;
                                                        </>}
                                                        {counterFileExist2 && <>
                                                            <button type="button" onClick={() => { viewBucketImage(counterFileExist2); }}
                                                                className='btn btn-primary btn-sm p-2 pt-1'><BsEye /> View</button>&nbsp;
                                                        </>}
                                                        {counterFileExist3 && <>
                                                            <button type="button" onClick={() => { viewBucketImage(counterFileExist3); }}
                                                                className='btn btn-primary btn-sm p-2 pt-1'><BsEye /> View</button>
                                                        </>}
                                                        <ErrorMessage name="counterFileCopy" component="div" className="text-danger" ></ErrorMessage>
                                                    </bst.Col>
                                                </>)}
                                            </bst.Row>




                                            <bst.Row className="px-4 pt-4">
                                                <bst.Col xs={6} sm={6} md={6} lg={4} xl={4} xxl={4}>
                                                    <label className="mb-0"> Action <span style={{ color: 'red' }}>*</span></label>
                                                    <Field as="select" className='form-control' name="actionToPerform" >
                                                        <option value="0">--SELECT--</option>
                                                        <option value="Counter Affidavit">Counter Affidavit</option>

                                                    </Field>
                                                    <ErrorMessage name="actionToPerform" component="div" className="text-danger" ></ErrorMessage>
                                                </bst.Col>
                                            </bst.Row>


                                            <bst.Row className="px-4 pt-4">
                                                <bst.Col xs={6} sm={6} md={6} lg={4} xl={4} xxl={4}>
                                                    <label className="mb-0"> Remarks <span style={{ color: 'red' }}>*</span></label>
                                                    <Field as='textarea' className='form-control' name="remarks" />
                                                    <ErrorMessage name="remarks" component="div" className="text-danger" ></ErrorMessage>
                                                </bst.Col>
                                            </bst.Row>
                                            <bst.Col xs={4} sm={4} md={4} lg={3} xl={3} xxl={3}>
                                                <button type="submit" className='btn btn-success mt-4' >Update & Finalize Counter</button>
                                            </bst.Col>



                                            <bst.Col xs={4} sm={4} md={4} lg={2} xl={2} xxl={2}>
                                                <button type="button" className='btn btn-success mt-4' onClick={() => gpReject('Counter Affidavit')}
                                                >Return</button>
                                            </bst.Col>


                                        </bst.Row>
                                    </div>
                                </Form>
                            </FormikProvider>
                        </bst.Row>
                    </>}
                </div>;

            case 'caseHistory':
                return <div>
                    {Array.isArray(caseDetails?.CASEHISTORYLIST) && <>
                        <div className="card">
                            <div style={{
                                backgroundColor: '#989b9c',
                                color: '#ffffff',
                                borderRadius: '10px',
                                boxShadow: '0 4px 6px rgba(68, 23, 23, 0.2)',
                                display: 'inline-block',
                                width: '180px',
                                height: '30px',
                                marginTop: '20px',
                                marginLeft: '10px',
                                textAlign: 'center'
                            }}>
                                Case History Details
                            </div>
                            <div className="card-body RowColorForLeave">
                                <bst.Row>
                                    <bst.Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={12}>
                                        <table className="table  table-bordered  table-responsive" style={{ width: "80%" }}>
                                            <thead style={{ textAlign: "left", backgroundColor: 'blue', color: 'white' }}>
                                                <tr>
                                                    <td>Sl No.</td>
                                                    <td>Sr No</td>
                                                    <td>Judge Name</td>
                                                    <td>Business Date</td>
                                                    <td>Hearing Date</td>
                                                    <td>Purpose of Listing</td>
                                                    <td>Cause Type</td>
                                                </tr>
                                            </thead>
                                            <tbody style={{ textAlign: "left" }}>
                                                {Array.isArray(caseDetails?.CASEHISTORYLIST) &&
                                                    caseDetails?.CASEHISTORYLIST.map((party, index) => (
                                                        <tr key={index}>
                                                            <td>{index + 1}</td>
                                                            <td>{party?.sr_no}</td>
                                                            <td>{party?.judge_name}</td>
                                                            <td>{party?.business_date}</td>
                                                            <td>{party?.hearing_date}</td>
                                                            <td>{party?.purpose_of_listing}</td>
                                                            <td>{party?.causelist_type}</td>

                                                        </tr>
                                                    ))}
                                            </tbody>

                                        </table>
                                    </bst.Col>
                                </bst.Row>
                            </div>
                        </div>&nbsp;
                    </>}
                </div>;
            case 'activities':
                return <div>
                    {Array.isArray(caseDetails?.ACTIVITIESDATA) && <>
                        <div className="card">
                            <div style={{
                                backgroundColor: '#989b9c',
                                color: '#ffffff',
                                borderRadius: '10px',
                                boxShadow: '0 4px 6px rgba(68, 23, 23, 0.2)',
                                display: 'inline-block',
                                width: '180px',
                                height: '30px',
                                marginTop: '20px',
                                marginLeft: '10px',
                                textAlign: 'center'
                            }}>
                                Case Activities
                            </div>
                            <div className="card-body RowColorForLeave">
                                <bst.Row>
                                    <bst.Col>
                                        <table className="table  table-bordered  table-responsive" style={{ width: "100%" }}>
                                            <thead style={{ textAlign: "left", backgroundColor: 'blue', color: 'white' }}>
                                                <tr>
                                                    <th>Sl No.</th>
                                                    <th>Date</th>
                                                    <th>Activity</th>
                                                    <th>Updated By</th>
                                                    <th>Assigned to</th>
                                                    <th>Remarks</th>
                                                    <th>Uploaded Document</th>
                                                </tr>
                                            </thead>
                                            <tbody style={{ textAlign: "left" }}>
                                                {Array.isArray(caseDetails?.ACTIVITIESDATA) &&
                                                    caseDetails?.ACTIVITIESDATA.map((party, index) => (
                                                        <tr key={index}>
                                                            <td>{index + 1}</td>
                                                            <td>{party?.inserted_on}</td>
                                                            <td>{party?.action_type}</td>
                                                            <td>{party?.inserted_by}</td>
                                                            <td>{party?.assigned_to}</td>
                                                            <td>{party?.remarks}</td>
                                                            <td>
                                                                <button type="button" class="btn btn-primary btn-sm rounded" onClick={() => { viewBucketImage(party?.uploaded_doc_path) }} >
                                                                    View Uploaded File
                                                                </button>
                                                            </td>

                                                        </tr>
                                                    ))}
                                            </tbody>

                                        </table>
                                    </bst.Col>
                                </bst.Row>
                            </div>
                        </div>&nbsp;
                    </>}

                </div>;
            case 'finalOrders':
                return <div>
                    {Array.isArray(caseDetails?.orderlist) && <>
                        <div className="card">
                            <div style={{
                                backgroundColor: '#989b9c',
                                color: '#ffffff',
                                borderRadius: '10px',
                                boxShadow: '0 4px 6px rgba(68, 23, 23, 0.2)',
                                display: 'inline-block',
                                width: '180px',
                                height: '30px',
                                marginTop: '20px',
                                marginLeft: '10px',
                                textAlign: 'center'
                            }}>
                                Final Order Details
                            </div>
                            <div className="card-body RowColorForLeave">
                                <bst.Row>
                                    <bst.Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={12}>
                                        <table className="table  table-bordered  table-responsive" style={{ width: "80%" }}>
                                            <thead style={{ textAlign: "left", backgroundColor: 'blue', color: 'white' }}>
                                                <tr>
                                                    <td>Sl No.</td>
                                                    <td>Sr No</td>
                                                    <td>Order NO</td>
                                                    <td>Order Date</td>
                                                    <td>Order Details</td>
                                                    <td>Order Document</td>
                                                </tr>
                                            </thead>
                                            <tbody style={{ textAlign: "left" }}>
                                                {Array.isArray(caseDetails?.orderlist) &&
                                                    caseDetails?.orderlist.map((party, index) => (
                                                        <tr key={index}>
                                                            <td>{index + 1}</td>
                                                            <td>{party?.sr_no}</td>
                                                            <td>{party?.order_no}</td>
                                                            <td>{party?.order_date}</td>
                                                            <td>{party?.order_details}</td>
                                                            <td>
                                                                <button type="button" class="btn btn-primary btn-sm rounded" onClick={() => { viewBucketImage(party?.order_document_path) }} >
                                                                    {party?.order_details}-{party?.order_no}
                                                                </button></td>

                                                        </tr>
                                                    ))}
                                            </tbody>

                                        </table>
                                    </bst.Col>
                                </bst.Row>
                            </div>
                        </div>&nbsp;
                    </>}
                </div>;
            default:
                return <div>Select a tab to view content.</div>;
        }
    };




    const firstRowTabs = tabs.slice(0, tabs.findIndex(tab => tab.key === 'objections') + 1);
    const secondRowTabs = tabs.slice(tabs.findIndex(tab => tab.key === 'objections') + 1);

    return (<>
        <CommonFormHeader heading={HEADING} />

        <bst.Container className="outer-page-content-container">
            <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', whiteSpace: 'nowrap', marginBottom: '8px' }}>
                {firstRowTabs.map((tab) => (
                    <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key)}
                        style={{
                            padding: '12px 16px',
                            backgroundColor: tab.color,
                            border: activeTab === tab.key ? '2px solid black' : '1px solid #ccc',
                            borderRadius: '6px',
                            fontWeight: activeTab === tab.key ? 'bold' : 'normal',
                            whiteSpace: 'nowrap',
                            cursor: 'pointer',
                        }}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Second row */}
            <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', whiteSpace: 'nowrap' }}>
                {secondRowTabs.map((tab) => (
                    <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key)}
                        style={{
                            padding: '12px 16px',
                            backgroundColor: tab.color,
                            border: activeTab === tab.key ? '2px solid black' : '1px solid #ccc',
                            borderRadius: '6px',
                            fontWeight: activeTab === tab.key ? 'bold' : 'normal',
                            whiteSpace: 'nowrap',
                            cursor: 'pointer',
                        }}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>&nbsp;

            {/* <hr
                    style={{
                        height: '1px',
                        backgroundColor: 'gray',
                        border: 'none',
                        marginTop: '100px',
                    }}
                /> */}


            <div className="p-4 border rounded-md bg-white shadow">{renderTabContent()}</div>

        </bst.Container >
        <InstructionPopup popupflagvalue={showModelPopup} setPopupflagvalue={setModelPopup} regularpopup={regularPopStatus}
            category={cino} viewdata={PopupData} />
    </>)
}

export default GPReportNewPWR