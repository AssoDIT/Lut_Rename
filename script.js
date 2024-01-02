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
  
        const modifiedCubeContent =
          `#ProjectName ${projectName}\n#Look ${look}\n#ColorspaceIn ${colorspaceIn}\n#ColorspaceOut ${colorspaceOut}\n#DRT ${drt}\n#LookCreatedBy ${lookCreatedBy}\n#LUTSize ${lutSize}\n` +
          cubeContent;
  
        const modifiedFileName = `${projectName}_${look}_${colorspaceIn}_${colorspaceOut}_${lutSize}.cube`;
  
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
  