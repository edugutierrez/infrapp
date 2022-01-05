if (login.access.ACCESO.includes('control')) {
    $('.boxInfo').html('<sidebar></sidebar><div id=search></div><div id=data></div>')
    /*  CONSTRUYO MAIN  *//*  AGREGO INPUT DNI Y TEMPERTAURA  */
    $('<input type=number id=dni placeholder=DNI style="height:2%;width:30%;margin:1%"/>').keyup(async function (e) {
        if (this.value.length == 8) {
            const data = (await DB.collection('acceso').doc('db').get())[this.value]
            if (data) {
                $('#data').html(`<h3>${data[1]}<br>${data[2]}<br>${data[3]}<br>${data[4]}</h3><img src="${data[8]}" style="height:25vh">
                            <table align=center>${['CAPA', 'DDJJ', 'EPP'].map((r, n) => `<th width=25%>${r}<br><img style="height:10vh" src="${data[5 + n]}"/></th>`).join('')}</table>`)
            }
            else { $('#data').html(`<h3>INVITADO</h3>`) }
            $(`#search a.btn`).removeAttr('hidden');
            $('#tmp').focus();
        }
        else { $(`#search a.btn`).attr('hidden', true) }
    }).appendTo('#search')

    $('<input type=number id=tmp placeholder="T °C" style="height:2%;width:15%;margin:1%"/>').keyup((e) => {
        if (e.key == 'Enter' && $(`#dni`).val().length == 8) { $('#search a.btn').click() }
    }).appendTo('#search')

    /*  AGREGO BOTON    */
    $(`<br><a class="btn" hidden="true">registrar!</a>`).click(async function () {
        const ts = date();
        const data = (await DB.collection('acceso').doc('db').get())[$('#dni').val()]
        if (data) { DB.collection('acceso').doc('regs').update({ [ts]: [ts, $('#dni').val(), data[2], $('#tmp').val()] }) }
        else { DB.collection('acceso').doc('regs').update({ [ts]: [ts, $('#dni').val(), 'INVITADO', $('#tmp').val()] }) }
        $('#data').html(``); $('#dni').val(``); $('#tmp').val(``); $('#dni').focus()
        Swal.mixin({ toast: true, showConfirmButton: false, timer: 1000 }).fire({ title: '... cargado ...' });
        clearTimeout(timer);
        timer = setTimeout(async function () {
            const send = await DB.collection('acceso').doc('regs').get();
            Swal.mixin({ toast: true, showConfirmButton: false }).fire({ title: '... upload DB ...' }); Swal.showLoading();
            $.post(scrp('AKfycby37WdMLHE53wGhc8JLIQJKSvQhgz9VNQrMtmdKkbrqKuE2mgzZtgxI0BlgvlURhgU'), { action: 'upData', data: JSON.stringify(send), site: localStorage.site },
                () => { DB.collection('acceso').doc('regs').set({}); Swal.close() })
        }, 60000);
    }).appendTo('#search')
    /*  OBTENGO BASE DE DATOS */
    Swal.mixin({ toast: true, showConfirmButton: false }).fire({ title: '... download DB ...' }); Swal.showLoading();
    $.post(scrp('AKfycby37WdMLHE53wGhc8JLIQJKSvQhgz9VNQrMtmdKkbrqKuE2mgzZtgxI0BlgvlURhgU'), { action: 'getBase' }, (e) => {
        DB.collection('acceso').doc('db').set(Object.fromEntries(JSON.parse(e).getBase.map(r => [r[0], r])));
        DB.collection('acceso').doc('regs').get().then(r => { if (!r) { DB.collection('acceso').doc('regs').set({}) } })
        Swal.close()
    })
}

/**REPORTES */
$(`main a:contains(REPORTES)`).click(function () {
    const sites = `<select id=s><option disabled selected>selecciona site</option>${Object.keys(login.cfg.SITES).map(r=>`<option>${r}</option>`)}</select>`
    Swal.fire({html:`<h2>vamos a descargar</h2>${sites}<br><input type="month" id="date"><br>`,showCloseButton:true,showConfirmButton:false});
    $('select').change(() => {if($('#s').val() != null && $('#y').val() != null){$('.botonGetStarted').removeAttr('hidden')}})
    $(`<br><a class="botonGetStarted">descargar!</a>`).click(()=>{
        if($('#s').val() && $('#date').val()){
            const date = $('#date').val().split('-')
            $(`.botonGetStarted`).attr('hidden', true);
            $('#swal2-html-container').append('<br><div id=loader><div class="swal2-loader" style="display:inline-block"></div><br>descargando</div>')
            $.post(api,{action:'getAccFile',search:JSON.stringify({site:$('#s').val(),year:date[0],month:date[1]})},(e)=>{

            })  
        }
        else{Swal.showValidationMessage('...complete los campos...')}
        //$('#swal2-html-container').append('<br><br><div id=loader><div class="swal2-loader" style="display:inline-block"></div><br>descargando</div>')
        //$.post(api,{action:'getAccFile',search:JSON.stringify({site:$('#s').val(),year:$('#y').val()})},(e)=>alert(JSON.parse(e)))
        //alert(JSON.stringify({action:'getAccFile',search:{site:$('#s').val(),year:$('#y').val()}}))
    }).appendTo(`#swal2-html-container`)
})