function modifyCubeFile() {
    const projectName = document.getElementById('projectName').value;
    const look = document.getElementById('look').value;
    const lookCreatedBy = document.getElementById('lookCreatedBy').value;
    const colorspaceIn = document.getElementById('colorspaceIn').value;
    const colorspaceOut = document.getElementById('colorspaceOut').value;
    const drt = document.getElementById('drt').value;
    const lutSize = document.getElementById('lutSize').value;
    const file = document.getElementById('file').files[0];
  
    if (file) {
        const reader = new FileReader();
        reader.onload = function(event) {
            const cubeContent = event.target.result;

            try {
                calculatedLutSize = (lutSize === 'auto') ? calculateSize(cubeContent) : lutSize
            } catch (error) {
                alert(error)
            }

            const modifiedCubeContent =
            `#ProjectName ${projectName}\n#Look ${look}\n#ColorspaceIn ${colorspaceIn}\n#ColorspaceOut ${colorspaceOut}\n#DRT ${drt}\n#LookCreatedBy ${lookCreatedBy}\n#LUTSize ${calculatedLutSize}\n` +
            cubeContent;
  
            const modifiedFileName = `${projectName}_${look}_${colorspaceIn}_${colorspaceOut}_${calculatedLutSize}.cube`;
  
            downloadFile(modifiedCubeContent, modifiedFileName);
      };
      reader.readAsText(file);
    }
}
  
function downloadFile(content, fileName) {
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(content));
    element.setAttribute('download', fileName);
  
    element.style.display = 'none';
    document.body.appendChild(element);
  
    element.click();
  
    document.body.removeChild(element);
}

function calculateSize(content) {

    let count = 0
    let sizeInformation = null
    const floatsLinePattern = /(-?\d+(\.\d+([eE][+-]?\d+)?)?\s+){2}-?\d+(\.\d+([eE][+-]?\d+)?)?/
    const lutSizePattern = /LUT_3D_SIZE (\d{2})/
    let lines = content.split('\n')
    lines.forEach((line) => {
        if (floatsLinePattern.test(line)) {
            count++
        }
        if (lutSizePattern.test(line)) {
            sizeInformation = lutSizePattern.exec(line)[1]
        }
    })
    size = Math.cbrt(count)
    if (sizeInformation && size != sizeInformation) {
        throw new Error(`Inconsistency between LUT_3D_SIZE (${sizeInformation}) parameter and calculated size (${size})`)
    }

    return size
}