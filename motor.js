const ASSETS_PATH = "Assets/"; // Carpeta base de imágenes

const MotorVN = {
	escenas: {},
	personajesGlobales: {},
	duena: null,
	escenaActual: "",
	dialogoIndex: 0,
	escribiendo: false,
	velocidad: 40,

	_clickHandler: null,
	_finishWriting: null,

	// -------------------- CARGAR ESCENA --------------------
	cargarEscena(nombre) {
		console.log("[LOG] Cargar escena:", nombre);
		this.escenaActual = nombre;
		this.dialogoIndex = 0;

		const esc = this.escenas[nombre];
		if(!esc){
			console.error("[LOG] Escena no existe:", nombre);
			document.getElementById("texto").innerHTML = "Escena no encontrada.";
			return;
		}

		// Fondo y música
		this.cargarFondo(esc.fondo);
		this.cargarMusica(esc.musica);

		const contenedor = document.getElementById("personajes");
		if(contenedor){
			// borrar todos los invitados visibles, pero no tocar a la dueña
			Array.from(contenedor.querySelectorAll('img')).forEach(img => {
				if(img.dataset.duena !== "true") img.remove();
			});
		}

		// Cargar personajes de la escena
		if(esc.personajes){
			esc.personajes.forEach(p => {
				if(p.duena){
					if(!this.duena){
						this.duena = { nombre: p.nombre, imagen: p.imagen, slot: p.slot ?? 1 };
						this.personajesGlobales[p.nombre] = this.duena;
					}
				} else {
					this.cargarPersonaje(
						p.imagen,
						p.slot ?? 2,
						p.duena ?? false,
						p.nombre,
						false // invisible al inicio
					);
				}
			});
		}

		this.enableClickAdvance();
		this.mostrarDialogo();
	},

	// -------------------- FONDO --------------------
	cargarFondo(url){
		const fondoDiv = document.getElementById("fondo");
		if(typeof url === "string" && url.trim()){
			const ruta = ASSETS_PATH + url;
			const img = new Image();
			img.onload = ()=>fondoDiv.style.backgroundImage = `url('${ruta}')`;
			img.onerror = ()=>console.warn("[LOG] Error cargando fondo:", ruta);
			img.src = ruta;
		}else{
			console.log("[LOG] Mantener fondo actual");
		}
	},

	// -------------------- MUSICA --------------------
	cargarMusica(url){
		const musica = document.getElementById("musica");
		if(url && url.trim()){
			const ruta = url;
			console.log("[LOG] Cambiando música:", ruta);
			musica.src = ruta;
			musica.play().catch(e=>console.warn("[LOG] play() fallo:", e));
		}else{
			musica.pause();
			musica.removeAttribute("src");
			musica.load();
		}
	},

	// -------------------- PERSONAJES --------------------
	cargarPersonaje(url, slot=2, esDuena=false, personajeNombre="", visible=true) {
		const contenedor = document.getElementById("personajes");
		if(!contenedor) return;

		// Si hay personajeNombre, buscar en su subcarpeta
		const ruta = personajeNombre ? `${ASSETS_PATH}${personajeNombre}/${url}` : `${ASSETS_PATH}${url}`;

		// Ver si ya existe la imagen
		let img = Array.from(contenedor.querySelectorAll('img')).find(i => i.dataset.nombre === personajeNombre);

		if(!img){
			img = document.createElement("img");
			img.dataset.nombre = personajeNombre;
			img.dataset.duena = esDuena ? "true" : "false";
			img.style.position = "absolute";
			img.style.bottom = "0";
			img.style.maxHeight = "80vh";
			contenedor.appendChild(img);
		}

		// Actualizar propiedades
		img.src = ruta;
		img.dataset.slot = slot;
		img.style.display = visible ? "block" : "none";

		this._ajustarPosiciones();
	},

	_ajustarPosiciones(){
		const contenedor = document.getElementById("personajes");
		const imgs = Array.from(contenedor.querySelectorAll('img')).filter(i => i.style.display !== "none");

		const duena = imgs.find(i => i.dataset.duena === "true");
		const invitados = imgs.filter(i => i.dataset.duena !== "true");

		// Dueña al centro
		if(duena){
			duena.style.left = "50%";
			duena.style.transform = "translateX(-50%)";
		}

		// Invitados según slot
		invitados.forEach(img => {
			const slot = parseInt(img.dataset.slot);
			switch(slot){
				case 2: img.style.left = "25%"; break;
				case 3: img.style.left = "75%"; break;
				default: img.style.left = "50%"; 
			}
			img.style.transform = "translateX(-50%)";
		});
	},

	// -------------------- AVANCE POR CLIC --------------------
	enableClickAdvance(){
		if(this._clickHandler) return;
		this._clickHandler = (e)=>{
			if(e.target.closest && e.target.closest('#opciones button')) return;
			const opcionesDiv = document.getElementById("opciones");
			if(opcionesDiv && opcionesDiv.children.length > 0) return;
			if(this.escribiendo){
				if(this._finishWriting) this._finishWriting();
				return;
			}
			this.nextDialog();
		};
		document.addEventListener('click', this._clickHandler);
		console.log("[LOG] Habilitado avance por clic global");
	},

	disableClickAdvance(){
		if(!this._clickHandler) return;
		document.removeEventListener('click', this._clickHandler);
		this._clickHandler = null;
		console.log("[LOG] Deshabilitado avance por clic global");
	},

	// -------------------- DIÁLOGOS --------------------
	nextDialog(){
		const esc = this.escenas[this.escenaActual];
		if(!esc) return;
		this.dialogoIndex++;
		if(this.dialogoIndex < esc.dialogos.length){
			this.mostrarDialogo();
		}else{
			console.log("[LOG] Fin de la escena:", this.escenaActual);
		}
	},

	mostrarDialogo(){
		const esc = this.escenas[this.escenaActual];
		if(!esc || !esc.dialogos || esc.dialogos.length===0){
			document.getElementById("texto").innerHTML = "No hay diálogos en esta escena.";
			return;
		}

		if(this.dialogoIndex >= esc.dialogos.length) return;

		const dlg = esc.dialogos[this.dialogoIndex];
		const textoDiv = document.getElementById("texto");
		const opcionesDiv = document.getElementById("opciones");
		opcionesDiv.innerHTML = "";
		textoDiv.innerHTML = "";

		// --- ACCIONES especiales ---
		if(dlg.accion === "MOSTRAR"){
			let p = esc.personajes?.find(px => px.nombre === dlg.personaje) || this.personajesGlobales[dlg.personaje];
			if(p){
				this.cargarPersonaje(
					p.imagen,
					p.slot ?? 2,
					p.duena ?? false,
					p.nombre,
					true
				);
			}
			this.nextDialog();
			return;
		}

		if(dlg.accion === "MOVER"){
			const img = document.querySelector(`#personajes img[data-nombre="${dlg.personaje}"]`);
			if(img){
				img.dataset.slot = dlg.slot;
				this._ajustarPosiciones();
			}
			this.nextDialog();
			return;
		}

		if(dlg.personaje){
			const esDuena = dlg.duena || (this.duena && this.duena.nombre === dlg.personaje);
			const personaje = esc.personajes?.find(p=>p.nombre===dlg.personaje) || this.personajesGlobales[dlg.personaje];

			let url = dlg.imagen || personaje?.imagen || (esDuena ? this.duena?.imagen : undefined);
			let slot = esDuena ? 1 : personaje?.slot ?? 2;

			if(url){
				this.cargarPersonaje(url, slot, esDuena, dlg.personaje, true);
				if(esDuena && !this.duena) this.duena = { nombre: dlg.personaje, imagen: url, slot };
				this.personajesGlobales[dlg.personaje] = { nombre: dlg.personaje, imagen: url, slot };
			}
		}

		const contenido = dlg.personaje ? `<b>${dlg.personaje}:</b> ${dlg.texto}` : dlg.texto;

		this.escribirTexto(contenido, textoDiv, ()=>{
			if(dlg.opciones && dlg.acciones && dlg.opciones.length === dlg.acciones.length){
				dlg.opciones.forEach((opt,i)=>{
					const btn = document.createElement("button");
					btn.textContent = opt;
					btn.onclick = (ev)=>{
						ev.stopPropagation();
						this.cargarEscena(dlg.acciones[i]);
					};
					opcionesDiv.appendChild(btn);
				});
			}
		});
	},

	// -------------------- EFECTO DE ESCRITURA --------------------
	escribirTexto(texto, contenedor, callback){
		if(this._finishWriting) this._finishWriting();

		this.escribiendo = true;
		let i = 0;
		let called = false;

		const interval = setInterval(()=>{
			contenedor.innerHTML = texto.substring(0, i+1);
			i++;
			if(i >= texto.length){
				clearInterval(interval);
				this.escribiendo = false;
				this._finishWriting = null;
				if(!called){
					called = true;
					if(callback) callback();
				}
			}
		}, this.velocidad);

		this._finishWriting = ()=>{
			if(called) return;
			clearInterval(interval);
			contenedor.innerHTML = texto;
			this.escribiendo = false;
			called = true;
			this._finishWriting = null;
			if(callback) callback();
		};
	}
};
