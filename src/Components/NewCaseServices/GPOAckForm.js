import { ErrorMessage, Field, FieldArray, Form, FormikProvider, useFormik } from 'formik';
import React, { useEffect, useRef, useState } from 'react'
import * as bst from "react-bootstrap"
import { FaMinus, FaPlus } from 'react-icons/fa';
import { config } from '../../CommonUtils/CommonApis';
import { CommonAxiosGet, CommonAxiosPost } from '../../CommonUtils/CommonAxios';
import { MdDelete } from 'react-icons/md';
import *as Yup from "yup";
import Swal from 'sweetalert2';
import { ALPHABETS_ONLY, ALPHABETS_SPACE_ONLY, NUMERIC } from '../../CommonUtils/contextVariables';
import { failureAlert, successAlert, successAlert2 } from '../../CommonUtils/SweetAlerts';
import CommonReactTable from '../../CommonUtils/CommonReactTable';
import { useLocation, useNavigate } from 'react-router-dom';
import ErrorBanner from '../ErrorBanner';

function GPOAckForm() {
    const [collapsed, setCollapsed] = useState(false);

    const [showDeptNames, setShowDeptNames] = useState([]);
    const [showDistNames, setShowDistNames] = useState([]);
    const [otherDeptList, setOtherDeptList] = useState([]);

    const [empIdList, setEmpIdList] = useState([]);
    const [otherdistList, setOtherdistList] = useState({});
    const [otherDeptHodList, setOtherDeptHodList] = useState({});
    const [empSectionList, setEmpSectionList] = useState({});
    const [empPOstList, setEmpPOstList] = useState({});
    const [mandalsList, setMandalsList] = useState({});
    const [villagesList, setVillagesList] = useState({});
    const [employeeIdList, setEmployeeIdList] = useState({});
    const [showServiceType, setShowServiceType] = useState([]);
    const [caseTypeShrtList, setCaseTypeShrtList] = useState([]);
    const [caseTypesList, setCaseTypesList] = useState([]);

    const [regYearList, setRegYearList] = useState([]);
    const [showAckList, setShowAckList] = useState([]);
    const [errmsg, seterrmsg] = useState(false);
    const [showDeptCategory, setshowDeptCategory] = useState(false);
    const [saveAction, setsaveAction] = useState("INSERT");


    const hasFetchedData = useRef(false)

    const navigate = useNavigate();

    //const ackNo = JSON.parse(localStorage.getItem("ackNo"));
    const location = useLocation();
    const ackNo = location.state?.ackNo;


    const regNO = location.state?.regNo;
    const regYr = location.state?.regYear;
    const oldcase = location.state?.ackType;
    const errorMsgs = location.state?.msg;
    //console.log("ackType------", oldcase);
    // console.log("errorMsg----", errorMsgs);
    const [errorMsg, setErrorMsg] = useState(errorMsgs);


    function reindexDropdownState(prevState, deletedIndex) {
        const updated = {};
        Object.keys(prevState).forEach((key) => {
            const numericKey = Number(key);
            if (numericKey < deletedIndex) {
                updated[numericKey] = prevState[key];
            } else if (numericKey > deletedIndex) {
                updated[numericKey - 1] = prevState[key];
            }
            // Skip the deleted index
        });
        return updated;
    }

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
                sectionSelection: Yup.string().when("departmentId", {
                    is: (val) => val === "Other",
                    then: (schema) => schema.required("section Required"),
                    otherwise: (schema) => schema.notRequired(),
                }),


                otherDist: Yup.string().when("sectionSelection", {
                    is: (val) => val === "Dist-Section",
                    then: (schema) => schema.required("District Required"),
                    otherwise: (schema) => schema.notRequired(),
                }),

                empDept: Yup.string().when(["sectionSelection", "otherDist"], {
                    is: (sectionSelection, otherDist) =>
                        sectionSelection === "Sec-Section" ||
                        sectionSelection === "Hod-Section" ||
                        (sectionSelection === "Dist-Section" && otherDist && otherDist.trim() !== ""),
                    then: (schema) => schema.required("empDept Required"),
                    otherwise: (schema) => schema.notRequired(),
                }),
                empSection: Yup.string().when("empDept", {
                    is: (val) => !!val && val.trim() !== "",
                    then: (schema) => schema.required("empSection Required"),
                    otherwise: (schema) => schema.notRequired(),
                }),
                mandal: Yup.string().when(["empSection", "otherDist"], {
                    is: (empSection, otherDist) => !!empSection && empSection.trim() !== "" && empSection === "MANDAL" && otherDist > 13,
                    then: (schema) => schema.required("mandal Required"),
                    otherwise: (schema) => schema.notRequired(),
                }),

                village: Yup.string().when(["empSection", "otherDist"], {
                    is: (empSection, otherDist) => !!empSection && empSection.trim() !== "" && empSection === "village" && otherDist > 13,
                    then: (schema) => schema.required("village Required"),
                    otherwise: (schema) => schema.notRequired(),
                }),

                empPost: Yup.string().when("empSection", {
                    is: (val) => !!val && val.trim() !== "",
                    then: (schema) => schema.required("empPost Required"),
                    otherwise: (schema) => schema.notRequired(),
                }),
                employeeId: Yup.string().when("empPost", {
                    is: (val) => !!val && val.trim() !== "",
                    then: (schema) => schema.required("employeeId Required"),
                    otherwise: (schema) => schema.notRequired(),
                }),



                serviceType: Yup.string().required("Required"),

            }),
        ),

        distId: Yup.string().required("Required"),

        petitionerName: Yup.string().required("Required").matches(ALPHABETS_ONLY, "Only alphabets are allowed"),
        advocateCCno: Yup.string().required("Required").matches(NUMERIC, "Only digits are allowed"),
        caseCategory: Yup.string().required("Required"),
        caseType: Yup.string().required("Required"),
        filingMode: Yup.string().required("Required"),
        caseType1: Yup.string().when("oldcase", {
            is: (val) => val === "OLD",
            then: (schema) => schema.required("Required"),
            otherwise: (schema) => schema.notRequired(),
        }),

        regYear1: Yup.string().when("oldcase", {
            is: (val) => val === "OLD",
            then: (schema) => schema.required("Required").matches(NUMERIC, "Only digits are allowed"),
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
                sectionSelection: "",
                empDept: "",
                empSection: "",
                empPost: "",
                employeeId: "",
                otherDist: "",
                mandal: "",
                village: "",
                serviceType: "",
            }],
            distId: "",
            petitionerName: "",
            advocateCCno: "",
            advocateName: "",
            caseCategory: "Others",
            caseType: "",
            filingMode: "",
            caseType1: "",
            regYear1: "",
            mainCaseNo: "",
            remarks: "",
            oldcase: oldcase,
        },
        validationSchema: userValidations,
        enableReinitialize: true,

        onSubmit: (values) => {
            console.log("---------onsubmit");
            console.log("values", values);

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
                                        navigate("/ShowAckDetails");
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
                        let url = config.url.local_URL + "SaveGPOAckForm";
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
                                        navigate("/ShowAckDetails");
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
                        formIk.setFieldValue("petitionerName", EditData?.petitioner_name);
                        formIk.setFieldValue("advocateCCno", EditData?.advocateccno);
                        formIk.setFieldValue("advocateName", EditData?.advocatename);
                        formIk.setFieldValue("caseCategory", EditData?.case_category);
                        formIk.setFieldValue("caseType", EditData?.nature_of_petition);
                        formIk.setFieldValue("filingMode", EditData?.mode_filing);
                        formIk.setFieldValue("regNo", EditData?.reg_no);
                        formIk.setFieldValue("regYear", EditData?.reg_year);
                        formIk.setFieldValue("caseType1", EditData?.reg_no);
                        formIk.setFieldValue("regYear1", EditData?.reg_year);

                        formIk.setFieldValue("mainCaseNo", EditData?.main_case_no);
                        formIk.setFieldValue("remarks", EditData?.remarks);

                        if (Array.isArray(dataList)) {
                            { console.log("-----", dataList) }
                            const gpOackFormValues = dataList.map((item, index) => ({

                                slno: index + 1,
                                departmentId: item?.dept_distcoll || "",
                                dispalyDept: item?.dept_code || "",
                                deptCategory: item?.dept_category || "",
                                dispalyDist: item?.dist_id || "",
                                serviceType: item?.servicetpye || "",

                            }));
                            formIk.setFieldValue("gpOackForm", gpOackFormValues);
                            //console.log("gpOackFormValues--------" + gpOackFormValues);

                            if (gpOackFormValues.some(item => item.dispalyDept === "REV01-L")) {
                                setshowDeptCategory(true);
                            } else {
                                setshowDeptCategory(false);
                            }
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
        GetDepartmentNames();
        GetDistrictNames();
        GetOtherDeptList();
        GetOtherDistList();
        GetServiceTypes();
        GetCaseTypesList();
        GetCaseTypeShrtList();
        GetRegYearList();
    }, []);

    useEffect(() => {
        formIk.setFieldValue("caseCategory", "Others");
    }, []);

    useEffect(() => {
        if (oldcase === "OLD") {
            formIk.setFieldValue("regNo", regNO);
            formIk.setFieldValue("regYear", regYr)
        }
        else {

        }
    }, []);




    function getAdvName(e) {
        let advocate_code = e.target.value;
        let url = config.url.COMMONSERVICE_URL + "loadAdvocateName?advocate_code=" + advocate_code;
        CommonAxiosGet(url).then((res) => {
            console.log("--" + JSON.stringify(res.data))
            if (res.data && res.data.length > 0) {
                formIk.setFieldValue("advocateName", res?.data)
            } else {
                formIk.setFieldValue("advocateName", "")
            }
        }).catch((error) => {
            console.error("Error fetching advocate names:", error);
        });
    }

    const GetCaseTypesList = () => {
        let url = config.url.COMMONSERVICE_URL + "getCaseTypesList";
        CommonAxiosGet(url).then((res) => {
            if (res.data && res.data.length > 0) {
                setCaseTypesList(res.data);

            } else {
                setCaseTypesList([]);
            }
        }).catch((error) => {
            console.error("Error fetching getCaseTypesList names:", error);
        });
    };

    const GetCaseTypeShrtList = () => {
        let url = config.url.COMMONSERVICE_URL + "getCaseTypesListShrt";
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


    const GetServiceTypes = () => {
        let url = config.url.COMMONSERVICE_URL + "getServiceTypesList";
        CommonAxiosGet(url).then((res) => {
            if (res.data && res.data.length > 0) {
                setShowServiceType(res.data);

            } else {
                setShowServiceType([]);
            }
        }).catch((error) => {
            console.error("Error fetching service type names:", error);
        });
    };

    const GetDepartmentNames = () => {
        let url = config.url.COMMONSERVICE_URL + "getDepartmentList";
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

    const GetOtherDeptList = () => {
        let url = config.url.COMMONSERVICE_URL + "getOtherDeptList";
        CommonAxiosGet(url).then((res) => {
            if (res.data && res.data.length > 0) {
                setOtherDeptList(res.data);

                //setEmpSectionList([]);
                setMandalsList([]);
                setVillagesList([]);
                setEmpPOstList([]);
                setEmpIdList([]);

            } else {
                setOtherDeptList([]);
            }
        }).catch((error) => {
            console.error("Error fetching other department names:", error);
        });
    };

    const GetOtherDistList = () => {
        let url = config.url.COMMONSERVICE_URL + "getOtherdistList";
        CommonAxiosGet(url).then((res) => {
            if (res.data && res.data.length > 0) {
                setOtherdistList(res.data);
                ///  setOtherDeptList([]);


            } else {
                setOtherdistList([]);
            }
        }).catch((error) => {
            console.error("Error fetching other district names:", error);
        });
    };


    function getSectionList(e, index) {
        const deptCode = e.target.value;
        const distCode = formIk?.values?.gpOackForm[index]?.otherDist !== undefined ? formIk.values.gpOackForm[index].otherDist : 0;
        let url = config.url.COMMONSERVICE_URL + "getEmpDeptSectionsList?distCode=" + distCode + "&deptCode=" + deptCode;
        CommonAxiosGet(url).then((res) => {
            if (res.data && res.data.length > 0) {
                let options = res.data.map((item, i) => {
                    return (
                        <option key={i} value={item.value}>
                            {item.label}
                        </option>
                    );
                });
                setEmpSectionList((prevState) => ({
                    ...prevState,
                    [index]: options,
                }));

            } else {
                setEmpSectionList((prevState) => ({
                    ...prevState,
                    [index]: [],
                }));
            }
        }).catch((error) => {
            console.error("Error fetching section names:", error);
        });

    }

    function getPostList(e, index) {
        const empSec = e.target.value;
        const deptCode = formIk?.values?.gpOackForm[index]?.empDept;
        const distCode = formIk?.values?.gpOackForm[index]?.otherDist !== undefined ? formIk.values.gpOackForm[index].otherDist : 0;
        let url = config.url.COMMONSERVICE_URL + "getEmpPostsList?distCode=" + distCode + "&deptCode=" + deptCode + "&empSec=" + empSec;
        CommonAxiosGet(url).then((res) => {
            if (res.data && res.data.length > 0) {
                let options = res.data.map((item, i) => {
                    return (
                        <option key={i} value={item.value}>
                            {item.label}
                        </option>
                    );
                });
                setEmpPOstList((prevState) => ({
                    ...prevState,
                    [index]: options,
                }));

            } else {
                //setEmpPOstList([]);
                setEmpPOstList((prevState) => ({
                    ...prevState,
                    [index]: [],
                }));
            }
        }).catch((error) => {
            console.error("Error fetching post names:", error);
        });

    }

    function getEmpList(e, index) {
        const deptCode = formIk?.values?.gpOackForm[index]?.empDept;
        const distCode = formIk?.values?.gpOackForm[index]?.otherDist !== undefined ? formIk.values.gpOackForm[index].otherDist : 0;
        const empSec = formIk?.values?.gpOackForm[index]?.empSection;
        const empPost = e.target.value;
        let url = config.url.COMMONSERVICE_URL + "getEmpsList?distCode=" + distCode + "&deptCode=" + deptCode + "&empSec=" + empSec + "&empPost=" + empPost;
        CommonAxiosGet(url).then((res) => {
            if (res.data && res.data.length > 0) {

                let options = res.data.map((item, i) => {
                    return (
                        <option key={i} value={item.value}>
                            {item.label}
                        </option>
                    );
                });
                setEmpIdList((prevState) => ({
                    ...prevState,
                    [index]: options,
                }));

            } else {
                //   setEmpIdList([]);
                setEmpIdList((prevState) => ({
                    ...prevState,
                    [index]: [],
                }));
            }
        }).catch((error) => {
            console.error("Error fetching emp names:", error);
        });

    }

    function getSectionDeptList(e, index) {
        console.log(e.target.value);
        let url = config.url.COMMONSERVICE_URL + "getDeptbasedSectionList?selectSection=" + e.target.value;
        CommonAxiosGet(url).then((res) => {
            if (res.data && res.data.length > 0) {
                let options = res.data.map((item, i) => {
                    return (
                        <option key={i} value={item.value}>
                            {item.label}
                        </option>
                    );
                });
                setOtherDeptHodList((prevState) => ({
                    ...prevState,
                    [index]: options,
                }));
                // setEmpSectionList([]);
                // setEmpPOstList([]);
                // setEmpIdList([]);

            } else {
                setOtherDeptHodList([]);
            }
        }).catch((error) => {
            console.error("Error fetching distdept names:", error);
        });
    }

    function getMandalvillageList(e, index) {
        let section = e.target.value;
        let distID = formIk?.values?.gpOackForm[index]?.otherDist;
        let deptId = formIk?.values?.gpOackForm[index]?.empDept;
        // alert("section-----", section);
        if (distID > 13) {
            if (section === "MANDAL") {
                let url = config.url.COMMONSERVICE_URL + "getMandalList?empDept=" + deptId + "&distCode="
                    + distID + "&empSec=" + section;
                CommonAxiosGet(url).then((res) => {
                    if (res.data && res.data.length > 0) {
                        let options = res.data.map((item, i) => {
                            return (
                                <option key={i} value={item.value}>
                                    {item.label}
                                </option>
                            );
                        });
                        setMandalsList((prevState) => ({
                            ...prevState,
                            [index]: options,
                        }));
                    } else {
                        setMandalsList([]);
                    }
                }).catch((error) => {
                    console.error("Error fetching distdept names:", error);
                });

            }
            else if (section === "village") {

                let url = config.url.COMMONSERVICE_URL + "getvillageList?empDept=" + deptId + "&distCode="
                    + distID + "&empSec=" + section;
                CommonAxiosGet(url).then((res) => {
                    if (res.data && res.data.length > 0) {
                        let options = res.data.map((item, i) => {
                            return (
                                <option key={i} value={item.value}>
                                    {item.label}
                                </option>
                            );
                        });
                        setVillagesList((prevState) => ({
                            ...prevState,
                            [index]: options,
                        }));
                    } else {
                        setVillagesList([]);
                    }
                }).catch((error) => {
                    console.error("Error fetching distdept names:", error);
                });

            }
            else {
                let url = config.url.COMMONSERVICE_URL + "getEmpPostsList?distCode="
                    + distID + "&deptCode=" + deptId + "&empSec=" + section;
                CommonAxiosGet(url).then((res) => {
                    if (res.data && res.data.length > 0) {
                        let options = res.data.map((item, i) => {
                            return (
                                <option key={i} value={item.value}>
                                    {item.label}
                                </option>
                            );
                        });
                        setEmpPOstList((prevState) => ({
                            ...prevState,
                            [index]: options,
                        }));
                        setMandalsList([]);
                        setVillagesList([]);
                    } else {
                        setEmpPOstList([]);
                        setMandalsList([]);
                        setVillagesList([]);
                    }
                }).catch((error) => {
                    console.error("Error fetching distdept names:", error);
                });

            }

        }

        else {

            let url = config.url.COMMONSERVICE_URL + "getEmpPostsList?distCode="
                + distID + "&deptCode=" + deptId + "&empSec=" + section;
            CommonAxiosGet(url).then((res) => {
                if (res.data && res.data.length > 0) {
                    let options = res.data.map((item, i) => {
                        return (
                            <option key={i} value={item.value}>
                                {item.label}
                            </option>
                        );
                    });
                    setEmpPOstList((prevState) => ({
                        ...prevState,
                        [index]: options,
                    }));
                    setMandalsList([]);
                    setVillagesList([]);
                } else {
                    setMandalsList([]);
                    setVillagesList([]);
                    setEmpPOstList([]);
                }
            }).catch((error) => {
                console.error("Error fetching distdept names:", error);
            });

        }

    }

    function populatePostsListWithMandal(e, index) {
        console.log(e.target.value);
        let mandalId = e.target.value;
        let distID = formIk?.values?.gpOackForm[index]?.otherDist;
        let deptId = formIk?.values?.gpOackForm[index]?.empDept;
        let section = formIk?.values?.gpOackForm[index]?.empSection;

        let url = config.url.COMMONSERVICE_URL + "getEmpPostsListWithMandal?empDept=" + deptId + "&distCode=" + distID + "&empSec=" + section + "&mndlCode=" + mandalId;
        CommonAxiosGet(url).then((res) => {
            if (res.data && res.data.length > 0) {
                let options = res.data.map((item, i) => {
                    return (
                        <option key={i} value={item.value}>
                            {item.label}
                        </option>
                    );
                });
                setEmpPOstList((prevState) => ({
                    ...prevState,
                    [index]: options,
                }));
            } else {
                setEmpPOstList([]);
            }
        }).catch((error) => {
            console.error("Error fetching distdept names:", error);
        });
    }

    function populatePostsListWithMandalvillage(e, index) {
        console.log(e.target.value);
        let village = e.target.value;
        let distID = formIk?.values?.gpOackForm[index]?.otherDist;
        let deptId = formIk?.values?.gpOackForm[index]?.empDept;
        let section = formIk?.values?.gpOackForm[index]?.empSection;
        let mandalId = formIk?.values?.gpOackForm[index]?.mandalId;

        let url = config.url.COMMONSERVICE_URL + "getEmpPostsListWithMandalandVill?empDept=" + deptId + "&distCode=" + distID + "&empSec=" + section + "&mndlCode=" + mandalId + "&village=" + village;
        CommonAxiosGet(url).then((res) => {
            if (res.data && res.data.length > 0) {
                let options = res.data.map((item, i) => {
                    return (
                        <option key={i} value={item.value}>
                            {item.label}
                        </option>
                    );
                });
                setEmpPOstList((prevState) => ({
                    ...prevState,
                    [index]: options,
                }));
            } else {
                setEmpPOstList([]);
            }
        }).catch((error) => {
            console.error("Error fetching distdept names:", error);
        });
    }


    function populateEmpDetails(e, index) {
        console.log(e.target.value);

        let empPost = e.target.value;
        let distID = formIk?.values?.gpOackForm[index]?.otherDist ? formIk?.values?.gpOackForm[index]?.otherDist : "0";
        let deptId = formIk?.values?.gpOackForm[index]?.empDept;
        let section = formIk?.values?.gpOackForm[index]?.empSection;


        if (distID > 13) {
            if (section === "MANDAL") {
                let mandalId = formIk?.values?.gpOackForm[index]?.mandalId ? formIk?.values?.gpOackForm[index]?.mandalId : "0";
                let url = config.url.COMMONSERVICE_URL + "getEmpsEmailsListWithMandal?empDept=" + deptId + "&distCode="
                    + distID + "&empSec=" + section + "&empPost=" + empPost + "&mndlCode=" + mandalId;
                CommonAxiosGet(url).then((res) => {
                    if (res.data && res.data.length > 0) {

                        let options = res.data.map((item, i) => {
                            return (
                                <option key={i} value={item.value}>
                                    {item.label}
                                </option>
                            );
                        });
                        setEmployeeIdList((prevState) => ({
                            ...prevState,
                            [index]: options,
                        }));

                    } else {
                        setEmployeeIdList((prevState) => ({
                            ...prevState,
                            [index]: [],
                        }));
                    }
                }).catch((error) => {
                    console.error("Error fetching distdept names:", error);
                });

            }
            else if (section === "village") {

                let mandalId = formIk?.values?.gpOackForm[index]?.mandalId ? formIk?.values?.gpOackForm[index]?.mandalId : "0";
                let villageId = formIk?.values?.gpOackForm[index]?.village ? formIk?.values?.gpOackForm[index]?.village : "0";

                let url = config.url.COMMONSERVICE_URL + "getEmpsEmailsListWithMandalAndVill?empDept=" + deptId + "&distCode="
                    + distID + "&empSec=" + section + "&empPost=" + empPost + "&mndlCode=" + mandalId + "&vlgCode=" + villageId;
                CommonAxiosGet(url).then((res) => {
                    if (res.data && res.data.length > 0) {
                        console.log("village--post-");
                        let options = res.data.map((item, i) => {
                            return (
                                <option key={i} value={item.value}>
                                    {item.label}
                                </option>
                            );
                        });
                        setEmployeeIdList((prevState) => ({
                            ...prevState,
                            [index]: options,
                        }));
                    } else {
                        setEmployeeIdList((prevState) => ({
                            ...prevState,
                            [index]: [],
                        }));
                    }
                }).catch((error) => {
                    console.error("Error fetching distdept names:", error);
                });

            }
            else {
                let url = config.url.COMMONSERVICE_URL + "getEmpsEmailsList?distCode="
                    + distID + "&empDept=" + deptId + "&empSec=" + section + "&empPost=" + empPost;
                CommonAxiosGet(url).then((res) => {
                    if (res.data && res.data.length > 0) {
                        let options = res.data.map((item, i) => {
                            return (
                                <option key={i} value={item.value}>
                                    {item.label}
                                </option>
                            );
                        });
                        setEmployeeIdList((prevState) => ({
                            ...prevState,
                            [index]: options,
                        }));
                    } else {
                        setEmployeeIdList((prevState) => ({
                            ...prevState,
                            [index]: [],
                        }));
                    }
                }).catch((error) => {
                    console.error("Error fetching distdept names:", error);
                });

            }

        }

        else {

            let url = config.url.COMMONSERVICE_URL + "getEmpsEmailsList?distCode="
                + distID + "&empDept=" + deptId + "&empSec=" + section + "&empPost=" + empPost;
            CommonAxiosGet(url).then((res) => {
                if (res.data && res.data.length > 0) {
                    let options = res.data.map((item, i) => {
                        return (
                            <option key={i} value={item.value}>
                                {item.label}
                            </option>
                        );
                    });
                    setEmployeeIdList((prevState) => ({
                        ...prevState,
                        [index]: options,
                    }));
                } else {
                    setEmployeeIdList((prevState) => ({
                        ...prevState,
                        [index]: [],
                    }));
                }
            }).catch((error) => {
                console.error("Error fetching distdept names:", error);
            });

        }
    }

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
        navigate("/ShowAckDetails");
    }

    useEffect(() => {
        if (!showAckList || showAckList.length === 0) {
            setCollapsed(false);
        }
    }, [showAckList]);


    const resetFields = (fields, index) => {
        console.log("Resetting fields for row:", index, fields);
        fields.forEach(field =>
            formIk.setFieldValue(`gpOackForm[${index}].${field}`, '')
        );
    };



    return (
        <>
            <ErrorBanner message={errorMsg} onClose={() => setErrorMsg('')} />

            <bst.Container className="outer-page-content-container">
                <bst.Row className="px-4">
                    <bst.Col xs={12} sm={12} md={12} lg={10} xl={10} xxl={10}>

                        <div className='h5'>Acknowledgement Generation </div>

                    </bst.Col>

                    <bst.Col xs={12} sm={12} md={12} lg={2} xl={2} xxl={2}>
                        <div className="flex justify-end">
                            <button
                                className="text-gray-600 hover:text-gray-800 transition"
                                onClick={() => setCollapsed(!collapsed)}
                            >
                                {collapsed ? <FaPlus /> : <FaMinus />}
                            </button>
                        </div>

                    </bst.Col>
                    <hr style={{ border: "1px solid gray" }} />
                </bst.Row>
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
                                                                                                sectionSelection: ''
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
                                                                {/* <button type="button" className="btn btn-sm btn-danger rounded">Remove</button> */}
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
                                                                                        <option value="Other">Other</option>
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
                                                                                                    <option key={indexDept} value={data.dept_id}>
                                                                                                        {data.dept_name}
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


                                                                                    {formIk.values.gpOackForm[index].departmentId === "Other" && (<>

                                                                                        <bst.Col xs={12} sm={12} md={12} lg={4} xl={4} xxl={4}></bst.Col>
                                                                                        <label htmlFor={`gpOackForm[${index}].sectionSelection`} className="form-label">
                                                                                            Section Selection<span style={{ color: 'red' }}>*</span>
                                                                                        </label>

                                                                                        <Field as="select" className='form-control' name={`gpOackForm[${index}].sectionSelection`}
                                                                                            onChange={(e) => {
                                                                                                resetFields(['otherDist', 'empDept', 'empSection', 'mandal', 'village', 'empPost', 'employeeId'], index);

                                                                                                getSectionDeptList(e, index)
                                                                                            }}
                                                                                        >
                                                                                            <option value="">--Select--</option>
                                                                                            <option value="Sec-Section">Sec-Section</option>
                                                                                            <option value="Hod-Section">Hod-Section</option>
                                                                                            <option value="Dist-Section">Dist-Section</option>



                                                                                        </Field>
                                                                                        <ErrorMessage name={`gpOackForm[${index}].sectionSelection`} component="div" className="text-danger" >
                                                                                        </ErrorMessage>&nbsp;

                                                                                        {(formIk.values.gpOackForm[index].sectionSelection === "Sec-Section" ||
                                                                                            formIk.values.gpOackForm[index].sectionSelection === "Hod-Section") && (<>
                                                                                                <bst.Col xs={12} sm={12} md={12} lg={4} xl={4} xxl={4}></bst.Col>
                                                                                                <label htmlFor={`gpOackForm[${index}].empDept`} className="form-label">
                                                                                                    Department<span style={{ color: 'red' }}>*</span>
                                                                                                </label>

                                                                                                <Field as="select" className='form-control' name={`gpOackForm[${index}].empDept`}
                                                                                                    onChange={(e) => {
                                                                                                        getSectionList(e, index);
                                                                                                        formIk.setFieldValue(`empSection`, '');
                                                                                                    }}>
                                                                                                    <option value="">--Select--</option>
                                                                                                    {otherDeptHodList[index]}
                                                                                                </Field>
                                                                                                <ErrorMessage name={`gpOackForm[${index}].empDept`} component="div" className="text-danger" ></ErrorMessage>

                                                                                                <bst.Col xs={12} sm={12} md={12} lg={4} xl={4} xxl={4}></bst.Col>
                                                                                                <label htmlFor={`gpOackForm[${index}].empSection`} className="form-label">
                                                                                                    Section<span style={{ color: 'red' }}>*</span>
                                                                                                </label>

                                                                                                <Field as="select" className='form-control' name={`gpOackForm[${index}].empSection`}
                                                                                                    onChange={(e) => {
                                                                                                        getPostList(e, index);
                                                                                                        formIk.setFieldValue(`empPost`, '');
                                                                                                    }}>
                                                                                                    <option value="">--Select--</option>
                                                                                                    {empSectionList[index]}

                                                                                                </Field>
                                                                                                <ErrorMessage name={`gpOackForm[${index}].empSection`} component="div" className="text-danger" ></ErrorMessage>

                                                                                                <bst.Col xs={12} sm={12} md={12} lg={4} xl={4} xxl={4}></bst.Col>
                                                                                                <label htmlFor={`gpOackForm[${index}].empPost`} className="form-label">
                                                                                                    Post<span style={{ color: 'red' }}>*</span>
                                                                                                </label>

                                                                                                <Field as="select" className='form-control' name={`gpOackForm[${index}].empPost`}
                                                                                                    onChange={(e) => {
                                                                                                        getEmpList(e, index);
                                                                                                        formIk.setFieldValue(`employeeId`, '');
                                                                                                    }}>
                                                                                                    <option value="">--Select--</option>

                                                                                                    {empPOstList[index]}
                                                                                                </Field>
                                                                                                <ErrorMessage name={`gpOackForm[${index}].empPost`} component="div" className="text-danger" ></ErrorMessage>


                                                                                                <bst.Col xs={12} sm={12} md={12} lg={4} xl={4} xxl={4}></bst.Col>
                                                                                                <label htmlFor={`gpOackForm[${index}].employeeId`} className="form-label">
                                                                                                    Employee Name<span style={{ color: 'red' }}>*</span>
                                                                                                </label>

                                                                                                <Field as="select" className='form-control' name={`gpOackForm[${index}].employeeId`}
                                                                                                >
                                                                                                    <option value="">--Select--</option>

                                                                                                    {empIdList[index]}
                                                                                                </Field>
                                                                                                <ErrorMessage name={`gpOackForm[${index}].employeeId`} component="div" className="text-danger" ></ErrorMessage>

                                                                                            </>)}

                                                                                        {formIk.values.gpOackForm[index].sectionSelection === "Dist-Section" && (<>

                                                                                            <bst.Col xs={12} sm={12} md={12} lg={4} xl={4} xxl={4}></bst.Col>
                                                                                            <label htmlFor={`gpOackForm[${index}].otherDist`} className="form-label">
                                                                                                District<span style={{ color: 'red' }}>*</span>
                                                                                            </label>

                                                                                            <Field as="select" className='form-control' name={`gpOackForm[${index}].otherDist`}
                                                                                                onChange={(e) => {
                                                                                                    // alert("index------" + index)
                                                                                                    console.log("otherDist-----", index);
                                                                                                    resetFields(['empDept', 'empSection', 'mandal', 'village', 'empPost', 'employeeId'], index);
                                                                                                }}
                                                                                            >
                                                                                                <option value="">--Select--</option>
                                                                                                {otherdistList != undefined && otherdistList?.map((data, indexDept) => {
                                                                                                    return (<React.Fragment key={indexDept}>
                                                                                                        <option key={indexDept} value={data.value}>
                                                                                                            {data.label}
                                                                                                        </option>
                                                                                                    </React.Fragment>);
                                                                                                })}
                                                                                            </Field>
                                                                                            <ErrorMessage name={`gpOackForm[${index}].otherDist`} component="div" className="text-danger" ></ErrorMessage>

                                                                                            <bst.Col xs={12} sm={12} md={12} lg={4} xl={4} xxl={4}></bst.Col>
                                                                                            <label htmlFor={`gpOackForm[${index}].empDept`} className="form-label">
                                                                                                Department<span style={{ color: 'red' }}>*</span>
                                                                                            </label>

                                                                                            <Field as="select" className='form-control' name={`gpOackForm[${index}].empDept`}
                                                                                                onChange={(e) => {
                                                                                                    //alert("dept index--" + index);
                                                                                                    console.log("department-----", index);

                                                                                                    resetFields(['empSection', 'mandal', 'village', 'empPost', 'employeeId'], index);

                                                                                                    getSectionList(e, index);

                                                                                                }}>
                                                                                                <option value="">--Select--</option>
                                                                                                {otherDeptHodList[index]}
                                                                                            </Field>
                                                                                            <ErrorMessage name={`gpOackForm[${index}].empDept`} component="div" className="text-danger" ></ErrorMessage>

                                                                                            <bst.Col xs={12} sm={12} md={12} lg={4} xl={4} xxl={4}></bst.Col>
                                                                                            <label htmlFor={`gpOackForm[${index}].empSection`} className="form-label">
                                                                                                Section<span style={{ color: 'red' }}>*</span>
                                                                                            </label>

                                                                                            <Field as="select" className='form-control' name={`gpOackForm[${index}].empSection`}
                                                                                                onChange={(e) => {
                                                                                                    //alert("empSection---" + index)
                                                                                                    console.log("empsection-----", index, formIk.values.gpOackForm[index].empSection);

                                                                                                    resetFields(['mandal', 'village', 'empPost', 'employeeId'], index);
                                                                                                    getMandalvillageList(e, index);
                                                                                                }}>
                                                                                                <option value="">--Select--</option>
                                                                                                {empSectionList[index]}
                                                                                            </Field>
                                                                                            <ErrorMessage name={`gpOackForm[${index}].empSection`} component="div" className="text-danger" ></ErrorMessage>

                                                                                            {mandalsList[index] && mandalsList[index].length > 0 && (<>
                                                                                                <bst.Col xs={12} sm={12} md={12} lg={4} xl={4} xxl={4}></bst.Col>
                                                                                                <label htmlFor={`gpOackForm[${index}].mandal`} className="form-label">
                                                                                                    Mandal<span style={{ color: 'red' }}>*</span>
                                                                                                </label>

                                                                                                <Field as="select" className='form-control' name={`gpOackForm[${index}].mandal`}
                                                                                                    onChange={(e) => {
                                                                                                        console.log("mandal-----", index);

                                                                                                        //     resetFields(['village', 'empPost', 'employeeId'], index);
                                                                                                        populatePostsListWithMandal(e, index); resetFields(['village', 'empPost'], index);
                                                                                                    }}>
                                                                                                    <option value="">--Select--</option>
                                                                                                    {mandalsList[index]}

                                                                                                </Field>
                                                                                                <ErrorMessage name={`gpOackForm[${index}].mandal`} component="div" className="text-danger" ></ErrorMessage>

                                                                                            </>)}

                                                                                            {villagesList[index] && villagesList[index].length > 0 && (
                                                                                                <>
                                                                                                    <bst.Col xs={12} sm={12} md={12} lg={4} xl={4} xxl={4}></bst.Col>
                                                                                                    <label htmlFor={`gpOackForm[${index}].village`} className="form-label">
                                                                                                        Village<span style={{ color: 'red' }}>*</span>
                                                                                                    </label>

                                                                                                    <Field as="select" className='form-control' name={`gpOackForm[${index}].village`}
                                                                                                        onChange={(e) => {
                                                                                                            console.log("village-----", index);

                                                                                                            resetFields(['empPost'], index);
                                                                                                            populatePostsListWithMandalvillage(e, index);

                                                                                                        }}>
                                                                                                        <option value="">--Select--</option>
                                                                                                        {villagesList[index]}
                                                                                                    </Field>
                                                                                                    <ErrorMessage name={`gpOackForm[${index}].village`} component="div" className="text-danger" ></ErrorMessage>
                                                                                                </>)}

                                                                                            <bst.Col xs={12} sm={12} md={12} lg={4} xl={4} xxl={4}></bst.Col>
                                                                                            <label htmlFor={`gpOackForm[${index}].empPost`} className="form-label">
                                                                                                Post<span style={{ color: 'red' }}>*</span>
                                                                                            </label>

                                                                                            <Field as="select" className='form-control' name={`gpOackForm[${index}].empPost`}
                                                                                                onChange={(e) => {
                                                                                                    console.log("post-----", index);

                                                                                                    resetFields(['employeeId'], index);
                                                                                                    populateEmpDetails(e, index);
                                                                                                }}>
                                                                                                <option value="">--Select--</option>
                                                                                                {empPOstList[index]}
                                                                                            </Field>
                                                                                            <ErrorMessage name={`gpOackForm[${index}].empPost`} component="div" className="text-danger" ></ErrorMessage>


                                                                                            <bst.Col xs={12} sm={12} md={12} lg={4} xl={4} xxl={4}></bst.Col>
                                                                                            <label htmlFor={`gpOackForm[${index}].employeeId`} className="form-label">
                                                                                                Employee Name<span style={{ color: 'red' }}>*</span>
                                                                                            </label>

                                                                                            <Field as="select" className='form-control' name={`gpOackForm[${index}].employeeId`}
                                                                                            >
                                                                                                <option value="">--Select--</option>
                                                                                                {employeeIdList[index]}
                                                                                            </Field>
                                                                                            <ErrorMessage name={`gpOackForm[${index}].employeeId`} component="div" className="text-danger" ></ErrorMessage>

                                                                                        </>)}

                                                                                    </>)}

                                                                                </td>
                                                                                <td> <bst.Col xs={12} sm={12} md={12} lg={4} xl={4} xxl={4}></bst.Col>
                                                                                    <Field as="select" className='form-control' name={`gpOackForm[${index}].serviceType`}
                                                                                    >
                                                                                        <option value="0">--Select--</option>
                                                                                        <option value="NON-SERVICES">NON-SERVICES</option>
                                                                                        {showServiceType != undefined && showServiceType?.map((data, indexDept) => {
                                                                                            return (<React.Fragment key={indexDept}>
                                                                                                <option key={indexDept} value={data.value}>
                                                                                                    {data.label}
                                                                                                </option>
                                                                                            </React.Fragment>);
                                                                                        })}


                                                                                    </Field>
                                                                                    <ErrorMessage name={`gpOackForm[${index}].serviceType`} component="div" className="text-danger" ></ErrorMessage>
                                                                                </td>


                                                                                <td width="1">
                                                                                    {/* {(formIk?.values?.gpOackForm[index].slno >= 1) ? */}
                                                                                    {(index) ?
                                                                                        <button
                                                                                            type="button"
                                                                                            className="btn btn-sm btn-danger"
                                                                                            onClick={() => {
                                                                                                // 1. Remove the formik row data at index
                                                                                                const updatedForm = [...formIk.values.gpOackForm];
                                                                                                updatedForm.splice(index, 1);

                                                                                                // 2. Reindex slno or any other fields if needed
                                                                                                const reindexedForm = updatedForm.map((row, i) => ({
                                                                                                    ...row,
                                                                                                    slno: i + 1,
                                                                                                }));

                                                                                                formIk.setFieldValue("gpOackForm", reindexedForm);

                                                                                                setOtherDeptHodList((prev) => reindexDropdownState(prev, index));
                                                                                                setEmpSectionList((prev) => reindexDropdownState(prev, index));
                                                                                                setMandalsList((prev) => reindexDropdownState(prev, index));
                                                                                                setVillagesList((prev) => reindexDropdownState(prev, index));
                                                                                                setEmpPOstList((prev) => reindexDropdownState(prev, index));
                                                                                                setEmployeeIdList((prev) => reindexDropdownState(prev, index));
                                                                                                setEmpIdList((prev) => reindexDropdownState(prev, index));

                                                                                            }}
                                                                                        >
                                                                                            <MdDelete />
                                                                                        </button>
                                                                                        : ''}
                                                                                </td>
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
                                        <Field as="select" className='form-control' name="distId">
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
                </FormikProvider>
            </bst.Container >
        </>
    )
}

export default GPOAckForm