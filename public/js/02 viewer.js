function viewer(e,mObj){
    $('body').html(`<div align=center><img src="img/zocalo.jpg" style="width:60%"/></div>
                    <main style="height:75hv !important"><h3>${e[1]}</h3></main>
                    <footer><img src="img/foother.png" style="width:60%" /></footer>`)
                    
    if(e[0] == `?idqr`){
        mObj = {data:[['site','sector','ubicacion'],['tipo','marca','modelo','potencia']],log:['time','item','user','obs','file']}
    }
    else if(e[0] == `?getTK`){
        mObj = {data:[['site','progress'],['item','sub','q','time']],log:['time','action','user','obs','file']}
    }
    
    Swal.mixin({toast:true,showConfirmButton:false,timer:20000}).fire({title:'... wait ...'});Swal.showLoading();

    $.post(api,{action:e[0].replace('?',''),id:e[1]},(r)=>{
        const id = JSON.parse(r);
        if(['?idqr','?getTK'].includes(e[0])){
            if(id.data.qr){$('main').append(`<h2>EQUIPO INVOLUCRADO: <a style="color:#499db9 !important">${id.data.qr}</a> </h2>`)
                           $('h2 a').click(()=>{open('https://infrapp.web.app?idqr='+id.data.qr,'_blank')})}
            
            mObj.data.forEach(n=>{
                const tbody = $('<table align=center style="width:50%"><tbody></tbody></table>')
                            .append(`<tr>${n.map(i=>'<th style="text-align:center">'+i.toUpperCase()+'</th>')}</tr>`)
                            .append(`<tr>${n.map(i=>'<td style="text-align:center">'+id.data[i]+'</td>')}</tr>`)
                $('main').append(tbody);
            })
            $('main').append(`<br><br><h2><strong>LOGS</strong></h2><table id=log align=center style="width:60%"><tbody></tbody></table>`)

            $('#log').append(`<tr>${mObj.log.map(i=>'<th>'+i.toUpperCase()+'</th>')}</tr>`)
            const log = (k,v)=>{if(k == 'file' && v){v = `<img src=img/camera.jpg width=20% onclick="window.open('${v}','_blank')">`};if(!v){v = ''};return v}
            $(`#log`).append(id.log.map(v=>$(`<tr></tr>`).append(mObj.log.map(k=>`<td>${log(k,v[k])}</td>`))))
        }
        else{
            
        }
        Swal.close()
    });
}