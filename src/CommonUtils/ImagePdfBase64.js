import Swal from "sweetalert2";
import { config } from "./CommonApis";
import { CommonAxiosPostLogin } from "./CommonAxios";
import { InfoAlert } from "./SweetAlerts";

//pdf*********************************************
const SUPPORTED_FORMATS_FILES = ['image/jpg', 'application/pdf', 'image/jpeg'];
const VIDEO_SUPPORTED_FORMATS = ['video/mp4', 'video/avi'];

const MAX_FILE_SIZES = 104857600; // 100 MB in bytes
const MAX_VIDEO_SIZES = 31457280; // 30MB in bytes

function validateFileTypeAndSizes(customefile) {
    let errormsg = "";
    // if (customefile.size > MAX_FILE_SIZES) {
    //     errormsg = "Please Check your file size, it should be less than 1MB\n";
    // }
    // if (!SUPPORTED_FORMATS_FILES.includes(customefile.type)) {
    //     errormsg += "File format is invalid, Please upload only .jpg or .jpeg or .pdf files";
    // }
    // if (errormsg === "") {
    //     return true;
    // } else {
    //     //alert(errormsg);
    //     InfoAlert(errormsg, "info");
    //     return false;
    // }
    // console.log("customefile.type", customefile.type)
    if (customefile.type === 'video/mp4' || customefile.type === 'video/avi') {
        if (customefile.size > MAX_VIDEO_SIZES) {
            errormsg = "Please Check your file size, it should be less than 30MB\n";
        }
        if (!VIDEO_SUPPORTED_FORMATS.includes(customefile.type)) {
            errormsg += "File format is invalid, Please upload only video/mp4, video/avi";
        }
        if (errormsg === "") {
            return true;
        } else {
            InfoAlert(errormsg, "info");
            return false;
        }
    } else {
        if (customefile.size > MAX_FILE_SIZES) {
            errormsg = "Please Check your file size, it should be less than 1MB\n";
        }
        if (!SUPPORTED_FORMATS_FILES.includes(customefile.type)) {
            errormsg += "File format is invalid, Please upload only .jpg or .jpeg or .pdf files";
        }
        if (errormsg === "") {
            return true;
        } else {
            InfoAlert(errormsg, "info");
            return false;
        }
    }
}


// export default function ImagePdfBase64(e, formIk, name, hiddenValue) {
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
export default function ImagePdfBucket(e, formIk, path, name, filename) {
    e.preventDefault();
    const file = e.target.files[0]; // Original file
    console.log("--s" + file);
    const type = file.type.split("/")[1]; // file type
    // const newFileName = filename + "." + type; // New file name
    const newFileName = `${filename}.${type}`;//filename + "." + type; // New file name
    console.log("--s" + type);
    console.log("----new=", newFileName);
    const modifiedFile = new File([file], newFileName, { type: file.type });


    console.log("----mod=", modifiedFile)

    if (validateFileTypeAndSizes(file)) {
        return new Promise((resolve, reject) => {
            const formData = new FormData();
            formData.append("file", modifiedFile);
            CommonAxiosPostLogin(config.url.FILE_UPLOAD_URL + path, formData).then((response) => {
                resolve(response.data)
                if (response?.data !== undefined) {
                    let data = response?.data
                    let cleanedData = data.replace(/\s+/g, '');
                    console.log(cleanedData);
                    formIk.setFieldValue(name, cleanedData);
                } else {
                    Swal.fire({
                        text: "Image/pdf Upload Failed",
                        icon: "warning",
                        backdrop: true,
                        allowOutsideClick: false,
                    }).then((refresh) => {
                        if (refresh.isConfirmed) {
                            formIk.setFieldValue(name, "");
                        }
                    })
                }
            }).catch((error) => {
                console.log("error at imagebucket", error)
                resolve(null);
            });

        });
    } else {
        e.target.value = '';
    }
}