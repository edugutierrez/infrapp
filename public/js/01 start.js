const scrp   = (e) => `https://script.google.com/macros/s/${e}/exec?`;
const api    = 'https://script.google.com/macros/s/AKfycbw3qy7-47n6XYS4tEFnpcQbe0bwB6UMVzbDBmUInQO90EBx9PeV4oO7yyssfzGXeSWKJg/exec?';
const months = {Enero:0,Febrero:1,Marzo:2,Abril:3,Mayo:4,Junio:5,Julio:6,Agosto:7,Setiembre:8,Octubre:9,Noviembre:10,Diciembre:11};
let DB       = new Localbase('db'),timer,login,searcher;

$(document).ready(()=>{
    DB.collection('infrapp').doc('login').get().then(r=>r.user?DB.collection(`infrapp`).delete():'')
    setTimeout(()=>{$('body').html('recargue la web')},36000000); //Configuro Timer
    const e = window.location.search.split('=');
    if(['?idqr','?getTK','?getWaha'].includes(e[0])){$.getScript("js/02 viewer.js",()=>{viewer(e)})}
    else if(navigator.userAgent.match( /Android/i )){
        Swal.fire({title:'Es mejor si utilizas la App de Android',confirmButtonText:'instalar app',denyButtonText:'seguir en la web',showDenyButton:true,
                    preConfirm:()=>{open('https://drive.google.com/drive/folders/1b158aF93AafbBL9YMmw9ljhfeABWvI3f')},
                    preDeny:()=>{Landing()}
        })
    }else{Landing()}
})

async function Landing(e){
    if(e){await DB.collection('infrapp').doc('login').set(e)}
    login = await DB.collection('infrapp').doc('login').get();
        /*  CONSTRUYO INICIO DE SESION   */
    if(!login){
        $('body').html(`<div align=center style='margin-top:20%;margin-inline:35%;display:grid'>
                        <img src=img/logo.png style='margin-bottom:15%;justify-self:center'>
                        <input placeholder=user type=email><input type=password placeholder=password><br><br>
                        <a class="botonGetStarted" style="justify-self:center">log in!</a></div>`)
        $('input').keyup(function(e){if(e.key == 'Enter'){$('a.btn').click()}})
        $('a.botonGetStarted').click(function(){
            const data = {action:'login',user:$('input[type=email]').val(),pass:$('input[type=password]').val()}
            if(!data.user.includes('@') && data.pass.length < 4){Swal.mixin({toast:true,showConfirmButton:false,timer:2000}).fire({icon:'warning',title:'compruebe los campos'})}
            else{   Swal.mixin({toast:true,showConfirmButton:false}).fire({title:'... wait ...'});Swal.showLoading()
                    $.post(api,data,(e)=>{e != 'null'? Landing(JSON.parse(e)):Swal.fire({text:'usuario o contraseña incorrecto',icon:'warning'})})}
        })
    }
    else{
        /*  CONSTRUYO HOME PRINCIPAL   */
        $(`body`).html(`<nav id=nav class="bg-light"><div class="boxLogo"><h1>infrapp<small>.</small></h1></div></nav>
                        <main></main><footer><p>Departamento de Infraestructura y SSII<br>Atento Argentina</p></footer>`);
        /*  CONSTRUYO NAV Y SUS FUNCIONES   */
        $(`nav`).append([`HOME`,`TEAM`].concat(Object.keys(login.access)).map(r=>`<a>${r}</a>`));
        $('nav a').click(function(e){
            if($(this).text() == 'HOME'){Home()}
            else if(!localStorage.site){$(`.botonGetStarted`).click()}
            else{   const nav = Object.values(login.access[$(this).text()]).map(r=>`<a>${r.toUpperCase()}</a>`).join('');
                    $(`main`).html(`<nav style="color:white">${nav}</nav><div class="boxInfo"></div>`);
                    $.ajax({async:false,url:`js/apps/${$(this).text()}.js`,dataType:"script"})}
        })
        Home()
    }
    function Home(){
        $('main').html(`<img src="images/landing_1.png" style="width: 40%">
                        <div class="textosHeader"><h1>smart work</h1><div id=monitor></div></div>`)
        $(`.textosHeader`).append($(`<a class="botonGetStarted">opciones</a>`).click(()=>{
            Swal.fire({});
            const db = Object.keys(login.cfg.SITES).map(r=>`<option>${r}</option>`)
            Swal.fire({html:`<h2>mi cuenta</h2><div class=boxSel><select><option disabled selected>selecciona site</option>${db}</select></div><br>`,showCloseButton:true,showConfirmButton:false});
            if(localStorage.site){$(`select option:contains("${localStorage.site}")`).attr("selected",true)}
            $('#swal2-html-container').append($(`<p>change pass!</p>`).click(()=>{
                Swal.fire({title:'cambiemos el password',showCloseButton:true,html:'<input id="o" type=password placeholder="anterior"><input id="n" type=password placeholder="nuevo">',
                           preConfirm:()=>{
                               Swal.showLoading();
                               $.post(api,{action:'changePass',user:login.email,old:$('#o').val(),nw:$('#n').val()},x => Swal.fire(JSON.parse(x)))
                           }})
            }))
            $('#swal2-html-container').append($(`<p>log out!</p>`).click(()=>{Swal.fire({
                title:"cerramos sesion?",showCancelButton:true,preConfirm:()=>{DB.collection(`infrapp`).delete();localStorage.clear();location.reload()}})}))
            $('#swal2-html-container select').change(function(){localStorage.site = this.value;Swal.close();monitor()})
        }))
        const monitor = () => {
            const equipos = login.cfg.SITES[localStorage.site]
            $('#monitor').html(Object.keys(equipos.ups).map(r=>`<p><a target=_blank href=${equipos.ups[r]}>${r}</a></p>`))
                         .append(`<p><a target=_blank href=${equipos.ambiental}>CONTROL AMBIENTAL</a></p>`)}
        if(localStorage.site){monitor()}
    }  
}

function resizePhoto(e){
    let canvas = $('<canvas width=500 height=500 />')
    canvas.get(0).getContext('2d').drawImage(e,0,0,500,500)
    return canvas.get(0).toDataURL('image/jpeg').replace(/^data:(.*;base64,)?/, '');
}
const date = () => `${new Date().getDate()}/${new Date().getMonth()+1}/${new Date().getFullYear()} ${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}`