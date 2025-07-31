import Swal from "sweetalert2";
import { config } from "./CommonApis";
import { CommonAxiosPostLogin } from "./CommonAxios";
import { InfoAlert } from "./SweetAlerts";

//pdf*********************************************
const SUPPORTED_FORMATS_FILES = ['application/pdf'];
const MAX_FILE_SIZES = 1000000;
function validateFileTypeAndSizes(customefile) {
    let errormsg = "";
    if (customefile.size > MAX_FILE_SIZES) {
        errormsg = "Please Check your file size, it should be less than 1MB\n";
    }
    if (!SUPPORTED_FORMATS_FILES.includes(customefile.type)) {
        errormsg += "File format is invalid, Please upload only .pdf files";
    }
    if (errormsg === "") {
        return true;
    }
    else {
        // alert(errormsg);
        InfoAlert(errormsg, "info");
        return false;
    }
}


// export default function OnlyPdfBase64(e, formIk, name, hiddenValue) {
//     e.preventDefault();
//     let fileValue = validateFileTypeAndSizes(e.target.files[0]);

//     if (fileValue) {
//         const filevalue = e.target.value;
//         const file = e.target.files[0];
//         formIk.setFieldValue(name, filevalue);

//         return new Promise((resolve, reject) => {
//             const reader = new FileReader();
//             reader.onload = (event) => {
//                 formIk.setFieldValue(hiddenValue, event.target.result);
//             };

//             reader.onerror = (err) => {
//                 reject(err);
//             };

//             reader.readAsDataURL(file);
//         });
//     }
//     else {
//         e.target.value = '';

//         formIk.setFieldValue(name, '');
//         formIk.setFieldValue(hiddenValue, '');

//     }

// }

// aws bucket
export default function onlyPdfBucket(e, formIk, path, name, filename) {


    e.preventDefault();
    const file = e.target.files[0]; // Original file
    const type = file.type.split("/")[1]; // file type
    const newFileName = filename + "." + type; // New file name
    const modifiedFile = new File([file], newFileName, { type: file.type });

    if (validateFileTypeAndSizes(file)) {
        return new Promise((resolve, reject) => {
            const formData = new FormData();
            formData.append("file", modifiedFile);
            // console.log("formdata",formData)
            CommonAxiosPostLogin(config.url.FILE_UPLOAD_URL + path, formData).then((response) => {
                resolve(response.data)

                //console.log("response>>>",response?.data)
                if (response?.data !== undefined) {
                    formIk.setFieldValue(name, response?.data);
                }
                else {
                    Swal.fire({
                        text: "Pdf Upload Failed",
                        icon: "warning",
                        backdrop: false,
                    }).then((refresh) => {

                        if (refresh.isConfirmed) {
                            formIk.setFieldValue(name, "");
                        }
                    })
                    // InfoAlert("Pdf Upload Failed","warning");
                }
            }).catch((error) => {
                console.log("error at pdf bucket", error)
                resolve(null);
            });

        });
    }
    else {
        e.target.value = '';
    }

}