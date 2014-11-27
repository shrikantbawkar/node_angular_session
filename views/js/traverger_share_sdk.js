var travButton = document.getElementsByClassName("traverger-share-button")[0];

var style = document.createElement('style');
style.type = 'text/css';
style.innerHTML = '.traverger-share-button { width:120px; height:30px; background: url(http://172.20.131.193:8000/img/traverger-share-button-bg.png) left center no-repeat; cursor:pointer;}';
document.getElementsByTagName('head')[0].appendChild(style);

if (travButton.addEventListener) {                    // For all major browsers, except IE 8 and earlier
    travButton.addEventListener("click", onTravBtnClick);
} else if (travButton.attachEvent) {                  // For IE 8 and earlier versions
    travButton.attachEvent("onclick", onTravBtnClick);
}
function img_find() {
    var imgs = document.getElementsByTagName("img");
    var imgSrcs = [];

    for (var i = 0; i < imgs.length; i++) {
        imgSrcs.push(imgs[i].src);
    }

    return imgSrcs;
}
function onTravBtnClick(e)
{
	//alert(document.title);
	var str = "http://172.20.131.193:8000/#/travergerShare?title="+document.title+"&image="+img_find().slice(0, 2); 
	var win = window.open(str, "travergerShareWindow", "width=800, height=600");
	
}
