import { ErrorMessage, Field, Form, FormikProvider, useFormik } from 'formik';
import React, { useEffect, useState } from 'react'
import * as bst from "react-bootstrap";
import DataTable from 'react-data-table-component';
import { config } from '../../CommonUtils/CommonApis';
import { CommonAxiosGet } from '../../CommonUtils/CommonAxios';
import CommonReactTable from '../../CommonUtils/CommonReactTable';
import { InfoAlert } from '../../CommonUtils/SweetAlerts';


function HodWiseReport() {

    const [LegacyServiceList, setLegacyServiceList] = useState([]);
    const [NewServiceList, setNewServiceList] = useState([]);
    const [errmsg, seterrmsg] = useState(false);
    const [caseType, setCaseType] = useState([]);


    function getLegacyServiceList() {
        let url = config.url.COMMONSERVICE_URL + "getHODwiseReport";

        CommonAxiosGet(url).then((res) => {
            if (res !== undefined && res.data.status === true) {
                setLegacyServiceList(res.data.data);
                console.log("test", res.data.data)
            }
            else {
                setLegacyServiceList([]);
            }
        })
    }

    function getNewServiceList() {
        let url = config.url.COMMONSERVICE_URL + "getHODwiseNewReport";

        CommonAxiosGet(url).then((res) => {
            if (res !== undefined && res.data.status === true) {
                setNewServiceList(res.data.data);
            }
            else {
                setNewServiceList([]);
            }
        })
    }


    const formIk = useFormik({
        initialValues: {
            categoryService: ""
        },
        enableReinitialize: true,

        onSubmit: (values) => {
            console.log(values);
        }
    })

    function GetData(caseCategory) {
        if (!caseCategory) {
            InfoAlert("caseCategory Required", 'warning')
        }
        else {

            let Url = config.url.COMMONSERVICE_URL + "getCategorywiseHodReport?caseCategory=" + caseCategory;
            CommonAxiosGet(Url).then((res) => {

                if (res?.data?.status === true && res?.data?.caseType === 'old') {

                    setCaseType(res?.data?.caseType);
                    setLegacyServiceList(res?.data?.data);
                    setNewServiceList([]);
                }
                else if (res?.data?.status === true && res?.data?.caseType === 'New') {
                    setCaseType(res?.data?.caseType);
                    setNewServiceList(res?.data?.data);
                    setLegacyServiceList([]);
                }
                else {
                    setLegacyServiceList([]);
                    setNewServiceList([]);
                }
            })
        }
    }
    useEffect(() => {
        getLegacyServiceList();
        getNewServiceList();
    }, [])

    const columns = [
        {
            Header: "S.No", accessor: (row, TotalIndex) => (<>{TotalIndex + 1}&nbsp;</>),
            Cell: ({ value }) => <div style={{ textAlign: 'center' }}>{value}</div>,
            Footer: 'Total',
        },
        { Header: 'Department Code', accessor: "dept_code", },
        { Header: 'Department Name', accessor: "description", },

        ...(caseType === "old") ? [

            {

                Header: 'Category',
                accessor: "category_service",
            },
        ] : [],

        { Header: 'Total Cases', accessor: "total", Footer: 'total' },


    ];

    const columnsNew = [
        {
            Header: "S.No", accessor: (row, TotalIndex) => (<>{TotalIndex + 1}&nbsp;</>),
            Cell: ({ value }) => <div style={{ textAlign: 'center' }}>{value}</div>,
            Footer: 'Total'
        },
        { Header: 'Department Code', accessor: "dept_code", },
        { Header: 'Department Name', accessor: "description", },

        ...(caseType === "New") ? [

            {

                Header: 'Category',
                accessor: "servicetpye",
            },
        ] : [],
        { Header: 'Total Cases', accessor: "total", Footer: 'total' },

    ];


    return (
        <bst.Row className=" pt-2">
            <FormikProvider value={formIk}>
                <Form onSubmit={formIk?.handleSubmit} onChange={formIk?.handleChange} >
                    <div className="border px-3 pb-3 mb-4 pt-1">
                        <bst.Row className="px-3">
                            <bst.Col xs={12} sm={12} md={12} lg={3} xl={3} xxl={3}>
                                <bst.InputGroup className="mb-1">
                                    <label className="w-100 mb-2"><b>Select Category</b></label>
                                    <Field as="select" className="form-control mb-2" name="categoryService"
                                    >
                                        <option value="0">--Select--</option>
                                        <option value="legacyService">Service(Legacy)</option>
                                        <option value="legacynonService">Non-Service(Legacy)</option>
                                        <option value="NewService">Service(New)</option>
                                        <option value="newnonService">Non-Service(New)</option>


                                    </Field>
                                </bst.InputGroup>
                                <ErrorMessage component="div" className="text-danger" name="categoryService" />
                            </bst.Col>
                            <bst.InputGroup className="mb-1">
                                <bst.Col xs={12} sm={12} md={12} lg={3} xl={3} xxl={3}>
                                    <button type="button" className='btn btn-success mt-4' onClick={() => {
                                        GetData(formIk?.values?.categoryService)
                                    }}>Get Details</button>
                                </bst.Col>
                            </bst.InputGroup>
                        </bst.Row>
                    </div>
                </Form>
            </FormikProvider>

            <bst.Row className="px-2 pt-2">
                <div className="table-responsive px-0 datatable-reports">
                    {/* <DataTable
                        noHeader
                        columns={columns}
                        pagination={true}
                        paginationPerPage="10"
                        persistTableHead={true}
                        data={LegacyServiceList}
                        keyField="ddo_code"
                        fixedHeader
                        fixedHeaderScrollHeight='600px'
                        highlightOnHover
                    //progressPending={loadingSpinner}
                    /> */}


                    {LegacyServiceList?.length > 0 ? (
                        <CommonReactTable data={LegacyServiceList} columns={columns} showFooter={"true"}
                            filename="Hod Wise Case Details(Legacy)" headerName="Hod Wise Case Details(Legacy)" />
                    ) : (errmsg && (
                        <center><b style={{ color: "red" }}>*********No Data Found*********</b></center>))}

                </div>&nbsp;&nbsp;
            </bst.Row>

            <bst.Row className="px-2 pt-2">
                <div className="table-responsive px-0 datatable-reports">
                    {NewServiceList?.length > 0 ? (
                        <CommonReactTable data={NewServiceList} columns={columnsNew} showFooter={"true"}
                            filename="Hod Wise Case Details(New)" headerName="Hod Wise Case Details(New)" />
                    ) : (errmsg && (
                        <center><b style={{ color: "red" }}>*********No Data Found*********</b></center>))}

                </div>
            </bst.Row>



        </bst.Row>

    )
}

export default HodWiseReport