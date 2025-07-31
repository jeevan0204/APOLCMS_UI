import React, { useEffect, useState } from 'react'
import { CommonFormHeader } from '../../CommonUtils/CommonFormHeader'
import CommonReactTable from '../../CommonUtils/CommonReactTable'
import { config } from '../../CommonUtils/CommonApis';
import { CommonAxiosGet } from '../../CommonUtils/CommonAxios';

function EofficeEmployeeReport() {
    const [DeptWiseList, setDeptWiseList] = useState([]);
    const [casesList, setCasesList] = useState([]);
    const [errmsg, seterrmsg] = useState(false);
    const [Heading, setHeading] = useState([]);

    const [showDrillCount, setDrillCount] = useState();


    useEffect(() => {
        GetEmpDetailsReport();
    }, []);

    function GetEmpDetailsReport() {
        let Url = config.url.local_URL + "eofficeEmployeeReport";
        CommonAxiosGet(Url).then((res) => {
            setDrillCount(0);
            if (res?.data?.status === true) {
                setCasesList(res?.data?.regData);
                setDeptWiseList([]);
            }
            else {
                setCasesList([]);
                seterrmsg(true);
            }
        })
    }

    function isBackFunction() {
        setDrillCount(showDrillCount - 1)
    }


    const columns = [
        {
            Header: "S.No", accessor: (row, TotalIndex) => (<>{TotalIndex + 1}&nbsp;</>),
            Cell: ({ value }) => <div style={{ textAlign: 'left' }}>{value}</div>,
            Footer: 'Total',
        },
        {
            Header: 'Department Code', accessor: "code"
        },
        {
            Header: 'Department Name', accessor: "global_org_name",
            isClickable: true,
            Cell: ({ row }) => (
                <div style={{ cursor: "pointer", color: "blue", textAlign: "center", }}
                    onClick={() => {
                        showOfficerWise(row.original.global_org_name);
                    }}
                >
                    {row.original.pending_dc}
                </div>
            ),
            Footer: 'global_org_name'
        },
        {
            Header: 'No. of Employess', accessor: "count",
            Footer: 'count'

        },
    ];

    const columnsList = [
        {
            Header: "S.No", accessor: (row, TotalIndex) => (<>{TotalIndex + 1}&nbsp;</>),
            Cell: ({ value }) => <div style={{ textAlign: 'left' }}>{value}</div>,
            Footer: 'Total',
        },
        {
            Header: 'Employee Code', accessor: "employee_code"
        },
        {
            Header: 'Employee Id', accessor: "employee_id"
        },
        {
            Header: 'Employee Identity', accessor: "employee_identity"
        },

        {
            Header: 'Global Org Id', accessor: "global_org_id"
        },
        {
            Header: 'Global Org Name', accessor: "global_org_name"
        },

        {
            Header: 'Fullname', accessor: "fullname_en"
        },
        {
            Header: 'Designation Id', accessor: "designation_id"
        },
        {
            Header: 'Designation Name', accessor: "designation_name_en"
        },
        {
            Header: 'Post Name', accessor: "post_name_en"
        },
        {
            Header: 'Org Unit Name', accessor: "org_unit_name_en"
        }, {
            Header: 'Marking', accessor: "marking_abbr"
        },
        {
            Header: 'Mobile1', accessor: "mobile1"
        },
        {
            Header: 'Email', accessor: "email"
        },
        {
            Header: 'Address Type', accessor: "address_type"
        },
        {
            Header: 'Primary', accessor: "is_primary"
        },
        {
            Header: 'OU Head', accessor: "is_ou_head"
        },
    ];

    function showOfficerWise(deptId) {
        let Url = config.url.local_URL + "getOfficerWise?deptId=" + deptId;
        CommonAxiosGet(Url).then((res) => {
            setDrillCount(1);
            if (res?.data?.status === true) {
                setDeptWiseList(res?.data?.EMPWISENOS);
                setHeading(res?.data?.HEADING);
            }
            else {
                setDeptWiseList([]);
                seterrmsg(true);
            }
        })

    }

    return (
        <>
            <CommonFormHeader heading="Eoffice Employee Details" />
            {showDrillCount === 0 && (<>
                {casesList?.length > 0 ? (
                    <div style={{ width: "98%" }}>
                        <CommonReactTable data={casesList} columns={columns} showFooter={"true"}
                            filename="Eoffice Employee Details REPORT" />

                    </div>
                ) : (errmsg && (
                    <center><b style={{ color: "red" }}>*********No Data Found*********</b></center>))}</>)}


            {showDrillCount === 1 && (<>
                {DeptWiseList?.length > 0 ? (
                    <div style={{ width: "98%" }}>
                        <CommonReactTable data={DeptWiseList} columns={columnsList} showFooter={"false"}
                            filename="Eoffice Dept Wise Employee Details REPORT" headerName={Heading} />

                    </div>
                ) : (errmsg && (
                    <center><b style={{ color: "red" }}>*********No Data Found*********</b></center>))}</>)}



        </>
    )
}

export default EofficeEmployeeReport