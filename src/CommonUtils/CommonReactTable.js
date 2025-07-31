import React, { useEffect, useRef, useState } from 'react';
import { useTable, usePagination, useSortBy, useFilters, useGlobalFilter, useAsyncDebounce } from "react-table";
import { SiMicrosoftexcel } from 'react-icons/si';
import { BsPrinter } from 'react-icons/bs';
import { useReactToPrint } from 'react-to-print';
import ReactHtmlTableToExcel from 'react-html-table-to-excel';
import { CgPushChevronLeft, CgPushChevronRight } from "react-icons/cg";
import { FaChevronLeft, FaChevronRight, FaFileExcel } from 'react-icons/fa';
import * as jnb from 'react-bootstrap';
import { FaCircleArrowLeft } from 'react-icons/fa6';

export default function CommonReactTable(props) {

    const { columns, data, filename, showFooter, headerName, paginationCount, align, tableId, excelFlag, excelshow, downloadExcelD, hideColPrint, decimal, Wrapn,
        isBack, isBackFunction
    } = props
    // Determine page size based on paginationCount prop
    const calculatedPageSize = paginationCount === "All" ? data.length : 10;
    const {
        getTableBodyProps,
        headerGroups,
        footerGroups,
        page,
        canPreviousPage,
        canNextPage,
        preGlobalFilteredRows,
        pageCount,
        gotoPage,
        nextPage,
        previousPage,
        state: { pageIndex, pageSize },
        setPageSize,
        globalFilter,
        setGlobalFilter,
        rows,
        prepareRow
    } = useTable({
        columns,
        data,
        initialState: { pageIndex: 0, pageSize: calculatedPageSize },
    },
        useFilters,
        useGlobalFilter,
        useSortBy,
        usePagination,
    );
    // UseEffect to adjust pageSize based on paginationCount prop
    useEffect(() => {
        if (paginationCount === "All") {
            setPageSize(data.length); // Set to total rows if "All" is selected
        } else {
            setPageSize(10); // Default to 10 rows per page
        }
    }, [paginationCount, data.length, setPageSize]);

    const [value, setValue] = React.useState(globalFilter)
    const onChange = useAsyncDebounce(valuess => {
        setGlobalFilter(valuess)
    }, 200)

    let componentRef = useRef();
    const handleprint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: filename,
    });

    // const [currentPage, setCurrentPage] = useState(1);
    function rowsCountworking(a) {
        const currentPageRows = rows.slice(pageIndex * pageSize, (pageIndex + 1) * pageSize);
        const countSum = currentPageRows.reduce((sum, row) => sum + row.values[a.Footer], 0);
        if (!isNaN(countSum)) {
            const precision = 2;
            const roundedSum = parseFloat(countSum.toFixed(precision));
            return roundedSum;
        } else {
            return "";
        }
    }
    function rowsCount(a) {
        let countSum = 0
        const rdata = data?.slice(pageIndex * pageSize, (pageIndex + 1) * pageSize);

        if (a?.FooterParamAction) {
            let params1 = a?.Footerparams?.split('-')[0]
            let params2 = a?.Footerparams?.split('-')[1]
            let params3 = a?.Footerparams?.split('-')[2]
            let paramsum1 = rdata?.reduce((sum, row) => sum + row[params1], 0)
            let paramsum2 = rdata?.reduce((sum, row) => sum + row[params2], 0)
            let paramsum3 = rdata?.reduce((sum, row) => sum + row[params3], 0)
            if (a.FooterParamAction === '-') {
                countSum = parseInt(paramsum1) - parseInt(paramsum2) - parseInt(paramsum3)
            }
            else if (a.FooterParamAction === '/') {
                countSum = parseFloat((Math.round((parseInt(paramsum1) / parseInt(paramsum2)) * 1000) / 10).toFixed(1));
            }
            else {
                countSum = parseInt(paramsum1) + parseInt(paramsum2)
            }

        }
        else {
            countSum = rdata?.reduce((sum, row) => sum + row[a.Footer], 0)
        }

        if (!isNaN(countSum)) {
            if (decimal === 'two') {
                return countSum.toFixed(2);
            }
            return countSum
        }

        else {
            return ""
        }
    }
    function getLowLevelColumnCount(columns) {
        let count = 0;

        function countColumns(cols) {
            cols.forEach(col => {
                if (col.columns) {
                    countColumns(col.columns);
                } else {
                    count += 1;
                }
            });
        }
        countColumns(columns);
        return count;
    }

    const lowLevelColumnCount = getLowLevelColumnCount(columns);

    // Calculate the item numbers for pagination display
    const totalItems = preGlobalFilteredRows.length;
    const startItemNumber = pageIndex * pageSize + 1;
    const endItemNumber = Math.min((pageIndex + 1) * pageSize, totalItems);

    // Generate unique IDs for table and excel button
    const uniqueTableId = `table-to-xls-${tableId}`;
    const uniqueButtonId = `test-table-xls-button-${tableId}`;

    return (
        <React.Fragment>
            <jnb.Row>
                <jnb.Col xs={12} sm={12} md={8} lg={8} xl={8} xxl={8}>
                    <input
                        value={value || ""}
                        name={`search_${Date.now()}`}
                        style={{ fontSize: '1.1rem', border: '1' }}
                        placeholder="Search"
                        onChange={(e) => {
                            setValue(e.target.value);
                            onChange(e.target.value);
                        }}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                e.preventDefault();
                            }
                        }}
                    />
                    &nbsp;
                </jnb.Col>
                <jnb.Col xs={12} sm={12} md={4} lg={4} xl={4} xxl={4} className='excel-print'>
                    <div style={{ float: 'right' }}>
                        {excelFlag !== false && (<>
                            <ReactHtmlTableToExcel
                                id="table-to-xls"
                                className="pull-right btn btn-sm btn-success"
                                table="export-table-for-excel"
                                filename={filename}
                                sheet="Sheet1"
                                buttonText={
                                    <>
                                        {/* <FaFileExcel size={20} color="green" />Excel */}
                                        <FaFileExcel size={20} color="green" />Excel

                                    </>
                                }
                            />
                        </>)}
                        {excelshow === "excelremoveonerow" && (<>
                            <button
                                type='button'
                                className="pull-right btn btn-sm btn-success"
                                onClick={() => {
                                    downloadExcelD(); // Call your custom function
                                }}
                            >
                                <FaFileExcel size={20} color="green" />Excel
                            </button>
                        </>)}
                        &nbsp;
                        <button type="button" className=" btn btn-primary btn-sm" onClick={handleprint}><BsPrinter title="Print" size={"20px"} /> Print</button>
                    </div>
                    {isBack == true &&
                        <button type='button' className="btn btn-secondary btn-sm"
                            onClick={() => { isBackFunction() }}>
                            <FaCircleArrowLeft size={20} /> Back</button>}
                </jnb.Col>
                <jnb.Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={12} className='pt-3'>
                    <div className='table-responsive'
                        style={paginationCount !== "All" && preGlobalFilteredRows.length > 10 ? { height: '550px', overflowY: 'auto' } : {}}
                    >
                        <table className="table table-bordered table-striped"
                            style={{ border: '1px solid lightblue', width: '100%' }}
                            ref={componentRef}
                            id="export-table-for-excel"
                        >
                            <thead className='sticky-header' style={{ top: "-2px" }} >
                                {(headerName !== '' && headerName !== null && headerName !== undefined) && (<>
                                    {/* <tr className='sticky-header' style={{ top: "-2px" }}>
                                        <th colSpan={lowLevelColumnCount} className='sticky-header' style={{ top: "-2px" }}> {headerName} </th>
                                    </tr> */}
                                    <tr className='sticky-header' style={{ top: "-2px" }}>
                                        <th colSpan={lowLevelColumnCount} style={{ top: "-2px" }}
                                            className={`sticky-header ${hideColPrint === "hideColPrint" ? "no-print" : ""}`} >
                                            {headerName}
                                        </th>
                                    </tr>
                                </>)}
                                {headerGroups.map((headerGroup, index) => (
                                    <tr key={index} {...headerGroup.getHeaderGroupProps()} className='sticky-header' style={{ top: "-2px" }}>
                                        {headerGroup.headers.map((column, index) => (
                                            <th key={index} {...column.getHeaderProps(column.getSortByToggleProps())} className={`${column.className} ${"top-table"}`} >
                                                {column.render('Header')}
                                                <span>
                                                    {column.isSorted
                                                        ? column.isSortedDesc
                                                            ? ' 🔽'
                                                            : ' 🔼'
                                                        : ''}
                                                </span>
                                            </th>
                                        ))}
                                    </tr>
                                ))}
                            </thead>
                            <tbody {...getTableBodyProps()} style={{
                                fontSize: "12px",
                                whiteSpace: Wrapn === "normal" ? "normal" : "nowrap",
                                overflow: Wrapn === "normal" ? "" : "hidden",
                                textOverflow: Wrapn === "normal" ? "" : "ellipsis"
                            }}
                            // style={{ fontSize: "12px", whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
                            >
                                {rows.length === 0 ? (
                                    <tr>
                                        <td colSpan={columns.length} style={{ textAlign: "center", }}>
                                            <center className='text-danger h6'>*** No Records Found ***</center>
                                        </td>
                                    </tr>
                                ) : (
                                    page.map((row, index) => {
                                        prepareRow(row);
                                        return (
                                            <tr {...row.getRowProps()} key={index}>
                                                {row.cells.map((cell, index) => {
                                                    let backGroundColor = row.cells[index].row.original.colorFlag;
                                                    const columnStyle = cell.column.width ? { width: `${cell.column.width}px`, } : {};
                                                    return <td
                                                        style={{
                                                            verticalAlign: 'top', backgroundColor: backGroundColor, ...columnStyle,
                                                        }}
                                                        key={index}
                                                        {...cell.getCellProps()}
                                                        className={cell.column.className}
                                                    >
                                                        {cell.render("Cell")}
                                                    </td>;
                                                })}
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                            {showFooter === "true" && rows.length !== 0 && (
                                <tfoot>
                                    <tr>
                                        {footerGroups[0].headers.map((column, cindex) => (
                                            <td
                                                key={cindex}
                                                {...column.getFooterProps()}
                                                style={{
                                                    border: '1px solid black',
                                                    textAlign: align === 'center' ? 'center' : 'right',
                                                    cursor: column.isClickable ? 'pointer' : 'auto',
                                                    textDecoration: column.isClickable ? 'underline' : null
                                                }}
                                                onClick={() => {
                                                    if (column.isClickable) {
                                                        column.FooterFunc();
                                                    }
                                                }}
                                                className={column.className}
                                            >
                                                {column.Footer === 'Total' ? column.Footer : <p style={{ textAlign: 'right' }}>{rowsCount(column)}</p>}
                                            </td>
                                        ))}
                                    </tr>
                                </tfoot>
                            )}

                        </table>
                    </div>
                    <div style={{ display: 'none' }}>
                        <table id="export-table-for-excel">
                            <thead>
                                {(headerName !== '' && headerName !== null && headerName !== undefined) && (<>
                                    <tr>
                                        <th colSpan={lowLevelColumnCount}>{headerName}</th>
                                    </tr>
                                </>)}
                                {headerGroups.map((headerGroup, index) => (
                                    <tr key={index} {...headerGroup.getHeaderGroupProps()}>
                                        {headerGroup.headers.map((column, index) => (
                                            <th key={index} {...column.getHeaderProps(column.getSortByToggleProps())} >
                                                {column.render('Header')}
                                                <span>
                                                    {column.isSorted
                                                        ? column.isSortedDesc
                                                            ? ' 🔽'
                                                            : ' 🔼'
                                                        : ''}
                                                </span>
                                            </th>
                                        ))}
                                    </tr>
                                ))}
                                {/* <tr>
                                    {columns.map((col, index) => (
                                        <th key={index}>{col.Header}</th>
                                    ))}
                                </tr> */}
                            </thead>
                            <tbody>
                                {rows.map((row, rowIndex) => {
                                    prepareRow(row);
                                    return (
                                        <tr key={rowIndex}>
                                            {row.cells.map((cell, cellIndex) => (
                                                <td key={cellIndex}>{cell.value}</td>
                                            ))}
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </jnb.Col>
                {paginationCount !== "All" && (
                    <jnb.Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={12}>
                        <div className="pagination mt-2">
                            <button type='button' onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}><CgPushChevronRight size={21} /></button>&emsp;
                            <button type='button' onClick={() => nextPage()} disabled={!canNextPage}><FaChevronRight /></button>&emsp;
                            <button type='button' onClick={() => previousPage()} disabled={!canPreviousPage}><FaChevronLeft /></button>&emsp;
                            <button type='button' onClick={() => gotoPage(0)} disabled={!canPreviousPage}><CgPushChevronLeft size={21} /></button>&emsp;
                            <span>&emsp;{startItemNumber}-{endItemNumber} of <strong>{totalItems}</strong>&emsp;</span>
                            <select value={pageSize} onChange={e => { setPageSize(Number(e.target.value)); }} >
                                <option value={rows.length}>All</option>
                                <option value="10">10</option>
                                <option value="20">20</option>
                            </select>
                            Rows per page : &emsp;
                        </div>
                    </jnb.Col>
                )}
            </jnb.Row>
        </React.Fragment >
    );
}
