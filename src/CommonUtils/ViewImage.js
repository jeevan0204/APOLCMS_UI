import Swal from "sweetalert2";
import { config } from "./CommonApis";

// export function viewImage(filePath) {//fileName
//     const fileName = filePath.substring(filePath.lastIndexOf('/') + 1);
//     const fileExtension = fileName.split('.').pop();
//     if (fileExtension === "pdf") {
//         let file = config.url.FILE_DOWNLOAD_URL + filePath;
//         const newTab = window.open();
//         newTab.document.body.innerHTML =
//             `<iframe src="${file}" width="100%" height="100%"></iframe>`;
//     } else {
//         let file = config.url.IMG_DOWNLOAD_URL + filePath;
//         const swalPopup = Swal.fire({
//             html: `<img src="${file}" class="img-thumbnail" />`,
//             width: '80%',
//             showCloseButton: true,
//             showConfirmButton: false,
//             customClass: {
//                 content: 'custom-modal-content',
//             },
//         });
//         window.addEventListener('popstate', () => {
//             swalPopup.close();
//         });
//     }

// }
const showPDF = (imgg) => ConvertFileToBase64(imgg).then(base64Data => {
    const extractedData = base64Data.split(',')[1];
    const binaryData = atob(extractedData);
    const arrayBuffer = new ArrayBuffer(binaryData.length);
    const uint8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < binaryData.length; i++) {
        uint8Array[i] = binaryData.charCodeAt(i);
    }
    const blob = new Blob([uint8Array], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
}).catch(error => {
    console.error('Error:', error);
});
async function ConvertFileToBase64(fileUrl) {
    const response = await fetch(fileUrl);
    const blob = await response.blob();
    return await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    })
}
export function viewImage(fileName) {
    console.log("filename", fileName)
    let url = config.url.FILE_DOWNLOAD_URL + fileName;
    // let pdf_url = config.url.FILE_VIEW_URL + fileName;
    const dataType = fileName?.split(".")[1];

    if (dataType === "pdf" || dataType === "PDF") {
        showPDF(url);
        // const newTab = window.open();
        // newTab.document.body.innerHTML =
        //     `<embed src="${pdf_url}" class="pdf-embed" width="100%" height="100%"></embed>`;
    } else if (dataType === "text") {
        const newTab = window.open();
        newTab.document.body.innerHTML =
            `<embed src="${url}" width="100%" height="100%" ></embed>`;
    } else if (dataType === "mp4" || dataType === "avi" || dataType === "mov" || dataType === "mkv") {
        // Create a video element to view the video in a modal
        Swal.fire({
            html: `<video controls width="100%">
                     <source src="${url}" type="video/${dataType}">
                     Your browser does not support the video tag.
                   </video>`,
            width: '80%',
            showCloseButton: true,
            showConfirmButton: true,
            confirmButtonText: 'Download Video',
            customClass: {
                content: 'custom-modal-content',
            },
        }).then((result) => {
            if (result.isConfirmed) {
                // Trigger the download of the video
                const a = document.createElement('a');
                a.href = url;
                a.download = fileName;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
            }
        });
    } else {
        const swalPopup = Swal.fire({
            html: `<img src="${url}" class="img-thumbnail" />`,
            width: '80%',
            showCloseButton: true,
            showConfirmButton: false,
            customClass: {
                content: 'custom-modal-content',
            },
        });
        window.addEventListener('popstate', () => {
            swalPopup.close();
        });
    }
}

export function MultiImageView(fileNames) {

    const urls = fileNames.map(fileName => config.url.FILE_DOWNLOAD_URL + fileName);
    const dataTypes = fileNames.map(fileName => fileName.split(".")[1].toLowerCase());

    // Filter images (jpg, png, gif) and videos (mp4, webm, ogg)
    const mediaUrls = urls.map((url, index) => {
        const dataType = dataTypes[index];
        if (["jpg", "jpeg", "png", "gif"].includes(dataType)) {
            return { type: 'image', url };
        } else if (["mp4", "webm", "ogg"].includes(dataType)) {
            return { type: 'video', url };
        }
        return null;
    }).filter(media => media !== null);

    if (mediaUrls.length > 0) {
        // Create a gallery-like layout for both images and videos
        const galleryHtml = mediaUrls.map(media => {
            const downloadButton = `<a href="${media.url}" download class="btn btn-sm btn-primary" style="margin-top: 5px;">Download</a>`;

            if (media.type === 'image') {
                return `<div style="margin: 10px; text-align: center;">
                        <img src="${media.url}" class="img-thumbnail" />
                        ${downloadButton}
                    </div>`;
            } else if (media.type === 'video') {
                return `<div style="margin: 10px; text-align: center;">
                        <video controls class="img-thumbnail" style="max-width: 100%;">
                            <source src="${media.url}" type="video/${media.url.split('.').pop()}">
                            Your browser does not support the video tag.
                        </video>
                        ${downloadButton}
                    </div>`;
            } else {
                return null;
            }
        }).join("");

        Swal.fire({
            html: `<div style="display: flex; flex-wrap: wrap; max-width: 100%; justify-content: center;">${galleryHtml}</div>`,
            width: '40%',
            showCloseButton: true,
            showConfirmButton: false,
            customClass: {
                content: 'custom-modal-content',
            },
        });
    }


    // const urls = fileNames.map(fileName => config.url.FILE_DOWNLOAD_URL + fileName);
    // const dataTypes = fileNames.map(fileName => fileName.split(".")[1].toLowerCase());

    // // Filter images (jpg, png, gif) and videos (mp4, webm, ogg)
    // const mediaUrls = urls.map((url, index) => {
    //     const dataType = dataTypes[index];
    //     if (["jpg", "jpeg", "png", "gif"].includes(dataType)) {
    //         return { type: 'image', url };
    //     } else if (["mp4", "webm", "ogg"].includes(dataType)) {
    //         return { type: 'video', url };
    //     }
    //     return null;
    // }).filter(media => media !== null);

    // if (mediaUrls.length > 0) {
    //     // Create a gallery-like layout for both images and videos
    //     const galleryHtml = mediaUrls.map(media => {
    //         if (media.type === 'image') {
    //             return `<img src="${media.url}" class="img-thumbnail" style="margin: 10px;" />`;
    //         } else if (media.type === 'video') {
    //             return `<video controls class="img-thumbnail" style="margin: 10px; max-width: 100%;">
    //             <source src="${media.url}" type="video/${media.url.split('.').pop()}">Your browser does not support the video tag.</video>`;
    //         }
    //     }).join("");

    //     Swal.fire({
    //         // html: `<div style="display: flex; flex-wrap: wrap; justify-content: center;">${galleryHtml}</div>`,
    //         html: `<div style="display: flex; flex-wrap: wrap; max-width: 100%; justify-content: center;">${galleryHtml}</div>`,
    //         width: '40%',
    //         showCloseButton: true,
    //         showConfirmButton: false,
    //         customClass: {
    //             content: 'custom-modal-content',
    //         },
    //     });
    // }
}

// export function viewFile(fileName) { // upto now not used anywhere
//     let url = config.url.COMMONSERVICE_URL + "file-retrival-with-path";
//     const postValues = {
//         filepath: fileName
//     }
//     CommonAxiosPost(url, postValues).then((res) => {
//         if (res.data.status === true) {
//             let base64String = res.data.file;
//             const [dataType, data] = base64String.split(",");
//             const finalFileType = dataType.match(/\/(.+);/)[1];
//             if (finalFileType === "pdf") {
//                 const newTab = window.open();
//                 newTab.document.body.innerHTML =
//                     `<iframe src="${base64String}" width="100%" height="100%"></iframe>`;
//             }
//             else {
//                 const swalPopup = Swal.fire({
//                     html: `<img src="${base64String}" class="img-thumbnail" />`,
//                     width: '80%',
//                     showCloseButton: true,
//                     showConfirmButton: false,
//                     customClass: {
//                         content: 'custom-modal-content',
//                     },
//                 });
//                 window.addEventListener('popstate', () => {
//                     swalPopup.close();
//                 });
//             }
//         }
//         else {
//             alert("No Data Found")
//         }
//     })


// }


// export function viewBucketImage(fileName) { // not using bcz not working properly
//     let url = config.url.FILE_DOWNLOAD_URL + fileName;

//     const dataType = fileName.split(".")[1];
//     if (dataType === "pdf") {
//         const newTab = window.open();
//         newTab.document.body.innerHTML =
//             `<iframe src="${url}" width="100%" height="100%"></iframe>`;
//     }
//     else if (dataType === "text") {
//         const newTab = window.open();
//         newTab.document.body.innerHTML =
//             `<iframe src="${url}" width="100%" height="100%"></iframe>`;
//     }
//     else {
//         const swalPopup = Swal.fire({
//             html: `<img src="${url}" class="img-thumbnail" />`,
//             width: '80%',
//             showCloseButton: true,
//             showConfirmButton: false,
//             customClass: {
//                 content: 'custom-modal-content',
//             },
//         });
//         window.addEventListener('popstate', () => {
//             swalPopup.close();
//         });
//     }
// }


