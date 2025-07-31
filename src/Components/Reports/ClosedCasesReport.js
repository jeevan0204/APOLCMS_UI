import React, { useEffect, useState } from 'react'
import *as bst from "react-bootstrap"
import { CommonFormHeader } from '../../CommonUtils/CommonFormHeader'
import CommonReactTable from '../../CommonUtils/CommonReactTable';
import { config } from '../../CommonUtils/CommonApis';
import { CommonAxiosGet } from '../../CommonUtils/CommonAxios';
import LegacyCaseDetailsPopup from '../Popups/LegacyCaseDetailsPopup';

function ClosedCasesReport() {
    const [closedcasesList, setClosedcasesList] = useState([]);
    const [heading, setHeading] = useState([]);
    const [errmsg, seterrmsg] = useState(false);

    const [showModelPopup, setModelPopup] = useState(false);
    const [regularPopupFlag, setregularPopupFlag] = useState(false);
    const [cino, setcino] = useState([]);
    const [PopupData, setPopupData] = useState([]);
    function regularPopStatus() { setregularPopupFlag(false); }

    useEffect(() => {
        GetClosedCasesData();

    }, []);

    const GetClosedCasesData = () => {
        let url = config.url.local_URL + "ClosedCasesReport";
        CommonAxiosGet(url).then((res) => {
            if (res?.data?.status === true) {
                setHeading(res?.data?.heading);
                setClosedcasesList(res?.data?.data);
            } else {
                seterrmsg(true);
                setClosedcasesList([]);

            }
        }).catch((error) => {
            console.error("Error fetching closedcases data :", error);
        });
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

        },
        {
            Header: 'CINo', accessor: "cino",
            Cell: ({ value, row }) => (
                <button
                    onClick={() => handleCinoClick(value)}
                    style={{
                        backgroundColor: '#74b9db',
                        color: '#000',
                        padding: '6px 12px',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                    }}>
                    {value}
                </button>
            )

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
            Header: 'SR Number', accessor: "fil_no",

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
            Cell: ({ row }) => {
                const orderList = row?.original?.orderpaths?.split("<br/>-") || [];
                return (
                    <ul style={{ paddingLeft: "1rem", margin: 0 }}>
                        {orderList.map((item, index) => (
                            <li key={index}>{item.trim()}</li>
                        ))}
                    </ul>
                );
            }
        },
        {
            Header: 'Status', accessor: "",

        }

    ];

    return (<>
        <CommonFormHeader heading={"Orders Issued Report"} />
        <bst.Row className="pt-2 pt-2 " style={{ marginLeft: "50px" }}>
            {
                closedcasesList?.length > 0 ? (
                    <CommonReactTable data={closedcasesList} columns={columns} showFooter={"false"}
                        filename="Closed Cases Report" headerName={heading} />
                ) : (errmsg && (
                    <center><b style={{ color: "red" }}>*********No Data Found*********</b></center>))
            }

        </bst.Row>

        <LegacyCaseDetailsPopup popupflagvalue={showModelPopup} setPopupflagvalue={setModelPopup} regularpopup={regularPopStatus}
            category={cino} viewdata={PopupData} />

    </>)
}

export default ClosedCasesReport