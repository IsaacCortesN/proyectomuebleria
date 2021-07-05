
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
    
        $.when(getCategorias()/*peticion que devuelve todos las categorias etc*/).done(function (res) {
    
            console.log(res);
            const tableCategorias = $("#tablacategorias").DataTable(); //Creacion de la tabla mediante tu ID 
    
            
    
            res.forEach(function (element, index){ //recorrido de la lista de objetos que te devuelve la consulta
    
                const id = `<td>${element.idCategoria}</td>`; //creacion de la primera columna.
    
                const tipo = `<td>${element.tipoCategoria}</td>`;//creacion de la segunda columna.

                const desc = `<td>${element.descripcionCategoria}</td>`;//creacion de la tercer columna.
    
                const boton1= `<td><button type="button" style= "display:none" class="btn btn-danger deleteCategoria" data-idCategoria=${element.idCategoria}><i class="fas fa-trash-alt"></i></button></td>`;
               
                const boton2= `<td><button type="button"  class="btn btn-warning editCategoria" data-idCategoria=${element.idCategoria}><i class="fas fa-pencil-alt"></i></button></td> `;

                const boton3= `<td><button type="button" style= "display:none" class="btn btn-warning" editCategoria" data-idCategoria=${element.idCategoria}><i class="fas fa-pencil-alt"></i></button></td> `;
    
                
    
                //Insertamos las columnas en la tabla, en el orden que queremos que se muestre.
    
                tableCategorias.row.add([id,tipo,desc,boton1,boton2,boton3]).draw(true);
    
            });
    
        });
    
    })();
    
    $("#tablacategorias").on("click", ".deleteCategoria", function () {
        let idCategoria = $(this).attr("data-idCategoria");
        console.log(idCategoria);
      Swal.fire({
            title: "Atención",
            text: "¿Seguro que desea eliminar esta categoría?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Aceptar",
            cancelButtonText: "Cancelar",
            allowOutsideClick: false        }).then((result) => {
            if (result.value) {
                $(".preloader").show();
                $.when(deleteCategoria(idCategoria))
                    .done(function (data) {
                        $(".preloader").hide();
                        Swal.fire({
                            title: "Éxito",
                            text: "La categoría se eliminó correctamente.",
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
    
    $("#tablacategorias").on("click", ".editCategoria", function () {
        $(".preloader").show();
        let idUSuarioE = $(this).attr("data-idCategoria");
        let id = document.querySelector("#guardarEdit"); //traemos el boton de guardar mediante ID
        id.dataset.idUsuario = idUSuarioE;//le asignamos el id Al boton de guardar
        console.log(idUSuarioE);
        
        $.when(getCategorias()).done(function (categorias) { //ejecutamos la peticion que nos regresa a los usuarios
            categorias.forEach(function (cat) {
                if (cat.idCategoria == idUSuarioE) {
                    $("#tipo").val(cat.tipoCategoria);
                    $("#descripcion").val(cat.descripcionCategoria);
                }
            });
        });
        $("#modalEditCate").modal("show");
        $(".preloader").hide();
    });
    
    $("#cerrarmodal").on("click", function(){
        $("#modalEditCate").modal("hide");
    });


    $("#modalEditCate").on("click", ".saveEdit", function () {
        let idUsuario = $(this).attr("data-id-usuario");
        Swal.fire({
            title: "Atención",
            text: "¿Seguro que desea editar la categoría?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Aceptar",
            cancelButtonText: "Cancelar",
            allowOutsideClick: false
        }).then((result) => {
            if (result.value) {
                $(".preloader").show();
                if($("#tipo").val() != '' && $("#descripcion").val() != ''){
                    let datos={};
                    datos = {
                        idCategoria: idUsuario,
                        tipoCategoria: $("#tipo").val(),
                        descripcionCategoria: $("#descripcion").val(),
                    };
                    console.log(datos);
                //Creas tu objeto JSON que se insertara en la DB
                    $.when(updateUserCategoria(datos))
                        .done(function (data) {
                            console.log(data);
                            $(".preloader").hide()
                            Swal.fire({
                                title: "Éxito",
                                text: "La categoría se editó correctamente.",
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

    $("#addcate").on("click", function (){ 
        $("#modalAgregarCate").modal("show");
    });

    $("#cerrar").on("click", function (){ 
        $("#modalAgregarCate").modal("hide");
    });

    $("#guardarAdd").click(function () {
        Swal.fire({
            title: "Atención",
            text: "¿Seguro que desea guardar esta categoría?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Aceptar",
            cancelButtonText: "Cancelar",
            allowOutsideClick: false
        }).then((result) => {
            if (result.value) {
                $(".preloader").show();
                if ($("#tipocate").val() != '' && $("#descripcioncate").val() != '' ) {
                    $(".preloader").show();
                    $.when(savePersona($("#tipocate").val(), $("#descripcioncate").val()))
                        .done(function (data) {
                            $(".preloader").hide();
                            Swal.fire({
                                title: "Éxito",
                                text: "La categoría se guardó correctamente.",
                                icon: "success",
                                confirmButtonText: "Aceptar",
                                allowOutsideClick: false
                            }).then((result) => {
                                location.reload();
                            });
                        })
                        .fail(function (jqXHR, textStatus, errorThrown) {
                             console.log(jqXHR);
                             console.log(textStatus);
                             console.log(errorThrown);
                            $(".preloader").hide();
                            Swal.fire({
                                title: "Error",
                                text: "La categoría ya está registrada.",
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


    function savePersona(nombre, correo) {
        return $.ajax({
            url: "http://localhost:8080/api/categorias/addCategoria/" + nombre + "/" + correo, //aqui va a ir las rutas que se obtuvieron del back, checa el ejemplo del login
            type: "POST",
            dataType: "json",
            contentType: "application/json"
        });
    }

    function updateUserCategoria(datos) {
        return $.ajax({
          url:"http://localhost:8080/api/categorias/editCategoria", //aqui va a ir las rutas que se obtuvieron del back, checa el ejemplo del login
          type: "POST",
          dataType: "json",
          data: JSON.stringify(datos),
          contentType: "application/json"
        });
    }

    //peticion a tu servicio
    
    
    
    function getCategorias() {
    
        return $.ajax({
    
          url:"http://localhost:8080/api/categorias/getCategorias", //aqui va a ir las rutas que se obtuvieron del back, checa el ejemplo del login
    
          type: "GET",
    
          dataType: "json",
    
          contentType: "application/json"
    
        });
    
    }
    function deleteCategoria(idCategoria) {
        return $.ajax({
            url:"http://localhost:8080/api/categorias/deleteCategoria/" + idCategoria,
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
    