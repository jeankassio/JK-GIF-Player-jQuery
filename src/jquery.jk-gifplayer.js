/*!
 * JK GIF Player v0.5.0
 * by Jean Kássio
 *
 * More info:
 * https://jeankassio.dev
 *
 * Copyright JK Desenvolvimento WEB <contato@jeankassio.dev> - https://jeankassio.dev
 * Released under the MIT license
 * https://github.com/jeankassio/JK-GIF-Player-jQuery/blob/main/LICENSE
 *
 * @preserve
 */

(function($){
  $.fn.JKGifPlayer = function(options){
	
	$jkgifs = [];
	
    let defaults = {
		autoplay: false,
		data: "gif",
		autopause: false,
		loops: 5
	}
	
	var options = $.extend(defaults, options);
	
    function setListeners(container, options){
		
		$(container).addClass("jk_gif").append([
			$("<img/>").data("gif", $(container).data(options.data)).data("thumb", "").attr("src", "")
		]);
		
		LoadGif(container);
		
			$(container).click(function(e){
		
				$gif = $(this),
				$img = $gif.children('img').eq(0),
				$imgSrc = $img.attr('src'),
				$imgThumb = $img.data('thumb'),
				$imgGif = $img.data('gif');
				
				Play_Stop($gif, $img, $imgSrc, $imgThumb, $imgGif);
			
		});
		
    }
	
	$.fn.PlayStop_Gif = function(){
		
		$gif = $(this),
		$img = $gif.children('img').eq(0),
		$imgSrc = $img.attr('src'),
		$imgThumb = $img.data('thumb'),
		$imgGif = $img.data('gif');
		
		Play_Stop($gif, $img, $imgSrc, $imgThumb, $imgGif);
		
	}
	
	$.fn.GetSize_Gif = function(){
		
		return {
			width: $(this).children('img').eq(0).data("width"),
			height: $(this).children('img').eq(0).data("height")
		};
		
	}
	
	$.fn.GetHeight_Gif = function(){
		
		return $(this).children('img').eq(0).data("height");
		
	}
	
	$.fn.GetWidth_Gif = function(){
		
		return $(this).children('img').eq(0).data("width");
		
	}
	
	$.fn.GetDuration_Gif = function(){
		
		return $(this).children('img').eq(0).data("seconds");
		
	}
	
	$.fn.GetDurationMili_Gif = function(){
		
		return $(this).children('img').eq(0).data("miliseconds");
		
	}
	
	function Play_Stop($gif, $img, $imgSrc, $imgThumb, $imgGif){
		
		if($imgThumb == '' || $imgThumb === undefined){
			
			$img.data("thumb", $imgSrc);
			$img.attr("src", $imgGif);
			$img.data("gif", "");
			$gif.addClass('play_gif');
			
			$($gif).trigger('play.JK_Gif');
			
			if(options.autopause){
				DefineTimer($gif, $imgGif, $imgSrc);
			}
			
		}else{
			
			$img.data("gif", $imgSrc);
			$img.attr("src", $imgThumb);
			$img.data("thumb", "");
			$gif.removeClass('play_gif');
			
			$($gif).trigger('stop.JK_Gif');
			
			if(options.autopause){
				clearTimeout($jkgifs[GetObjectId($gif)]);
			}
			
		}
		
	}
	
	function DefineTimer(obj, $gifn, $img, $stop = false){
		
		$jkgifs[GetObjectId($(obj))] = setTimeout(function(e){
			
			$gif = $(obj),
			$img = $gif.children('img').eq(0);
			
			$img.data("gif", $img.attr("src"));
			$img.attr("src", $img.data("thumb"));
			$img.data("thumb", "");
			$gif.removeClass('play_gif');
			
			$(obj).trigger('stop.JK_Gif');
			
		}, ($stop ? 0 : (Number($(obj).children('img').eq(0).data("seconds")) * options.loops) * 1000));
		
	}
	
	function GetObjectId(obj){
		
		return ($(obj).attr('id') ?? CreateId(obj, Math.random(50).toString()));
		
	}
	
	function CreateId(obj, $id){
		
		$(obj).attr('id', $id);
		
		return $id;
		
	}
	
	async function LoadGif(obj){
		
		await StaticGifImage(obj);
		
	}
	
	async function StaticGifImage(obj){
	
		var image = new Image();

		image.setAttribute('crossOrigin', 'anonymous');
		
		image.src = $(obj).children("img").eq(0).data('gif');
		
		image.onload = function(){
			
			var canvas = document.createElement('canvas');
			canvas.height = this.naturalHeight;
			canvas.width = this.naturalWidth;			
			canvas.getContext('2d').drawImage(this, 0, 0);
				
			CalculateDuration($(obj).children("img").eq(0), image.src);
			
			$(obj).children("img").eq(0).data("width", canvas.width);
			$(obj).children("img").eq(0).data("height", canvas.height);
			$(obj).children("img").eq(0).attr("src", canvas.toDataURL());
				
		};
		
		await image.decode();
		
	}
	
	function CalculateDuration(obj, base64){
  
	  fetch(base64)
		.then(res => res.arrayBuffer())
		.then(ab => isGifAnimated(new Uint8Array(ab)))
		.then(function(s){
			
			$duration = s;
			
			$(obj).data("seconds", $duration[0]);
			$(obj).data("miliseconds", $duration[1]);
			
		})

	  function isGifAnimated (uint8) {
		let duration = 0
		for (let i = 0, len = uint8.length; i < len; i++) {
		  if (uint8[i] == 0x21
			&& uint8[i + 1] == 0xF9
			&& uint8[i + 2] == 0x04
			&& uint8[i + 7] == 0x00) 
		  {
			const delay = (uint8[i + 5] << 8) | (uint8[i + 4] & 0xFF)
			duration += delay < 2 ? 10 : delay
		  }
		}
		return [duration / 100, duration * 10];
	  }
	  
	}
	
    return this.each(function(i){
		
		setListeners(this, options);
		
    });
  };
})(jQuery);