import React, { useEffect, useState } from 'react'
import { MdMiscellaneousServices } from 'react-icons/md';
import { TbArrowsExchange } from 'react-icons/tb';
import { Menu, Sidebar, SubMenu, useProSidebar } from 'react-pro-sidebar';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

function SideBar({ children }) {

    const { collapseSidebar } = useProSidebar();
    const logindetails = useSelector((state) => state.reducers.loginreducer);

    const [roleId, setRoleId] = useState([]);
    const [showList, setShowList] = useState([]);

    useEffect(() => {
        if (logindetails?.userLoginDetials?.role) {
            setRoleId(JSON.stringify(logindetails?.userLoginDetials.role));
        }
    }, [logindetails]);

    useEffect(() => {
        let url = config.url.local_URL + "GetServices?role_id=" + roleId;
        CommonAxiosGet(url).then((res) => {
            if (res.data.status === true) {
                setShowList(res.data.data);

            } else {
                setShowList([]);
            }
        }).catch((error) => {
            console.error("Error fetching GetConselData :", error);
        });
    }, []);


    return (
        <>

            <div className='bg-white' style={{ display: 'flex' }}>
                <Sidebar defaultCollapsed={true}>
                    <Menu style={{ textAlign: 'left', fontSize: '13px' }}>
                        <button variant="dark" onClick={() => collapseSidebar()} style={{ width: '100%' }} >
                            <main> <p style={{ fontWeight: '600', opacity: '0.7', letterSpacing: '0.5px', fontSize: '12px', margin: '0px auto', padding: '10px' }}>
                                <TbArrowsExchange style={{ fontSize: "22px", Color: '#ffffff' }} />
                            </p></main></button>

                        {data ? (<>
                            <SubMenu
                                label={
                                    <Link to="/Dashboard" style={{ textDecoration: "none", color: "inherit" }}>
                                        Home
                                    </Link>
                                }
                                icon={<IoHome style={{ fontSize: "22px" }} />}
                            />
                        </>) : null}

                        <SubMenu label="Services" icon={<MdMiscellaneousServices style={{ fontSize: "22px" }} />}>
                            {Array.isArray(showList) && showList.length > 0 ? (
                                showList.map((data, i) => (
                                    <MenuItem
                                        key={i}
                                        component={<Link to={data?.service_url} />}
                                    >
                                        {data?.service_name}
                                    </MenuItem>
                                ))
                            ) : (
                                <HERBUI.Col xs={12}>
                                    <p>No services available.</p>
                                </HERBUI.Col>
                            )}
                        </SubMenu>
                        <SubMenu label="Reports" icon={<MdMiscellaneousServices style={{ fontSize: "22px" }} />}>
                            {Array.isArray(showList) && showList.length > 0 ? (
                                showList.map((data, i) => (
                                    <MenuItem
                                        key={i}
                                        component={<Link to={data?.service_url} />}
                                    >
                                        {data?.service_name}
                                    </MenuItem>
                                ))
                            ) : (
                                <HERBUI.Col xs={12}>
                                    <p>No services available.</p>
                                </HERBUI.Col>
                            )}
                        </SubMenu>

                    </Menu>

                </Sidebar >

                <Container fluid className='content-container  px-0' >
                    <Header />
                    <div className='p-4 ' style={{ height: '80vh' }}>{children}</div>
                </Container>
            </div >
        </>
    )
}

export default SideBar