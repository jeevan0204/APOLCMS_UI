import React, { useEffect, useRef, useState } from 'react'
import *as bst from "react-bootstrap"
import CommonReactTable from '../../CommonUtils/CommonReactTable';
import { useNavigate } from 'react-router-dom';
import { config } from '../../CommonUtils/CommonApis';
import { CommonAxiosGet } from '../../CommonUtils/CommonAxios';
import { CommonFormHeader } from '../../CommonUtils/CommonFormHeader';

function GPInstructions() {
    const [heading, setHeading] = useState([]);
    const [errmsg, seterrmsg] = useState(false);
    const [casesList, setCasesList] = useState([]);


    const navigate = useNavigate();
    const hasFetchedData = useRef(false)

    useEffect(() => {
        if (!hasFetchedData.current) {
            GetCaseDetailspwr();
            hasFetchedData.current = true
        }
    }, []);

    function GetCaseDetailspwr() {
        let url = config.url.local_URL + "viewInstructionsCases";
        CommonAxiosGet(url).then((res) => {
            if (res?.data?.status === true) {
                // console.log("first");
                setCasesList([
                    ...(res?.data?.CASEWISEDATA || []),
                    ...(res?.data?.CASEWISEDATANEW || [])
                ]);


            } else {
                seterrmsg(true);
                setCasesList([]);

            }
        }).catch((error) => {
            console.error("Error fetching pwr cases list:", error);
        });
    }



    const columnsList = [
        {
            Header: "S.No", accessor: (row, TotalIndex) => (<>{TotalIndex + 1}&nbsp;</>),
            Cell: ({ value }) => <div style={{ textAlign: 'left' }}>{value}</div>,

        },
        {
            Header: 'Case Type', accessor: "type_name_reg",

        },
        {
            Header: 'Case No./Ack No',
            accessor: row => {
                if (row.type_name_reg && row.reg_no && row.reg_year) {
                    return `${row.type_name_reg} / ${row.reg_no} / ${row.reg_year}`;
                } else {
                    return row.cino;
                }
            },
            Cell: ({ row }) => {
                const { cino, legacy_ack_flag, type_name_reg, reg_no, reg_year } = row.original;

                const handleClick = () => {
                    const route = legacy_ack_flag === "New" ? "/GPReportNewPWR" : "/GPReportLegacyPWR";
                    navigate(route);
                    localStorage.setItem("caseNo", JSON.stringify(cino));
                    localStorage.setItem("caseType", JSON.stringify(legacy_ack_flag));
                };

                const displayText = type_name_reg && reg_no && reg_year
                    ? `${type_name_reg} / ${reg_no} / ${reg_year}`
                    : cino;

                return (
                    <span
                        onClick={handleClick}
                        className="p-3 mb-2"
                        style={{ color: 'red', cursor: 'pointer' }}
                    >
                        {displayText}
                    </span>
                );
            }
        }

        ,

        {
            Header: 'Registered Date', accessor: "dt_regis",

        },
        {
            Header: 'Status', accessor: () => 'Pending'
        },

        {
            Header: 'Category Service', accessor: "servicetype",

        },
    ];



    return (
        <>
            <CommonFormHeader heading={heading} />
            <bst.Container className="outer-page-content-container">
                <bst.Row className="pt-2 pt-2 ">
                    {
                        casesList?.length > 0 ? (
                            <div style={{ width: "95%" }}>
                                <CommonReactTable data={casesList} columns={columnsList} showFooter={"true"}
                                    filename="Instructions Received List" />
                            </div>
                        ) : (errmsg && (<center><b style={{ color: "red" }}>*********No Data Found*********</b></center>))

                    }


                </bst.Row>
            </bst.Container>
        </>
    )
}

export default GPInstructions