const BloquesVN = {
    Dialogo: (texto, personaje="") => ({ tipo:"dialogo", texto, personaje }),
    Fondo: (url) => ({ tipo:"fondo", url }),
    Musica: (url) => ({ tipo:"musica", url }),
    Personaje: (url) => ({ tipo:"personaje", url }),
    Espera: (ms) => ({ tipo:"espera", tiempo:ms }),
    Eleccion: (opciones, acciones) => ({ tipo:"eleccion", opciones, acciones }),
    Final: (tipo) => ({ tipo:"final", tipoFinal:tipo })
};
