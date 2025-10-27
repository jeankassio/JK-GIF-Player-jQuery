# JK GIF Player jQuery
JK GIF Player jQuery is a jQuery plugin that allows you to manipulate gifs, calculate their duration, their size, click to start and stop and have related events. Check it out below. **Under construction**

I bring you a plugin developed by me that is actually a piece of code from a personal project, but I developed it as a plugin to be able to share it on Github.
I hope you enjoy.

JK GIF Player jQuery is a lightweight and very functional plugin, it loads the elements selected by you and defines play/stop controls, and it's up to you to select whether the GIF will repeat itself infinitely, and if not, how many times it will if it repeats until it pauses automatically, if it will autoplay, etc.,

You can see a demo on [CodePen](https://codepen.io/jeankassio/pen/abRpELe)

## How To Use



Gifs must be inside a "Data" type attribute in a div, as shown below. **External links, internal links, blobs and base64 are accepted.**

```html
<div class="div_with_data_gif" data-gif="https://media4.giphy.com/media/VjxnWfOi55j2gGDhZE/giphy.gif"></div>
<div class="div_with_data_gif" data-gif="https://media4.giphy.com/media/cfuL5gqFDreXxkWQ4o/giphy.gif"></div>
```



Select the element you want and call the plugin, and pass the desired parameters (if you want to customize it)

```javascript
$(".div_with_data_gif").JKGifPlayer({
    autoplay: false,
    data: "gif",
    autopause: true,
    loops: 5
});
```

And the result will be:


![model](https://github.com/user-attachments/assets/9c0d7a94-4746-4b42-a9c5-49c5e1dcca42)



## Parameters

Option	|Values	|Default
--- | --- | --- 
autoplay	| Whether the GIF will automatically start | false 
data	| Attribute name "data" found in the div, by default "data-gif" is selected	|'gif'
autopause | If false, the GIF will repeat indefinitely | false 
loops | Number of times the GIF will repeat itself. Can be ignored if "autopause" is false | 5 

example:

```javascript
$(".gifimage").JKGifPlayer({
    autoplay: true,
    data: "img",
    autopause: true,
    loops: 3
});
```


## Getters

Option	|Values
--- | ---
GetSize_Gif	| Gets an object array containing the Width and Height of the image.
GetHeight_Gif	| Gets Height of the image.
GetWidth_Gif | Gets the Width of the image.
GetDuration_Gif | Gets the time duration of the GIF, in seconds
GetDurationMili_Gif | Gets the time duration of the GIF, in miliseconds

Examples:

```javascript
setTimeout(function(){
    $(".gifimage").each(function(){
    
          console.log($(this).GetSize_Gif());
          console.log($(this).GetHeight_Gif());
          console.log($(this).GetWidth_Gif());
          console.log($(this).GetDuration_Gif() + " seconds");
          console.log($(this).GetDurationMili_Gif() + " miliseconds");

    });
}, 1000);
```

## Play/Stop programmatically

Option	|Values
--- | ---
PlayStop_Gif	| If it is running, stop. If it's stopped, play.

Example:
```javascript
  $(".gifimage").PlayStop_Gif();
```

## Events

Option	|Values
--- | ---
play.JK_Gif	| It is called when a GIF element starts.
stop.JK_Gif	| It is called when a GIF element is stopped.

Example:

```javascript
$(document).on('play.JK_Gif', '.gifimage', function(e) { 
    
    console.log("playing");
  
});


$(document).on('stop.JK_Gif', '.gifimage', function(e) { 
    
    console.log("stopped");
  
});
```

## Copyright and license

Code released under the [MIT license](https://github.com/jeankassio/LBT-Lightbox/blob/main/LICENSE).







