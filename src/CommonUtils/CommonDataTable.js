import React from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import ToolkitProvider from 'react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit';
import paginationFactory from 'react-bootstrap-table2-paginator';
import ReactHtmlTableToExcel from 'react-html-table-to-excel';
import { FcPrint } from 'react-icons/fc';
import { SiMicrosoftexcel } from 'react-icons/si';
import usePrint from './usePrint';
import useSearch from './useSearch';
import * as jnb from 'react-bootstrap';
import { useState } from 'react';


const CommonDataTable = ({ data, columns, fileName }) => {
  const { componentRef, handlePrint } = usePrint({ title: fileName });
  const { searchTerm, filteredData, handleSearchChange } = useSearch(data);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const handleSizePerPageChange = (sizePerPage) => {
    if (sizePerPage === 'All') {
      setPageSize(data.length);
      setCurrentPage(1);
    } else {
      setPageSize(sizePerPage);
      setCurrentPage(1);
    }
  };
  const paginationOptions = {
    page: currentPage,
    sizePerPage: pageSize,

    onSizePerPageChange: handleSizePerPageChange,
    sizePerPageList: [
      { text: '5', value: 5 },
      { text: '10', value: 10 },
      { text: '15', value: 15 },
      { text: '30', value: 30 },
      { text: 'All', value: data.length }
    ]
  }
  return (
    <div className="outer-page-content-container">
      <div className="mt20 form-card-jnb pb-5" style={{ marginTop: "5px" }}>

        <div>


          <div className='pt-3'>
            {data.length > 0 ? (
              <ToolkitProvider
                keyField="sNo"
                data={searchTerm ? filteredData : data}
                columns={columns}
                search
              >
                {props => (
                  <>
                    <jnb.Row className='pb-4'>
                      <jnb.Col xs={4}>
                        <input
                          type="text"
                          id="searchBar"
                          placeholder="Search..."
                          className='form-control form-control-md'
                          value={searchTerm}
                          onChange={handleSearchChange}
                        />
                      </jnb.Col>
                      <jnb.Col xs={6}></jnb.Col>
                      <jnb.Col xs={2} className="float-end">
                        Print<FcPrint size={20} onClick={handlePrint} /> &nbsp;

                        <ReactHtmlTableToExcel id="test-table-xls-button" title='Download Excel'
                          className="pull-right d-inline mx-3 btn btn-success" table="table-to-xls"
                          filename={fileName} sheet="tablexls" buttonText=<SiMicrosoftexcel size={20} /> />
                      </jnb.Col>
                    </jnb.Row>

                    <BootstrapTable
                      id="table-to-xls"
                      ref={componentRef}
                      bootstrap4
                      pagination={paginationFactory(paginationOptions)}
                      // pagination={paginationFactory({ sizePerPage: 50 })}
                      {...props.baseProps}
                    />
                  </>
                )}
              </ToolkitProvider>
            ) : <p></p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommonDataTable;
