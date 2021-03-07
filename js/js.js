
window.addEventListener('scroll', parallax , true);





function parallax(){
    const parallax = document.querySelector('.parallax');
    const parallaxsub = document.querySelector('.parallax-1');

    let scrollposition = window.pageYOffset;
    console.log(scrollposition);

    if(scrollposition >= 900){
        var menu = document.getElementById('menu-a');
        menu.style.filter = 'invert(0)'
    }else{
        var menu = document.getElementById('menu-a');
        menu.style.filter = 'invert(1)';
    }
    
    parallax.style.transform = 'translateY(' + scrollposition *.9 + 'px)';
    parallaxsub.style.transform = 'translateY(' + scrollposition *.9 + 'px)';

    if(scrollposition >= 100){

        parallaxsub.style.opacity = '0';
    }else{
        parallaxsub.style.opacity = '1';
    }

}



window.onload = initialize;
var newvisitor;
var refVisitante;
var tbody;
var CREATE = "Añadir visita"
var MODIFICAR = "Modificar visita"
var modo = CREATE;
var refEditar;
var databaseRef;

function initialize() {
    newvisitor = document.getElementById('new-visitor');
    newvisitor.addEventListener('submit', enviarfirebase, switchtocreate ,   false);

  

    tbody = document.getElementById('tbody');

    refVisitante = firebase.database().ref().child("nuevoVisitante");

    mostrarVisitantes();

   
    databaseRef = firebase.database().ref().child("Image");

 



    var menutoggle = document.querySelector('.menu');
    

    menutoggle.addEventListener('click' , openmenu , false);


    
    
}

function openmenu(){
    var menu = document.querySelector('.main-navigation');

    if(menu.classList.contains('hidden')){
        var menu = document.querySelector('.main-navigation');
        
        menu.classList.remove('hidden');
        menu.classList.add('fadeInLeft');
    }else{
        var menu = document.querySelector('.main-navigation');
        menu.classList.add('fadeInLeft');
        menu.classList.add('hidden');

    }
    
}

function switchtocreate(){
    var button = document.getElementById('new-visitor-btn');
    if(button.value === MODIFICAR){
        button.value = CREATE;
        modo = CREATE;
    }
    
    
}

function abrirmodal(){
    event.preventDefault()
    var signinModal = document.getElementById('signin-modal');
    var signinButton = document.getElementById('sign-in-button');
    signinModal.classList.toggle('hidden');
    signinButton.classList.toggle('hidden');

}





function mostrarVisitantes() {
    refVisitante.on("value", function (snap) {
        var datos = snap.val();
        var filas = "";
        for (var key in datos) {
            filas += "<tr>" +
                "<td>" + datos[key].Fecha + "</td>" +
                "<td>" + datos[key].Nombre + "</td>" +
                "<td>" + datos[key].Ubicación + "</td>" +
                "<td>" + datos[key].Comentario + "</td>" +
                "<td>" + datos[key].Valoración + "</td>" +

                '</td>' +
                '<td>' +
                '<button id="editCRUD" class="btn btn-primary editar crudbuttons hidden" data-visitante="' + key + '">' +
                '<i class="fas fa-edit"></i>' +
                '</button>' +
                '</td>' +

                '<td>' +
                '<button id="removeCRUD" class="btn btn-danger borrar crudbuttons hidden" data-visitante="' + key + '">' +
                '<i class="fas fa-trash"></i>' +
                '</button>' +
                '</td>' +
                "</tr>";
        }
        tbody.innerHTML = filas;
        if (filas != "") {
            var elementosEditables = document.getElementsByClassName('editar');
            for (var i = 0; i < elementosEditables.length; i++) {
                elementosEditables[i].addEventListener('click', editarVisitante, false);
            }
            var elementosBorrables = document.getElementsByClassName('borrar');
            for (var i = 0; i < elementosBorrables.length; i++) {
                elementosBorrables[i].addEventListener('click', borrarVisitante, false);
            }
        }
    })
}

function editarVisitante(event) {
    console.log('okeeey');
    event.preventDefault();
    var keyEditar = this.getAttribute('data-visitante');
    refEditar = refVisitante.child(keyEditar);
    refEditar.once('value', function (snap) {
        var datos = snap.val();
        document.getElementById('first-name').value = datos.Nombre;
        document.getElementById('country').value = datos.Ubicación;
        document.getElementById('commentary').value = datos.Comentario;
    })
    document.getElementById('new-visitor-btn').value = MODIFICAR;
    modo = MODIFICAR;

}
function borrarVisitante(event) {
    event.preventDefault();
    console.log('aquillegamos');
    var keyBorrar = this.getAttribute('data-visitante');
    var refBorrar = refVisitante.child(keyBorrar);
    refBorrar.remove();
    currentUser()
}





function enviarfirebase(event) {
    event.preventDefault();
    switch (modo) {
        case CREATE:
            f = new Date();
            n = (f.getDate() + "/" + (f.getMonth() +1) + "/" + f.getFullYear());

            refVisitante.push({
                Fecha: n,
                Comentario: event.target.commentary.value,
                Nombre: event.target.firstname.value,
                Ubicación: event.target.country.value,
                Valoración:event.target.formvaloracion.value,
            });
            break;
        case MODIFICAR:
            event.preventDefault();
            refEditar.update({
                Comentario: event.target.commentary.value,
                Nombre: event.target.firstname.value,
                Ubicación: event.target.country.value,
            });
            document.getElementById('new-visitor-btn').value = CREATE;
            modo = CREATE;

            break;
    }

    newvisitor.reset();
    currentUser();
}

function toggleVisitor(newvisitor) {
    var x = document.getElementById('newvisitor');
    x.classList.toggle('hidden');
    var z = document.getElementById('toggle-btn');

    if(z.innerText === 'Abrir'){
        z.innerText = 'Cerrar'
    }else{
        z.innerText = 'Abrir'
    }
}

