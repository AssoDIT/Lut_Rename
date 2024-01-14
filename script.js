//useful accessors
const projectName = document.getElementById('projectName');
const look = document.getElementById('look');
const lookCreatedBy = document.getElementById('lookCreatedBy');
const colorspaceIn = document.getElementById('colorspaceIn');
const colorspaceOut = document.getElementById('colorspaceOut');
const drt = document.getElementById('drt');
const lutSize = document.getElementById('lutSize');

//dynamic LUT content display variables
var lutLoaded = false;
var lutContent = "";
let lutFileUpload = document.getElementById("file");
let uploadMessage = document.getElementById("lutContentShow");

function modifyCubeFile() {
    //const projectName = document.getElementById('projectName').value;
    //const look = document.getElementById('look').value;
    //const lookCreatedBy = document.getElementById('lookCreatedBy').value;
    //const colorspaceIn = document.getElementById('colorspaceIn').value;
    //const colorspaceOut = document.getElementById('colorspaceOut').value;
    //const drt = document.getElementById('drt').value;
    //const lutSize = document.getElementById('lutSize').value;
    const file = document.getElementById('file').files[0];
  
    if (file) {
        const reader = new FileReader();
        reader.onload = function(event) {
            const cubeContent = event.target.result;

            try {
                calculatedLutSize = (lutSize.value === 'auto') ? calculateSize(cubeContent) : lutSize.value
            } catch (error) {
                alert(error)
                calculatedLutSize = 'ERROR'
            }

            const modifiedCubeContent =
            `# ProjectName: ${projectName.value}\n# Look: ${look.value}\n# ColorspaceIn: ${colorspaceIn.value}\n# ColorspaceOut: ${colorspaceOut.value}\n# DRT: ${drt.value}\n# LookCreatedBy: ${lookCreatedBy.value}\n# LUTSize: ${calculatedLutSize}\n` +
            cubeContent;
  
            const modifiedFileName = `${projectName.value}_${look.value}_${colorspaceIn.value}_${colorspaceOut.value}_${calculatedLutSize}.cube`;
  
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

    let size = 0
    let count = 0
    let sizeInformation = null
    let lutType = null
    const floatsLinePattern = /(-?\d+(\.\d+([eE][+-]?\d+)?)?\s+){2}-?\d+(\.\d+([eE][+-]?\d+)?)?/
    const lutSizePattern = /(LUT_3D_SIZE|LUT_1D_SIZE) (\d+)/
    let lines = content.split('\n')
    lines.forEach((line) => {
        if (floatsLinePattern.test(line)) {
            count++
        }
        if (lutSizePattern.test(line)) {
            sizeInformation = lutSizePattern.exec(line)[2]
            lutType = lutSizePattern.exec(line)[1]
            console.log(lutSizePattern.exec(line))
        }
    })
    
    if (lutType == 'LUT_3D_SIZE')
        size = (Math.cbrt(count))
    else if (lutType == 'LUT_1D_SIZE')
        size = count
    
    console.log(size)
    console.log("sizeInfo " + sizeInformation)
    if (sizeInformation && size != sizeInformation) {
        throw new Error(`Inconsistency between ${lutType} (${sizeInformation}) parameter and calculated size (${size})`)
    }

    return size
}

function getFiftyLines(content)
{
    let lines = content.split('\n');
    let cpt = 0;
    let croppedContent = "";
    lines.forEach((line) => {
        if (cpt == 100)
            return;
        
        croppedContent += line;
        croppedContent += '\n';
        cpt++;
    })
    return croppedContent;
}

lutFileUpload.onchange = function(event) 
{
    let input = event.target.files[0];
    if (input) 
    {
        const reader = new FileReader();
        reader.onload = function() 
        {
            const content = reader.result;
            lutContent = getFiftyLines(content);
            uploadMessage.innerText = lutContent + "\n" + "[...]";
            lutLoaded = true;
        };
        reader.readAsText(input, 'utf-8');
    }
}

var projetNameValue = "";
var lookValue = "";
var lookCreated;
var arrayValues = new Array(7);
arrayValues.forEach((elt, idx) => { this[idx] = ''});
arrayValues[2] = "# ColorspaceIn: " + colorspaceIn.value + "\n";
arrayValues[3] = "# ColorspaceOut: " + colorspaceOut.value + "\n";
arrayValues[4] = "# DRT: " + drt.value + "\n";
arrayValues[6] = "# LUTSize: " + lutSize.value + "\n";

const inputHandler = function(event) {
    allString = "";
    result = event.target.value;
    if (event.srcElement.id === "projectName")
        arrayValues[0] = "# ProjectName: " + result + "\n";
    else if (event.srcElement.id === "look")
        arrayValues[1] = "# Look: " + result + "\n";
    else if (event.srcElement.id === "colorspaceIn")
        arrayValues[2] = "# ColorspaceIn: " + result + "\n";
    else if (event.srcElement.id === "colorspaceOut")
        arrayValues[3] = "# ColorspaceOut: " + result + "\n";
    else if (event.srcElement.id === "drt")
        arrayValues[4] = "# DRT: " + result + "\n";
    else if (event.srcElement.id === "lookCreatedBy")
        arrayValues[5] = "# LookCreatedBy: " + result + "\n";
    else if (event.srcElement.id === "lutSize")
        arrayValues[6] = "# LUTSize: " + result + "\n";
    
    if (!lutLoaded)
        return;
    
    arrayValues.forEach((elt) => {
        allString += elt;
    });
    uploadMessage.innerText = allString + lutContent;
}

projectName.addEventListener('input', inputHandler);
look.addEventListener('input', inputHandler);
lookCreatedBy.addEventListener('input', inputHandler);
colorspaceIn.addEventListener('input', inputHandler);
colorspaceOut.addEventListener('input', inputHandler);
drt.addEventListener('input', inputHandler);
lutSize.addEventListener('input', inputHandler);