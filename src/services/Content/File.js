export const sendDownload = async (name, data) => {

    const element = document.createElement("a");

    const textFile = new Blob([
      JSON.stringify(data)
    ], {type: 'text/plain'}); 

    element.href = URL.createObjectURL(textFile);
    element.download = name;
    document.body.appendChild(element); 
    element.click();
}