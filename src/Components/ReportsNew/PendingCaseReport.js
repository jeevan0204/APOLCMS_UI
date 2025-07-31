import React, { useEffect, useState } from 'react'
import *as bst from "react-bootstrap"
import { CommonFormHeader } from '../../CommonUtils/CommonFormHeader'
import { ErrorMessage, Field, Form, FormikProvider, useFormik } from 'formik';
import { config } from '../../CommonUtils/CommonApis';
import { CommonAxiosGet } from '../../CommonUtils/CommonAxios';
import Select from 'react-select';
import CommonReactTable from '../../CommonUtils/CommonReactTable';
import LegacyCaseDetailsPopup from '../Popups/LegacyCaseDetailsPopup';


function PendingCaseReport() {
    const [showDeptNames, setShowDeptNames] = useState([]);
    const [caseTypesList, setCaseTypesList] = useState([]);
    const [showDistNames, setShowDistNames] = useState([]);
    const [regYearList, setRegYearList] = useState([]);
    const [categoryServiceList, setCategoryServiceList] = useState([]);
    const [respAdvList, setRespAdvList] = useState([]);
    const [selectedCaseTypes, setSelectedCaseTypes] = useState([]);
    const [selectedDept, setSelectedDept] = useState([]);

    const [heading, setHeading] = useState([]);
    const [casesList, setcaseslist] = useState([]);
    const [errmsg, seterrmsg] = useState(false);


    const [showModelPopup, setModelPopup] = useState(false);
    const [regularPopupFlag, setregularPopupFlag] = useState(false);
    const [cino, setcino] = useState([]);
    const [PopupData, setPopupData] = useState([]);
    function regularPopStatus() { setregularPopupFlag(false); }


    let showcaseTypes = [];




    const formIk = useFormik({
        initialValues: {
            caseTypeId: [],
            deptId: [],
            distId: "",
            regYear: "",
            dofFromDate: "",
            dofToDate: "",
            petitionerName: "",
            respodentName: "",
            categoryServiceId: "",
            res_adv_Id: ""

        },
        onSubmit: ((values) => {

            alert("hloo")
            const casetypeList = [];
            const deptList = [];
            const body = {

                casetype_id: selectedCaseTypes.map(option => option.value),
                dept_id: selectedDept.map(option => option.value)
            };
            casetypeList.push(body?.casetype_id);
            deptList.push(body?.dept_id);
            console.log("selected options are-----", casetypeList.join(','));
            console.log("selected dept are-----", deptList.join(','));

            let url = config.url.local_URL + "getdataOfPendingCases?caseTypeId=" + casetypeList.join(',') + "&deptId=" + deptList.join(',') +
                "&districtId=" + formIk?.values?.distId + "&regYear=" + formIk?.values?.regYear + "&dofFromDate=" + formIk?.values?.dofFromDate + "&dofToDate=" + formIk?.values?.dofToDate +
                "&petitionerName=" + formIk?.values?.petitionerName + "&respodentName=" + formIk?.values?.respodentName + "&categoryServiceId=" + formIk?.values?.categoryServiceId +
                "&res_adv_Id=" + formIk?.values?.res_adv_Id;

            CommonAxiosGet(url).then((res) => {
                if (res?.data?.status === true) {
                    console.log(res?.data);
                    setcaseslist(res?.data?.DATA);
                    setHeading(res?.data?.HEADING);
                }
                else {
                    seterrmsg(true);
                    setcaseslist([]);
                }

            })

        })
    });




    useEffect(() => {
        GetDepartmentNames();
        GetCaseTypesList();
        GetDistrictNames();
        GetRegYearList();
        GetCategoryServiceList();
        GetRespAdvNames();
    }, []);


    const GetCaseTypesList = () => {
        let url = config.url.local_URL + "getCaseTypeMstNEW";
        CommonAxiosGet(url).then((res) => {
            if (res.data && res.data.length > 0) {

                showcaseTypes = (res.data.map(({ label, value }) => ({ label, value })));
                setCaseTypesList(showcaseTypes);
            } else {
                setCaseTypesList([]);
            }
        }).catch((error) => {
            console.error("Error fetching getCaseTypesList names:", error);
        });
    };



    const GetRespAdvNames = () => {
        let url = config.url.local_URL + "getResAdvList";
        CommonAxiosGet(url).then((res) => {
            if (res.data && res.data.length > 0) {

                setRespAdvList(res.data);
            } else {
                setRespAdvList([]);
            }
        }).catch((error) => {
            console.error("Error fetching getCaseTypesList names:", error);
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

    const GetCategoryServiceList = () => {
        let url = config.url.COMMONSERVICE_URL + "getCategoryServiceList";
        CommonAxiosGet(url).then((res) => {
            if (res.data && res.data.length > 0) {
                setCategoryServiceList(res.data);

            } else {
                setCategoryServiceList([]);
            }
        }).catch((error) => {
            console.error("Error fetching getCategoryServiceList names:", error);
        });
    };

    const customStyles = {
        valueContainer: (provided) => ({
            ...provided,
            maxHeight: '96px', // Scroll kicks in after 4 items
            overflowY: 'auto',
            display: 'flex',
            flexWrap: 'wrap',
        }),
        control: (provided) => ({
            ...provided,
            minHeight: '38px',
        }),
    };

    const handleCinoClick = (cino) => {

        let url = config.url.local_URL + "AssignedCasesToSections?cino=" + cino + "&fileCino=&SHOWPOPUP=SHOWPOPUP";
        CommonAxiosGet(url).then((res) => {
            if (res.data !== undefined) {
                alert("test")
                setcino(res?.data?.fileCino);
                setModelPopup(true);
                setPopupData(res.data);

            } else {
                setPopupData([]);
            }
        }).catch((error) => {
            console.error("Error fetching popup:", error);
        });
    };


    const columns = [

        {
            Header: "S.No", accessor: (row, TotalIndex) => (<>{TotalIndex + 1}&nbsp;</>),
            Cell: ({ value }) => <div style={{ textAlign: 'left' }}>{value}</div>,
            Footer: 'Total',
        },
        {
            Header: 'CINo', accessor: "cino",
            isClickable: true,
            Cell: ({ row }) => (

                <button className="btn btn-sm"
                    style={{ backgroundColor: '#18c4bc', color: 'white' }} onClick={() => handleCinoClick(row.original.cino)
                    }>
                    {row.original.cino}
                </button >
            ),
        },

        {
            Header: 'Date of Filing', accessor: "date_of_filing",

        },


        {
            Header: 'Case Type.', accessor: "case_type",

        },

        {
            Header: 'Main Case No.', accessor: "main_case_no",
        },

        {
            Header: 'Year', accessor: "year",

        },

        {
            Header: 'Department', accessor: "dept_name",

        },
        {
            Header: 'District', accessor: "dist_name",
        },
        {
            Header: 'Service/Non-Service', accessor: "category_service",

        },

        {
            Header: 'Petitioner', accessor: "petitioner",

        },
        {
            Header: 'Ptr.Advocate', accessor: "petioner_advocate",

        },
        {
            Header: 'Respondents', accessor: "respondent",

        },

        {
            Header: 'Respondent Advocate', accessor: "respondent_advocate",

        },


        {
            Header: 'Prayer', accessor: "prayer",

        },




        {
            Header: 'IA Prayer', accessor: "",

        },
        {
            Header: 'Counter Affidavit Filed or not', accessor: "",

        },

        {
            Header: 'Vacate Stay Filed or not', accessor: "",

        },

        {
            Header: 'Pending/Disposed', accessor: "pending_disposed",

        },

    ];


    return (<>
        <CommonFormHeader heading={"Total Pending cases Against The Government Of Andhra Pradesh Report"} />
        <bst.Container className="outer-page-content-container">
            <bst.Row className="pt-2 pt-2 " >
                <FormikProvider value={formIk}>
                    <Form onSubmit={formIk?.handleSubmit} onChange={formIk?.handleChange} >
                        <div className="border px-13 pb-13 mb-4 pt-1">
                            <bst.Row className="px-4 pt-4">
                                <bst.Col xs={12} sm={12} md={12} lg={4} xl={4} xxl={4}>
                                    <label className="mb-0"> Case Type <span style={{ color: 'red' }}>*</span></label>

                                    <Select
                                        name="caseTypeId"
                                        //  styles={customStyles}

                                        className='form-contrl w-100 multi-selt'
                                        options={[{ value: "all", label: "ALL" }, ...caseTypesList.map(casetype => ({ value: casetype.value, label: casetype.label }))]}

                                        isMulti
                                        placeholder="--Select--"
                                        value={selectedCaseTypes}
                                        onChange={(selectedOptions) => {
                                            const allOption = { value: "all", label: "ALL" };
                                            const otherOptions = caseTypesList.map(casetype => ({
                                                value: casetype.value,
                                                label: casetype.label
                                            }));

                                            // If nothing is selected (deselect all)
                                            if (!selectedOptions || selectedOptions.length === 0) {
                                                formIk.setFieldValue('caseTypeId', []);
                                                setSelectedCaseTypes([]);
                                                return;
                                            }

                                            // Check if "ALL" was deselected
                                            const wasAllPreviouslySelected = selectedCaseTypes.some(opt => opt.value === "all");
                                            const isAllStillSelected = selectedOptions.some(opt => opt.value === "all");
                                            console.log("wasAllPreviouslySelected", wasAllPreviouslySelected, "isAllStillSelected", isAllStillSelected)

                                            if (wasAllPreviouslySelected && !isAllStillSelected) {
                                                // "ALL" was removed → clear everything
                                                formIk.setFieldValue('caseTypeId', []);
                                                setSelectedCaseTypes([]);
                                                return;
                                            }


                                            // NEW CONDITION — user deselected one or more after selecting ALL
                                            if (wasAllPreviouslySelected && isAllStillSelected && selectedOptions.length < selectedCaseTypes.length) {
                                                // remove "ALL" and keep the rest
                                                const filtered = selectedOptions.filter(opt => opt.value !== "all");
                                                formIk.setFieldValue('caseTypeId', filtered);
                                                setSelectedCaseTypes(filtered);
                                                return;
                                            }

                                            // If "ALL" was just selected → select everything
                                            if (isAllStillSelected) {
                                                const fullSelection = [...otherOptions, allOption];
                                                formIk.setFieldValue('caseTypeId', fullSelection);
                                                setSelectedCaseTypes(fullSelection);
                                                return;
                                            }

                                            // // Any normal selection (not ALL)
                                            const filtered = selectedOptions.filter(opt => opt.value !== "all");
                                            formIk.setFieldValue('caseTypeId', filtered);
                                            setSelectedCaseTypes(filtered);
                                        }}
                                    />
                                    <ErrorMessage name="caseTypeId" component="div" className="text-error" />
                                </bst.Col>

                                <bst.Col xs={12} sm={12} md={12} lg={4} xl={4} xxl={4}>
                                    <label className="mb-0"> Department <span style={{ color: 'red' }}>*</span></label>

                                    <Select
                                        name="deptId"
                                        className='form-contrl w-100 multi-selt'
                                        // options={showDeptNames.map(deptname => ({ value: deptname.dept_id, label: deptname.dept_name }))}
                                        options={[{ value: "all", label: "ALL" }, ...showDeptNames.map(deptname => ({ value: deptname.dept_id, label: deptname.dept_name }))]}

                                        isMulti
                                        placeholder="--Select--"
                                        value={selectedDept}
                                        onChange={(selectedOptions) => {
                                            const allOption = { value: "all", label: "ALL" };
                                            const otherOptions = showDeptNames.map(deptnames => ({
                                                value: deptnames.dept_id,
                                                label: deptnames.dept_name
                                            }));

                                            if (!selectedOptions || selectedOptions.length === 0) {
                                                formIk.setFieldValue('deptId', []);
                                                setSelectedDept([]);
                                                return;
                                            }

                                            const wasAllPreviouslySelected = selectedDept.some(opt => opt.value === "all");
                                            const isAllStillSelected = selectedOptions.some(opt => opt.value === "all");

                                            // Case 1: deselect "ALL"
                                            if (wasAllPreviouslySelected && !isAllStillSelected) {
                                                formIk.setFieldValue('deptId', []);
                                                setSelectedDept([]);
                                                return;
                                            }

                                            // Case 2: deselect one or more after selecting ALL
                                            if (wasAllPreviouslySelected && isAllStillSelected && selectedOptions.length < selectedDept.length) {
                                                const filtered = selectedOptions.filter(opt => opt.value !== "all");
                                                formIk.setFieldValue('deptId', filtered);
                                                setSelectedDept(filtered);
                                                return;
                                            }

                                            // Case 3: select ALL
                                            if (isAllStillSelected) {
                                                const fullSelection = [...otherOptions, allOption];
                                                formIk.setFieldValue('deptId', fullSelection);
                                                setSelectedDept(fullSelection);
                                                return;
                                            }

                                            // Case 4: regular selection
                                            const filtered = selectedOptions.filter(opt => opt.value !== "all");
                                            formIk.setFieldValue('deptId', filtered);
                                            setSelectedDept(filtered);
                                        }}

                                    />

                                    <ErrorMessage name="deptId" component="div" className="text-danger" ></ErrorMessage>
                                </bst.Col>

                                <bst.Col xs={12} sm={12} md={12} lg={4} xl={4} xxl={4}>
                                    <label className="mb-0"> District <span style={{ color: 'red' }}>*</span></label>
                                    <Field as="select" className='form-control' name="distId" >
                                        <option value="ALL">--ALL--</option>
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
                            </bst.Row>
                            <bst.Row className="px-4 pt-4">
                                <bst.Col xs={12} sm={12} md={12} lg={4} xl={4} xxl={4}>
                                    <label className="mb-0"> Reg Year <span style={{ color: 'red' }}>*</span></label>
                                    <Field as="select" className='form-control' name="regYear">
                                        <option value="ALL">--ALL--</option>
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
                                    <label className="mb-0"> Date of Registration (From Date)<span style={{ color: 'red' }}>*</span></label>
                                    <Field type="date" name="dofFromDate" className="form-control" />
                                    <ErrorMessage name="dofFromDate" component="div" className="text-error" />
                                </bst.Col>

                                <bst.Col xs={12} sm={12} md={12} lg={4} xl={4} xxl={4}>
                                    <label className="mb-0"> Date of Registration (To Date)<span style={{ color: 'red' }}>*</span></label>
                                    <Field type="date" name="dofToDate" className="form-control" />
                                    <ErrorMessage name="dofToDate" component="div" className="text-error" />
                                </bst.Col>
                            </bst.Row>
                            <bst.Row className="px-4 pt-4">
                                <bst.Col xs={12} sm={12} md={12} lg={4} xl={4} xxl={4}>
                                    <label className="mb-0">Petitioner Name<span style={{ color: 'red' }}>*</span></label>
                                    <Field type="text" className="form-control me-1 mt-0" name="petitionerName" />
                                    <ErrorMessage name="petitionerName" component="div" className="text-error" />

                                </bst.Col>

                                <bst.Col xs={12} sm={12} md={12} lg={4} xl={4} xxl={4}>
                                    <label className="mb-0">Respondent Name<span style={{ color: 'red' }}>*</span></label>
                                    <Field type="text" className="form-control me-1 mt-0" name="respodentName" />
                                    <ErrorMessage name="respodentName" component="div" className="text-error" />
                                </bst.Col>

                                <bst.Col xs={12} sm={12} md={12} lg={4} xl={4} xxl={4}>
                                    <label className="mb-0">Service Category <span style={{ color: 'red' }}>*</span></label>
                                    <Field as="select" className='form-control' name="categoryServiceId"
                                    >
                                        <option value="ALL">--ALL--</option>
                                        {categoryServiceList != undefined && categoryServiceList?.map((data, indexDept) => {
                                            return (<React.Fragment key={indexDept}>
                                                <option key={indexDept} value={data.value}>
                                                    {data.label}
                                                </option>
                                            </React.Fragment>);
                                        })}

                                    </Field>
                                    <ErrorMessage name="categoryServiceId" component="div" className="text-error" />
                                </bst.Col>
                                <bst.Col xs={12} sm={12} md={12} lg={4} xl={4} xxl={4}>
                                    <label className="mb-0">Respondent Advocate <span style={{ color: 'red' }}>*</span></label>
                                    <Field as="select" className='form-control' name="res_adv_Id"  >
                                        <option value="ALL">--ALL--</option>
                                        {respAdvList != undefined && respAdvList?.map((data, indexDept) => {
                                            return (<React.Fragment key={indexDept}>
                                                <option key={indexDept} value={data.value}>
                                                    {data.label}
                                                </option>
                                            </React.Fragment>);
                                        })}

                                    </Field>
                                    <ErrorMessage name="res_adv_Id" component="div" className="text-error" />
                                </bst.Col>
                            </bst.Row>
                            <bst.Row className="px-2 pt-2" style={{ marginLeft: "20px" }}>
                                <bst.InputGroup className="mb-4">
                                    <bst.Col xs={6} sm={6} md={6} lg={3} xl={3} xxl={3}>
                                        <button type="submit" className='btn btn-success mt-4'
                                        >Submit</button>
                                    </bst.Col>
                                </bst.InputGroup>
                            </bst.Row>
                        </div>


                    </Form>
                </FormikProvider>
            </bst.Row>


            <bst.Row className="pt-2 pt-2 " style={{ marginLeft: "8px" }}>
                {
                    casesList?.length > 0 ? (
                        <div style={{ width: "95%" }}>
                            <CommonReactTable data={casesList} columns={columns} showFooter={"false"}
                                filename="Pending Cases List" headerName={heading} />
                        </div>
                    ) : (errmsg && (<center><b style={{ color: "red" }}>*********No Data Found*********</b></center>))

                }
            </bst.Row>
        </bst.Container>

        <LegacyCaseDetailsPopup popupflagvalue={showModelPopup} setPopupflagvalue={setModelPopup} regularpopup={regularPopStatus}
            category={cino} viewdata={PopupData} />

    </>)
}

export default PendingCaseReport