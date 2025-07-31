import React, { useEffect, useState } from 'react'
import * as bst from "react-bootstrap"
import CommonReactTable from '../../CommonUtils/CommonReactTable';
import { config } from '../../CommonUtils/CommonApis';
import { CommonAxiosGet } from '../../CommonUtils/CommonAxios';

function DistrictNodalOfficerAbstactReport() {
    const [errmsg, seterrmsg] = useState(false);
    const [heading, setHeading] = useState([]);
    const [distNodalReportList, setdistNodalReportList] = useState();
    const [casesList, setCasesList] = useState([]);

    const [showDrillCount, setDrillCount] = useState();


    useEffect(() => {
        GetDistWiseNodalReport();
    }, [])

    function GetDistWiseNodalReport() {
        let url = config.url.local_URL + "DistrictNodalOfficerAbstactReport";
        CommonAxiosGet(url).then((res) => {
            if (res?.data?.status === true) {
                setDrillCount(0);
                setdistNodalReportList(res?.data?.data);
            } else {
                setdistNodalReportList([]);
            }
        }).catch((error) => {
            console.error("Error fetching setdistNodalReportList:", error);
        });
    };

    const columnsDist = [
        {
            Header: "S.No", accessor: (row, TotalIndex) => (<>{TotalIndex + 1}&nbsp;</>),
            Cell: ({ value }) => <div style={{ textAlign: 'center' }}>{value}</div>,
            Footer: 'Total',

        },
        {
            Header: 'District', accessor: "district_name",
            isClickable: true,
            Cell: ({ row }) => (
                <div style={{ cursor: "pointer", color: "blue", textAlign: "center", }}
                    onClick={() => {
                        getCasesWiseList(row.original.distid, row.original.district_name);

                    }}
                >
                    {row.original.district_name}
                </div>
            ),
            Footer: 'district_name'
        },
        {
            Header: 'Nodal Officers Registered', accessor: "acks",

        },
    ]

    function getCasesWiseList(distCode, distName) {

        let Url = config.url.local_URL + "getEmpListData?districtId=" + distCode + "&district_name=" + distName;
        CommonAxiosGet(Url).then((res) => {
            setDrillCount(1);
            if (res?.data?.status === true) {
                setHeading(res?.data?.heading);
                setCasesList(res?.data?.data);
            }
            else {
                seterrmsg(true);

            }
        })

    }

    function isBackFunction() {
        setDrillCount(showDrillCount - 1)
    }

    const columnsList = [
        {
            Header: "S.No", accessor: (row, TotalIndex) => (<>{TotalIndex + 1}&nbsp;</>),
            Cell: ({ value }) => <div style={{ textAlign: 'left' }}>{value}</div>,
            Footer: 'Total',
        },
        {
            Header: 'Department Code', accessor: "dept_id",

        },
        {
            Header: 'Department', accessor: "description",

        },
        {
            Header: 'Employee Name', accessor: "fullname_en",

        },
        {
            Header: 'Designation', accessor: "designation_name_en",

        }, {
            Header: 'Mobile No', accessor: "mobileno",

        },
        {
            Header: 'eMail', accessor: "emailid",

        }
    ]


    return (
        <bst.Container className="outer-page-content-container">

            {showDrillCount === 0 && (<>
                {distNodalReportList !== "" ? (
                    <CommonReactTable data={distNodalReportList} columns={columnsDist} showFooter={"true"}
                        filename="Distwise Nodal Officer Abstract Report" headerName={heading} />
                ) : (errmsg && (
                    <center><b style={{ color: "red" }}>*********No Data Found*********</b></center>))}</>)}

            {showDrillCount === 1 && (<>
                {casesList?.length > 0 ? (
                    <CommonReactTable data={casesList} columns={columnsList} showFooter={"true"}
                        filename="Distwise Nodal Officer Abstract Report" headerName={heading} isBack={true}
                        isBackFunction={isBackFunction} />
                ) : (errmsg && (
                    <center><b style={{ color: "red" }}>*********No Data Found*********</b></center>))}</>)}
        </bst.Container>
    )
}

export default DistrictNodalOfficerAbstactReport