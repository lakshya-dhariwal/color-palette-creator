
//query selectors
const colorDivs = document.querySelectorAll('.color');
const colorH1 = document.querySelectorAll('.color h1');
const lockBtn = document.querySelectorAll('.lock');
const lockLogo = document.querySelectorAll('.lock i');
const editBtn = document.querySelectorAll('.edit');

//hsl ctrls
const hslCtrlDivs = document.querySelectorAll('.hslControl');
const XbtnHsl = document.querySelectorAll('.x');
const sliders= document.querySelectorAll('.sliders');

//for saving 
const saveBtn = document.getElementById("save");
const saveForm = document.querySelector('.saveForm');
const xSaveBtn = document.querySelector('#xSave');
const submitSavebtn = document.querySelector('#submitSave');
const saveNameInput = document.querySelector('#name');


//for copying color to clipboard
const copyMssgDiv = document.querySelector('.copyMssg');
const copyColorSpan = document.querySelector('#copyColor');


const generateBtn = document.getElementById("generate");
//library
const libraryBtn = document.querySelector("#library");
const libraryMain = document.querySelector(".libraryMain");

const libraryContainer = document.querySelector('.libraryContainer');
const xLibrary = document.querySelector('.xLibrary');

//
let initialColors = [];
let savedPalettes = [];
let paletteNr;
const paletteObjects = JSON.parse(localStorage.getItem("palettes"));
if(paletteObjects){
    paletteNr =paletteObjects.length;

}
else{
    paletteNr = savedPalettes.length;
}


let library = {};
library.key = [];
let saveName = saveNameInput.value;




//functions
function lock(indexOfNodeList){
    lockBtn[`${indexOfNodeList}`].dataset.lock= 'True';

}
function unlock(indexOfNodeList){
    lockBtn[`${indexOfNodeList}`].dataset.lock= 'False';
}
function changeH1Contrast(heading,randomColor,index){
    if(randomColor.luminance()>0.5){
        //when luminance is close to 1 colour is very light so h1 should be dark
        heading.style.color = 'black';
        lockLogo[index].style.color = 'black';
        editBtn[index].style.color = 'black';
        hslCtrlDivs[index].style.color = 'black';
        
    }else if(randomColor.luminance()<0.5){
        //when luminance is close to 0 colour is very dark so h1 should be light
        heading.style.color = 'white';
        lockLogo[index].style.color = 'white';
        editBtn[index].style.color = 'white';
        hslCtrlDivs[index].style.color = 'white'; 
    }

}

function generateColor(){
    colorDivs.forEach((e,index)=>{
        if(lockBtn[index].dataset.lock== 'False'){
            let randomColor = chroma.random()
            const H1ofDiv = colorH1[index];
       
            e.style.background = randomColor;
            H1ofDiv.innerText = randomColor.hex();
            initialColors[index]= `${randomColor.hex()}`;
            
            changeH1Contrast( H1ofDiv,randomColor , index);
            //intialize sliders
            const color = chroma(randomColor);
            const sliders = e.querySelectorAll('.sliders');
            
            const hue = sliders[0];
            const brightness = sliders[1];
            const saturation = sliders[2];
            
            colorizeSliders(color,hue,brightness,saturation);
            

        }else if (lockBtn[index].dataset.lock == 'True'){
             
            
        }
    
        
        
    })
    
    
}

function colorizeSliders(color,hue,brightness,saturation ){
    //scale sat
    const noSat = color.set('hsl.s',0);
    const fullSat = color.set('hsl.s',1);
    const scaleSat = chroma.scale([noSat,color,fullSat]);
    const midBri = color.set('hsl.l',0.5);
    const scaleBri = chroma.scale(['black',midBri,'white']);
    

    
    //update input colors
    saturation.style.backgroundImage = `linear-gradient(to right , ${scaleSat(0)},${scaleSat(1)})`;
    brightness.style.backgroundImage = `linear-gradient(to right , ${scaleBri(0)},${scaleBri(0.5)},${scaleBri(1)})`;
    hue.style.backgroundImage = `linear-gradient(to right , rgb(204,75,75),rgb(204,204,75),rgb(75,204,75),rgb(75,204,204),rgb(75,75,204),rgb(204,75,204),rgb(204,75,75) `
}
function saveLocal(paletteObj){
    let localPalettes;
    if(localStorage.getItem('palettes') === null){
        localPalettes=[];
    }else{
        localPalettes = JSON.parse(localStorage.getItem("palettes"));
    }
    localPalettes.push(paletteObj);
    localStorage.setItem("palettes",JSON.stringify(localPalettes)); 
    //Generate the pallete for Library 
    const palette = document.createElement('div');
    palette.classList.add('custom-palette');
    const title = document.createElement('h4');
    title.innerText = paletteObj.name;
    const preview = document.createElement("div");
    preview.classList.add('small-palette');
    paletteObj.colors.forEach((smallColor)=>{
        const smallDiv = document.createElement('div');
        smallDiv.style.background = smallColor;
        console.log(smallColor);
        preview.appendChild(smallDiv);
    });
    const paletteBtn = document.createElement('button');
    paletteBtn.classList.add('paletteBtn');
    paletteBtn.classList.add(paletteObj.nr);
    paletteBtn.innerText = "Select";
    //attach event to btn
    paletteBtn.addEventListener('click', e=>{
        closeLibrary();
        const paletteIndex = e.target.classList[1];
        initialColors = [];
        savedPalettes[paletteIndex].colors.forEach((color,index)=>{
            initialColors.push(color);
            const H1ofDiv = colorH1[index];
            colorDivs[index].style.backgroundColor = color;
            console.log(color);
           
           H1ofDiv.innerText = color;

        })
        libraryInputUpdate();
    })
    //append to library
    palette.appendChild(title);
    palette.appendChild(preview);
    palette.appendChild(paletteBtn);
    libraryContainer.appendChild(palette);

}



function pageLoad(){
    generateColor();
    console.log('load...');
    getLocal();
}
//event listners
window.addEventListener('load', pageLoad );
generateBtn.addEventListener('click', generateColor);

lockBtn.forEach((e,index)=>{
    e.addEventListener('click',()=>{
        let logo = lockLogo[index];
        
        if(logo.classList.contains('fa-lock-open')){
           logo.classList.add( "fa-lock");
           logo.classList.remove("fa-lock-open");
           lock(index);
        }else if(logo.classList.contains('fa-lock')){
            logo.classList.add( "fa-lock-open");
            logo.classList.remove("fa-lock");
            unlock(index);
            
        }
    })
})

editBtn.forEach((e,index)=>{
    e.addEventListener('click',()=>{
        hslCtrlDivs[index].classList.add('edit');
        
    })
})
XbtnHsl.forEach((e,index)=>{
    e.addEventListener('click',()=>{
        hslCtrlDivs[index].classList.remove('edit');
        hslCtrlDivs[index].style.visiblity = 'hidden';
        
    })
})
saveBtn.addEventListener('click',()=>{
    saveForm.classList.remove('hidden');
})
xSaveBtn.addEventListener('click',()=>{
    saveForm.classList.add('hidden');
})
submitSavebtn.addEventListener ('click',()=>{
     saveForm.classList.add('hidden');
     const name = saveNameInput.value;
     const colors = [];
     colorH1.forEach(hex=>{
         colors.push(hex.innerText);
     })
     //Generate Object
     let paletteNr = savedPalettes.length ; 

     const paletteObj = {name:name,colors:colors, nr : paletteNr};
     savedPalettes.push(paletteObj);
     //save to locale storage
     saveLocal(paletteObj);
     saveNameInput.value="";
     console.log(`submit ${paletteObj}`);
    })
colorH1.forEach((e,index)=>{
    e.addEventListener('click',()=>{
        const copyColor = colorH1[index].innerText;
        copyMssgDiv.classList.remove('hidden');
        copyMssgDiv.style.visiblity = 'visible';
        navigator.clipboard.writeText(copyColor);
        copyColorSpan.innerText = copyColor;
        setTimeout(()=>{
            copyMssgDiv.classList.add('hidden');
        },800)
    })
});
libraryBtn.addEventListener('click', openLibrary);
xLibrary.addEventListener('click', closeLibrary);


//hsl input change color according to sliders
 
const hueInput = document.querySelectorAll('.hue-input');
hueInput.forEach((e,index)=>{
    e.addEventListener('input',()=>{
        hue = e.value;
        
        currentColor = initialColors[index];
        newColor = chroma(currentColor).set('hsl.h',hue);

        colorDivs[index].style.background = newColor
        colorH1[index].innerText = newColor;
    })
})
const satInput = document.querySelectorAll('.sat-input');
satInput.forEach((e,index)=>{
    e.addEventListener('input',()=>{
        sat = e.value;
        
        currentColor = initialColors[index];
        newColor = chroma(currentColor).set('hsl.s',sat);

        colorDivs[index].style.background = newColor
        colorH1[index].innerText = newColor;
    })
})
const briInput = document.querySelectorAll('.bri-input');
briInput.forEach((e,index)=>{
    e.addEventListener('input',()=>{
        bri = e.value;
        
        currentColor = initialColors[index];
        newColor = chroma(currentColor).set('hsl.l',bri);

        colorDivs[index].style.background = newColor;
        colorH1[index].innerText = newColor;
    })
})

function openLibrary(){
    
    libraryMain.classList.remove('hidden');
    libraryMain.style.visiblity = 'visible';
    xLibrary.style.visiblity='visible';

}
function closeLibrary(){
    
    libraryMain.classList.add('hidden');
    libraryMain.style.visiblity = 'hidden';

}

function getLocal(){
    if(localStorage.getItem('palettes')=== null){
        localPalettes = [];
        console.log('if run..');
    }else{
        console.log('else run...');
        const paletteObjects = JSON.parse(localStorage.getItem("palettes"));
        savedPalettes = [...paletteObjects];
        paletteObjects.forEach(paletteObj=>{
            console.log('forEachrun...');
            //Generate the pallete for Library 
            const palette = document.createElement('div');
            palette.classList.add('custom-palette');
            const title = document.createElement('h4');
            title.innerText = paletteObj.name;
            const preview = document.createElement("div");
            preview.classList.add('small-palette');
            paletteObj.colors.forEach((smallColor)=>{
            const smallDiv = document.createElement('div');
            smallDiv.style.background = smallColor;
            console.log(smallColor);
            preview.appendChild(smallDiv);
        });
        const paletteBtn = document.createElement('button');
        paletteBtn.classList.add('paletteBtn');
        paletteBtn.classList.add(paletteObj.nr);
        paletteBtn.innerText = "Select";
        //attach event to btn
        paletteBtn.addEventListener('click', e=>{
            closeLibrary();
            const paletteIndex = e.target.classList[1];
            initialColors = [];
            paletteObjects[paletteIndex].colors.forEach((color,index)=>{
                initialColors.push(color);
                const H1ofDiv = colorH1[index];
                colorDivs[index].style.backgroundColor = color;
                console.log(color);
           
                H1ofDiv.innerText = color;
            })
            libraryInputUpdate();
         })
        //append to library
        palette.appendChild(title);
        palette.appendChild(preview);
        palette.appendChild(paletteBtn);
        libraryContainer.appendChild(palette);
        } ) 
    }}
