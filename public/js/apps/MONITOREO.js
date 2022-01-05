$('.boxInfo').append('<table></table>')
$(`main a:contains(STATUS)`).click(function(){
    const keys = {id:{w:3},site:{w:12},progress:{w:10},equipo:{w:10},sector:{w:15},tipo:{w:5}}
    keys.id.f = (e)=>{
        return $('<a></a>').text(e.id).click(r=>{
            let swal  = {title:'EQUIPO '+e.id,showCancelButton:true,cancelButtonText:'poster!',showCloseButton:true,confirmButtonText:'bitacora',denyButtonText:'gestionar',showDenyButton:true,showCloseButton:true}
            Swal.fire(Object.assign(swal,{
                preConfirm:()=>{open('https://infrapp.web.app?idqr='+e.id,'_blank')},
                preDeny:()=>{$.getScript("js/apps/TICKET.js",()=>{newTK(e.id)})},
            }))
            $('.swal2-cancel').click(()=>{
                Swal.mixin({toast:true,showConfirmButton:false,timer:10000}).fire({title:'generando poster'});Swal.showLoading()
                $.post(api,{action:'posterQR',id:e.id},(x)=>{Swal.close();open('https://docs.google.com/spreadsheets/d/1Ru2BGqKOID0OOuFl3I6ZBZ6kUNZcQlPAx_v551vs-eI/export?format=pdf&gid=585816309&size=A4&portrait=true&scale=1','_blank')})
            })
        })
    }
    $.getScript("js/03 tableMaker.js",()=>{makeTable('getMonitor',keys)})
}).click()