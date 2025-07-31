import React, { useEffect, useState } from 'react'
import * as bst from "react-bootstrap"
import CommonReactTable from '../../CommonUtils/CommonReactTable';
import { viewBucketImage } from '../../CommonUtils/ViewImagelm';
import { CommonAxiosGet, CommonAxiosPost } from '../../CommonUtils/CommonAxios';
import { config } from '../../CommonUtils/CommonApis';
import LegacyCaseDetailsPopup from './LegacyCaseDetailsPopup';
import { ErrorMessage, Field, Form, FormikProvider, useFormik } from 'formik';
import ImagePdfBucket from '../../CommonUtils/ImagePdfBase64';
import { failureAlert, successAlert, successAlert2 } from '../../CommonUtils/SweetAlerts';



const InstructionPopup = (propsAtCaseDetailsView) => {

    const [showPrintData, setPrintData] = useState(true);
    const [casesList, setcasesList] = useState([]);
    const [casesListNew, setcasesListNew] = useState([]);
    const [errmsg, seterrmsg] = useState(false);
    const [showModelPopup, setModelPopup] = useState(false);
    const [regularPopupFlag, setregularPopupFlag] = useState(false);
    const [cino, setcino] = useState([]);
    const [PopupData, setPopupData] = useState([]);

    const serno = JSON.parse(localStorage.getItem("serno"));
    const caseType = JSON.parse(localStorage.getItem("caseType"));
    const cino1 = JSON.parse(localStorage.getItem("cino"));


    function regularPopStatus() { setregularPopupFlag(false); }

    useEffect(() => {
        const cino = propsAtCaseDetailsView?.viewdata?.CASESLISTOLD?.[0]?.cino;
        console.log("--------------view----", propsAtCaseDetailsView?.viewdata?.CASESLISTOLD?.[0]);
        if (cino) {
            console.log("-----" + JSON.stringify(cino));
            if (propsAtCaseDetailsView?.viewdata?.CASESLISTOLD !== "undefined") {
                setcasesList([propsAtCaseDetailsView?.viewdata?.CASESLISTOLD?.[0]]);
            }
            else {
                setcasesListNew([propsAtCaseDetailsView?.viewdata?.CASESLISTNEW?.[0]]);
            }
        }
    }, [propsAtCaseDetailsView.viewdata]);

    // console.log("popupflagvalue:", propsAtCaseDetailsView?.popupflagvalue);
    // console.log("viewdata:", propsAtCaseDetailsView?.viewdata);

    const handleClosePopup = () => {
        propsAtCaseDetailsView?.setPopupflagvalue(false);
    }

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

    const formIk = useFormik({
        initialValues: {
            daily_status: "",
            changeLetter: "",
        },
        enableReinitialize: true,

        onSubmit: (values) => {
            console.log("heloo-----", values);
            values.cino = cino1;
            values.serno = serno;
            const url = config.url.local_URL + "getSubmitCategoryLegacyDSE";
            CommonAxiosPost(url, values).then((res) => {
                if (res?.data?.scode === "01") {
                    successAlert2(res?.data?.sdesc);
                } else {
                    failureAlert(res?.data?.sdesc);
                }
            }).catch((error) => {
                console.error("Error fetching legacy instraction submit:", error);
            });
        }

    })

    const formIknew = useFormik({
        initialValues: {
            daily_status: "",
            changeLetter: "",
        },
        enableReinitialize: true,

        onSubmit: (values) => {
            console.log("heloo-----", values);
            values.cino = cino1;
            values.serno = serno;
            const url = config.url.local_URL + "getSubmitCategoryNewDSE";
            CommonAxiosPost(url, values).then((res) => {
                if (res?.data?.scode === "01") {
                    successAlert2(res?.data?.sdesc);
                } else {
                    failureAlert(res?.data?.sdesc);
                }
            }).catch((error) => {
                console.error("Error fetching legacy instraction submit:", error);
            });
        }
    });









    const columnsList = [
        {
            Header: "S.No", accessor: (row, TotalIndex) => (<>{TotalIndex + 1}&nbsp;</>),
            Cell: ({ value }) => <div style={{ textAlign: 'left' }}>{value}</div>,

        },
        {
            Header: 'CINo',
            accessor: 'cino',
            Cell: ({ row }) => {
                const cino = row.original.cino;
                return (
                    <button
                        className="btn btn-sm"
                        style={{ backgroundColor: '#18c4bc', color: 'white' }}
                        onClick={() => handleCinoClick(cino)}
                    >
                        {cino}
                    </button>
                );
            },

        },

        {
            Header: 'Scanned Affidavit', accessor: "scanned_document_path1",
            isClickable: true,
            Cell: ({ row }) => (
                <center>
                    <h5 style={{ color: "blue", fontSize: "1.5vh", textDecoration: "underline", cursor: "pointer", textAlign: "center" }} onClick={() => { viewBucketImage(row?.original?.scanned_document_path1); }} >
                        View
                    </h5>
                </center>
            ),
        },
        {
            Header: 'Current Status', accessor: "current_status",

        },

        {
            Header: 'Date of Filing', accessor: "date_of_filing",

        },


        {
            Header: 'Case Reg Type.', accessor: "type_name_fil",

        },

        {
            Header: 'Case Reg No.', accessor: "reg_no",
        },

        {
            Header: 'Case Reg Year.', accessor: "reg_year",

        },

        {
            Header: 'Prayer', accessor: "prayer",

        },

        {
            Header: 'Filing No', accessor: "fil_no",

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
            isClickable: true,
            Cell: ({ row }) => (
                <center>
                    <h5 style={{ color: "blue", fontSize: "1.5vh", textDecoration: "underline", cursor: "pointer", textAlign: "center" }} onClick={() => { viewBucketImage(row?.original?.scanned_document_path1); }} >
                        View
                    </h5>
                </center>
            ),
        },

    ];

    const columnsListNew = [
        {
            Header: "S.No", accessor: (row, TotalIndex) => (<>{TotalIndex + 1}&nbsp;</>),
            Cell: ({ value }) => <div style={{ textAlign: 'left' }}>{value}</div>,

        },
        {
            Header: 'Ack No.',
            accessor: 'ack_no',

        },

        {
            Header: 'Date', accessor: "generated_date",

        },

        {
            Header: 'District', accessor: "district_name",

        },


        {
            Header: 'Case Type', accessor: "case_full_name",

        },

        {
            Header: 'Main Case No.', accessor: "maincaseno",
        },
        {
            Header: 'Departments / Respondents', accessor: "dept_descs",

        },

        {
            Header: 'Advocate CC No.', accessor: "advocateccno",

        },


        {
            Header: 'Advocate Name', accessor: "advocatename",

        },

        {
            Header: 'Download / Print',
            accessor: 'ack_file_path',
            isClickable: true,
            Cell: ({ row }) => (
                <center>
                    <h5 style={{ color: "blue", fontSize: "1.5vh", textDecoration: "underline", cursor: "pointer", textAlign: "center" }} onClick={() => { viewBucketImage(row?.original?.ack_file_path); }} >
                        Acknowledgement
                    </h5>
                </center>
            ),
        },
    ];


    return (<>
        <bst.Modal show={propsAtCaseDetailsView?.popupflagvalue} onHide={handleClosePopup} className="modal-xl" backdrop="static">
            <bst.Modal.Header className="bg-success bg-opacity-75 text-white" closeButton>
                <bst.Modal.Title>View/Submit Daily Status for Case : {propsAtCaseDetailsView?.viewdata?.cino} </bst.Modal.Title>
            </bst.Modal.Header>
            <bst.Modal.Body>
                <bst.Container className="outer-page-content-container">
                    <bst.Row className="pt-2 pt-2 ">
                        {
                            casesList?.length > 0 ? (
                                <div style={{ width: "95%" }}>
                                    <CommonReactTable data={casesList} columns={columnsList} showFooter={"true"}
                                        filename="Cases List" />
                                </div>
                            ) : (errmsg && (<center><b style={{ color: "red" }}>*********No Data Found*********</b></center>))

                        }

                        {
                            casesListNew?.length > 0 ? (
                                <div style={{ width: "95%" }}>
                                    <CommonReactTable data={casesListNew} columns={columnsListNew} showFooter={"true"}
                                        filename="New Cases List" />
                                </div>
                            ) : (errmsg && (<center><b style={{ color: "red" }}>*********No Data Found*********</b></center>))
                        }
                    </bst.Row>&nbsp;


                    {Array.isArray(propsAtCaseDetailsView?.viewdata?.existData) && <>
                        <div className="card">
                            <div style={{
                                backgroundColor: '#989b9c',
                                color: '#ffffff',
                                borderRadius: '10px',
                                boxShadow: '0 4px 6px rgba(68, 23, 23, 0.2)',
                                display: 'inline-block',
                                width: '200px',
                                height: '40px',
                                marginTop: '20px',
                                marginLeft: '10px',
                                textAlign: 'center'
                            }}>
                                Instructions submitted
                            </div>
                            <div className="card-body RowColorForLeave">
                                <bst.Row>
                                    <bst.Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={12}>
                                        <table className="table  table-bordered  table-responsive" style={{ width: "80%" }}>
                                            <thead style={{ textAlign: "left", backgroundColor: 'blue', color: 'white' }}>
                                                <tr>

                                                    <th>Sl.No</th>
                                                    <th>Description</th>
                                                    <th>Submitted On</th>
                                                    <th>Uploaded Instructions File</th>
                                                </tr>
                                            </thead>
                                            <tbody style={{ textAlign: "left" }}>
                                                {Array.isArray(propsAtCaseDetailsView?.viewdata?.existData) &&
                                                    propsAtCaseDetailsView?.viewdata?.existData?.map((party, index) => (
                                                        <tr key={index}>
                                                            <td>{index + 1}</td>
                                                            <td>{party?.instructions}</td>
                                                            <td>{party?.insert_time}</td>
                                                            <td>

                                                                <center>
                                                                    <h5 style={{ color: "blue", fontSize: "1.5vh", textDecoration: "underline", cursor: "pointer", textAlign: "center" }} onClick={() => { viewBucketImage(party?.upload_fileno); }} >
                                                                        View Uploaded File
                                                                    </h5>
                                                                </center>

                                                            </td>

                                                        </tr>
                                                    ))}
                                            </tbody>

                                        </table>
                                    </bst.Col>
                                </bst.Row>
                            </div>
                        </div>&nbsp;

                        <FormikProvider value={formIk}>
                            <Form onSubmit={formIk?.handleSubmit} onChange={formIk?.handleChange} >
                                <div className="border px-13 pb-13 mb-4 pt-1">
                                    <h5 class="m-t-0 header-title">
                                        <b>Reply to Instructions </b>
                                    </h5>
                                    <bst.Row className="px-4 pt-4">
                                        <bst.Col xs={12} sm={12} md={12} lg={8} xl={8} xxl={8}>
                                            <label className="mb-0"> Status:  <span style={{ color: 'red' }}>*</span></label>
                                            <Field as='textarea' className='form-control' name="daily_status" />
                                            <ErrorMessage name="ecourtsCaseStatus" component="div" className="text-danger" ></ErrorMessage>
                                        </bst.Col>
                                    </bst.Row>
                                    <bst.Row className="px-4 pt-4">
                                        <bst.Col xs={6} sm={6} md={6} lg={4} xl={4} xxl={4}>
                                            <label className="mb-0">Upload file: <span style={{ color: 'red' }}>*</span></label>

                                            <Field name="changeLetter">
                                                {({ field, form }) => (
                                                    <input
                                                        type="file"
                                                        className="form-control mt-3"
                                                        accept="application/pdf,image/jpeg,image/jpg"
                                                        onChange={(e) => {
                                                            const file = e.target.files[0];
                                                            if (file) {
                                                                let fileVal = "instruction_" + cino1;
                                                                let filename = fileVal;
                                                                let path = "apolcms/uploads/DailyStatus/";
                                                                form.setFieldValue("changeLetter", file);
                                                                ImagePdfBucket(e, form, path, `changeLetter`, filename);
                                                            }
                                                        }}
                                                    />
                                                )}
                                            </Field>
                                            <ErrorMessage name="changeLetter" component="div" className="text-danger" ></ErrorMessage>
                                        </bst.Col>
                                    </bst.Row>

                                    <bst.Col xs={4} sm={4} md={4} lg={4} xl={4} xxl={4}>
                                        <button type="submit" className='btn btn-success mt-4' style={{ marginLeft: "40px" }}>Submit</button>
                                    </bst.Col>&nbsp;
                                </div>
                            </Form>
                        </FormikProvider>

                    </>}

                    {Array.isArray(propsAtCaseDetailsView?.viewdata?.existDataNew) && <>
                        <div className="card">
                            <div style={{
                                backgroundColor: '#989b9c',
                                color: '#ffffff',
                                borderRadius: '10px',
                                boxShadow: '0 4px 6px rgba(68, 23, 23, 0.2)',
                                display: 'inline-block',
                                width: '200px',
                                height: '40px',
                                marginTop: '20px',
                                marginLeft: '10px',
                                textAlign: 'center'
                            }}>
                                Instructions submitted
                            </div>
                            <div className="card-body RowColorForLeave">
                                <bst.Row>
                                    <bst.Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={12}>
                                        <table className="table  table-bordered  table-responsive" style={{ width: "80%" }}>
                                            <thead style={{ textAlign: "left", backgroundColor: 'blue', color: 'white' }}>
                                                <tr>

                                                    <th>Sl.No</th>
                                                    <th>Description</th>
                                                    <th>Submitted On</th>
                                                    <th>Uploaded Instructions File</th>
                                                </tr>
                                            </thead>
                                            <tbody style={{ textAlign: "left" }}>
                                                {Array.isArray(propsAtCaseDetailsView?.viewdata?.existDataNew) &&
                                                    propsAtCaseDetailsView?.viewdata?.existDataNew?.map((party, index) => (
                                                        <tr key={index}>
                                                            <td>{index + 1}</td>
                                                            <td>{party?.instructions}</td>
                                                            <td>{party?.insert_time}</td>
                                                            <td>

                                                                <center>
                                                                    <h5 style={{ color: "blue", fontSize: "1.5vh", textDecoration: "underline", cursor: "pointer", textAlign: "center" }} onClick={() => { viewBucketImage(party?.upload_fileno); }} >
                                                                        View Uploaded File
                                                                    </h5>
                                                                </center>

                                                            </td>

                                                        </tr>
                                                    ))}
                                            </tbody>

                                        </table>
                                    </bst.Col>
                                </bst.Row>
                            </div>
                        </div>&nbsp;

                        <FormikProvider value={formIknew}>
                            <Form onSubmit={formIknew?.handleSubmit} onChange={formIknew?.handleChange} >

                                <div className="border px-13 pb-13 mb-4 pt-1">
                                    <h5 class="m-t-0 header-title">
                                        <b>Reply to Instructions </b>
                                    </h5>


                                    <bst.Row className="px-4 pt-4">
                                        <bst.Col xs={12} sm={12} md={12} lg={8} xl={8} xxl={8}>
                                            <label className="mb-0"> Status:  <span style={{ color: 'red' }}>*</span></label>
                                            <Field as='textarea' className='form-control' name="daily_status" />
                                            <ErrorMessage name="ecourtsCaseStatus" component="div" className="text-danger" ></ErrorMessage>
                                        </bst.Col>
                                    </bst.Row>
                                    <bst.Row className="px-4 pt-4">
                                        <bst.Col xs={6} sm={6} md={6} lg={4} xl={4} xxl={4}>
                                            <label className="mb-0">Upload file: <span style={{ color: 'red' }}>*</span></label>

                                            <Field name="changeLetter">
                                                {({ field, form }) => (
                                                    <input
                                                        type="file"
                                                        className="form-control mt-3"
                                                        accept="application/pdf,image/jpeg,image/jpg"
                                                        onChange={(e) => {
                                                            const file = e.target.files[0];
                                                            if (file) {
                                                                let fileVal = "instruction_" + cino1;
                                                                let filename = fileVal;
                                                                let path = "apolcms/uploads/DailyStatus/";
                                                                form.setFieldValue("changeLetter", file);
                                                                ImagePdfBucket(e, form, path, `changeLetter`, filename);
                                                            }
                                                        }}
                                                    />
                                                )}
                                            </Field>
                                            <ErrorMessage name="changeLetter" component="div" className="text-danger" ></ErrorMessage>
                                        </bst.Col>
                                    </bst.Row>

                                    <bst.Col xs={4} sm={4} md={4} lg={3} xl={3} xxl={3}>
                                        <button type="submit" className='btn btn-success mt-4' style={{ marginLeft: "40px" }}>Submit</button>
                                    </bst.Col>
                                </div>
                            </Form>
                        </FormikProvider>

                    </>}
                </bst.Container>
            </bst.Modal.Body>
        </bst.Modal>

        < LegacyCaseDetailsPopup popupflagvalue={showModelPopup} setPopupflagvalue={setModelPopup} regularpopup={regularPopStatus}
            category={cino} viewdata={PopupData} />


    </>)

}
export default InstructionPopup