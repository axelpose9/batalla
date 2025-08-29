let pseudo = `
ESCENA Inicio
	FONDO cafe.jpg
	MUSICA entrada.mp3
	PERSONAJE Narrador, imagen=""
		DIALOGO "El protagonista llega a la ciudad y se dirige al maid café donde trabajaba su amiga."
		DIALOGO "Sea bienvenido a nuestro Café. Esperamos que disfrute su tiempo aquí."
		DIALOGO "Por favor, elija una mesa."
		OPCIONES
			1 "Mesa #1" -> Mesa1
			2 "Mesa #2" -> Mesa1
			3 "Mesa #3" -> Mesa1
			4 "Mesa #4" -> Mesa1
			5 "Mesa #5" -> Mesa1
			6 "Mesa #6" -> Mesa1

ESCENA Mesa1
	FONDO mesa.jpg
	MUSICA cafe_theme.mp3
	PERSONAJE Sakura, imagen="sakura_1.png", slot=1, visible=true
		DIALOGO "¡Bienvenido Maestro! Mi nombre es Sakura y seré su maid personal por hoy ¿Me dejaría tomar su orden?"
		MOSTRAR Sakura
		DIALOGO "¿Qué desea ordenar?"
		OPCIONES
			1 "Café con leche" -> CafeLeche
			2 "Té verde y torta de frutilla" -> TeTorta
			3 "Me gustaría charlar un rato" -> Charla

ESCENA CafeLeche
	DIALOGO "¡Perfecto! Un café con leche recién hecho para usted. Mientras lo preparo, puede mirar nuestro menú especial."
	DIALOGO "Fin del demo — Final Neutro"

ESCENA TeTorta
	DIALOGO "Una elección particular, hace tiempo no lo piden…"
	DIALOGO "Fin del demo — Final Neutral"

ESCENA Charla
	
	FONDO mesa.jpg
	MUSICA cafe_theme.mp3
	DIALOGO "¿uh? charlar, ¿de qué le gustaría hablar?"
	DIALOGO "Elija un tema"
	OPCIONES
		1 "De mi amiga desaparecida" -> Amiga
		2 "Sobre este Café" -> Cafe
		3 "Sobre ti" -> SobreTi

ESCENA Amiga
	DIALOGO "Amiga… Entonces tú eres… Lo siento mucho. Debo irme."
	DIALOGO "Final_1"

ESCENA Cafe
	PERSONAJE Sakura, imagen="sakura_1.png", slot=0, visible=false
	PERSONAJE Nagase, imagen="nagase.png", slot=2, visible=false
		MOSTRAR Sakura
		MOSTRAR Nagase
		DIALOGO "El Café Maid fue inaugurado en el año XXXX. Nuestro lema es 'El cliente siempre se va con una sonrisa'. Actualmente somos 4 maids trabajando, aunque…"
		MOVER Sakura, slot=3
		DIALOGO "¡Sakura!, deja de entretener a los clientes, ¡tienes otras mesas que atender!"
		DIALOGO "Fin del demo — Ruta Café"

ESCENA SobreTi
	PERSONAJE Sakura, imagen="sakura_asustada.png", slot=1, visible=false
		MOSTRAR Sakura
		DIALOGO "Eh?... ah… Me llamo Sakura Watanabe. Es un placer conocerte."
		DIALOGO "Trabajo aquí medio tiempo..."
		DIALOGO "Antes de seguir necesito tomar su pedido…"
		DIALOGO "¿Que yo elija? Entonces le recomiendo el Té verde y la torta de frutilla."
		DIALOGO "uh? ¿por qué la cara de sorprendido?"
		DIALOGO "¡También es su favorito maestro! Eso es genial!", imagen="sakura_1.png"
		DIALOGO "¿Quieres 2 pedidos? Ah, ¿me vas a invitar? Está bien. Gracias…", imagen="sakura_charla_avergonzada.png"
		DIALOGO "..."
		DIALOGO "Final Bueno — Sakura"

`;


MotorVN.escenas = parsePseudo(pseudo);
MotorVN.cargarEscena("Inicio");
