if(!$(`#GUARDIAS content`).html()){
    //Swal.mixin({toast:true,showConfirmButton:false,timer:20000}).fire({title:'... wait ...'});Swal.showLoading();
    $(`#GUARDIAS`).append(`<div class="boxLogo"><img src="img/logo2.png" style="margin:5%"></div><div class="boxHeader">
    <div style="width:50%"><h3>Gestion de Guardias</h3><img src="images/watch.png" style="margin:5%"></div>
    <div id=tableGuardia style="width:60%"></div></div>`);
    //$.post(api,{action:'openTK'},(e)=>{makeTable(JSON.parse(e).openTK,'tableGuardia');Swal.close()})
    $(`#GUARDIAS a:contains(NUEVO)`).click(function(){newWch()})
    $(`#GUARDIAS a:contains(SUPERADOS)`).click(function(){open('https://drive.google.com/drive/folders/1YMGoWGC4SPLvEdx8Xgj66ClLLp-ydwFF','_blank')})
    /*$(`#TICKET a:contains(ACTUALIZAR)`).click(function(){
        Swal.mixin({toast:true,showConfirmButton:false,timer:20000}).fire({title:'... wait ...'});Swal.showLoading();
        $.post(api,{action:'openTK'},(e)=>{makeTable(JSON.parse(e).openTK,'tableTicket');Swal.close()})
    }) */
}

async function newWch(){
    const lg = await DB.collection('infrapp').doc('login').get();
    let   send   = {user:lg.user.email}
    Swal.fire({html:'<strong>vamos a crear un tk</strong>',showCloseButton:true,confirmButtonText:'avancemos!',preConfirm:()=>{upTK(send)}});
    inSelect('site',Object.keys(lg.cfg.SITES))
    //alert(JSON.stringify(send))
    //"user":"cagutierrez@atento.com","site":"EJERCITO DEL NORTE","id":"1011","item":"Climatización","sub":"Contingencia de operacion","init":"27/10/2021  23:32","end":"27/10/2021  23:32","impacto":"Impacto en Operacion: 0","obs":"Esto es una prueba","asis":"presencial","duracion":"01:00"

    function inSelect(id,db){
        if(!$(`#${id}`).html()){
            $('#swal2-content').append(`<select id=${id}><option disabled selected>selecciona ${id}</option>${db.map(r=>`<option>${r}</option>`)}<select>`);    
            $('#'+id).change(function(){
                if(this.id == 'site'){  localStorage.site = this.value;
                                        inSelect('item',Object.keys(lg.cfg.APPS.TK))}
                else if(this.id == 'item'){inSelect('sub',Object.keys(lg.cfg.APPS.TK[this.value]))}
                else if(this.id == 'sub'){
                    if(lg.cfg.APPS.TK[send.data.item][this.value].qr){
                        send.data.qrop = 'OK';
                        if(idqr){   $('#swal2-content').append('<a>'+idqr+'</a>');
                                    send.data.qr = idqr;
                                    $('.swal2-actions').show()}
                        else{       inSelect('qr',lg.cfg.SITES[send.data.site].equipos)}
                        $('#swal2-content').append('<p><label><span> Equipo Operativo ?</span></label></p>')
                        $('#swal2-content label').prepend($('<input type="checkbox" checked="checked" hidden/>').change(function(){if(this.checked){send.data.qrop = 'OK'}else{send.data.qrop = 'FS'}}))
                    }
                    else{$('#swal2-content').append($('<input type=number id=q placeholder=cantidad>').change(function(){send.data.q = this.value;$('.swal2-actions').show()}))}
                }
                else if(this.id == 'qr'){$('.swal2-actions').show()}
                send.data[this.id] = this.value;
                $('#'+this.id).prop('disabled',true).formSelect();
            }).formSelect()
        }
    }
}

async function upTK(send){
   /*  const lg = await DB.collection('infrapp').doc('login').get()
    send.log.user = lg.user.email;
    Swal.fire({html:'<div id=title><strong>GESTIONAMOS: </strong></div>',showCloseButton:true,confirmButtonText:'enviar!',
        preConfirm:()=>{
            if(lg.user.perfil == 'tecnico' && send.data.time == undefined){Swal.showValidationMessage('complete el tiempo')}
            else{
                Swal.showValidationMessage('...cargando datos...');$(".swal2-confirm").hide();
                $(".swal2-content").append('<div class="swal2-loader" style="display:inline-block"></div>')
                //Swal.fire({html:JSON.stringify(send)})
                $.post(api,{action:'newTK',content:JSON.stringify(send)},(x)=>{
                    Swal.fire(JSON.parse(x));
                    table.updateData([{id:send.data.id,progress:JSON.parse(x).action}])
                })
            }
        }
    });
    if(send.data.id){
        $('#title').append($('<a>'+send.data.id+'</a>').click(()=>{open('https://infrapp.web.app?getTK='+send.data.id,'_blank')}))
        $('#title').append(`<select>${send.log.action.map(r=>'<option>'+r+'</option>')}</select>`)
        $('#title select').change(function(){send.log.action = this.value}).formSelect()
        send.log.action = send.log.action[0]
    }
    else{$('#title').append('nuevo ticket')}
    
    $('#swal2-content').append($('<a><img width=50% src="/img/camera.jpg"><br>una buena foto ayuda!</a><br>').click(function(){
        $('<input type=file></input>').change(function(){
            $('a img').attr('src',window.URL.createObjectURL(this.files[0]))
            setTimeout(()=>{send.log.file = resizePhoto($('a img').get(0))},500)
        }).click()
    }))
    if(lg.user.perfil == 'tecnico'){$('#swal2-content').append($('<input type=number id=t placeholder="tiempo (minutos)">').change(function(){send.data.time = this.value}))}
    $('#swal2-content').append($('<textarea placeholder="las aclaraciones son importantes"></textarea>').change(function(){send.log.obs = this.value})) */
}