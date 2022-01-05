const waha = 'https://script.google.com/macros/s/AKfycby3G2IVJ6NszBjd7x_c1xgrB7QLPfPAHDB7sLZ4aqHwjJWh48egHEBDGBs4_-AqdEEM/exec?'

$('.boxInfo').append('<table></table>')
$(`main a:contains(ACTUALIZAR)`).click(async function(){
    const keys    = {id:{w:3},site:{w:12},progress:{w:10},despacho:{w:10},activo:{w:15},tipo:{w:5},wsp:{w:10}}
    keys.activo.f = (e) => {
        const act = e.activo.map((r,n)=> r? ['CPU','MON','VIN','TEC','MOU','BAM' ][n]:'').join(' ').replace('CPU MON VIN TEC MOU','PC COMPLETA')
        return $(`<a>${act == '     '? 'OTRO':act}</a>`).click(r=>{
            Swal.mixin({toast:true,showConfirmButton:false}).fire({title:'... pdf ...',position:'top-end'});Swal.showLoading()
            $.post(waha,{action:'getPdf',id:e.id},(x)=>{open(JSON.parse(x).getPdf,'_blank');Swal.close()})
        })
    }
    keys.progress.f = function(e){
        const it = {intendente:{'DESPACHO SSII':['DESPACHADO','ENTREGADO','NO ENTREGADO','CANCELAR'],'DESPACHADO':['ENTREGADO','NO ENTREGADO','CANCELAR']}}
                   [login.perfil][e.progress]
        return it? $(`<a>${e.progress}</a>`).click(r=>{upWaha(e,it)}):e.progress
    }
    keys.id.f = (e) => $('<a></a>').text(e.id).click(r=>{upWaha(e)})
    $.getScript("js/03 tableMaker.js",()=>{makeTable('openWaha',keys)})
}).click()
$(`main a:contains(BUSCAR)`).click(()=>searchWaha({icon:'question',text:'busquemos por dni, id o apellido',}))

function upWaha(e,options){
    const send = {id:e.id,user:login.email}
    Swal.fire({
        html:`<div style="text-align:-webkit-center"><h2>vamos a gestionar<br><a target=_blank href="https://waha-infrapp.web.app/?waha=${e.id}">${e.id}</a></h2>
              <h2><a>pdf!</a></h2>
              <table>${[['empleado','site'],['progress','despacho']].map(r=>`<tr>${r.map(n=>`<th><p>${n}<br>${e[n]}</p></th>`).join('')}</tr>`).join('')}</table></div>
              <select><option disabled selected>seleccione</option>${options.map(r=>`<option>${r}</option>`)}</select><br><br></div>`,
              showCloseButton:true,confirmButtonText:'enviar!',
              preConfirm:()=>{
                //Swal.fire({text:JSON.stringify(send)})
                Swal.showValidationMessage('...cargando datos...');$(".swal2-confirm").hide();
                $("#swal2-html-container").append('<div class="swal2-loader" style="display:inline-block"></div>')
                $('#swal2-content img').click(function(){})
                $.post(waha,{action:'setWaha',content:JSON.stringify(send)},(x)=>{searchWaha(Object.values(JSON.parse(x))[0])})
        }
    })
    $(`#swal2-html-container a:contains(pdf!)`).click(()=>{
        $('#swal2-html-container').append('<br><div id=loader><div class="swal2-loader" style="display:inline-block"></div>generando remito</div>')
        $.post(waha,{action:'getPdf',id:e.id},(x)=>{$('#loader').remove();open(JSON.parse(x).getPdf,'_blank')})
    })
    $('#swal2-html-container select').change(function(){
        $(".swal2-confirm").show();
        $('#swal2-html-container select').prop('disabled',true);
        $('<textarea placeholder="las aclaraciones son importantes"></textarea>').change(function(){send.log = this.value}).appendTo('#swal2-html-container')
        send.action = this.value
        if(this.value == 'ENTREGADO'){
            $('#swal2-html-container').append(
                $('<br><img width=35% src="/img/camera.jpg"><br>carguemos el remito! (*jpg)<br>').click(function(){
                    $('<input type=file accept="image/jpeg"></input>').change(function(){
                        $('#swal2-html-container img').attr('src',window.URL.createObjectURL(this.files[0]))
                        setTimeout(()=>{send.file = resizePhoto($('#swal2-html-container img').get(0))},500)
                    }).click()
                })
            )
            $('#swal2-html-container img').click()
        }
        else{$('textarea').focus()}
    })
    $(".swal2-confirm").hide();
}

function searchWaha(e){
    Swal.fire(Object.assign(e,{showDenyButton:true,confirmButtonText:'buscar!',denyButtonText:'no por ahora!',
                preConfirm:()=>gestion(),preDeny:()=>$(`main a:contains(ACTUALIZAR)`).click()
    }))
    $("#swal2-html-container").append($(`<br><input id=input placeholder='busquemos'/>`).keyup((e)=>{if(e.key == 'Enter')gestion()}))
    $('#input').focus();
    function gestion (){
        const e = $(`#input`).val()
        if(isNaN(e) || e.length == 8){open(`https://infrapp.web.app/getWaha=${e}`,'_blank')}
        else if(e.length == 5){
            DB.collection('infrapp').doc('openWaha').get()
            .then(r=>{
                const id = r['openWaha'].filter(i=>i['id'] == e)[0];
                const it = {intendente:{'DESPACHO SSII':['DESPACHADO','ENTREGADO','NO ENTREGADO','CANCELAR'],'DESPACHADO':['ENTREGADO','NO ENTREGADO','CANCELAR']}}
                           [login.perfil][id.progress]
                if(it){upWaha(id,it)}
                else{open(`https://infrapp.web.app/getWaha=${e}`,'_blank')}
            })
            .catch(r=>{open(`https://infrapp.web.app/getWaha=${e}`,'_blank')})
        }
        else{Swal.showValidationMessage('controle lo ingresado')}
    }
}