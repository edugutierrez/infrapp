async function makeTable(db,keys){
    
    DB.collection('infrapp').doc('tableOptions').get().then(res=>{if(!res){DB.collection('infrapp').doc('tableOptions').set({[db]:{}})}})
    
    Swal.mixin({toast:true,showConfirmButton:false}).fire({title:'... wait ...',position:'top-end'});Swal.showLoading();
    $.post(api,{action:db},(e)=>DB.collection('infrapp').doc(db).set({[db]:JSON.parse(e)}).then(()=>{Swal.close();make()}))

    if((await DB.collection('infrapp').doc(db).get())[db]){make()}

    async function make(){
      
        const data = (await DB.collection('infrapp').doc(db).get())[db]
        const th = ()=> Object.keys(keys).map(r=>`<th ${keys[r].w? `style="width:${keys[r].w}%"`:''}><input placeholder=${r}></th>`)
        
        if(!$(`.boxInfo table thead`).html()){$(`.boxInfo table`).html(`<thead><tr>${th().join('')}</tr></thead><tbody></tbody>`)}

        $(`.boxInfo table thead input`).keyup(function(){
            clearTimeout(searcher)
            searcher = setTimeout(()=>{
                const srch   = Object.fromEntries($(`thead input`).map((r,n)=>[[n.placeholder,n.value]]).get());
                $('.boxInfo table tbody').html('');
                DB.collection('infrapp').doc('tableOptions').update({[db]:srch})
                data.forEach(r=>{
                    const proof = Object.keys(srch).map(i=>r[i]? r[i].toString().toLowerCase().includes(srch[i].toString().toLowerCase()):true)
                    if(!proof.includes(false)){
                        const td = Object.keys(keys).map(i=>$(`<td></td>`).append(keys[i].f ? keys[i].f(r):r[i]? r[i].toString():''))
                        $(`tbody`).append($(`<tr></tr>`).append(td))
                    }
                })
            },250)
        })
        DB.collection('infrapp').doc('tableOptions').get().then(res=>{
            $(`.boxInfo table thead input`).each((r,n)=> n.value = res[db][n.placeholder]? res[db][n.placeholder]:'')
            $(`table input`).first().keyup()
        })
        
    }
}