
$(document).ready(function () {

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

        $.when(getRoles()/*peticion que devuelve todos los clientes etc*/).done(function (res) {

            console.log(res);
            const tableRoles = $("#tablaroles").DataTable(); //Creacion de la tabla mediante tu ID 



            res.forEach(function (element, index) { //recorrido de la lista de objetos que te devuelve la consulta

                const id = `<td>${element.idRol}</td>`; //creacion de la primera columna.

                const nombre = `<td>${element.nombre}</td>`;//creacion de la segunda columna.

                const correo = `<td>${element.correo}</td>`; // creacion de la cuarta columna

                const rol = `<td>${element.rol}</td>`; // creacion de la quinta columna

                const contrasena = `<td>${element.contrasena}</td>`; // creacion de la quinta columna

                const boton1 = `<td><button type="button" class="btn btn-danger deleteRoles" data-idRoles=${element.idRol}><i class="fas fa-trash-alt"></i></button></td>`;

                //const boton2 = `<td><button type="button" class="btn btn-warning editRol" data-idRoles=${element.idRol}><i class="fas fa-pencil-alt"></i></button></td> `;

                const boton2 = "";

                const boton3 = `<td><button type="button" style= "display:none" class="btn btn-warning editCategoria" data-idRoles=${element.idRoles}><i class="fas fa-pencil-alt"></i></button></td> `;


                //Insertamos las columnas en la tabla, en el orden que queremos que se muestre.

                tableRoles.row.add([id, nombre, correo, rol,contrasena, boton1, boton2, boton3]).draw(true);

            });

        });

    })();

    $("#tablaroles").on("click", ".deleteRoles", function () {
        let idRoles = $(this).attr("data-idRoles");
        console.log(idRoles);
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
                $.when(deleteRoles(idRoles))
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

    $("#tablaroles").on("click", ".editRol", function () {
        $(".preloader").show();
        let idUSuarioE = $(this).attr("data-idroles");
        let id = document.querySelector("#guardarEdit"); //traemos el boton de guardar mediante ID
        id.dataset.idUsuario = idUSuarioE;//le asignamos el id Al boton de guardar
        console.log(idUSuarioE);

        $.when(getRoles()).done(function (roles) { //ejecutamos la peticion que nos regresa a los usuarios
            roles.forEach(function (rol) {
                if (rol.idRol == idUSuarioE) {
                    if (rol.rol == "Administrador") {
                        $("#editTipoRol").val(1);
                    } else {
                        $("#editTipoRol").val(2);
                    }
                    $("#contrasena").val(rol.contrasena);
                }
            });
        });
        $("#modalEditRol").modal("show");
        $(".preloader").hide();
    });

    $("#cerrarmodal").on("click", function () {
        $("#modalEditRol").modal("hide");
    });

    $("#modalEditRol").on("click", ".saveEdit", function () {
        let idUsuario = $(this).attr("data-id-usuario");
        Swal.fire({
            title: "Atención",
            text: "¿Seguro que desea editar el rol a este usuario?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Aceptar",
            cancelButtonText: "Cancelar",
            allowOutsideClick: false
        }).then((result) => {
            if (result.value) {
                $(".preloader").show();
                let datos = {};
                if ($("#editTipoRol").val() == 1 && $("#contrasena").val() ) {
                    datos = {
                        idRol: idUsuario,
                        rol: "Administrador",
                        contrasena: "",
                        //descripcionCategoria: $("#descripcion").val(),
                        //tipoCategoria: $("#tipo").val()
                    };
                } else {
                    datos = {
                        idRol: idUsuario,
                        rol: "Cliente"
                    };
                }

                //Creas tu objeto JSON que se insertara en la DB
                $.when(updateUserRol(datos))
                    .done(function (data) {
                        setTimeout(function () {
                            $(".preloader").hide()
                        }, 9000);
                        Swal.fire({
                            title: "Éxito",
                            text: "El rol del usuario se editó correctamente.",
                            icon: "success",
                            confirmButtonText: "Aceptar",
                            allowOutsideClick: false
                        }).then((result) => {
                            location.reload();
                        });
                    })
                    .fail(function (jqXHR, textStatus, errorThrown) {
                        // console.log(jqXHR);
                        // console.log(textStatus);
                        // console.log(errorThrown);
                        $(".preloader").hide();
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

    $("#addrol").on("click", function (){ 
        $("#modalAgregarRol").modal("show");
    });

    $("#cerrar").on("click", function (){ 
        $("#modalAgregarRol").modal("hide");
    });

    $("#guardarAdd").click(function () {
        Swal.fire({
            title: "Atención",
            text: "¿Seguro que desea guardar este usuario?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Aceptar",
            cancelButtonText: "Cancelar",
            allowOutsideClick: false
        }).then((result) => {
            if (result.value) {
                $(".preloader").show();
                if ($("#nombre").val() != '' && $("#email").val() != '' && $("#rol").val() != 0 && $("#contrasena").val()) {
                    $(".preloader").show();
                    $.when(savePersona($("#nombre").val(), $("#email").val(),$("#rol").val(),$("#contrasena").val()))
                        .done(function (data) {
                            $(".preloader").hide();
                            Swal.fire({
                                title: "Éxito",
                                text: "El usuario se guardó correctamente.",
                                icon: "success",
                                confirmButtonText: "Aceptar",
                                allowOutsideClick: false
                            }).then((result) => {
                                location.reload();
                            });
                        })
                        .fail(function (jqXHR, textStatus, errorThrown) {
                             //console.log(jqXHR);
                             //console.log(textStatus);
                             //console.log(errorThrown);
                            $(".preloader").hide();
                            Swal.fire({
                                title: "Error",
                                text: "Ha ocurrido un error.",
                                icon: "error",
                                confirmButtonText: "Aceptar",
                                allowOutsideClick: false
                            });
                        });
                } else {
                    $(".preloader").hide();
                    Swal.fire({
                        title: "Error",
                        text: "Faltan datos por llenar.",
                        icon: "error",
                        confirmButtonText: "Aceptar",
                        allowOutsideClick: false
                    });
                }
            }
        });
    });

    //peticion a tu servicio

    function savePersona(nombre, correo, rol, contrasena) {
        return $.ajax({
            url: "http://localhost:8080/api/roles/addRoles/" + nombre + "/" + correo + "/" + rol + "/" + contrasena, //aqui va a ir las rutas que se obtuvieron del back, checa el ejemplo del login
            type: "POST",
            dataType: "json",
            contentType: "application/json"
        });
    }

    function updateUserRol(data) {
        return $.ajax({
            url: "http://localhost:8080/api/roles/editRoles", //aqui va a ir las rutas que se obtuvieron del back, checa el ejemplo del login
            type: "POST",
            dataType: "json",
            data: JSON.stringify(data),
            contentType: "application/json"
        });
    }
  
    function getRoles() {

        return $.ajax({

            url: "http://localhost:8080/api/roles/getRoles", //aqui va a ir las rutas que se obtuvieron del back, checa el ejemplo del login

            type: "GET",

            dataType: "json",

            contentType: "application/json"

        });

    }

    function deleteRoles(idRol) {
        return $.ajax({
            url: "http://localhost:8080/api/roles/deleteRoles/" + idRol,
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
