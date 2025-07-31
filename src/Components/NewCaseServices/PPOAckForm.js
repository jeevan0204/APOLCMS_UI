import { ErrorMessage, Field, FieldArray, Form, FormikProvider, useFormik } from 'formik';
import React, { useEffect, useRef, useState } from 'react'
import * as bst from "react-bootstrap"
import { useLocation, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { config } from '../../CommonUtils/CommonApis';
import { CommonAxiosGet, CommonAxiosPost } from '../../CommonUtils/CommonAxios';
import { MdDelete } from 'react-icons/md';
import ErrorBanner from '../ErrorBanner';
import * as Yup from "yup"
import { ALPHABETS_ONLY, ALPHABETS_SPACE_ONLY, NUMERIC } from '../../CommonUtils/contextVariables';
import { failureAlert } from '../../CommonUtils/SweetAlerts';

function PPOAckForm() {
    const [collapsed, setCollapsed] = useState(false);
    const [showDeptNames, setShowDeptNames] = useState([]);
    const [showDistNames, setShowDistNames] = useState([]);
    const [showDeptCategory, setshowDeptCategory] = useState(false);
    const [caseTypeShrtList, setCaseTypeShrtList] = useState([]);
    const [caseTypesList, setCaseTypesList] = useState([]);
    const [saveAction, setsaveAction] = useState("INSERT");

    const [regYearList, setRegYearList] = useState([]);
    const [StationList, setStationList] = useState([]);
    const [SebStationList, setSebStationList] = useState([]);

    const navigate = useNavigate();
    const location = useLocation();
    const ackNo = location.state?.ackNo;

    const regNO = location.state?.regNo;
    const regYr = location.state?.regYear;
    const oldcase = location.state?.ackType;
    const errorMsgs = location.state?.msg;

    const [errorMsg, setErrorMsg] = useState(errorMsgs);

    const hasFetchedData = useRef(false)


    function allowNumbersOnly(e) {
        var keyCode = e.keyCode === 0 ? e.charCode : e.keyCode;
        var value = Number(e.target.value + e.key) || 0;
        if (keyCode >= 48 && keyCode <= 57) {
            return isValidNumber(value);
        } else {
            e.preventDefault();
        }
        return false;
    }

    const isValidNumber = (number) => {
        return 1 <= number && number <= 10;
    };


    const userValidations = Yup.object().shape({
        gpOackForm: Yup.array().of(
            Yup.object().shape({
                departmentId: Yup.string().required("Required"),
                dispalyDept: Yup.string().when("departmentId", {
                    is: (val) => val === "Department",
                    then: (schema) => schema.required("Dept Required"),
                    otherwise: (schema) => schema.notRequired(),
                }),
                deptCategory: Yup.string().when("dispalyDept", {
                    is: (val) => val === "REV01-L",
                    then: (schema) => schema.required("Required"),
                    otherwise: (schema) => schema.notRequired(),
                }),
                dispalyDist: Yup.string().when("departmentId", {
                    is: (val) => val === "District",
                    then: (schema) => schema.required("Dist Required"),
                    otherwise: (schema) => schema.notRequired(),
                }),
                serviceType: Yup.string().required("Required"),

            }),
        ),

        distId: Yup.string().required("Required"),
        stationId: Yup.string().required("Required"),
        sebStationId: Yup.string().required("Required"),
        courtName: Yup.string().required("Required").matches(ALPHABETS_SPACE_ONLY, "Only alphabets are allowed"),
        chargeSheetNo: Yup.string().required("Required"),
        crimeNo: Yup.string().required("Required"),
        crimeYear: Yup.string().required("Required"),
        petitionerName: Yup.string().required("Required").matches(ALPHABETS_ONLY, "Only alphabets are allowed"),
        advocateCCno: Yup.string().required("Required").matches(NUMERIC, "Only digits are allowed"),
        caseCategory: Yup.string().required("Required"),
        caseType: Yup.string().required("Required"),
        filingMode: Yup.string().required("Required"),
        bailPetitionType: Yup.string().when("filingMode", {
            is: (val) => val === "93",
            then: (schema) => schema.required("Required"),
            otherwise: (schema) => schema.notRequired(),
        }),

        caseType1: Yup.string().when("oldcase", {
            is: (val) => val === "OLD",
            then: (schema) => schema.required("Required"),
            otherwise: (schema) => schema.notRequired(),
        }),

        regYear1: Yup.string().when("oldcase", {
            is: (val) => val === "OLD",
            then: (schema) => schema.required("Required"),
            otherwise: (schema) => schema.notRequired(),
        }),
        remarks: Yup.string().required("Required").matches(ALPHABETS_SPACE_ONLY, "Only alphabets are allowed"),

    })


    const formIk = useFormik({
        initialValues: {
            gpOackForm: [{
                slno: 0,
                departmentId: "",
                dispalyDept: "",
                deptCategory: "",
                dispalyDist: "",
                serviceType: "",
            }],
            distId: "",
            stationId: "",
            sebStationId: "",
            courtName: "",
            chargeSheetNo: "",
            crimeNo: "",
            crimeYear: "",


            petitionerName: "",
            advocateCCno: "",
            advocateName: "",
            caseCategory: "Others",
            caseType: "",
            filingMode: "",
            bailPetitionType: "",
            caseType1: "",
            regYear1: "",
            mainCaseNo: "",
            remarks: "",
            oldcase: oldcase,

        },
        validationSchema: userValidations,
        enableReinitialize: true,

        onSubmit: (values) => {
            console.log("values--------", values);
            console.log("FieldArray Size:", values.gpOackForm.length);
            values.respSize = values.gpOackForm.length;
            values.ackType = "NEW";

            values.gpOackForm = values.gpOackForm.map((item) => ({
                ...item,
                dispalyDist:
                    item?.dispalyDist !== undefined && item?.dispalyDist !== null && item?.dispalyDist !== ""
                        ? item.dispalyDist
                        : "0",
                dispalyDept:
                    item?.dispalyDept !== undefined && item?.dispalyDept !== null && item?.dispalyDept !== ""
                        ? item.dispalyDept
                        : "0",
                deptCategory:
                    item?.deptCategory !== undefined && item?.deptCategory !== null && item?.deptCategory !== ""
                        ? item.deptCategory
                        : "0",
            }));


            console.log("saveAction---edit--------", { saveAction });

            if (saveAction === "UPDATE") {
                Swal.fire({
                    title: `Do you want to update Acknowledgement details?`,
                    icon: 'question',
                    showDenyButton: false,
                    showCancelButton: true,
                    confirmButtonText: "Yes",
                    cancelButtonText: 'No',
                    backdrop: true,
                    allowOutsideClick: false,
                }).then((result) => {
                    if (result.isConfirmed) {
                        values.ackNo = ackNo;
                        console.log("update-----", values)
                        let url = config.url.local_URL + "updateAckDetails";
                        CommonAxiosPost(url, values, {
                            headers: { "Content-Type": "application/json" }
                        }).then((res) => {
                            if (res?.data?.scode === '01') {
                                Swal.fire({
                                    title: res?.data?.sdesc,
                                    icon: "success",
                                    backdrop: false
                                }).then((resforalert) => {
                                    if (resforalert?.isConfirmed === true) {
                                        navigate("/ShowAckDetailsPP");
                                    }
                                });
                            } else {
                                failureAlert(res?.data?.sdesc);
                            }
                        });
                    }
                });
            } else {

                Swal.fire({
                    title: `Are you sure you want to submit the Details?`,
                    icon: 'question',
                    showDenyButton: false,
                    showCancelButton: true,
                    confirmButtonText: "Yes",
                    cancelButtonText: 'No',
                    backdrop: true,
                    allowOutsideClick: false,
                }).then((result) => {
                    if (result.isConfirmed) {
                        let url = config.url.local_URL + "savePPOAckDetails";
                        CommonAxiosPost(url, values, {
                            headers: { "Content-Type": "application/json" }
                        }).then((res) => {
                            if (res?.data?.scode === '01') {
                                Swal.fire({
                                    title: res?.data?.sdesc,
                                    icon: "success",
                                    backdrop: false
                                }).then((resforalert) => {
                                    if (resforalert?.isConfirmed === true) {
                                        navigate("/ShowAckDetailsPP");
                                    }
                                });
                            } else {
                                failureAlert(res?.data?.sdesc);
                            }
                        });
                    }
                });
            }
        }

    });


    useEffect(() => {
        if (!hasFetchedData.current) {
            if (ackNo !== '' && ackNo !== 'undefined' && ackNo !== undefined) {
                let url = config.url.local_URL + "displayAckEditForm?ackNo=" + ackNo;
                CommonAxiosGet(url).then((res) => {

                    if (res?.data?.scode === '01') {
                        const EditData = res?.data?.data?.[0];
                        const dataList = res?.data?.data2;
                        setsaveAction(res?.data?.saveAction);
                        formIk.setFieldValue("distId", EditData?.distid);
                        GetPoliceStationList(EditData?.distid);
                        GetPoliceSEBStationList(EditData?.distid);
                        formIk.setFieldValue("stationId", EditData?.name_of_the_police_station);
                        formIk.setFieldValue("sebStationId", EditData?.seb_name);
                        formIk.setFieldValue("courtName", EditData?.court_name);
                        formIk.setFieldValue("chargeSheetNo", EditData?.charge_sheet_no);
                        formIk.setFieldValue("crimeNo", EditData?.crime_no);
                        formIk.setFieldValue("crimeYear", EditData?.crime_year);

                        formIk.setFieldValue("petitionerName", EditData?.petitioner_name);
                        formIk.setFieldValue("advocateCCno", EditData?.advocateccno);
                        formIk.setFieldValue("advocateName", EditData?.advocatename);
                        formIk.setFieldValue("caseCategory", EditData?.case_category);
                        formIk.setFieldValue("caseType", EditData?.nature_of_petition);
                        formIk.setFieldValue("filingMode", EditData?.mode_filing);
                        formIk.setFieldValue("bailPetitionType", EditData?.bail_petition_type);
                        formIk.setFieldValue("regNo", EditData?.reg_no);
                        formIk.setFieldValue("regYear", EditData?.reg_year);
                        formIk.setFieldValue("caseType1", EditData?.reg_no);
                        formIk.setFieldValue("regYear1", EditData?.reg_year);

                        formIk.setFieldValue("mainCaseNo", EditData?.main_case_no);
                        formIk.setFieldValue("remarks", EditData?.remarks);

                        if (Array.isArray(dataList)) {
                            const gpOackFormValues = dataList.map((item, index) => ({

                                slno: index + 1,
                                departmentId: item?.dept_distcoll || "",
                                dispalyDept: item?.dept_code || "",
                                deptCategory: item?.dept_category || "",
                                dispalyDist: item?.dist_id || "",
                                serviceType: item?.servicetpye || "",

                            }));
                            formIk.setFieldValue("gpOackForm", gpOackFormValues);
                        }
                    } else {

                    }
                }).catch((error) => {
                    console.error("Error fetching advocate names:", error);
                });
                hasFetchedData.current = true
            }
        }

    }, [ackNo, formIk]);



    useEffect(() => {
        if (oldcase === "OLD") {
            formIk.setFieldValue("regNo", regNO);
            formIk.setFieldValue("regYear", regYr)
        }
        else {

        }
    }, []);

    function showRevenueClassification(e) {
        const deptValue = e.target.value;
        console.log("-------dept-rev--", deptValue);

        if (deptValue === "REV01-L") {
            setshowDeptCategory(true);
        }
        else {
            setshowDeptCategory(false);
        }
    }

    useEffect(() => {
        GetDepartmentNames();
        GetDistrictNames();
        GetCaseTypesList();
        GetCaseTypeShrtList();
        GetRegYearList();

    }, []);

    useEffect(() => {
        formIk.setFieldValue("caseCategory", "Others");
    }, []);


    function GetPoliceStationList(e) {
        // let distId = e.target.value;
        let url = config.url.local_URL + "getStationListPP?distId=" + e;
        CommonAxiosGet(url).then((res) => {
            if (res.data && res.data.length > 0) {
                setStationList(res.data);

            } else {
                setStationList([]);
            }
        }).catch((error) => {
            console.error("Error fetching department names:", error);
        });
    };

    function GetPoliceSEBStationList(e) {
        // let distId = e.target.value;
        let url = config.url.local_URL + "getSebStationListPP?distId=" + e;
        CommonAxiosGet(url).then((res) => {
            if (res.data && res.data.length > 0) {
                setSebStationList(res.data);

            } else {
                setSebStationList([]);
            }
        }).catch((error) => {
            console.error("Error fetching department names:", error);
        });
    };

    const GetDepartmentNames = () => {
        let url = config.url.local_URL + "getDepartmentListPP";
        CommonAxiosGet(url).then((res) => {
            if (res.data && res.data.length > 0) {
                setShowDeptNames(res.data);

            } else {
                setShowDeptNames([]);
            }
        }).catch((error) => {
            console.error("Error fetching department names:", error);
        });
    };

    const GetDistrictNames = () => {
        let url = config.url.COMMONSERVICE_URL + "getDistrictList";
        CommonAxiosGet(url).then((res) => {
            if (res.data && res.data.length > 0) {
                setShowDistNames(res.data);

            } else {
                setShowDistNames([]);
            }
        }).catch((error) => {
            console.error("Error fetching district names:", error);
        });
    };


    function getAdvName(e) {
        let advocate_code = e.target.value;
        let url = config.url.COMMONSERVICE_URL + "loadAdvocateName?advocate_code=" + advocate_code;
        CommonAxiosGet(url).then((res) => {
            //  console.log("--" + JSON.stringify(res.data))
            if (res.data && res.data.length > 0) {
                formIk.setFieldValue("advocateName", res?.data)
            } else {
                formIk.setFieldValue("advocateName", "")
            }
        }).catch((error) => {
            console.error("Error fetching advocate names:", error);
        });
    }

    const GetCaseTypeShrtList = () => {
        let url = config.url.local_URL + "getCaseTypeListPP";
        CommonAxiosGet(url).then((res) => {
            if (res.data && res.data.length > 0) {
                setCaseTypeShrtList(res.data);

            } else {
                setCaseTypeShrtList([]);
            }
        }).catch((error) => {
            console.error("Error fetching getCaseTypesListShrt names:", error);
        });
    };

    const GetRegYearList = () => {
        let url = config.url.COMMONSERVICE_URL + "getYearsList";
        CommonAxiosGet(url).then((res) => {
            if (res.data && res.data.length > 0) {
                setRegYearList(res.data);

            } else {
                setRegYearList([]);
            }
        }).catch((error) => {
            console.error("Error fetching getYearsList names:", error);
        });
    };

    const GetCaseTypesList = () => {
        let url = config.url.local_URL + "getNaturePetitionListPP";
        CommonAxiosGet(url).then((res) => {
            if (res.data && res.data.length > 0) {
                setCaseTypesList(res.data);

            } else {
                setCaseTypesList([]);
            }
        }).catch((error) => {
            console.error("Error fetching nature names:", error);
        });
    };

    function populateCaseNumberExists(e) {
        let caseType = formIk?.values?.caseType1;
        let regYear1 = formIk?.values?.regYear1;
        let mainCaseNo = e.target.value;
        var caseTypeCode = caseType + "/" + regYear1 + "/" + mainCaseNo;
        let url = config.url.COMMONSERVICE_URL + "loadMainCaseNoDetails?caseTypeCode=" + caseTypeCode;
        CommonAxiosGet(url).then((res) => {
            if (res.data.scode === "02") {

                formIk?.setFieldError("caseType1", "Case details not found in APOLCMS.");
            } else {

                formIk?.setFieldError("caseType1", "Case details found in APOLCMS.");
            }
        }).catch((error) => {
            console.error("Error fetching distdept names:", error);
        });

    }


    function ShowAckList() {
        navigate("/ShowAckDetailsPP");
    }

    return (<>
        <ErrorBanner message={errorMsg} onClose={() => setErrorMsg('')} />

        <bst.Container className="outer-page-content-container">
            <FormikProvider value={formIk}>
                <Form onChange={formIk.handleChange} onSubmit={formIk.handleSubmit} >
                    <div className="table-container">
                        {collapsed === false ? (<>
                            <bst.Row className="px-4 pt-4">
                                <div className="table-responsive">
                                    <table
                                        className="table table-condensed table-bordered table-striped"
                                        style={{ width: "100%" }}>
                                        <thead style={{ color: "#1e3770" }}>
                                            <tr>
                                                <th colSpan={5} className="sticky-header">
                                                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
                                                        <span style={{ flex: 1, textAlign: "center" }}>Respondents</span>
                                                        <div>
                                                            <FieldArray name="gpOackForm">
                                                                {(formikFieldArray) => {
                                                                    return formikFieldArray.form.values.gpOackForm.map((LJP, index) => {
                                                                        let button = null;
                                                                        if (index === 0) {

                                                                            button = (
                                                                                <button
                                                                                    type="button"
                                                                                    className="button-titile btn btn-sm btn-success"
                                                                                    onClick={() => {
                                                                                        formikFieldArray.push({
                                                                                            slno: `${formikFieldArray.form.values.gpOackForm.length + 1}`,
                                                                                            departmentId: "",
                                                                                            dispalyDept: "",
                                                                                            serviceType: "",

                                                                                        });
                                                                                    }}>

                                                                                    Add
                                                                                </button>
                                                                            );
                                                                        }

                                                                        return (
                                                                            <>
                                                                                {button}
                                                                            </>
                                                                        );
                                                                    });
                                                                }}
                                                            </FieldArray>
                                                        </div>
                                                    </div>
                                                </th>
                                            </tr>
                                            <tr>
                                                <th className="sticky-header">S.No</th>
                                                <th className="sticky-header">Department/District</th>
                                                <th className="sticky-header">Respondent Department / District Collector</th>
                                                <th className="sticky-header">Service Type</th>
                                                <th></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <FieldArray name="gpOackForm">
                                                {(formikFieldArray) => {
                                                    return (
                                                        formikFieldArray.form.values.gpOackForm.map(
                                                            (qual, index) => {
                                                                return (
                                                                    <>

                                                                        <tr key={index}>
                                                                            <Field type="hidden" className="form-control" name={`gpOackForm[${index}].slno`} ></Field>
                                                                            <td>{index + 1}<Field type="hidden" className="form-control" name={`gpOackForm[${index}].slno`} value={`${index + 1}`}></Field>
                                                                                {/* <ErrorMessage name={`gpOackForm[${index}].slno`} component="div" className="text-danger" ></ErrorMessage> */}
                                                                            </td>

                                                                            <td>
                                                                                <bst.Col xs={12} sm={12} md={12} lg={4} xl={4} xxl={4}></bst.Col>
                                                                                <Field as="select" className='form-control' name={`gpOackForm[${index}].departmentId`}
                                                                                    onChange={(e) => {
                                                                                        if (index === 0 && e.target.value !== "Department") {
                                                                                            Swal.fire("Department is required").then((result) => {
                                                                                                if (result.isConfirmed) {
                                                                                                    formIk.setFieldValue(`gpOackForm[${index}].departmentId`, "")
                                                                                                }
                                                                                            })
                                                                                        }
                                                                                    }}
                                                                                >
                                                                                    <option value="">--Select--</option>
                                                                                    <option value="Department">Department</option>
                                                                                    <option value="District">District Collector</option>
                                                                                </Field>
                                                                                <ErrorMessage name={`gpOackForm[${index}].departmentId`} component="div" className="text-danger" ></ErrorMessage>
                                                                            </td>
                                                                            <td>
                                                                                {formIk?.values?.gpOackForm[index]?.departmentId === "Department" && (<>

                                                                                    <bst.Col xs={12} sm={12} md={12} lg={4} xl={4} xxl={4}></bst.Col>
                                                                                    <Field as="select" className='form-control' name={`gpOackForm[${index}].dispalyDept`}
                                                                                        onChange={(e) => { showRevenueClassification(e) }}>
                                                                                        <option value="">--Select--</option>
                                                                                        {showDeptNames != undefined && showDeptNames?.map((data, indexDept) => {
                                                                                            return (<React.Fragment key={indexDept}>
                                                                                                <option key={data.label} value={data.value}>
                                                                                                    {data.label}
                                                                                                </option>
                                                                                            </React.Fragment>);
                                                                                        })}
                                                                                    </Field>
                                                                                    <ErrorMessage name={`gpOackForm[${index}].dispalyDept`} component="div" className="text-danger" ></ErrorMessage>
                                                                                    {showDeptCategory === true && (<>
                                                                                        <bst.Col xs={12} sm={12} md={12} lg={4} xl={4} xxl={4}></bst.Col>
                                                                                        <label htmlFor={`gpOackForm[${index}].deptCategory`} className="form-label">
                                                                                            Department Category<span style={{ color: 'red' }}>*</span>
                                                                                        </label>
                                                                                        <Field as="select" className='form-control' name={`gpOackForm[${index}].deptCategory`}>
                                                                                            <option value="">--Select--</option>
                                                                                            <option value="General">General</option>
                                                                                            <option value="Assignment">Assignment</option>
                                                                                            <option value="Land Acquisition">Land Acquisition</option>
                                                                                        </Field>
                                                                                        <ErrorMessage name={`gpOackForm[${index}].deptCategory`} component="div" className="text-danger" ></ErrorMessage>

                                                                                    </>)}
                                                                                </>)}

                                                                                {formIk.values.gpOackForm[index].departmentId === "District" && (<>

                                                                                    <bst.Col xs={12} sm={12} md={12} lg={4} xl={4} xxl={4}></bst.Col>
                                                                                    <Field as="select" className='form-control' name={`gpOackForm[${index}].dispalyDist`}
                                                                                    >
                                                                                        <option value="">--Select--</option>
                                                                                        {showDistNames != undefined && showDistNames?.map((data, indexDept) => {
                                                                                            return (<React.Fragment key={indexDept}>
                                                                                                <option key={indexDept} value={data.value}>
                                                                                                    {data.label}
                                                                                                </option>
                                                                                            </React.Fragment>);
                                                                                        })}


                                                                                    </Field>
                                                                                    <ErrorMessage name={`gpOackForm[${index}].dispalyDist`} component="div" className="text-danger" ></ErrorMessage>

                                                                                </>)}
                                                                            </td>
                                                                            <td> <bst.Col xs={12} sm={12} md={12} lg={4} xl={4} xxl={4}></bst.Col>
                                                                                <Field as="select" className='form-control' name={`gpOackForm[${index}].serviceType`}
                                                                                >
                                                                                    <option value="0">--Select--</option>
                                                                                    <option value="NON-SERVICES">NON-SERVICES</option>
                                                                                </Field>
                                                                                <ErrorMessage name={`gpOackForm[${index}].serviceType`} component="div" className="text-danger" ></ErrorMessage>
                                                                            </td>


                                                                            <td width="1">
                                                                                {(index) ?
                                                                                    <button type="button" className="button-titile btn btn-sm btn-danger"
                                                                                        onClick={() => {
                                                                                            console.log(formIk?.values?.gpOackForm[index].slno, index);
                                                                                            formikFieldArray.remove(index);
                                                                                        }} >
                                                                                        <MdDelete />
                                                                                    </button> : ''}

                                                                            </td >

                                                                        </tr >
                                                                    </>
                                                                )
                                                            })
                                                    )
                                                }}

                                            </FieldArray>

                                        </tbody>

                                    </table>


                                </div>
                            </bst.Row>
                            <bst.Row className="px-4 pt-4">

                                <bst.Col xs={12} sm={12} md={12} lg={6} xl={6} xxl={6}>
                                    <label className="mb-0"> District <span style={{ color: 'red' }}>*</span></label>
                                    <Field as="select" className='form-control' name="distId"
                                        onChange={(e) => { GetPoliceStationList(e.target.value); GetPoliceSEBStationList(e.target.value); }}>
                                        <option value="">--Select--</option>

                                        {showDistNames != undefined && showDistNames?.map((data, indexDept) => {
                                            return (<React.Fragment key={indexDept}>
                                                <option key={indexDept} value={data.value}>
                                                    {data.label}
                                                </option>
                                            </React.Fragment>);
                                        })}
                                    </Field>

                                    <ErrorMessage name="distId" component="div" className="text-danger" ></ErrorMessage>
                                </bst.Col>

                                <bst.Col xs={12} sm={12} md={12} lg={6} xl={6} xxl={6}>
                                    <label className="mb-0"> Police Station Name <span style={{ color: 'red' }}>*</span></label>
                                    <Field as="select" className='form-control' name="stationId" >
                                        <option value="">--Select--</option>

                                        {StationList != undefined && StationList?.map((data, indexDept) => {
                                            return (<React.Fragment key={indexDept}>
                                                <option key={indexDept} value={data.value}>
                                                    {data.label}
                                                </option>
                                            </React.Fragment>);
                                        })}
                                    </Field>
                                    <ErrorMessage name="stationId" component="div" className="text-error" />
                                </bst.Col>

                            </bst.Row>

                            <bst.Row className="px-4 pt-4">

                                <bst.Col xs={12} sm={12} md={12} lg={6} xl={6} xxl={6}>
                                    <label className="mb-0"> SEB Station Name <span style={{ color: 'red' }}>*</span></label>
                                    <Field as="select" className='form-control' name="sebStationId">
                                        <option value="">--Select--</option>

                                        {SebStationList != undefined && SebStationList?.map((data, indexDept) => {
                                            return (<React.Fragment key={indexDept}>
                                                <option key={indexDept} value={data.value}>
                                                    {data.label}
                                                </option>
                                            </React.Fragment>);
                                        })}
                                    </Field>

                                    <ErrorMessage name="sebStationId" component="div" className="text-danger" ></ErrorMessage>
                                </bst.Col>


                                <bst.Col xs={12} sm={12} md={12} lg={6} xl={6} xxl={6}>
                                    <label className="mb-0">Court Name<span style={{ color: 'red' }}>*</span></label>
                                    <Field type="text" className="form-control me-1 mt-0" name="courtName" maxLength="150" />
                                    <ErrorMessage name="courtName" component="div" className="text-error" />
                                </bst.Col>

                            </bst.Row>
                            <bst.Row className="px-4 pt-4">

                                <bst.Col xs={12} sm={12} md={12} lg={6} xl={6} xxl={6}>
                                    <label className="mb-0">Charge Sheet Number<span style={{ color: 'red' }}>*</span></label>
                                    <Field type="text" className="form-control me-1 mt-0" name="chargeSheetNo" maxLength="20" onKeyPress={(e) => { allowNumbersOnly(e); }} />
                                    <ErrorMessage name="chargeSheetNo" component="div" className="text-error" />
                                </bst.Col>

                                <bst.Col xs={12} sm={12} md={12} lg={6} xl={6} xxl={6}>
                                    <label className="mb-0">Crime No<span style={{ color: 'red' }}>*</span></label>
                                    <Field type="text" className="form-control me-1 mt-0" name="crimeNo" onKeyPress={(e) => { allowNumbersOnly(e); }} />
                                    <ErrorMessage name="crimeNo" component="div" className="text-error" />
                                </bst.Col>
                            </bst.Row>

                            <bst.Row className="px-4 pt-4">
                                <bst.Col xs={12} sm={12} md={12} lg={6} xl={6} xxl={6}>
                                    <label className="mb-0">Crime Year<span style={{ color: 'red' }}>*</span></label>
                                    <Field type="text" className="form-control me-1 mt-0" name="crimeYear" onKeyPress={(e) => { allowNumbersOnly(e); }} />
                                    <ErrorMessage name="crimeYear" component="div" className="text-error" />
                                </bst.Col>

                                <bst.Col xs={12} sm={12} md={12} lg={6} xl={6} xxl={6}>
                                    <label className="mb-0">Petitioner Name<span style={{ color: 'red' }}>*</span></label>
                                    <Field type="text" className="form-control me-1 mt-0" name="petitionerName" />
                                    <ErrorMessage name="petitionerName" component="div" className="text-error" />
                                </bst.Col>
                            </bst.Row>
                            <bst.Row className="px-4 pt-4">
                                <bst.Col xs={12} sm={12} md={12} lg={6} xl={6} xxl={6}>
                                    <label className="mb-0"> Advocate CC No. <span style={{ color: 'red' }}>*</span></label>
                                    <Field type="text" className="form-control me-1 mt-0" name="advocateCCno"
                                        onKeyPress={(e) => { allowNumbersOnly(e); }} onChange={(e) => { getAdvName(e); }} />
                                    <ErrorMessage name="advocateCCno" component="div" className="text-error" />
                                </bst.Col>

                                <bst.Col xs={12} sm={12} md={12} lg={6} xl={6} xxl={6}>
                                    <label className="mb-0"> Advocate Name <span style={{ color: 'red' }}>*</span></label>
                                    <Field type="text" className="form-control me-1 mt-0" name="advocateName" readOnly={true} />
                                    <ErrorMessage name="advocateName" component="div" className="text-error" />
                                </bst.Col>

                            </bst.Row>
                            <bst.Row className="px-4 pt-4">
                                <bst.Col xs={12} sm={12} md={12} lg={6} xl={6} xxl={6}>

                                    <Field type="radio" name="caseCategory" value="Arbitration" />&nbsp;Arbitration&nbsp;
                                    <Field type="radio" name="caseCategory" value="Appeal" />&nbsp;Appeal&nbsp;
                                    <Field type="radio" name="caseCategory" value="Others" />&nbsp;Others&nbsp;

                                    <ErrorMessage name="caseCategory" component="div" className="text-error" />


                                </bst.Col>
                            </bst.Row>
                            <bst.Row className="px-4 pt-4">
                                <bst.Col xs={12} sm={12} md={12} lg={6} xl={6} xxl={6}>
                                    <label className="mb-0"> Nature of Petition <span style={{ color: 'red' }}>*</span></label>
                                    <Field as="select" className='form-control' name="caseType"
                                    // onChange={(e) => { { billChange(e) } }}
                                    >
                                        <option value="">--Select--</option>

                                        {caseTypesList != undefined && caseTypesList?.map((data, indexDept) => {
                                            return (<React.Fragment key={indexDept}>
                                                <option key={indexDept} value={data.value}>
                                                    {data.label}
                                                </option>
                                            </React.Fragment>);
                                        })}
                                    </Field>
                                    <ErrorMessage name="caseType" component="div" className="text-error" />
                                </bst.Col>

                                <bst.Col xs={12} sm={12} md={12} lg={6} xl={6} xxl={6}>
                                    <label className="mb-0"> Mode of Filing <span style={{ color: 'red' }}>*</span></label>
                                    <Field as="select" className='form-control' name="filingMode">
                                        <option value="0">--Select--</option>
                                        <option value="Normal">NORMAL</option>
                                        <option value="Lunch Motion">LUNCH MOTION</option>
                                        <option value="Fair List Case">FAIR LIST CASE</option>
                                        <option value="Tomorrow Normal">TOMORROW NORMAL</option>
                                        <option value="Tomorrow Lunch Motion">TOMORROW LUNCH MOTION</option>
                                        <option value="Tomorrow Fair List Case">TOMORROW FAIR LIST CASE</option>
                                        <option value="Vacation Court">VACATION COURT</option>
                                        <option value="House Motion">HOUSE MOTION</option>

                                    </Field>
                                    <ErrorMessage name="filingMode" component="div" className="text-error" />
                                </bst.Col>

                            </bst.Row>
                            {formIk?.values?.caseType === 93 && (<>
                                <bst.Row className="px-4 pt-4">
                                    <bst.Col xs={12} sm={12} md={12} lg={6} xl={6} xxl={6}>
                                        <label className="mb-0"> Bail Petition<span style={{ color: 'red' }}>*</span></label>
                                        <Field as="select" className='form-control' name="bailPetitionType">
                                            <option value="0">--Select--</option>
                                            <option value="Anticipatory Bail">Anticipatory Bail</option>
                                            <option value="Regular Bail">Regular Bail</option>
                                        </Field>
                                        <ErrorMessage name="bailPetitionType" component="div" className="text-error" />
                                    </bst.Col>
                                </bst.Row>
                            </>)}
                            {oldcase === "OLD" && <>
                                <bst.Row className="px-4 pt-4">
                                    <bst.Col xs={12} sm={12} md={12} lg={6} xl={6} xxl={6}>
                                        <label className="mb-0"> Case Registration Year <span style={{ color: 'red' }}>*</span></label>
                                        <Field as="select" className='form-control' name="regYear">
                                            <option value="">--Select--</option>
                                            {regYearList != undefined && regYearList?.map((data, indexDept) => {
                                                return (<React.Fragment key={indexDept}>
                                                    <option key={indexDept} value={data.value}>
                                                        {data.label}
                                                    </option>
                                                </React.Fragment>);
                                            })}

                                        </Field>
                                        <ErrorMessage name="regYear" component="div" className="text-error" />
                                    </bst.Col>
                                    <bst.Col xs={12} sm={12} md={12} lg={4} xl={4} xxl={4}>
                                        <label className="mb-0"> Case Reg. No <span style={{ color: 'red' }}>*</span></label>
                                        <Field type="text" className="form-control me-1 mt-0" name="regNo"
                                            onKeyPress={(e) => { allowNumbersOnly(e); }}
                                        />
                                        <ErrorMessage name="regNo" component="div" className="text-error" />
                                    </bst.Col>

                                </bst.Row>
                            </>}

                            <bst.Row className="px-4 pt-4">
                                <bst.Col xs={12} sm={12} md={12} lg={6} xl={6} xxl={6}>
                                    <label className="mb-0"> Main Case No. (WP/WA/AS/CRP Nos.) <span style={{ color: 'red' }}>*</span></label>
                                    <bst.Row className=" pt-4">
                                        <bst.Col xs={12} sm={12} md={12} lg={4} xl={4} xxl={4}>
                                            <Field as="select" className='form-control' name="caseType1"
                                            >
                                                <option value="">--Select--</option>
                                                {caseTypeShrtList != undefined && caseTypeShrtList?.map((data, indexDept) => {
                                                    return (<React.Fragment key={indexDept}>
                                                        <option key={indexDept} value={data.value}>
                                                            {data.label}
                                                        </option>
                                                    </React.Fragment>);
                                                })}

                                            </Field>
                                            <ErrorMessage name="caseType1" component="div" className="text-error" />
                                        </bst.Col>
                                        <bst.Col xs={12} sm={12} md={12} lg={4} xl={4} xxl={4}>

                                            <Field as="select" className='form-control' name="regYear1"
                                            >
                                                <option value="">--Select--</option>
                                                {regYearList != undefined && regYearList?.map((data, indexDept) => {
                                                    return (<React.Fragment key={indexDept}>
                                                        <option key={indexDept} value={data.value}>
                                                            {data.label}
                                                        </option>
                                                    </React.Fragment>);
                                                })}

                                            </Field>
                                            <ErrorMessage name="regYear1" component="div" className="text-error" />
                                        </bst.Col>
                                        <bst.Col xs={12} sm={12} md={12} lg={4} xl={4} xxl={4}>
                                            <Field type="text" className="form-control me-1 mt-0" name="mainCaseNo"
                                                onKeyPress={(e) => { allowNumbersOnly(e); }} onChange={(e) => { populateCaseNumberExists(e) }}
                                            />
                                            <ErrorMessage name="mainCaseNo" component="div" className="text-error" />
                                        </bst.Col>
                                    </bst.Row>

                                </bst.Col>
                                <bst.Col xs={12} sm={12} md={12} lg={6} xl={6} xxl={6}>
                                    <label className="mb-0"> Remarks <span style={{ color: 'red' }}>*</span></label>
                                    <bst.Row className=" pt-4">
                                        <bst.Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={12}>

                                            <Field as='textarea' name='remarks' className='form-control' />
                                            <ErrorMessage name="remarks" component="div" className="text-error" />
                                        </bst.Col>
                                    </bst.Row>
                                </bst.Col>
                            </bst.Row>


                            <bst.Row className="px-4 pt-4">
                                <bst.Col xs={12} sm={12} md={12} lg={8} xl={8} xxl={8}></bst.Col>


                                <bst.Col xs={4} sm={4} md={4} lg={2} xl={2} xxl={2}>
                                    <div className='d-flex flex-row justify-content-end '>
                                        <button type="submit" className="btn btn-success">{saveAction === "UPDATE" ? "Update" : "Submit"}</button>
                                    </div></bst.Col>

                                <bst.Col xs={4} sm={4} md={4} lg={2} xl={2} xxl={2}>
                                    <div className='d-flex flex-row justify-content-end '>
                                        <button type="button" className="btn btn-primary btn-sm"
                                            onClick={() => { ShowAckList(); }}>
                                            show Acks List</button>
                                    </div></bst.Col>
                            </bst.Row>
                            &nbsp;
                            &nbsp;

                        </>) : (<>

                        </>)}


                    </div>
                </Form>
            </FormikProvider >
        </bst.Container >
    </>
    )
}

export default PPOAckForm