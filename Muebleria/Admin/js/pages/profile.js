
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
    
    (function (){
        var $idUsuario = sessionStorage.getItem("idUsuario");
        $("#oculto").val($idUsuario);
        var $nombreUser = sessionStorage.getItem("nombre",);
        $("#nombre").val($nombreUser);
        var $correoUser= sessionStorage.getItem("correo");
        $("#correotexto").text($correoUser);
        $("#correo").val($correoUser);
        var $telefonoUser= sessionStorage.getItem("telefono");
        $("#telefono").val($telefonoUser);
        })();
        
    $("#actualizar").on ("click", function(){
        Swal.fire({
            title: "Atención",
            text: "¿Seguro que desea actualizar su perfil?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Aceptar",
            cancelButtonText: "Cancelar",
            allowOutsideClick: false
        }).then((result) => {
            if (result.value) {
                $(".preloader").show();
                if($("#contrasena").val()== $("#confirmar").val()){
                    let perfil = {
                        idUsuario: $("#oculto").val(), 
                        nombre: $("#nombre").val(),
                        correo: $("#correo").val(),
                        telefono: $("#telefono").val(),
                        contrasena: $("#contrasena").val()
                    }
                    console.log(perfil)
                $.when(actualizarPerfil(perfil))
                    .done(function (data) {
                        sessionStorage.setItem("idUsuario", data.idUsuario);
            sessionStorage.setItem("nombre", data.nombre);
            sessionStorage.setItem("correo", data.correo);
            sessionStorage.setItem("telefono", data.telefono);
                        $(".preloader").hide();
                        Swal.fire({
                            title: "Éxito",
                            text: "El perfil se actualizo correctamente.",
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
            }else{
                $(".preloader").hide();
                Swal.fire({
                    title: "Error",
                    text: "Las contraseñas no coinciden.",
                    icon: "error",
                    confirmButtonText: "Aceptar",
                    allowOutsideClick: false
                }); 
            }
            }
        });
    });

});

function actualizarPerfil(perfil) {
    return $.ajax({
        url: "http://localhost:8080/api/usuarios/editPerfil/" + perfil.idUsuario + "/" + perfil.nombre + "/" + perfil.correo + "/" + perfil.contrasena + "/" + perfil.telefono, //aqui va a ir las rutas que se obtuvieron del back, checa el ejemplo del login
        type: "POST",
        dataType: "json",
        contentType: "application/json"
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