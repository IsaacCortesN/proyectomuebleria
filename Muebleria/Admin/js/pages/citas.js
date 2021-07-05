
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

    (function () {

        $.when(getRelaciones()/*peticion que devuelve todos las citas etc*/).done(function (res) {
    
            console.log(res);
            const tableCitas = $("#tablacitas").DataTable(); //Creacion de la tabla mediante tu ID 
    
            
    
            res.forEach(function (element, index){ //recorrido de la lista de objetos que te devuelve la consulta
    
                const id = `<td>${element.citas.idCita}</td>`; //creacion de la primera columna.
    
                const nombre = `<td>${element.usuario.nombre}</td>`;//creacion de la segunda columna.
    
                const apellidos = `<td>${element.usuario.apellidos}</td>`; // creacion de la tercer columna
    
                const fecha = `<td>${element.citas.fecha}</td>`; // creacion de la cuarta columna
    
                const hora = `<td>${element.citas.hora}</td>`; // creacion de la quinta columna

                const direccion = `<td>${element.citas.direccion}</td>`; // creacion de la quinta columna
    
                const boton1= `<td><button type="button" class="btn btn-danger deleteCita" data-idCita=${element.citas.idCita}><i class="fas fa-trash-alt"></i></button></td>`;
               
                //const boton2= `<td><button type="button" class="btn btn-warning editCita" data-idCita=${element.citas.idCita}><i class="fas fa-pencil-alt"></i></button></td> `;

    
                //Insertamos las columnas en la tabla, en el orden que queremos que se muestre.
    
                tableCitas.row.add([id,nombre,apellidos,fecha,hora,direccion,boton1]).draw(true);
    
            });
    
        });
    
    })();

    $("#tablacitas").on("click", ".deleteCita", function () {
        let idCita = $(this).attr("data-idCita");
        console.log(idCita);
        Swal.fire({
            title: "Atención",
            text: "¿Seguro que desea eliminar este Usuario?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Aceptar",
            cancelButtonText: "Cancelar",
            allowOutsideClick: false
        }).then((result) => {
            if (result.value) {
                $(".preloader").show();
                $.when(deleteCita(idCita))
                    .done(function (data) {
                        $(".preloader").hide();
                        Swal.fire({
                            title: "Éxito",
                            text: "El usuario se eliminó correctamente.",
                            icon: "success",
                            confirmButtonText: "Aceptar",
                            allowOutsideClick: false
                        }).then((result) => {
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
                            allowOutsideClick: false
                        });
                    });
            }
        });
    });

    function deleteCita(idCita) {
        return $.ajax({
            url:"http://localhost:8080/api/cita/deleteCitas/" + idCita,
            type: "POST",
            dataType: "json",
            contentType: "application/json"
        });
    }


    function getRelaciones() {

        return $.ajax({
    
          url:"http://localhost:8080/api/cita/getRelaciones", //aqui va a ir las rutas que se obtuvieron del back, checa el ejemplo del login
    
          type: "GET",
    
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