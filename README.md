# Krayon
**Krayon is in Alpha. Be indulgent. It allow you to draw and write over any website, and save your creations and recreations!**

![This is Krayon!](http://annuaireblogbd.com/krayon/r/i/plugin.png)  

### What is it
It create a canvas in the current firefox tab you browser, and allow you to draw, or write over it. You can save screenshot of full page or part of it.

##How to use
You have to install the plugin in your firefox. For that, just drag and drop the XPI file to your firefox addons manager, it should be that easy!

##Interface
When you will click on the icon addon ![addon button](http://www.annuaireblogbd.com/krayon/r/i/icon.png), you will activate severals options over the webpage you visit. You will loose abilities to interact with the original page, but you can go back by clicking again on the addon icon.

![Size button](http://www.annuaireblogbd.com/krayon/r/i/size.png)  
This button allow you to resize your brush, the stroke of the shapes, or the text size you currently editing (see below).

![color button](http://www.annuaireblogbd.com/krayon/r/i/color.png)  
Color Panel offer you the abilities to change the color brush, shapes or text you currently editing.

![pencils button](http://www.annuaireblogbd.com/krayon/r/i/pen.png)  
On this pannel, you can choose gum for erasing drawings, but not text yet. When you select the pen or the gum, you'll have a yellow focus on it. Note you can click both on pen, it will reveal an another tool, the felt one. This one is similar to pencil, except the native form is square.

![Shape button](http://www.annuaireblogbd.com/krayon/r/i/forms.png)  
Shape panel allow you to draw directly a shape.

![Text button](http://www.annuaireblogbd.com/krayon/r/i/text.png)  
Text pannel allow you to create on the fly a textarea. Be carreful, for the moment, you're not abble to delete a specific textarea. And when you create a text field above a draw you made, the drawing will always be on top. When activated, will allow you to select between two font, with or without serif (Arial and Times).

![Screenshots button](http://www.annuaireblogbd.com/krayon/r/i/screenshot.png)  
The top icon allow you to take a screenshot of part of the page, bottom one just take a fullpage screenshot, even scrolling part. You have severals options for manage the uploading process, take a look below.

![Clear All button](http://www.annuaireblogbd.com/krayon/r/i/clearall.png)  
Erase the canvas, from drawings and text fields. You still allow to draw on the tab/webpage.

### Options

![options](http://www.annuaireblogbd.com/krayon/r/i/options.png)  
- You can choose to align the panel at the top or at bottom.
- local Hosting target the pic file you generate each time you take a screenshot. 
 - By default, it will be on your desktop in a folder called "Krayon". 
 - If you prefer stock your pic in an another folder on your computer, choose one in the option below with the form for.
- Remote hosting is a little more touchy, but more interesting. for be used, you need to own your server, and to be abble to write some basic code on it. 
 - For activate it, check the box for it, and put the good infos below. 
 - The adress will be the script URL
 - Others fields concerns the name of the param the plugin Krayon will send.
Based on the screenshot example, your script could be like this one:
```
header('Content-type: text/plain');
file_put_contents($_POST['namePic'], base64_decode($_POST['pic64']));
echo "ok";
```

This script will create a pic file in the current folder of myurl.com.
Like it's HXS, you have to make a callback. If you output an url, the plugin will open a new tab with this url your write. Elsewhere, will just try to open a new tab with myurl.com/picname.png.

### TODO
- Allow to destroy some textarea
- Add some shapes like empty circle
- Better fluidity in drawing... for the moment, not that terrible...
- fix some heights and widths bugs...
- better code...
- take all good ideas :)

### Version
0.0.1

### Tech
* Javascript
* CSS

License
----
[MPL 2.0](https://www.mozilla.org/MPL/2.0/)