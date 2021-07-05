
$(document).ready(function(){

    var $sesion = sessionStorage.getItem("sesion");
    $(window).on("load", function () {
        $(".preloader").show();
        if ($sesion == "cliente") {
            $(".preloader").hide();
        } else {
            $(".preloader").hide();
            sessionStorage.removeItem("sesion");
            window.location.href='http://localhost/muebleria/principal.php'; //cambiar cuando se suba al servidor por el URL del dominio
        }
    });

    var $idCliente = sessionStorage.getItem("idUsuario");
    function fechaToday() {
        var d = new Date(),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();
    
        if (month.length < 2) 
            month = '0' + month;
        if (day.length < 2) 
            day = '0' + day;
    
        let fecha = [year, month, day].join('-');
    
        return fecha;
      }

    (function () {

        const full_date = new Date();
        const Day = full_date.getFullYear() + "-" + ("0" + full_date.getMonth()).slice(-2) + "-" + ("0" + full_date.getDate()).slice(-2);
        $("#fecha").attr("min",fechaToday);

        $.when(getCitasById()/*peticion que devuelve todos las citas etc*/).done(function (res) {
    
            console.log(res);
            const tableCitas = $("#tablacitas").DataTable(); //Creacion de la tabla mediante tu ID 
    
            res.forEach(function (element, index){ //recorrido de la lista de objetos que te devuelve la consulta
                console.log($idCliente);
                if(element.usuario.idUsuario == $idCliente){

                    const id = `<td>${element.citas.idCita}</td>`; //creacion de la primera columna.
    
                    const fecha = `<td>${element.citas.fecha}</td>`;//creacion de la segunda columna.
    
                    const hora = `<td>${element.citas.hora}</td>`;//creacion de la tercer columna.
    
                    const direc = `<td>${element.citas.direccion}</td>`;//creacion de la tercer columna.

                    const tipo = `<td>${element.categorias.tipoCategoria}</td>`;//creacion de la tercer columna.

                    const descrip = `<td>${element.categorias.descripcionCategoria}</td>`;//creacion de la tercer columna.
        
                    const boton1= `<td><button type="button" class="btn btn-danger deleteCita" data-idCita=${element.citas.idCita} data-idDetalle=${element.idDetalle}><i class="fas fa-trash-alt"></i></button></td>`;
                   
                    const boton2= `<td><button type="button" class="btn btn-warning editCita" data-idCita=${element.citas.idCita} data-idDetalle=${element.idDetalle}><i class="fas fa-pencil-alt"></i></button></td> `;
    
                    const boton3= `<td><button type="button" style= "display:none" class="btn btn-warning" editCategoria" data-idCita=${element.citas.idCita}><i class="fas fa-pencil-alt"></i></button></td> `;
        
                    
        
                    //Insertamos las columnas en la tabla, en el orden que queremos que se muestre.
        
                    tableCitas.row.add([id,fecha,hora,direc,tipo,descrip,boton1,boton2,boton3]).draw(true);
                }

            });
    
        });
    
    })();

    $("#tablacitas").on("click", ".deleteCita", function () {
        let idCita = $(this).attr("data-idCita");
        console.log(idCita);
      Swal.fire({
            title: "Atención",
            text: "¿Seguro que desea eliminar su cita?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Aceptar",
            cancelButtonText: "Cancelar",
            allowOutsideClick: false        }).then((result) => {
            if (result.value) {
                $(".preloader").show();
                $.when(deleteCita(idCita))
                    .done(function (data) {
                        $(".preloader").hide();
                        Swal.fire({
                            title: "Éxito",
                            text: "La cita se eliminó correctamente.",
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
                            text: "Ha ocurrido un error, solo puede eliminar su cita con dos dias de anticipación.",
                            icon: "error",
                            confirmButtonText: "Aceptar",
                            allowOutsideClick: false                        });
                    });
            }
        });
    });


    $("#tablacitas").on("click", ".editCita", function () {
        $(".preloader").show();
        let idUSuarioE = $(this).attr("data-idCita");
        let id = document.querySelector("#guardarEdit"); //traemos el boton de guardar mediante ID
        id.dataset.idUsuario = idUSuarioE;//le asignamos el id Al boton de guardar

        let idDetalle = $(this).attr("data-iddetalle");
        let idD = document.querySelector("#guardarEdit"); //traemos el boton de guardar mediante ID
        idD.dataset.idDetalle = idDetalle;//le asignamos el id Al boton de guardar
        
        $.when(getCitasById($idCliente)).done(function (citas) { //ejecutamos la peticion que nos regresa a los usuarios
            citas.forEach(function (cita) {
                if (cita.idCita == idUSuarioE) {
                    $("#editfecha").val(cita.fecha);
                    $("#edithora").val(cita.hora);
                    $("#editdirec").val(cita.direccion);
                    $("#tipoedit").val(cita.tipoCategoria);
                    $("#descripcionedit").val(cita.descripcionCategoria);
                }
            });
        });
        $("#modalEditCita").modal("show");
        $(".preloader").hide();
    });

    $("#cerrarmodal").on("click", function () {
        $("#modalEditCita").modal("hide");
    });

    
    $("#modalEditCita").on("click", ".saveEdit", function () {
        let idUsuario = $(this).attr("data-id-usuario");
        let idDetalle = $(this).attr("data-id-detalle");
        console.log(idDetalle);
        Swal.fire({
            title: "Atención",
            text: "¿Seguro que desea editar la cita?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Aceptar",
            cancelButtonText: "Cancelar",
            allowOutsideClick: false
        }).then((result) => {
            if (result.value) {
                $(".preloader").show();
                if($("#editfecha").val() != '' && $("#edithora").val() != '' && $("#editdirec").val() != '' && $("#tipoedit").val() != -1){
                    let datos={};
                    datos = {
                        idCita: idUsuario,
                        fecha: $("#editfecha").val(),
                        hora: $("#edithora").val(),
                        direccion: $("#editdirec").val(),
                        tipoCategoria: $("#tipoedit").val(),
                        idDetalle: idDetalle
                    };
                    
                //Creas tu objeto JSON que se insertara en la DB
                    $.when(updateCitaUsuario(datos))
                        .done(function (data) {
                                $(".preloader").hide()
                            Swal.fire({
                                title: "Éxito",
                                text: "La cita se editó correctamente.",
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
                } else{
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

    
    $("#addrol").on("click", function (){ 
        $("#modalAgregarCita").modal("show");
    });

    $("#cerrar").on("click", function (){ 
        $("#modalAgregarCita").modal("hide");
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
            const full_date = new Date($("#fecha").val());
            const Day = full_date.getFullYear() + "-" + ("0" + full_date.getMonth()).slice(-2) + "-" + ("0" + full_date.getDate()).slice(-2);
            let datos={};
                    datos = {
                        idCita: 0,
                        fecha: Day,   
                        hora: $("#hora").val(),
                        direccion: $("#direccion").val(),
                        idCliente: $idCliente,
                        tipoCategoria: $("#tipo").val(),
                        descripcionCategoria: $("#descripcion").val(),
                    };
                    console.log(datos);
            if (result.value) {
                $(".preloader").show();
                if ($("#fecha").val() && $("#hora").val() && $("#direccion").val() && $("#tipo").val() && $("#descripcion").val())  {
                    $(".preloader").show();
                    $.when(savePersona(datos))
                        .done(function (data) {
                            $(".preloader").hide();
                            Swal.fire({
                                title: "Éxito",
                                text: "La cita se guardó correctamente.",
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
                        text: "Faltan campos por llenar.",
                        icon: "error",
                        confirmButtonText: "Aceptar",
                        allowOutsideClick: false
                    });
                }
            }
        });
    });

    function savePersona(datos) {
        return $.ajax({
            url: "http://localhost:8080/api/cita/addCita", //aqui va a ir las rutas que se obtuvieron del back, checa el ejemplo del login
            type: "POST",
            data: JSON.stringify(datos),
            dataType: "json",
            contentType: "application/json"
        });
    }
    
    function getCitasById() {

        return $.ajax({

            url: "http://localhost:8080/api/cita/getRelaciones", //aqui va a ir las rutas que se obtuvieron del back, checa el ejemplo del login

            type: "GET",

            dataType: "json",

            contentType: "application/json"

        });

    }

    function deleteCita(idCita) {
        return $.ajax({
            url:"http://localhost:8080/api/cita/deleteCitas/" + idCita,
            type: "POST",
            dataType: "json",
            contentType: "application/json"
        });
    }

    function updateCitaUsuario(data) {
        return $.ajax({
          url:"http://localhost:8080/api/cita/editCitasUsuario", //aqui va a ir las rutas que se obtuvieron del back, checa el ejemplo del login
          type: "POST",
          dataType: "json",
          data: JSON.stringify(data),
          contentType: "application/json"
        });
    }

    });

    (function () {
        $.when(getCategorias()).done(function (respuesta) {
          $("#tipoedit").append(`<option value=-1>Seleccionar</option>`);
          respuesta.forEach(function (element, index) {
              console.log(element);
            let options = `<option value=${element.idCategoria}>${element.tipoCategoria}</option>`;
            $("#tipoedit").append(options);
          });
        });
      })();

      (function () {
        $.when(getCategorias()).done(function (respuesta) {
          $("#tipo").append(`<option value=-1>Seleccionar</option>`);
          respuesta.forEach(function (element, index) {
              console.log(element);
            let options = `<option value=${element.idCategoria}>${element.tipoCategoria}</option>`;
            $("#tipo").append(options);
          });
        });
      })();


    function getCategorias() {
    
        return $.ajax({
    
          url:"http://localhost:8080/api/categorias/getCategorias", //aqui va a ir las rutas que se obtuvieron del back, checa el ejemplo del login
    
          type: "GET",
    
          dataType: "json",
    
          contentType: "application/json"
    
        });
    
    }

    function cambioCategoria(){

        console.log("Hola mundo");

        $.when(getCategorias()).done(function (respuesta) {
            respuesta.forEach(function (element, index) {
                if($("#tipoedit").val() == element.idCategoria){
                    $("#descripcionedit").val(element.descripcionCategoria);
                }
                if($("#tipo").val() == element.idCategoria){
                    $("#descripcion").val(element.descripcionCategoria);
                }
            });
          });
      }

      function sesion (){
        sessionStorage.removeItem("sesion");
        sessionStorage.removeItem("idUsuario");
            sessionStorage.removeItem("nombre");
            sessionStorage.removeItem("correo");
            sessionStorage.removeItem("telefono");
        window.location.href='http://localhost/muebleria/principal.php'; //cambiar cuando se suba al servidor por el URL del dominio
      }
        

    //PRIMERO VA MI IF 


    //OBJETO
    // datos = {
    //     idRol: idUsuario,
    //     rol: "Administrador",
    //     //descripcionCategoria: $("#descripcion").val(),
    //     //tipoCategoria: $("#tipo").val()
    // };

    //dentro del objeto

    //NOMBRE: $("#nombre").val(), PARA LOS CAMPOS QUE VAN LLENADOS
    //nombre: "", campos vaios

  