export const createImage= (url)=>
    new Promise((resolve ,reject)=>{
        const resim= new Image();
        resim.crossOrigin="anonymous";
        resim.onload=()=>resolve(resim);
        resim.onerror=(e)=> reject(e);
        resim.src=url;
    });


    export async function getResimKirpma(resimSrc,pixel){
        const resim= await createImage(resimSrc);
        const canvas= document.createElement("canvas");
        const ctx=canvas.getContext("2d");
;

      
        canvas.width=resim.width;
        canvas.height=resim.height;
        ctx.drawImage(resim,0,0);

        const croppedCanvas = document.createElement("canvas");
        const croppedCtx = croppedCanvas.getContext("2d");

        croppedCanvas.width = pixel.width;
        croppedCanvas.height = pixel.height;
        
        croppedCtx.drawImage(
        canvas,
        pixel.x,
        pixel.y,
        pixel.width,
        pixel.height,
        0,
        0,
        pixel.width,
        pixel.height
     );

     return new Promise((resolve, reject) => {
        croppedCanvas.toBlob(
        (blob) => {
        if (!blob) return reject(new Error("Crop işlemi başarısız (blob null)."));
            resolve(blob);
        },
      "image/jpeg",
      0.92
    );
  });
    }