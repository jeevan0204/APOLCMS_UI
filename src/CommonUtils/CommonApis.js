const protocol = window.location.protocol === "https:" ? "https" : "http";
const dev = {

    url: {

        COMMONSERVICE_URL: "http://172.16.115.34:8080/apolcmsapi/",

        FILE_DOWNLOAD_URL: "https://swapi.dev.nidhi.apcfss.in/socialwelfaredms/user-defined-path/file-download/bucket/jnbnivasdevuploads/jnbnivas2022/",
        FILE_UPLOAD_URL: "https://swapi.dev.nidhi.apcfss.in/socialwelfaredms/user-defined-path/file-upload/bucket/jnbnivasdevuploads/jnbnivas2022/",
        local_URL: `${protocol}://172.16.112.195:8008/apolcmsapi/`,

        // STAFF_URL: "https://swapi.dev.nidhi.apcfss.in/nivasstaffmanagement/",

    }
};
const local = {
    url: {

        COMMONSERVICE_URL: "http://172.16.115.34:8080/apolcmsapi/",
        COMMON_Dept_URL: "http://172.16.115.34:8080/apolcmsapi/",
        // FILE_UPLOAD_URL: "https://swapi.dev.nidhi.apcfss.in/socialwelfaredms/user-defined-path/file-upload/bucket/jnbnivasdevuploads/jnbnivas2022/",
        // FILE_DOWNLOAD_URL: "https://swapi.dev.nidhi.apcfss.in/socialwelfaredms/user-defined-path/file-download/bucket/jnbnivasdevuploads/jnbnivas2022/jnbNivas/apolcms/uploads/changerequests/1746439458028_ SectionOfficerChangeReqLetter.pdf",
        FILE_DOWNLOAD_URL: "https://swapi.dev.nidhi.apcfss.in/socialwelfaredms/user-defined-path/file-download/bucket/jnbnivasdevuploads/jnbnivas2022/",
        FILE_UPLOAD_URL: "https://swapi.dev.nidhi.apcfss.in/socialwelfaredms/user-defined-path/file-upload/bucket/jnbnivasdevuploads/jnbnivas2022/",
        local_URL: `${protocol}://172.16.112.195:8008/apolcmsapi/`,
    }

};
export const config = process.env.NODE_ENV === 'development' ? local : dev;