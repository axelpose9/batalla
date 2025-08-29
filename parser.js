function parsePseudo(pseudo) {
	let lines = pseudo.split("\n");
	let MotorVN = {};
	let escenaActual = null;
	let stackPersonajes = [];
	let personajesGlobales = {};

	for (let i = 0; i < lines.length; i++) {
		let lineRaw = lines[i];
		if (!lineRaw.trim()) continue;
		let indent = lineRaw.search(/\S|$/);
		let line = lineRaw.trim();

		// ESCENA
		if(line.startsWith("ESCENA")){
			let nombre = line.split(" ")[1].trim(); // <--- agregamos trim
			escenaActual = nombre;
			MotorVN[escenaActual] = { dialogos: [], personajes: [] };
			stackPersonajes = [];
			continue;
		}
		if (!escenaActual) continue;

		// FONDO
		if (line.startsWith("FONDO")) {
			MotorVN[escenaActual].fondo = line.split(" ")[1];
			continue;
		}

		// MUSICA
		if (line.startsWith("MUSICA")) {
			MotorVN[escenaActual].musica = line.split(" ")[1];
			continue;
		}

		// PERSONAJE
		if (line.startsWith("PERSONAJE")) {
			let match = line.match(/PERSONAJE ([^,]+)(?:, imagen="([^"]*)")?(?:, slot=(\d+))?(?:, visible=(true|false))?(?:, duena=(true|false))?/);
			if (match) {
				let nombre = match[1].trim();
				let imagen = match[2] || "";
				let slot = match[3] ? parseInt(match[3]) : 2;
				let visible = match[4] === "true";
				let duena = match[5] === "true";

				// Guardar globalmente
				if (!personajesGlobales[nombre]) {
					personajesGlobales[nombre] = { nombre, imagen, slot, visible, duena };
				}

				let obj = personajesGlobales[nombre];
				MotorVN[escenaActual].personajes.push(obj);
				stackPersonajes.push({ personaje: obj, indent });
			}
			continue;
		}

		// DIALOGO con soporte multilinea separadas por comas
		if (line.startsWith("DIALOGO")) {
			let match = line.match(/DIALOGO "([^"]+)"(?:, imagen="([^"]*)")?/);
			if (match) {
				let texto = match[1];
				let imagen = match[2];
				let lineas = texto.split(",").map(s => s.trim()); // separa por comas

				for (let l of lineas) {
					let dlg = { texto: l };
					if (imagen) dlg.imagen = imagen;

					// buscar personaje del stack
					for (let j = stackPersonajes.length - 1; j >= 0; j--) {
						if (stackPersonajes[j].indent < indent) {
							dlg.personaje = stackPersonajes[j].personaje.nombre;
							break;
						}
					}

					MotorVN[escenaActual].dialogos.push(dlg);
				}
			}
			continue;
		}

		// OPCIONES
		if (line.startsWith("OPCIONES")) {
			let opciones = [], acciones = [];
			while (i + 1 < lines.length && /^\d+ /.test(lines[i + 1].trim())) {
				i++;
				let match = lines[i].trim().match(/\d+ "([^"]+)" -> (\w+)/);
				if (match) {
					opciones.push(match[1]);
					acciones.push(match[2]);
				}
			}
			if (opciones.length > 0) {
				let ult = MotorVN[escenaActual].dialogos.slice(-1)[0];
				ult.opciones = opciones;
				ult.acciones = acciones;
			}
			continue;
		}

		// MOSTRAR
		if (line.startsWith("MOSTRAR")) {
			let nombre = line.split(" ")[1].trim();
			MotorVN[escenaActual].dialogos.push({ accion: "MOSTRAR", personaje: nombre });
			continue;
		}

		// MOVER
		if (line.startsWith("MOVER")) {
			let match = line.match(/MOVER ([^,]+), slot=(\d+)/);
			if (match) {
				let nombre = match[1].trim();
				let slot = parseInt(match[2]);
				MotorVN[escenaActual].dialogos.push({ accion: "MOVER", personaje: nombre, slot });
			}
			continue;
		}
	}

	return MotorVN;
}
