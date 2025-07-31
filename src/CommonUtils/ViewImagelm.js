import { config } from '../CommonUtils/CommonApis'

export function viewBucketImage(fileName) {
    let url = config.url.FILE_DOWNLOAD_URL + fileName;

    const dataType = fileName?.split(".")[1];
    if (dataType === "pdf") {
        showPDF(url)

    }
    else if (dataType === "text") {
        const newTab = window.open();
        newTab.document.body.innerHTML =
            `<iframe src="${url}" width="100%" height="100%"></iframe>`;
    }

}
const showPDF = (imgg) => ConvertFileToBase64(imgg)
    .then(base64Data => {
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
    })
    .catch(error => {
        console.error('Error:', error);
    });
async function ConvertFileToBase64(fileUrl) {
    const response = await fetch(fileUrl);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    })
}