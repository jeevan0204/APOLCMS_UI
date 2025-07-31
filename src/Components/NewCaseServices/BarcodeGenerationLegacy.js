import React, { useEffect, useState } from 'react'
import * as bst from "react-bootstrap"
import { CommonFormHeader } from '../../CommonUtils/CommonFormHeader'
import { ErrorMessage, Field, Form, FormikProvider, useFormik } from 'formik';
import CommonReactTable from '../../CommonUtils/CommonReactTable';
import { viewBucketImage } from '../../CommonUtils/ViewImagelm';
import { config } from '../../CommonUtils/CommonApis';
import { CommonAxiosGet, CommonAxiosGetPost } from '../../CommonUtils/CommonAxios';
import { useNavigate } from 'react-router-dom';
import LegacyCaseDetailsPopup from '../Popups/LegacyCaseDetailsPopup';

function BarcodeGenerationLegacy() {
    const [errmsg, seterrmsg] = useState(false);
    const [casesList, setCasesList] = useState([]);
    const [caseTypesList, setCaseTypeList] = useState([]);
    const [regYearList, setRegYearList] = useState([]);
    const [showModelPopup, setModelPopup] = useState(false);
    const [regularPopupFlag, setregularPopupFlag] = useState(false);
    const [cino, setcino] = useState([]);
    const [PopupData, setPopupData] = useState([]);
    function regularPopStatus() { setregularPopupFlag(false); }


    const navigate = useNavigate();

    useEffect(() => {
        GetCaseTypesList();
        GetRegYearList();
    }, []);

    const formIk = useFormik({
        initialValues: {
            caseType: "",
            regYear: "",
            regNo: "",
            cino: ""
        },
        enableReinitialize: true,
        onSubmit: (values) => {
            console.log("heloo-----", values);
            const url = config.url.local_URL + "getCasesListData";
            CommonAxiosGetPost(url, values).then((res) => {
                console.log("---post---", res?.data?.CASESLIST);
                if (res?.data?.status === true) {
                    setCasesList(res?.data?.CASESLIST);
                }
                else {
                    navigate("/GPOAcknowledgementForm", {
                        state: {
                            ackType: res?.data?.ackType,
                            msg: res?.data?.errorMsg,
                            regYear: values.regYear,
                            regNo: values.regNo
                        }
                    });
                    // localStorage.setItem("regYear", JSON.stringify(values.regYear));
                    // localStorage.setItem("regNo", JSON.stringify(values.regNo));
                    // localStorage.setItem("ackType", JSON.stringify(res?.data?.ackType));

                    // setCasesList([]);
                    // seterrmsg(true);
                }

            }).catch((error) => {
                console.error("Error fetching onsubmit:", error);
            });
        }

    })


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

    const GetCaseTypesList = () => {
        let url = config.url.COMMONSERVICE_URL + "getCaseTypesListShrt";
        CommonAxiosGet(url).then((res) => {
            if (res.data && res.data.length > 0) {
                setCaseTypeList(res.data);

            } else {
                setCaseTypeList([]);
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


    const columnsList = [
        {
            Header: "S.No", accessor: (row, TotalIndex) => (<>{TotalIndex + 1}&nbsp;</>),
            Cell: ({ value }) => <div style={{ textAlign: 'left' }}>{value}</div>,
            Footer: 'Total',
        },

        {
            Header: 'Scanned Affidavit', accessor: "scanned_document_path",
            isClickable: true,
            Cell: ({ row }) => (
                <center>
                    <h5 style={{ color: "blue", fontSize: "1.5vh", textDecoration: "underline", cursor: "pointer", textAlign: "center" }} onClick={() => { viewBucketImage(row?.original?.scanned_document_path); }} >
                        View
                    </h5>
                </center>
            ),
        },
        {
            Header: 'Barcode', accessor: "barcode_file_path",
            isClickable: true,
            Cell: ({ row }) => (
                <center>
                    <h5 style={{ color: "blue", fontSize: "1.5vh", textDecoration: "underline", cursor: "pointer", textAlign: "center" }} onClick={() => { viewBucketImage(row?.original?.barcode_file_path); }} >
                        Barcode
                    </h5>
                </center>
            ),
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
            Header: 'Case Type', accessor: "type_name_fil",

        },

        {
            Header: 'Reg No.', accessor: "reg_no",
        },

        {
            Header: 'Reg Year.', accessor: "reg_year",

        },

        {
            Header: 'Filing Year', accessor: "fil_year",
        },
        {
            Header: 'Date of Next List', accessor: "date_next_list",

        },

        {
            Header: 'Bench', accessor: "bench_name",

        },

        {
            Header: 'Judge Name', accessor: "coram",

        },
        {
            Header: 'Petitioner', accessor: "pet_name",

        },
        {
            Header: 'District', accessor: "dist_name",

        },
        {
            Header: 'Purpose', accessor: "purpose_name",

        },
        {
            Header: 'Respondents', accessor: "res_name",

        },
        {
            Header: 'Petitioner Advocate', accessor: "pet_adv",

        },
        {
            Header: 'Respondent Advocate', accessor: "res_adv",

        },

        {
            Header: 'Orders', accessor: "orderpaths",
            accessor: "",
            Cell: ({ row }) => {
                const data = row.original;
                console.log("Data:", data.ack_file_path);

                return (
                    <div>
                        {
                            data.ack_file_path !== '' && (
                                <center>
                                    <h5 style={{ color: "blue", fontSize: "1.5vh", textDecoration: "underline", cursor: "pointer", textAlign: "center" }} onClick={() => { viewBucketImage(row?.original?.ack_file_path); }} >
                                        Acknowledgement
                                    </h5>
                                </center>
                            )
                        }

                        {
                            data.barcode_file_path !== '' && (
                                <center>
                                    <h5 style={{ color: "blue", fontSize: "1.5vh", textDecoration: "underline", cursor: "pointer", textAlign: "center" }} onClick={() => { viewBucketImage(row?.original?.barcode_file_path); }} >
                                        Barcode
                                    </h5>
                                </center>
                            )
                        }
                    </div >
                );
            }
        },

    ];
    return (<>
        <CommonFormHeader heading="Generate Barcode for Existing Case" />
        <bst.Container className="outer-page-content-container">
            <FormikProvider value={formIk}>
                <Form onChange={formIk.handleChange} onSubmit={formIk.handleSubmit} >
                    <bst.Row className="px-4 pt-4">
                        <bst.Col xs={12} sm={12} md={12} lg={2} xl={2} xxl={2}>

                            <label className="mb-0"> Case Type : <span style={{ color: 'red' }}>*</span></label>

                            <Field as="select" className='form-control' name="caseType">
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
                        <bst.Col xs={12} sm={12} md={12} lg={2} xl={2} xxl={2}>
                            <label className="mb-0"> Case Registration Year: <span style={{ color: 'red' }}>*</span></label>
                            <Field as="select" className='form-control' name="regYear" >
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
                        <bst.Col xs={12} sm={12} md={12} lg={2} xl={2} xxl={2}>
                            <label className="mb-0"> Case Reg. No : <span style={{ color: 'red' }}>*</span></label>
                            <Field type="text" className="form-control me-1 mt-0" name="regNo"
                                onKeyPress={(e) => { allowNumbersOnly(e); }} />
                            <ErrorMessage name="regNo" component="div" className="text-error" />

                        </bst.Col>

                        <bst.Col xs={12} sm={12} md={12} lg={1} xl={1} xxl={1}>

                            <span style={{ fontWeight: 'bold', display: 'block', marginTop: '1.8rem', textAlign: 'center' }}>(or)</span>
                        </bst.Col>

                        <bst.Col xs={12} sm={12} md={12} lg={2} xl={2} xxl={2}>

                            <label className="mb-0"> CIN No: <span style={{ color: 'red' }}>*</span></label>
                            <Field type="text" className="form-control me-1 mt-0" name="cino"
                                onKeyPress={(e) => { allowNumbersOnly(e); }} />
                            <ErrorMessage name="cino" component="div" className="text-error" />
                        </bst.Col>

                        <bst.Col xs={4} sm={4} md={4} lg={2} xl={2} xxl={2} >
                            <button type="submit" className='btn btn-success mt-4' >Get Case Details</button>
                        </bst.Col>
                    </bst.Row>


                </Form>
            </FormikProvider >
            <div style={{ width: "95%", paddingTop: "100px" }}>
                {casesList?.length > 0 ? (
                    <CommonReactTable data={casesList} columns={columnsList} showFooter={"true"}
                        filename="case details REPORT" headerName="Case Details" />
                ) : (errmsg && (
                    <center><b style={{ color: "red" }}>*********No Data Found*********</b></center>))}
            </div>
        </bst.Container >
        <LegacyCaseDetailsPopup popupflagvalue={showModelPopup} setPopupflagvalue={setModelPopup} regularpopup={regularPopStatus}
            category={cino} viewdata={PopupData} />
    </>)
}

export default BarcodeGenerationLegacy