$(document).ready(function (){

    $("#inicio").on("click", function (){
        $.when(login()).done(function (response){
            console.log(response);
            if(response.rolesIdRol == 2){
                sessionStorage.setItem("sesion", "admin");
                window.location.href = "../Admin/profile.html";
                
            }else{
                sessionStorage.setItem("sesion", "cliente");
                window.location.href = "../Cliente/perfilcli.html";
                
            }
            sessionStorage.setItem("idUsuario", response.idUsuario);
            sessionStorage.setItem("nombre", response.nombre);
            sessionStorage.setItem("correo", response.correo);
            sessionStorage.setItem("telefono", response.telefono);
        }).fail(function (jqXHR, textSatus,errorThrown){
            console.log(jqXHR);
        });
    });

    function login(){
        var data = {
            idUsuario: 0,
            Nombre: "",
            Apellidos: "",
            Correo: $("#correo").val(),
            Telefono: "",
            Foto: "",
            Contrasena: $("#contrasena").val(),
            idRol: 0
        }
        console.log(data);
        return $.ajax({
            url: "http://localhost:8080/api/usuarios/login",
            type: 'POST',
            dataType: 'json',
            data:JSON.stringify(data),
            contentType: "application/json",
            success: function(response){
                console.log(response);
            }
        });
    }
});