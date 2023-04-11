window.onload = function() {
    //event.preventDefault();
    var subjectSel = document.getElementById("direction");
    // subjectSel.onchange = function() {
    //     console.log('object :>> ', subjectSel.value);
    //     window.location.href = '?sort='+subjectSel.value;
    // }
    subjectSel.addEventListener("change", (event) => {
        //console.log('event.target.value :>> ', event.target.value);
        window.location.replace("http://localhost:3001/?sort="+event.target.value);
        //subjectSel.value=event.target.value;
    })
}



