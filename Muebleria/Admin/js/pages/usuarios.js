$(document).ready(function(){

    var $sesion = sessionStorage.getItem("sesion");
    $(window).on("load", function () {
        $(".preloader").show();
        if ($sesion == "admin") {
            $(".preloader").hide();
        } else {
            $(".preloader").hide();
            sessionStorage.removeItem("sesion");
            window.location.href='http://localhost/muebleria/principal.php'; //cambiar cuando se suba al servidor por el URL del dominio
        }
    });

/* Llenado automatico de tabla*/

(function () {

    $.when(getUsuarios()/*peticion que devuelve todos los clientes etc*/).done(function (res) {

        console.log(res);
        const tableUsuarios = $("#tablausuarios").DataTable(); //Creacion de la tabla mediante tu ID 

        

        res.forEach(function (element, index){ //recorrido de la lista de objetos que te devuelve la consulta

            const id = `<td>${element.idUsuario}</td>`; //creacion de la primera columna.

            const nombre = `<td>${element.nombre}</td>`;//creacion de la segunda columna.

            const apellidos = `<td>${element.apellidos}</td>`; // creacion de la tercer columna

            const correo = `<td>${element.correo}</td>`; // creacion de la cuarta columna

            const telefono = `<td>${element.telefono}</td>`; // creacion de la quinta columna

            const botones = `<button type="button" class="btn btn-danger deleteUser" data-idUsuario=${element.idUsuario}><i class="fas fa-trash-alt"></i></button>`;

            

            //Insertamos las columnas en la tabla, en el orden que queremos que se muestre.

            tableUsuarios.row.add([id,nombre,apellidos,correo,telefono,botones]).draw(true);

        });

    });

})();

$("#tablausuarios").on("click", ".deleteUser", function () {
    let idUsuario = $(this).attr("data-idUsuario");
    console.log(idUsuario);
  Swal.fire({
        title: "Atención",
        text: "¿Seguro que desea eliminar este usuario?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Aceptar",
        cancelButtonText: "Cancelar",
        allowOutsideClick: false        }).then((result) => {
        if (result.value) {
            $(".preloader").show();
            $.when(deleteUser(idUsuario))
                .done(function (data) {
                    $(".preloader").hide();
                    Swal.fire({
                        title: "Éxito",
                        text: "El usuario se eliminó correctamente.",
                        icon: "success",
                        confirmButtonText: "Aceptar",
                        allowOutsideClick: false                        }).then((result) => {
                        location.reload();
                    });
                })
                .fail(function (jqXHR, textStatus, errorThrown) {
                    // console.log(jqXHR);                        // console.log(textStatus);                        // console.log(errorThrown);                        $(".preloader").hide();
                    Swal.fire({
                        title: "Error",
                        text: "Ha ocurrido un error.",
                        icon: "error",
                        confirmButtonText: "Aceptar",
                        allowOutsideClick: false                        });
                });
        }
    });
});




//peticion a tu servicio



function getUsuarios() {

    return $.ajax({

      url:"http://localhost:8080/api/usuarios/getUsuarios", //aqui va a ir las rutas que se obtuvieron del back, checa el ejemplo del login

      type: "GET",

      dataType: "json",

      contentType: "application/json"

    });

}
function deleteUser(idUsuario) {
    return $.ajax({
        url:"http://localhost:8080/api/usuarios/deleteUsuario/" + idUsuario,
        type: "POST",
        dataType: "json",
        contentType: "application/json"
    });
}
});

function sesion (){
    sessionStorage.removeItem("sesion");
    sessionStorage.removeItem("idUsuario");
        sessionStorage.removeItem("nombre");
        sessionStorage.removeItem("correo");
        sessionStorage.removeItem("telefono");
    window.location.href='http://localhost/muebleria/principal.php'; //cambiar cuando se suba al servidor por el URL del dominio
  }

