
// saveBlob (assuming blob is in response data)
export function saveBlob(filename, response,rootElementToAttachTo) {
    if(window.navigator.msSaveOrOpenBlob) {
        var blob = response.data;
        window.navigator.msSaveBlob(blob, filename);
    } else {
        var contentType = response.headers['content-type'];
        var blob = response.data;
        var elem = window.document.createElement('a');
        elem.href = window.URL.createObjectURL(blob);
        elem.download = filename;       

        var rootElement = rootElementToAttachTo ? rootElementToAttachTo : document.body;
        rootElement.appendChild(elem);
        elem.click();        
    }
};
