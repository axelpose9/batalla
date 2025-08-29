// image_load.js
const ImageLoad = (() => {
	const cache = {};

	// Precargar imágenes de Sakura
	function precargarSakura() {
		const imagenes = [
			"sakura_1.png",
			"sakura_asustada.png",
			"sakura_charla_avergonzada.png"
		];

		imagenes.forEach(url => {
			if(!cache[url]){
				const img = new Image();
				img.src = url;
				cache[url] = img;
				console.log("[LOG] Imagen precargada:", url);
			}
		});
	}

	// Obtener imagen precargada
	function get(url) {
		if(cache[url]) return cache[url].src;
		console.warn("[LOG] Imagen no precargada:", url);
		return url; // fallback
	}

	return { precargarSakura, get };
})();

