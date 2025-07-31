import React, { useEffect, useRef, useState } from 'react'
import * as bst from "react-bootstrap"
import { CommonAxiosGet, CommonAxiosPost } from '../../CommonUtils/CommonAxios';
import { config } from '../../CommonUtils/CommonApis';
import { CommonFormHeader } from '../../CommonUtils/CommonFormHeader';
import { ErrorMessage, Field, FieldArray, Form, Formik, FormikProvider, useFormik } from 'formik';
import ImagePdfBucket from '../../CommonUtils/ImagePdfBase64';
import { viewBucketImage } from '../../CommonUtils/ViewImagelm';
import Sweetalert, { failureAlert, InfoAlert, successAlert, successAlert2 } from '../../CommonUtils/SweetAlerts';
import { BsEye } from 'react-icons/bs';
import { viewImage } from '../../CommonUtils/ViewImage';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import * as Yup from "yup"

function CaseStatusUpdation() {
    const [caseDetails, setcaseDetails] = useState([]);
    const [HEADING, setHEADING] = useState([]);
    const [GPSLIST, setGPSLIST] = useState([]);

    const [petitionFileExist, setpetitionFileExist] = useState([]);
    const [judgementFileExist, setjudgementFileExist] = useState([]);
    const [actiontakenFileExist, setactiontakenFileExist] = useState([]);
    const [appealFileExist, setappealFileExist] = useState([]);
    const [parawiseFileExist1, setparawiseFileExist1] = useState([]);
    const [parawiseFileExist2, setparawiseFileExist2] = useState([]);
    const [parawiseFileExist3, setparawiseFileExist3] = useState([]);

    const [counterFileExist1, setcounterFileExist1] = useState([]);
    const [counterFileExist2, setcounterFileExist2] = useState([]);
    const [counterFileExist3, setcounterFileExist3] = useState([]);

    const cino = JSON.parse(localStorage.getItem("cino"));

    const navigate = useNavigate();
    const hasFetchedData = useRef(false);


    const userValidations = Yup.object().shape({
        ecourtsCaseStatus: Yup.string().required("Required"),

        petitionDocument: Yup.mixed().when(['ecourtsCaseStatus'],
            {
                is: (ecourtsCaseStatus) =>
                    (ecourtsCaseStatus === 'Pending' || ecourtsCaseStatus === 'Closed') && !petitionFileExist,
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
        counterFiled: Yup.string().when("ecourtsCaseStatus", {
            is: (val) => val === "Pending",
            then: (schema) => schema.required("Required"),
            otherwise: (schema) => schema.notRequired(),
        }),
        counterFiledDt: Yup.string().when(['ecourtsCaseStatus', 'counterFiled'],
            {
                is: (ecourtsCaseStatus, counterFiled) =>
                    ecourtsCaseStatus === 'Pending' && counterFiled === 'Yes',
                then: (schema) => schema.required('Required'),
                otherwise: (schema) => schema.notRequired(),
            }),
        counterFileCopy: Yup.array()
            .when(['ecourtsCaseStatus', 'counterFiled'], {
                is: (status, submitted) => status === 'Pending' && submitted === 'Yes',
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

        judgementOrder: Yup.mixed().when('ecourtsCaseStatus', {
            is: (val) => val === 'Closed',
            then: (schema) =>
                schema
                    .required('Required')
                    .test('file-size', 'File size should be ≤ 2MB', function (value) {
                        return (
                            typeof value === 'string' ||
                            (value instanceof File && value.size <= 2 * 1024 * 1024)
                        )
                    }),
            otherwise: (schema) => schema.notRequired(),

        }),
        actionTakenOrder: Yup.string().when("ecourtsCaseStatus", {
            is: (val) => val === "Closed",
            then: (schema) => schema.required("Required"),
            otherwise: (schema) => schema.notRequired(),
        }),
        appealFiled: Yup.string().when("ecourtsCaseStatus", {
            is: (val) => val === "Closed",
            then: (schema) => schema.required("Required"),
            otherwise: (schema) => schema.notRequired(),
        }),
        appealFileCopy: Yup.mixed().when(['ecourtsCaseStatus', 'appealFiled'],
            {
                is: (ecourtsCaseStatus, appealFiled) =>
                    ecourtsCaseStatus === 'Closed' && appealFiled === 'Yes',
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

        appealFiledDt: Yup.string().when(['ecourtsCaseStatus', 'appealFiled'],
            {
                is: (ecourtsCaseStatus, appealFiled) =>
                    ecourtsCaseStatus === 'Closed' && appealFiled === 'Yes',
                then: (schema) => schema.required("Required"),
                otherwise: (schema) => schema.notRequired(),
            }),
        actionToPerform: Yup.string().required("Required"),
        remarks: Yup.string().required("Required"),
    });


    const formIk = useFormik({
        initialValues: {
            ecourtsCaseStatus: "",
            petitionDocument: "",
            parawiseRemarksSubmitted: "",
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
        enableReinitialize: true,
        validationSchema: userValidations,
        onSubmit: (values) => {
            values.fileCino = cino;
            console.log("heloo-----", values);
            if (caseDetails?.STATUSUPDATEBTN !== "") {
                const url = config.url.local_URL + "updateCaseDetails";

                CommonAxiosPost(url, values).then((res) => {
                    if (res?.data?.status === true) {
                        successAlert2(res?.data?.msg).then(() => {

                            const apiResponse = res?.data;
                            const record = apiResponse?.data;
                            console.log(apiResponse?.status);
                            if (
                                record[0]?.OLCMSCASEDATA &&
                                Array.isArray(record[0].OLCMSCASEDATA) &&
                                record[0].OLCMSCASEDATA.length > 0 &&
                                record[0].OLCMSCASEDATA[0]?.ecourts_case_status !== undefined
                            ) {
                                console.log("------------------if" + JSON.stringify(record[0]?.OLCMSCASEDATA[0].petition_document));
                                const SetCaseDeailsData = res?.data?.data?.[0]?.OLCMSCASEDATA[0];
                                formIk.setFieldValue('ecourtsCaseStatus', record[0]?.OLCMSCASEDATA[0].ecourts_case_status || "");
                                formIk.setFieldValue('parawiseRemarksSubmitted', record[0]?.OLCMSCASEDATA[0].pwr_uploaded || "");
                                formIk.setFieldValue('parawiseRemarksDt', record[0]?.OLCMSCASEDATA[0].pwr_submitted_date || "");
                                formIk.setFieldValue('counterFiled', record[0]?.OLCMSCASEDATA[0].counter_filed || "");
                                formIk.setFieldValue('counterFiledDt', record[0]?.OLCMSCASEDATA[0].counter_filed_date || "");
                                formIk.setFieldValue('judgementOrder', record[0]?.OLCMSCASEDATA[0].judgement_order || "");
                                formIk.setFieldValue('actionTakenOrder', record[0]?.OLCMSCASEDATA[0].action_taken_order || "");
                                formIk.setFieldValue('appealFiled', record[0]?.OLCMSCASEDATA[0].appeal_filed || "");
                                formIk.setFieldValue('appealFileCopy', record[0]?.OLCMSCASEDATA[0].appeal_filed_copy || "");
                                formIk.setFieldValue('appealFiledDt', record[0]?.OLCMSCASEDATA[0].appeal_filed_date || "");
                                formIk.setFieldValue('actionToPerform', record[0]?.OLCMSCASEDATA[0].action_to_perfom || "");
                                formIk.setFieldValue('remarks', record[0]?.OLCMSCASEDATA[0].remarks || "");


                                setpetitionFileExist(SetCaseDeailsData.petition_document || "");
                                setparawiseFileExist1(SetCaseDeailsData.pwr_uploaded_copy || "");
                                setparawiseFileExist2(SetCaseDeailsData.pwr_uploaded_copy2 || "");
                                setparawiseFileExist3(SetCaseDeailsData.pwr_uploaded_copy3 || "");
                                setcounterFileExist1(SetCaseDeailsData.counter_filed_document || "");
                                setcounterFileExist2(SetCaseDeailsData.counter_filed_document2 || "");
                                setcounterFileExist3(SetCaseDeailsData.counter_filed_document3 || "");
                                setjudgementFileExist(SetCaseDeailsData.judgement_order || "");
                                setactiontakenFileExist(SetCaseDeailsData.action_taken_order || "");
                                setappealFileExist(SetCaseDeailsData.appeal_filed_copy || "");


                            }
                        });
                    }
                    else if (res?.data?.status === true) {

                    }
                    else {
                        console.log("else------")
                        failureAlert(res?.data?.sdesc);

                        setpetitionFileExist([]);
                        setparawiseFileExist1([]);
                        setparawiseFileExist2([]);
                        setparawiseFileExist3([]);
                        setcounterFileExist1([]);
                        setcounterFileExist2([]);
                        setcounterFileExist3([]);
                        setjudgementFileExist([]);
                        setactiontakenFileExist([]);
                        setappealFileExist([]);
                    }
                });

            }
            else {

                const url = config.url.local_URL + "updateCaseDetails";
                CommonAxiosPost(url, values, {
                    headers: { "Content-Type": "application/json" }
                }).then((res) => {
                    console.log("----------g------" + res?.data?.scode);
                    if (res?.data?.scode === '01') {
                        successAlert2(res?.data?.sdesc);
                    } else {
                        failureAlert(res?.data?.sdesc);
                    }
                });
            }
        }

    })

    console.log("formikk", formIk.errors, formIk.values)

    useEffect(() => {
        if (!hasFetchedData.current) {
            GetCaseDetails(cino);
            GetGPsList();
            hasFetchedData.current = true
        }
    }, [cino]);

    function GetCaseDetails(cino) {
        alert(cino + "---------cino");
        resetCaseDetailsState();

        const url = config.url.local_URL + "caseStatusUpdate?cino=" + cino;

        CommonAxiosGet(url).then((res) => {
            const apiResponse = res?.data;
            const caseData = apiResponse?.data || [];
            console.log(apiResponse?.status);


            if (apiResponse?.status === true && Array.isArray(caseData) && caseData.length > 0) {
                setcaseDetails(caseData[0]);
                setHEADING(caseData[0]?.HEADING);
                if (caseData[0].OLCMSCASEDATA.length > 0 && caseData[0].OLCMSCASEDATA[0]?.ecourts_case_status !== undefined) {

                    console.log("p--------" + JSON.stringify(caseData[0]?.OLCMSCASEDATA[0].ecourts_case_status));

                    const SetCaseDeailsData = res?.data?.data?.[0]?.OLCMSCASEDATA[0];

                    formIk.setFieldValue('ecourtsCaseStatus', caseData[0]?.OLCMSCASEDATA[0].ecourts_case_status || "");

                    formIk.setFieldValue('parawiseRemarksSubmitted', caseData[0]?.OLCMSCASEDATA[0].pwr_uploaded || "");
                    formIk.setFieldValue('parawiseRemarksDt', caseData[0]?.OLCMSCASEDATA[0].pwr_submitted_date || "");
                    formIk.setFieldValue('counterFiled', caseData[0]?.OLCMSCASEDATA[0].counter_filed || "");
                    formIk.setFieldValue('counterFiledDt', caseData[0]?.OLCMSCASEDATA[0].counter_filed_date || "");
                    formIk.setFieldValue('judgementOrder', caseData[0]?.OLCMSCASEDATA[0].judgement_order || "");
                    formIk.setFieldValue('actionTakenOrder', caseData[0]?.OLCMSCASEDATA[0].action_taken_order || "");
                    formIk.setFieldValue('appealFiled', caseData[0]?.OLCMSCASEDATA[0].appeal_filed || "");
                    formIk.setFieldValue('appealFileCopy', caseData[0]?.OLCMSCASEDATA[0].appeal_filed_copy || "");
                    formIk.setFieldValue('appealFiledDt', caseData[0]?.OLCMSCASEDATA[0].appeal_filed_date || "");
                    formIk.setFieldValue('actionToPerform', caseData[0]?.OLCMSCASEDATA[0].action_to_perfom || "");
                    formIk.setFieldValue('remarks', caseData[0]?.OLCMSCASEDATA[0].remarks || "");

                    setpetitionFileExist(SetCaseDeailsData.petition_document || "");
                    setparawiseFileExist1(SetCaseDeailsData.pwr_uploaded_copy || "");
                    setparawiseFileExist2(SetCaseDeailsData.pwr_uploaded_copy2 || "");
                    setparawiseFileExist3(SetCaseDeailsData.pwr_uploaded_copy3 || "");
                    setcounterFileExist1(SetCaseDeailsData.counter_filed_document || "");
                    setcounterFileExist2(SetCaseDeailsData.counter_filed_document2 || "");
                    setcounterFileExist3(SetCaseDeailsData.counter_filed_document3 || "");
                    setjudgementFileExist(SetCaseDeailsData.judgement_order || "");
                    setactiontakenFileExist(SetCaseDeailsData.action_taken_order || "");
                    setappealFileExist(SetCaseDeailsData.appeal_filed_copy || "");

                }
            } else {
                resetCaseDetailsState();

            }
        }).catch((err) => {
            console.error("Error fetching case details:", err);
            resetCaseDetailsState();

        });
    }



    function resetCaseDetailsState() {
        setcaseDetails("");
        setpetitionFileExist("");
        setparawiseFileExist1("");
        setparawiseFileExist2("");
        setparawiseFileExist3("");
        setcounterFileExist1("");
        setcounterFileExist2("");
        setcounterFileExist3("");
        setjudgementFileExist("");
        setactiontakenFileExist("");
        setappealFileExist("");
    }


    function sendbackFn() {

        const url = config.url.local_URL + "sendBackCaseDetails";
        const payload = { fileCino: cino };

        CommonAxiosPost(url, payload, {
            headers: { "Content-Type": "application/json" }
        }).then((res) => {
            if (res?.data?.scode === '01') {
                Swal.fire({
                    title: res?.data?.sdesc,
                    icon: "success",
                    backdrop: false
                }).then((resforalert) => {
                    if (resforalert?.isConfirmed === true) {
                        //navigateToDetaisl()
                        navigate("/AssignedCasesToSection");
                    }
                });
            } else {
                failureAlert(res?.data?.sdesc);
            }
        });
    }

    function forwardCase() {

        alert(cino + "-------")
        const url = config.url.local_URL + "forwardCaseDetails";
        const payload = { fileCino: cino };

        CommonAxiosPost(url, payload, {
            headers: { "Content-Type": "application/json" }
        }).then((res) => {
            if (res?.data?.scode === '01') {

                Swal.fire({
                    title: res?.data?.sdesc,
                    icon: "success",
                    backdrop: false
                }).then((resforalert) => {
                    if (resforalert?.isConfirmed === true) {
                        //navigateToDetaisl()
                        navigate("/AssignedCasesToSection");
                    }
                });



            } else {

                failureAlert(res?.data?.sdesc);
            }
        });
    }

    function forwardCase2GP(gpCode) {
        if (!gpCode?.trim()) {
            alert("Select GP!");
            return;
        }

        const url = config.url.local_URL + "forwardCaseDetails2GP";
        const payload = { fileCino: cino, gpCode: gpCode };

        CommonAxiosPost(url, payload, {
            headers: { "Content-Type": "application/json" }
        }).then((res) => {
            if (res?.data?.scode === '01') {
                Swal.fire({
                    title: res?.data?.sdesc,
                    icon: "success",
                    backdrop: false
                }).then((resforalert) => {
                    if (resforalert?.isConfirmed === true) {

                        navigate("/AssignedCasesToSection");
                    }
                });
            } else {
                failureAlert(res?.data?.sdesc);
            }
        });
    }

    function gpApprove() {
        const url = config.url.local_URL + "gpApprove";
        const payload = { fileCino: cino };

        CommonAxiosPost(url, payload, {
            headers: { "Content-Type": "application/json" }
        }).then((res) => {
            if (res?.data?.scode === '01') {
                Swal.fire({
                    title: res?.data?.sdesc,
                    icon: "success",
                    backdrop: false
                }).then((resforalert) => {
                    if (resforalert?.isConfirmed === true) {
                        //navigateToDetaisl()
                        navigate("/AssignedCasesToSection");
                    }
                });
            } else {
                failureAlert(res?.data?.sdesc);
            }
        });

    }
    function gpReject() {
        const url = config.url.local_URL + "gpReject";
        const payload = { fileCino: cino };

        CommonAxiosPost(url, payload, {
            headers: { "Content-Type": "application/json" }
        }).then((res) => {
            if (res?.data?.scode === '01') {
                Swal.fire({
                    title: res?.data?.sdesc,
                    icon: "success",
                    backdrop: false
                }).then((resforalert) => {
                    if (resforalert?.isConfirmed === true) {
                        //navigateToDetaisl()
                        navigate("/AssignedCasesToSection");
                    }
                });
            } else {
                failureAlert(res?.data?.sdesc);
            }
        });
    }

    const GetGPsList = () => {
        let url = config.url.local_URL + "getGPSList";
        CommonAxiosGet(url).then((res) => {
            if (res.data && res.data.length > 0) {
                setGPSLIST(res.data);

            } else {
                setGPSLIST([]);
            }
        }).catch((error) => {
            console.error("Error fetching getYearsList names:", error);
        });
    };


    return (<>
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
                    </div>&nbsp;



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
                                            <tr>
                                                <td>{1}</td>
                                                <td>{caseDetails?.actlist?.[0]?.act}</td>
                                                <td>{caseDetails?.actlist?.[0]?.actname}</td>
                                                <td>{caseDetails?.actlist?.[0]?.section}</td>
                                            </tr>

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


                <bst.Row className="pt-2 pt-2 ">
                    <FormikProvider value={formIk}>
                        <Form onSubmit={formIk?.handleSubmit} onChange={formIk?.handleChange} >
                            <div className="border px-13 pb-13 mb-4 pt-1">
                                <bst.Row className="px-4 pt-4">
                                    <bst.Col xs={4} sm={4} md={4} lg={3} xl={3} xxl={3}>
                                        <label className="mb-0"> Case Status  <span style={{ color: 'red' }}>*</span></label>
                                        <Field as="select" className='form-control mt-3' name="ecourtsCaseStatus" >
                                            <option value="0">--SELECT--</option>
                                            <option value="Pending">Pending</option>
                                            <option value="Private">Private</option>
                                            <option value="Closed">Closed</option>
                                            <option value="GoI">Government of India / Central Tax / Income Tax</option>
                                            <option value="PSU">PSU (or) Public Sector Undertaking</option>

                                        </Field>
                                        <ErrorMessage name="ecourtsCaseStatus" component="div" className="text-danger" ></ErrorMessage>
                                    </bst.Col>

                                    {formIk?.values?.ecourtsCaseStatus === "Pending" || formIk?.values?.ecourtsCaseStatus === "Closed" ? (<>
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

                                            {petitionFileExist && petitionFileExist !== "" && <>
                                                <button type="button" onClick={() => { viewBucketImage(petitionFileExist); }}
                                                    className='btn btn-primary btn-sm p-2 pt-1'><BsEye /> View</button>
                                            </>}
                                            <ErrorMessage name="petitionDocument" component="div" className="text-danger" ></ErrorMessage>
                                        </bst.Col>
                                    </>) : <></>}
                                </bst.Row>




                                <bst.Row className="px-4 pt-4">
                                    {formIk?.values?.ecourtsCaseStatus === "Pending" && (<>
                                        <bst.Col xs={4} sm={4} md={4} lg={3} xl={3} xxl={3}>
                                            <label className="mb-10"> Submit Parawise Remarks  <span style={{ color: 'red' }}>*</span></label>
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

                                            {/* <bst.Col xs={4} sm={4} md={4} lg={3} xl={3} xxl={3}>
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
                                                <ErrorMessage name="parawiseRemarksCopy" component="div" className="text-danger" ></ErrorMessage>
                                            </bst.Col> */}

                                            <FieldArray name="parawiseRemarksCopy">
                                                {({ remove, push, form }) => {
                                                    const fileArray = form.values.parawiseRemarksCopy || [];

                                                    return (
                                                        <div>
                                                            {fileArray.map((file, index) => {
                                                                // const isLast = index === fileArray.length - 1;
                                                                const fileAdded = file instanceof File || typeof file === 'string';
                                                                return (
                                                                    <div key={index} className="d-flex align-items-center gap-2 mb-3 ">
                                                                        <bst.Col xs={6} sm={6} md={6} lg={6} xl={6} xxl={6}>
                                                                            <label className="mb-0">Upload Parawise Remarks {index + 1}</label>
                                                                            <div className="d-flex align-items-center gap-2">
                                                                                <input
                                                                                    type="file"
                                                                                    className="form-control w-50"
                                                                                    accept="application/pdf,image/jpeg,image/jpg"
                                                                                    onChange={(e) => {
                                                                                        const file = e.target.files[0];
                                                                                        let fileVal = "parawiseRemarks_" + cino + "_" + index;
                                                                                        let filename = fileVal;
                                                                                        let path = "apolcms/uploads/parawiseremarks/";
                                                                                        form.setFieldValue(`parawiseRemarksCopy[${index}]`, file);
                                                                                        ImagePdfBucket(e, form, path, `parawiseRemarksCopy[${index}]`, filename);
                                                                                    }}
                                                                                />
                                                                                <ErrorMessage name={`parawiseRemarksCopy[${index}]`} component="div" className="text-danger" />


                                                                                {parawiseFileExist1 && parawiseFileExist1 !== "" && <>
                                                                                    <button type="button" onClick={() => { viewBucketImage(parawiseFileExist1); }}
                                                                                        className='btn btn-primary btn-sm d-flex align-items-center px-2 py-1'><BsEye /> View1</button>
                                                                                </>}
                                                                                {parawiseFileExist2 && parawiseFileExist2 !== "" && <>
                                                                                    <button type="button" onClick={() => { viewBucketImage(parawiseFileExist2); }}
                                                                                        className='btn btn-primary btn-sm d-flex align-items-center px-2 py-1'><BsEye /> View2</button>
                                                                                </>}
                                                                                {parawiseFileExist3 && parawiseFileExist3 !== "" && <>
                                                                                    <button type="button" onClick={() => { viewBucketImage(parawiseFileExist3); }}
                                                                                        className='btn btn-primary btn-sm d-flex align-items-center px-2 py-1'><BsEye /> View3</button>
                                                                                </>}
                                                                            </div>
                                                                            {fileArray.length < 3 && (
                                                                                <button
                                                                                    type="button"
                                                                                    className="btn btn-primary"
                                                                                    onClick={() => push(null)}
                                                                                    disabled={!fileAdded}
                                                                                >
                                                                                    Add
                                                                                </button>
                                                                            )}
                                                                            {fileArray.length > 1 && index > 0 && (
                                                                                <button
                                                                                    type="button"
                                                                                    className="btn btn-danger"
                                                                                    onClick={() => remove(index)}
                                                                                >
                                                                                    Remove
                                                                                </button>
                                                                            )}
                                                                        </bst.Col>

                                                                    </div>
                                                                );
                                                            })}
                                                        </div>
                                                    );
                                                }}
                                            </FieldArray>



                                        </>}
                                    </>)}

                                </bst.Row>
                                {formIk?.values?.ecourtsCaseStatus === "Pending" && (<>
                                    <bst.Row className="px-4 pt-4">
                                        <bst.Col xs={4} sm={4} md={4} lg={3} xl={3} xxl={3}>
                                            <label className="mb-0"> Submit Counter File <span style={{ color: 'red' }}>*</span></label>
                                            <Field as="select" className='form-control' name="counterFiled" >
                                                <option value="0">--SELECT--</option>
                                                <option value="No">No</option>
                                                <option value="Yes">Yes</option>

                                            </Field>
                                            <ErrorMessage name="counterFiled" component="div" className="text-danger" ></ErrorMessage>
                                        </bst.Col>

                                        {formIk?.values?.counterFiled === "Yes" && (<>
                                            <bst.Col xs={4} sm={4} md={4} lg={3} xl={3} xxl={3}>
                                                <label className="mb-0"> Counter File Date  <span style={{ color: 'red' }}>*</span></label>
                                                <Field type="date" name="counterFiledDt" className="form-control" />
                                                <ErrorMessage name="counterFiledDt" component="div" className="text-danger" ></ErrorMessage>
                                            </bst.Col>

                                            {/* <bst.Col xs={4} sm={4} md={4} lg={3} xl={3} xxl={3}>
                                                <label className="mb-0">Counter File Upload <span style={{ color: 'red' }}>*</span></label>
                                                <Field name="counterFileCopy">
                                                    {({ field, form }) => (
                                                        <input
                                                            type="file"
                                                            className="form-control"
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
                                                <ErrorMessage name="counterFileCopy" component="div" className="text-danger" ></ErrorMessage>
                                            </bst.Col> */}


                                            <FieldArray name="counterFileCopy">
                                                {({ remove, push, form }) => {
                                                    const fileArray = form.values.counterFileCopy || [];

                                                    return (
                                                        <div>
                                                            {fileArray.map((file, index) => {
                                                                const isLast = index === fileArray.length - 1;
                                                                const fileAdded = file instanceof File || typeof file === 'string';
                                                                return (
                                                                    <div key={index} className="d-flex align-items-center gap-2 mb-3 ">
                                                                        <bst.Col xs={6} sm={6} md={6} lg={6} xl={6} xxl={6}>
                                                                            <label className="mb-0">Counter File Upload {index + 1}</label>
                                                                            <div className="d-flex align-items-center gap-2">
                                                                                <input
                                                                                    type="file"
                                                                                    className="form-control w-50"
                                                                                    accept="application/pdf,image/jpeg,image/jpg"
                                                                                    onChange={(e) => {
                                                                                        const file = e.target.files[0];
                                                                                        let fileVal = "counters_" + cino + "_" + index;
                                                                                        let filename = fileVal;
                                                                                        let path = "apolcms/uploads/counters/";
                                                                                        form.setFieldValue(`counterFileCopy[${index}]`, file);
                                                                                        ImagePdfBucket(e, form, path, `counterFileCopy[${index}]`, filename);
                                                                                    }}
                                                                                />
                                                                                <ErrorMessage name={`counterFileCopy[${index}]`} component="div" className="text-danger" />


                                                                                {counterFileExist1 && counterFileExist1 !== "" && <>
                                                                                    <button type="button" onClick={() => { viewBucketImage(counterFileExist1); }}
                                                                                        className='btn btn-primary btn-sm d-flex align-items-center px-2 py-1'><BsEye /> View 1</button>&nbsp;
                                                                                </>}
                                                                                {counterFileExist2 && counterFileExist2 !== "" && <>
                                                                                    <button type="button" onClick={() => { viewBucketImage(counterFileExist2); }}
                                                                                        className='btn btn-primary btn-sm d-flex align-items-center px-2 py-1'><BsEye /> View 2</button>&nbsp;
                                                                                </>}
                                                                                {counterFileExist3 && counterFileExist3 !== "" && <>
                                                                                    <button type="button" onClick={() => { viewBucketImage(counterFileExist3); }}
                                                                                        className='btn btn-primary btn-sm d-flex align-items-center px-2 py-1'><BsEye /> View 3</button>
                                                                                </>}
                                                                            </div>
                                                                            {fileArray.length < 3 && (
                                                                                <button
                                                                                    type="button"
                                                                                    className="btn btn-primary"
                                                                                    onClick={() => push(null)}
                                                                                    disabled={!fileAdded}
                                                                                >
                                                                                    Add
                                                                                </button>
                                                                            )}
                                                                            {fileArray.length > 1 && index !== 0 && (
                                                                                <button
                                                                                    type="button"
                                                                                    className="btn btn-danger"
                                                                                    onClick={() => remove(index)}
                                                                                >
                                                                                    Remove
                                                                                </button>
                                                                            )}
                                                                        </bst.Col>
                                                                    </div>
                                                                );
                                                            })}
                                                        </div>
                                                    );
                                                }}
                                            </FieldArray>





                                        </>)}

                                    </bst.Row>
                                </>)}


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
                                            <ErrorMessage name="actionTakenOrder" component="div" className="text-danger" ></ErrorMessage>
                                        </bst.Col>

                                        <bst.Col xs={6} sm={6} md={6} lg={4} xl={4} xxl={4}>
                                            <label className="mb-0"> Appeal Filed  <span style={{ color: 'red' }}>*</span></label>
                                            <Field as="select" className='form-control' name="appealFiled" >
                                                <option value="0">--SELECT--</option>
                                                <option value="No">No</option>
                                                <option value="Yes">Yes</option>
                                            </Field>
                                            <ErrorMessage name="appealFiled" component="div" className="text-danger" ></ErrorMessage>
                                        </bst.Col>

                                        {formIk?.values?.appealFiled === "Yes" && (<>
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
                                                    <ErrorMessage name="appealFileCopy" component="div" className="text-danger" ></ErrorMessage>
                                                </bst.Col>
                                                <bst.Col xs={6} sm={6} md={6} lg={4} xl={4} xxl={4}>
                                                    <label className="mb-0"> Appeal Date  <span style={{ color: 'red' }}>*</span></label>
                                                    <Field type="date" name="appealFiledDt" className="form-control" />
                                                    <ErrorMessage name="appealFiledDt" component="div" className="text-danger" ></ErrorMessage>
                                                </bst.Col>
                                            </bst.Row>
                                        </>)}


                                    </bst.Row>
                                </>)}

                                <bst.Row className="px-4 pt-4">
                                    <bst.Col xs={6} sm={6} md={6} lg={4} xl={4} xxl={4}>
                                        <label className="mb-0"> Action <span style={{ color: 'red' }}>*</span></label>
                                        <Field as="select" className='form-control' name="actionToPerform" >
                                            <option value="0">--SELECT--</option>
                                            <option value="Parawise Remarks">Parawise Remarks</option>
                                            <option value="Counter Affidavit">Counter Affidavit</option>
                                            <option value="Private">Private</option>
                                            <option value="Appeals">Appeals</option>
                                            <option value="Closed">Closed</option>
                                            <option value="GoI">Government of India / Central Tax / Income Tax</option>
                                            <option value="PSU">PSU (or) Public Sector Undertaking</option>

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

                                <bst.Row className="px-4 pt-4">
                                    {caseDetails?.SHOWBACKBTN && <>
                                        <bst.Col xs={4} sm={4} md={4} lg={2} xl={2} xxl={2}>
                                            <button type="button" className='btn btn-success mt-4' onClick={() => sendbackFn()}
                                            >Send Back</button>
                                        </bst.Col>
                                    </>}

                                    <bst.Col xs={4} sm={4} md={4} lg={3} xl={3} xxl={3}>
                                        <button type="submit" className='btn btn-success mt-4' >Update Case Details</button>
                                    </bst.Col>


                                    {caseDetails?.SHOWNOBTN && <>
                                        <bst.Col xs={4} sm={4} md={4} lg={2} xl={2} xxl={2}>
                                            <button type="button" className='btn btn-success mt-4' onClick={() => forwardCase()}
                                            >Forward to Nodal Officer</button>
                                        </bst.Col>
                                    </>}

                                    {caseDetails?.SHOWMLOBTN && <>
                                        <bst.Col xs={4} sm={4} md={4} lg={2} xl={2} xxl={2}>
                                            <button type="button" className='btn btn-success mt-4' onClick={() => forwardCase()}
                                            >Forward to MLO</button>
                                        </bst.Col>
                                    </>}
                                    {caseDetails?.SHOWHODDEPTBTN && <>
                                        <bst.Col xs={4} sm={4} md={4} lg={3} xl={3} xxl={3}>
                                            <button type="button" className='btn btn-success mt-4' onClick={() => forwardCase()}
                                            >Forward to HOD</button>
                                        </bst.Col>
                                    </>}
                                    {caseDetails?.SHOWSECDEPTBTN && <>
                                        <bst.Col xs={4} sm={4} md={4} lg={3} xl={3} xxl={3}>
                                            <button type="button" className='btn btn-success mt-4' onClick={() => forwardCase()}
                                            >Forward to Secretary</button>
                                        </bst.Col>
                                    </>}

                                    {caseDetails?.SHOWGPBTN && <>
                                        <bst.Col xs={12} sm={12} md={12} lg={4} xl={4} xxl={4}>
                                            <label className="mb-0">Select GP <span style={{ color: 'red' }}>*</span></label>
                                            <Field as="select" className='form-control' name="gpCode"
                                            >
                                                <option value="ALL">--ALL--</option>
                                                {GPSLIST != undefined && GPSLIST?.map((data, indexDept) => {
                                                    return (<React.Fragment key={indexDept}>
                                                        <option key={indexDept} value={data.value}>
                                                            {data.label}
                                                        </option>
                                                    </React.Fragment>);
                                                })}

                                            </Field>
                                            <ErrorMessage name="gpCode" component="div" className="text-error" />
                                        </bst.Col>
                                        <bst.Col xs={4} sm={4} md={4} lg={3} xl={3} xxl={3}>
                                            <button type="button" className='btn btn-success mt-4' onClick={() => forwardCase2GP(formIk?.values?.gpCode)}
                                            >Forward to GP for Approval.</button>
                                        </bst.Col>


                                    </>}

                                    {caseDetails?.SHOWGPAPPROVEBTN && <>
                                        <bst.Col xs={4} sm={4} md={4} lg={3} xl={3} xxl={3}>
                                            <button type="button" className='btn btn-success mt-4' onClick={() => gpApprove()}
                                            >Approve</button>
                                        </bst.Col>

                                        <bst.Col xs={4} sm={4} md={4} lg={3} xl={3} xxl={3}>
                                            <button type="button" className='btn btn-success mt-4' onClick={() => gpReject()}
                                            >Return</button>
                                        </bst.Col>
                                    </>}




                                </bst.Row>&nbsp;


                            </div>
                        </Form>
                    </FormikProvider>
                </bst.Row>

            </bst.Container >
        </>}

    </>)
}

export default CaseStatusUpdation