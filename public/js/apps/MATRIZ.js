
/*  ACCIONES DE BOTONES  */
$(`main a:contains(GALERIA)`).click(()=>open('https://drive.google.com/drive/folders/1ZsK9sE8wBUQDjd6qC1lOAnOIAZvWM_K5','_blank'))
$(`main a:contains(CREAR IGM)`).click(function(){
    Swal.mixin({toast:true,showConfirmButton:false}).fire({title:'... CREANDO IGM ...'});Swal.showLoading();
    $.post(api,{action:'getIgm',site:localStorage.site},(e)=>{Swal.close();open(JSON.parse(e).getIgm,'_blank')})
})
$(`main a:contains(IGMS)`).click(()=>open('https://drive.google.com/drive/folders/1HCCPnr9PngHQq29y6YXQtUuF1ldOf4Pv','_blank'))
$(`main a:contains(ARCHIVOS)`).click(()=>open('https://drive.google.com/drive/folders/17XfhaYj29Jc61aEeAUdegFl64YxsgaI_','_blank'))
    
    /*  OBTENGO MATRIZ  */
Swal.mixin({toast:true,showConfirmButton:false,timer:20000}).fire({title:'... wait ...'});Swal.showLoading();
$.post(scrp('AKfycbwDuCVNj2X1c_So3B4xpHUUoRVyAihGy59f1ISw7LuB_bNrNiNn_YK1LAPb_wXV2K8d'),{action:'getMatriz',id:new Date().getFullYear()},(e)=>{
    alert(JSON.parse(e))
    $(`main .boxInfo`).html(`<iframe src="https://spreadsheets1.google.com/spreadsheet/pub?key=${JSON.parse(e)}"></iframe>`);
    $(`main a:contains(GESTIONAR)`).click(()=>open(`https://docs.google.com/spreadsheets/d/${JSON.parse(e)}`,`_blank`))
    Swal.close()
})