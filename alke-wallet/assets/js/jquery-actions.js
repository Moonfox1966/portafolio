// Efectos visuales y mejoras de interacción con jQuery

// Función global para mostrar mensajes Bootstrap en #mensaje
function mostrarMensaje(texto, tipo = "success") {
    const $msg = $("#mensaje");
    if ($msg.length === 0) return; // Si no existe, no hace nada

    $msg
        .hide()
        .html(`<div class="alert alert-${tipo} mb-0">${texto}</div>`)
        .fadeIn(300);
}

$(document).ready(function () {

 
    // Efecto fade-in del contenido
    $("main").hide().fadeIn(400);

 
    // Hover con sombra en botones del menú
    if ($(".list-group-item a").length) {
        $(".list-group-item a").hover(
            function () {
                $(this).addClass("shadow");
            },
            function () {
                $(this).removeClass("shadow");
            }
        );
    }

 
    // Validación visual en inputs numéricos
    $("input[type='number']").on("input", function () {
        const val = Number($(this).val());
        if (isNaN(val) || val <= 0) {
            $(this).addClass("is-invalid");
        } else {
            $(this).removeClass("is-invalid");
        }
    });


    // Autocompletado simple en Enviar dinero
    //    (solo si existen #contact y #contactos)

    if ($("#contact").length && $("#contactos").length) {

        $("#contact").on("keyup", function () {
            const texto = $(this).val().toLowerCase();

            if (texto.length === 0) {
                $("#contactos").slideUp();
                return;
            }

            $("#contactos li").each(function () {
                const nombre = $(this).text().toLowerCase();
                $(this).toggle(nombre.includes(texto));
            });

            $("#contactos").slideDown();
        });

        $("#contactos li").on("click", function () {
            $("#contact").val($(this).text());
            $("#contactos").slideUp();
        });
    }


    // Animación de filas en historial (transactions.html)

    if ($("#tabla-movimientos").length) {
        $("#tabla-movimientos tr").each(function (i) {
            $(this)
                .css("display", "none")
                .delay(i * 100)
                .fadeIn(200);
        });
    }
});