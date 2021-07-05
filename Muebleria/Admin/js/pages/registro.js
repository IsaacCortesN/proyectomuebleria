
$(document).ready(function () {
    
    $("#inicio").on ("click", function(){
       
                $(".preloader").show();
                if($("#contrasena").val()== $("#confirmar").val() && $("#nombre").val()!="" && $("#apellidos").val()!="" && $("#correo").val()!="" && $("#telefono").val()!="" && $("#contrasena").val()!=""){
                    let perfil = {
                        idUsuario: 0,
                        nombre: $("#nombre").val(),
                        apellidos: $("#apellidos").val(),
                        correo: $("#correo").val(),
                        telefono: $("#telefono").val(),
                        foto: "",
                        contrasena: $("#contrasena").val(),
                        idRol: 1
                    }
                    console.log(perfil)
                $.when(registrar(perfil))
                    .done(function (data) {
                        $(".preloader").hide();
                        Swal.fire({
                            title: "Éxito",
                            text: "Registro exitoso.",
                            icon: "success",
                            confirmButtonText: "Aceptar",
                            allowOutsideClick: false
                        }).then((result) => {
                            console.log(window.Location.href);
                            window.location.href='http://localhost/muebleria/Login_v2/iniciosesion.html';
                        });
                    })
                    .fail(function (jqXHR, textStatus, errorThrown) {
                        // console.log(jqXHR);                       
                         // console.log(textStatus);                        
                         // console.log(errorThrown);                      
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
                    text: "Faltan campos por llenar.",
                    icon: "error",
                    confirmButtonText: "Aceptar",
                    allowOutsideClick: false
                });
                
            }
    });

    function registrar(perfil) {
        return $.ajax({
            url: "http://localhost:8080/api/usuarios/addUsuario", //aqui va a ir las rutas que se obtuvieron del back, checa el ejemplo del login
            type: "POST",
            dataType: "json",
            data: JSON.stringify(perfil),
            contentType: "application/json"
        });
    }

});