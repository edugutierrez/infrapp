$('.boxInfo').append('<table></table>')
$(`main a:contains(NUEVO)`).click(()=>{newTK()})
$(`main a:contains(SUPERADOS)`).click(()=>{open('https://drive.google.com/drive/folders/10cCpKRA-kqZLvEgxXcVs-k0DetcWWXXh','_blank')})
$(`main a:contains(ACTUALIZAR)`).click(async function(){
    const keys      = {id:{w:3},site:{w:12},progress:{w:10},item:{w:15},sub:{w:15},creado:{w:5},obs:{w:40}}
    keys.id.f       = (e)=>`<a onclick=window.open('?getTK=${e.id}','_blank')>${e.id}</a>`;
    keys.progress.f = (e)=>{
        const it = {intendente:{supervisado:['cerrar','reabrir']},
                    tecnico:{nuevo:['gestionar','cotizar']},
                    help:{gestionado:['supervisar'],reabierto:['supervisar']}}
                    [login.perfil][e.progress]
        return it? $('<a></a>').text(e.progress.toUpperCase()).click(r=>upTK({log:{action:it},data:{id:e.id}})):e.progress.toUpperCase()
    };
    $.getScript("js/03 tableMaker.js",()=>{makeTable('openTK',keys)})
}).click()

/*CREAR NUEVO TICKET DESDE 0*/
async function newTK(idqr){

    let   send   = {log:{action:'nuevo'},data:{site:localStorage.site}}
    if(login.perfil == 'tecnico'){send.log.action = 'gestionado'}
    Swal.fire({html:`<strong>vamos a crear un tk ${idqr? `<br>${idqr}`:''}</strong><br>`,
               showCloseButton:true,confirmButtonText:'avancemos!',preConfirm:()=>{upTK(send)}});
    inSelect('site',Object.keys(login.cfg.SITES))
    if(localStorage.site){
        $(`#site option:contains("${localStorage.site}")`).attr("selected",true);
        inSelect('item',Object.keys(login.cfg.APPS.TK))
    }
    $('.swal2-actions').hide();

    function inSelect(id,db){
        if(!$(`#${id}`).html()){
            $('#swal2-html-container').append(`<br><select id=${id}><option disabled selected>selecciona ${id}</option>${db.map(r=>`<option>${r}</option>`)}</select><br>`);    
            $('#'+id).change(function(){
                if(this.id == 'site'){  localStorage.site = this.value;
                                        inSelect('item',Object.keys(login.cfg.APPS.TK))}
                else if(this.id == 'item'){inSelect('sub',Object.keys(login.cfg.APPS.TK[this.value]))}
                else if(this.id == 'sub'){
                    if(login.cfg.APPS.TK[send.data.item][this.value].qr){
                        send.data.qrop = 'OK';
                        if(idqr){   $('#swal2-html-container').append('<a>'+idqr+'</a>');
                                    send.data.qr = idqr;
                                    $('.swal2-actions').show()}
                        else{       inSelect('qr',login.cfg.SITES[send.data.site].equipos)}
                        $('#swal2-html-container').append('<label><input type="checkbox" id="cbox1" checked="checked">Equipo Operativo?</label>')
                        $('#swal2-html-container input[type=checkbox]').change(function(){send.data.qrop = this.checked? 'OK':'FS'})
                    }
                    else{$('#swal2-html-container').append($('<input type=number id=q placeholder=cantidad>').change(function(){send.data.q = this.value;$('.swal2-actions').show()}))}
                }
                else if(this.id == 'qr'){$('.swal2-actions').show()}
                send.data[this.id] = this.value;
                $('#'+this.id).prop('disabled',true);
            })
        }
    }
}
//GESTIONAR TICKET
async function upTK(send){
    
    send.log.user = login.email;
    Swal.fire({html:'<div id=title><strong>GESTIONAMOS: </strong></div>',showCloseButton:true,confirmButtonText:'enviar!',
        preConfirm:()=>{
            if(login.perfil == 'tecnico' && send.data.time == undefined){Swal.showValidationMessage('complete el tiempo')}
            else{
                Swal.showValidationMessage('...cargando datos...');$(".swal2-confirm").hide();
                $("#swal2-html-container").append('<div class="swal2-loader" style="display:inline-block"></div>')
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
                   .append(`<br><select>${send.log.action.map(r=>'<option>'+r+'</option>')}</select>`)
        $('#title select').change(function(){send.log.action = this.value})
        send.log.action = send.log.action[0]
    }
    else{$('#title').append('nuevo ticket')}
    
    $('#swal2-html-container').append($('<a><img width=50% src="/img/camera.jpg"><br>una buena foto ayuda!</a><br>').click(function(){
        $('<input type=file></input>').change(function(){
            $('a img').attr('src',window.URL.createObjectURL(this.files[0]))
            setTimeout(()=>{send.log.file = resizePhoto($('a img').get(0))},500)
        }).click()
    }))
    if(login.perfil == 'tecnico'){$('#swal2-html-container').append($('<input type=number id=t placeholder="tiempo (minutos)">').change(function(){send.data.time = this.value}))}
    $('#swal2-html-container').append($('<textarea placeholder="las aclaraciones son importantes"></textarea>').change(function(){send.log.obs = this.value}))
}