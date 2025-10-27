/*!
 * JK GIF Player v1.0.2
 * by Jean Kássio
 *
 * More info:
 * https://jeankassio.dev
 *
 * Copyright JK Desenvolvimento WEB <contato@jeankassio.dev>
 * Released under the MIT license
 * https://github.com/jeankassio/JK-GIF-Player-jQuery/blob/main/LICENSE
 *
 * @preserve
 */

(($) => {
	$.fn.JKGifPlayer = function (userOptions = {}) {
	const activeTimers = new Map();
	
	const defaults = {
		autoplay: false,
		data: "gif",
		autopause: false,
		loops: 5,
	};
	
	const options = Object.assign({}, defaults, userOptions);
	
	// ========================
	// Helpers
	// ========================
	const getObjectId = (obj) => {
		let id = $(obj).attr("id");
		if (!id) id = createId(obj);
		return id;
	};
	
	const createId = (obj) => {
		const id = `jk_${Math.random().toString(36).substr(2, 9)}`;
		$(obj).attr("id", id);
		return id;
	};
	
	// ========================
	// Core
	// ========================
	const playStop = ($gif, $img, src, thumb, gifSrc) => {
		if (!thumb) {
		// Play
		$img.data("thumb", src);
		$img.attr("src", gifSrc);
		$img.data("gif", "");
		$gif.addClass("play_gif");
	
		$gif.trigger("play.JK_Gif");
	
		if (options.autopause) defineTimer($gif, gifSrc, src);
		} else {
		// Stop
		$img.data("gif", src);
		$img.attr("src", thumb);
		$img.data("thumb", "");
		$gif.removeClass("play_gif");
	
		$gif.trigger("stop.JK_Gif");
	
		if (options.autopause) {
			const id = getObjectId($gif);
			clearTimeout(activeTimers.get(id));
			activeTimers.delete(id);
		}
		}
	};
	
	const defineTimer = (obj, gifSrc, imgSrc, stop = false) => {
		const id = getObjectId(obj);
		const $img = $(obj).find("img").eq(0);
		const seconds = parseFloat($img.data("seconds")) || 0;
		
		console.log(seconds);
		
		const delay = stop ? 0 : seconds * options.loops * 1000;
	
		const timer = setTimeout(() => {
		const $gif = $(obj);
		const $img = $gif.find("img").eq(0);
	
		$img.data("gif", $img.attr("src"));
		$img.attr("src", $img.data("thumb"));
		$img.data("thumb", "");
		$gif.removeClass("play_gif");
	
		$gif.trigger("stop.JK_Gif");
		}, delay);
	
		activeTimers.set(id, timer);
	};
	
	const staticGifImage = async (obj) => {
		const imgElement = $(obj).find("img").eq(0);
		const image = new Image();
		image.crossOrigin = "anonymous";
		image.src = imgElement.data("gif");
	
		await image.decode();
	
		const canvas = document.createElement("canvas");
		canvas.width = image.naturalWidth;
		canvas.height = image.naturalHeight;
		canvas.getContext("2d").drawImage(image, 0, 0);
	
		await calculateDuration(imgElement, image.src); // <-- AQUI o await real
	
		imgElement.data({
			width: canvas.width,
			height: canvas.height,
		});
	
		imgElement.attr("src", canvas.toDataURL());
	};

	
	const calculateDuration = (obj, src) => {
		return new Promise((resolve) => {
			fetch(src)
			.then((res) => res.arrayBuffer())
			.then((ab) => isGifAnimated(new Uint8Array(ab)))
			.then(([seconds, milliseconds]) => {
				$(obj).data({
				seconds,
				miliseconds: milliseconds,
				});
				resolve([seconds, milliseconds]);
			});
	
			const isGifAnimated = (uint8) => {
			let duration = 0;
			for (let i = 0; i < uint8.length; i++) {
				if (
				uint8[i] === 0x21 &&
				uint8[i + 1] === 0xf9 &&
				uint8[i + 2] === 0x04 &&
				uint8[i + 7] === 0x00
				) {
				const delay = (uint8[i + 5] << 8) | (uint8[i + 4] & 0xff);
				duration += delay < 2 ? 10 : delay;
				}
			}
			return [duration / 100, duration * 10];
			};
		});
	};

	
	const loadGif = async (obj) => {
		await staticGifImage(obj);
	
		if (options.autoplay) {
		$(obj).each(function () {
			const $gif = $(this);
			const $img = $gif.find("img").eq(0);
			const src = $img.attr("src");
			const thumb = $img.data("thumb");
			const gifSrc = $img.data("gif");
			playStop($gif, $img, src, thumb, gifSrc);
		});
		}
	};
	
	const setListeners = (container) => {
		const $container = $(container);
		const gifSrc = $container.data(options.data);
	
		$container
		.empty()
		.addClass("jk_gif")
		.append($("<img/>").data("gif", gifSrc).attr("src", ""));
	
		loadGif(container);
	
		$container.on("click", function () {
		const $gif = $(this);
		const $img = $gif.find("img").eq(0);
		const src = $img.attr("src");
		const thumb = $img.data("thumb");
		const gifSrc = $img.data("gif");
	
		playStop($gif, $img, src, thumb, gifSrc);
		});
	};
	
	// ========================
	// Public methods
	// ========================
	$.fn.PlayStop_Gif = function () {
		return this.each(function () {
		const $gif = $(this);
		const $img = $gif.find("img").eq(0);
		const src = $img.attr("src");
		const thumb = $img.data("thumb");
		const gifSrc = $img.data("gif");
		playStop($gif, $img, src, thumb, gifSrc);
		});
	};
	
	$.fn.GetSize_Gif = function () {
		const $img = $(this).find("img").eq(0);
		return {
		width: $img.data("width"),
		height: $img.data("height"),
		};
	};
	
	$.fn.GetHeight_Gif = function () {
		return $(this).find("img").eq(0).data("height");
	};
	
	$.fn.GetWidth_Gif = function () {
		return $(this).find("img").eq(0).data("width");
	};
	
	$.fn.GetDuration_Gif = function () {
		return $(this).find("img").eq(0).data("seconds");
	};
	
	$.fn.GetDurationMili_Gif = function () {
		return $(this).find("img").eq(0).data("miliseconds");
	};
	
	// ========================
	// Init
	// ========================
	return this.each(function () {
		setListeners(this);
	});
	};
})(jQuery);
