import React, { useEffect, useRef, useState } from 'react'
import *as bst from "react-bootstrap"
import { CommonFormHeader } from '../../CommonUtils/CommonFormHeader';
import { config } from '../../CommonUtils/CommonApis';
import { CommonAxiosGet, CommonAxiosPost } from '../../CommonUtils/CommonAxios';
import { viewBucketImage } from '../../CommonUtils/ViewImagelm';
import InstructionPopup from '../Popups/InstructionPopup';
import ImagePdfBucket from '../../CommonUtils/ImagePdfBase64';
import { ErrorMessage, Field, FieldArray, Form, FormikProvider, useFormik } from 'formik';
import { BsEye } from 'react-icons/bs';
import { failureAlert, successAlert2 } from '../../CommonUtils/SweetAlerts';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

function GPReportLegacyPWR() {
    const [activeTab, setActiveTab] = useState('caseDetails');
    const [HEADING, setHEADING] = useState([]);
    const [caseDetails, setcaseDetails] = useState([]);
    const [showModelPopup, setModelPopup] = useState(false);
    const [PopupData, setPopupData] = useState([]);
    const [regularPopupFlag, setregularPopupFlag] = useState(false);

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

    function regularPopStatus() { setregularPopupFlag(false); }

    const navigate = useNavigate();

    const hasFetchedData = useRef(false)


    const cino = JSON.parse(localStorage.getItem("caseNo"));
    const caseType = JSON.parse(localStorage.getItem("caseType"));

    useEffect(() => {
        if (!hasFetchedData.current) {
            getAllCaseDetails();
            hasFetchedData.current = true
        }
    }, []);

    function getAllCaseDetails() {

        let url = config.url.local_URL + "caseStatusUpdateGPReport?caseNo=" + cino + "&caseType=" + caseType;
        CommonAxiosGet(url).then((res) => {
            if (res.data !== undefined) {
                setHEADING(res.data?.HEADING)
                setcaseDetails(res.data);
                const SetCaseDeailsData = res?.data?.OLCMSCASEDATA[0]
                //console.log("DATA??????????????????", res?.data?.OLCMSCASEDATA[0])
                setcaseStatus(SetCaseDeailsData?.ecourts_case_status);

                formIk.setFieldValue("ecourtsCaseStatus", SetCaseDeailsData?.ecourts_case_status);
                formIk.setFieldValue("parawiseRemarksSubmitted", SetCaseDeailsData?.pwr_uploaded);
                formIk.setFieldValue("parawiseRemarksDt", SetCaseDeailsData?.pwr_submitted_date);
                formIk.setFieldValue("pwr_gp_approved", SetCaseDeailsData?.pwr_approved_gp);
                formIk.setFieldValue("dtPRApprovedToGP", SetCaseDeailsData?.pwr_gp_approved_date);
                formIk.setFieldValue("dtPRReceiptToGP", SetCaseDeailsData?.pwr_received_date);
                formIk.setFieldValue("actionToPerform", SetCaseDeailsData?.action_to_perfom);
                formIk.setFieldValue("remarks", SetCaseDeailsData?.remarks);
                formIk.setFieldValue("appealFiled", SetCaseDeailsData?.appeal_filed);
                formIk.setFieldValue("appealFiledDt", SetCaseDeailsData?.appeal_filed_date);
                formIk.setFieldValue("counterFiled", SetCaseDeailsData?.counter_filed);

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
        // enableReinitialize: true,

        onSubmit: async (values) => {
            // console.log("values----------", values);

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
            counterFiled: "",
            counterFiledDt: "",
            counterFileCopy: [null],
            judgementOrder: "",
            actionTakenOrder: "",
            appealFiled: "",
            appealFileCopy: "",
            appealFiledDt: "",
            actionToPerform: "",
            remarks: ""
        },
        // enableReinitialize: true,
        onSubmit: async (values) => {
            // console.log("values----------", values);
            values.fileCino = cino;
            await GPApproval(values);
        }

    }, []);

    const GPApproval = async (values) => {
        try {
            const url = config.url.local_URL + "ApproveGP";
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
                            //navigateToDetaisl()
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





    function handlePopupClick(cino, caseNo, serno) {
        let url = config.url.local_URL + "DailyStatusEntryReport?cino=" + cino + "&serno=" + serno + "&caseType=" + caseNo;
        // console.log("instructionm popup url-----", url);
        CommonAxiosGet(url).then((res) => {
            if (res.data.status === true) {
                //alert("test " + res.data.CASESLISTOLD?.[0]?.cino);
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


    function gpReject(actiontoperform) {

        let url = config.url.local_URL + "RejectGP";
        const values = {
            action: actiontoperform,
            fileCino: cino
        };
        CommonAxiosPost(url, values).then((res) => {
            if (res?.data?.scode === '01') {
                successAlert2(res?.data?.sdesc);
            } else {
                failureAlert(res?.data?.sdesc);
            }
        });
    }

    const tabs = [
        { key: 'caseDetails', label: 'Case Details', color: '#c2e8be' },
        { key: 'instructions', label: 'Instructions', color: '#c7e6eb' },
        { key: 'iaFilings', label: 'IA Filings', color: '#dbd1a9' },
        { key: 'paraWise', label: 'Parawise Remarks', color: '#dea0a6' },
        { key: 'counterDetails', label: 'Counter Details', color: '#c2b8bb' },
        { key: 'interimOrders', label: 'Interim Orders', color: '#d1c782' },
        { key: 'taggedCases', label: 'Tagged along Cases', color: '#a2decc' },
        { key: 'objections', label: 'Objections', color: '#ed6b6b' },
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

                            <table className="table  table-bordered  table-responsive" style={{ width: "100%", marginTop: "1%" }}>

                                <tbody style={{ textAlign: "left" }}>
                                    <tr>
                                        <td><b>Download Affidavit :</b>
                                            {caseDetails.USERSLIST[0]?.scanned_document_path ? <>

                                                <button type="button" class="btn btn-primary btn-sm rounded" onClick={() => { viewBucketImage(caseDetails.USERSLIST[0]?.order_document_path) }} >
                                                    Affidavit
                                                </button>
                                            </> : <>--</>}

                                            {caseDetails.USERSLIST[0]?.barcode_file_path ? <>

                                                <button type="button" class="btn btn-primary btn-sm rounded" onClick={() => { viewBucketImage(caseDetails.USERSLIST[0]?.order_document_path) }} >
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
                                            <b>Filing No. :</b>&nbsp;
                                            {caseDetails.USERSLIST[0]?.fil_no}
                                        </td>


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


                                    </tr>
                                    <tr>

                                        <td>
                                            <b>Est Code :</b>&nbsp;
                                            {caseDetails.USERSLIST[0]?.est_code}
                                        </td>

                                        <td>
                                            <b>Case Type :</b>&nbsp;
                                            {caseDetails.USERSLIST[0]?.case_type_id}
                                        </td>
                                        <td>
                                            <b>Cause List Type :</b>&nbsp;
                                            {caseDetails.USERSLIST[0]?.causelist_type}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <b>Bench Name :</b>&nbsp;
                                            {caseDetails.USERSLIST[0]?.bench_name}
                                        </td>

                                        <td>
                                            <b>Judicial Branch :</b>&nbsp;
                                            {caseDetails.USERSLIST[0]?.judicial_branch}
                                        </td>
                                        <td>
                                            <b>Coram :</b>&nbsp;
                                            {caseDetails.USERSLIST[0]?.coram}
                                        </td>
                                    </tr>

                                    <tr>

                                        <td>
                                            <b>Court Est Name:</b>&nbsp;
                                            {caseDetails.USERSLIST[0]?.court_est_name}
                                        </td>

                                        <td>
                                            <b>State Name :</b>&nbsp;
                                            {caseDetails.USERSLIST[0]?.state_name}
                                        </td>
                                        <td>
                                            <b>District :</b>&nbsp;
                                            {caseDetails.USERSLIST[0]?.dist_name}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <b>Date Of First List :</b>&nbsp;
                                            {caseDetails.USERSLIST[0]?.date_first_list}
                                        </td>

                                        <td>
                                            <b>Date Of Next List :</b>&nbsp;
                                            {caseDetails.USERSLIST[0]?.date_next_list}
                                        </td>

                                        <td>
                                            <b>Date Of Decision :</b>&nbsp;
                                            {caseDetails.USERSLIST[0]?.date_of_decision}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <b>Purpose  :</b>&nbsp;
                                            {caseDetails.USERSLIST[0]?.purpose_name}
                                        </td>

                                        <td>
                                            <b>Petitioner Name :</b>&nbsp;
                                            {caseDetails.USERSLIST[0]?.pet_name}
                                        </td>
                                        <td>
                                            <b>Petitioner Advocate:</b>&nbsp;
                                            {caseDetails.USERSLIST[0]?.pet_adv}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <b>Petitioner Legal Heir :</b>&nbsp;
                                            {caseDetails.USERSLIST[0]?.pet_legal_heir}
                                        </td>

                                        <td>
                                            <b>Respondent Name :</b>&nbsp;
                                            {caseDetails.USERSLIST[0]?.res_name}
                                        </td>

                                        <td>
                                            <b>Respondent Advocate :</b>&nbsp;
                                            {caseDetails.USERSLIST[0]?.res_adv}
                                        </td>

                                    </tr>

                                </tbody>
                            </table>
                            {/* </div>
                            </div>&nbsp; */}

                            <div className="card">
                                <bst.Row>
                                    <bst.Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={12}>
                                        <label className="w-100" style={{ marginLeft: '10px' }}>
                                            <b>Prayer :</b>
                                            {caseDetails.USERSLIST[0]?.prayer}

                                        </label>
                                    </bst.Col>
                                </bst.Row>
                            </div>&nbsp;

                            {Array.isArray(caseDetails?.otherDocumentsList) && <>
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
                                        Mapped Documents List
                                    </div>
                                    <div className="card-body RowColorForLeave">
                                        <bst.Row>
                                            <bst.Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={12}>
                                                <table className="table  table-bordered  table-responsive" style={{ width: "80%" }}>
                                                    <thead style={{ textAlign: "left", backgroundColor: 'blue', color: 'white' }}>
                                                        <tr>

                                                            <th>S No.</th>
                                                            <th>Acknowledgement No</th>
                                                            <th>Document Name</th>
                                                            <th>Document</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody style={{ textAlign: "left" }}>
                                                        {Array.isArray(caseDetails?.otherDocumentsList) &&
                                                            caseDetails?.otherDocumentsList.map((party, index) => (
                                                                <tr key={index}>
                                                                    <td>{index + 1}</td>
                                                                    <td>{party?.hc_ack_no}</td>
                                                                    <td>{party?.case_short_name}</td>
                                                                    <td>
                                                                        {/* document */}
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
                                                        {Array.isArray(caseDetails?.otherDocumentsList) &&
                                                            caseDetails?.otherDocumentsList.map((party, index) => (
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
            case 'iaFilings':
                return <div>
                    {Array.isArray(caseDetails?.IAFILINGLIST) && <>
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
                                IAFilling List
                            </div>
                            <div className="card-body RowColorForLeave">
                                <bst.Row>
                                    <bst.Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={12}>
                                        <table className="table  table-bordered  table-responsive" style={{ width: "80%" }}>
                                            <thead style={{ textAlign: "left", backgroundColor: 'blue', color: 'white' }}>
                                                <tr>

                                                    <th>S.No</th>
                                                    <th>Sr No</th>
                                                    <td>IA NO</td>
                                                    <td>IA Petitioner Name</td>
                                                    <td>IA Pending/Disposed</td>
                                                    <td>IA Date of Filling</td>
                                                </tr>
                                            </thead>
                                            <tbody style={{ textAlign: "left" }}>
                                                {Array.isArray(caseDetails?.IAFILINGLIST) &&
                                                    caseDetails?.IAFILINGLIST.map((party, index) => (
                                                        <tr key={index}>
                                                            <td>{index + 1}</td>
                                                            <td>{party?.sr_no}</td>
                                                            <td>{party?.ia_number}</td>
                                                            <td>{party?.ia_pet_name}</td>
                                                            <td>{party?.ia_pend_disp}</td>
                                                            <td>{party?.date_of_filing}</td>
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
                    {Array.isArray(caseDetails?.MappedPWRList) && <>
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
                                Other Parawise Remarks
                            </div>
                            <div className="card-body RowColorForLeave">
                                <bst.Row>
                                    <bst.Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={12}>
                                        <table className="table  table-bordered  table-responsive" style={{ width: "97%" }}>
                                            <thead style={{ textAlign: "left", backgroundColor: 'blue', color: 'white' }}>
                                                <tr>
                                                    <th>Sl No.</th>
                                                    <th>Acknowledgement No</th>
                                                    <th>Parawise Remarks</th>
                                                    <th>Parawise Remarks Submitted Date</th>
                                                    <th>Parawise Remarks Submitted File</th>
                                                </tr>
                                            </thead>
                                            <tbody style={{ textAlign: "left" }}>
                                                {Array.isArray(caseDetails?.MappedPWRList) &&
                                                    caseDetails?.MappedPWRList.map((party, index) => (
                                                        <tr key={index}>
                                                            <td>{index + 1}</td>
                                                            <td>{party?.ack_no}<br></br>
                                                                {party?.hc_ack_no}</td>
                                                            <td>{party?.pwr_uploaded}</td>
                                                            <td>{party?.pwr_submitted_date}</td>
                                                            <td>
                                                                {party?.pwr_uploaded_copy ? <>
                                                                    <button type="button" class="btn btn-primary btn-sm rounded" onClick={() => { viewBucketImage(party?.pwr_uploaded_copy) }} >
                                                                        View Document
                                                                    </button>
                                                                </> : <>--</>}
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
                                                        <Field as="select" className='form-control' name="pwr_gp_approved" >
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

                    </>
                    }
                </div >;
            case 'counterDetails':
                return <div>
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
            case 'interimOrders':
                return <div>
                    {Array.isArray(caseDetails?.INTERIMORDERSLIST) && <>
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
                                InterimOrder List
                            </div>
                            <div className="card-body RowColorForLeave">
                                <bst.Row>
                                    <bst.Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={12}>
                                        <table className="table  table-bordered  table-responsive" style={{ width: "80%" }}>
                                            <thead style={{ textAlign: "left", backgroundColor: 'blue', color: 'white' }}>
                                                <tr>

                                                    <th>S.No</th>
                                                    <th>Sr No</th>
                                                    <th>Order NO</th>
                                                    <th>Order Date</th>
                                                    <th width="400px" >Order Details</th>
                                                    <th width="600px" >Order Document</th>

                                                </tr>
                                            </thead>
                                            <tbody style={{ textAlign: "left" }}>
                                                {Array.isArray(caseDetails?.INTERIMORDERSLIST) &&
                                                    caseDetails?.INTERIMORDERSLIST.map((party, index) => (
                                                        <tr key={index}>
                                                            <td>{index + 1}</td>
                                                            <td>{party?.sr_no}</td>
                                                            <td>{party?.order_no}</td>
                                                            <td>{party?.order_date}</td>
                                                            <td>{party?.order_details}</td>
                                                            <td>
                                                                <button type="button" class="btn btn-primary btn-sm rounded" onClick={() => { viewBucketImage(party?.order_document_path) }} >
                                                                    View Document
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
            case 'taggedCases':
                return <div>
                    {Array.isArray(caseDetails?.LINKCASESLIST) && <>
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
                                Case Link List
                            </div>
                            <div className="card-body RowColorForLeave">
                                <bst.Row>
                                    <bst.Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={12}>
                                        <table className="table  table-bordered  table-responsive" style={{ width: "80%" }}>
                                            <thead style={{ textAlign: "left", backgroundColor: 'blue', color: 'white' }}>
                                                <tr>

                                                    <th>S.No</th>
                                                    <th>Sr No</th>
                                                    <th>Filling NO</th>
                                                    <th>Case Number</th>

                                                </tr>
                                            </thead>
                                            <tbody style={{ textAlign: "left" }}>
                                                {Array.isArray(caseDetails?.LINKCASESLIST) &&
                                                    caseDetails?.LINKCASESLIST.map((party, index) => (
                                                        <tr key={index}>
                                                            <td>{index + 1}</td>
                                                            <td>{party?.sr_no}</td>
                                                            <td>{party?.filing_number}</td>
                                                            <td>{party?.case_number}</td>

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
            case 'objections':
                return <div>
                    {Array.isArray(caseDetails?.OBJECTIONSLIST) && <>
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
                                Objections List
                            </div>
                            <div className="card-body RowColorForLeave">
                                <bst.Row>
                                    <bst.Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={12}>
                                        <table className="table  table-bordered  table-responsive" style={{ width: "80%" }}>
                                            <thead style={{ textAlign: "left", backgroundColor: 'blue', color: 'white' }}>
                                                <tr>

                                                    <th>Sl No.</th>
                                                    <th>Objection Number</th>
                                                    <th>Objection Description</th>
                                                    <th>Scrunity Date</th>
                                                    <th>Compliance Date</th>
                                                    <th>Receipt Date</th>

                                                </tr>
                                            </thead>
                                            <tbody style={{ textAlign: "left" }}>
                                                {Array.isArray(caseDetails?.OBJECTIONSLIST) &&
                                                    caseDetails?.OBJECTIONSLIST.map((party, index) => (
                                                        <tr key={index}>
                                                            <td>{index + 1}</td>
                                                            <td>{party?.objection_no}</td>
                                                            <td>{party?.objection_desc}</td>
                                                            <td>{party?.scrutiny_date}</td>
                                                            <td>{party?.objections_compliance_by_date}</td>
                                                            <td>{party?.obj_reciept_date}  </td>
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
                return <div>{Array.isArray(caseDetails?.orderlist) && <>
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

export default GPReportLegacyPWR