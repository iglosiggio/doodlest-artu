<html>
<head>
<title>Artu - Drawing test</title>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
<script language="javascript" type="text/javascript" src="p5.min.js"></script>
<script language="javascript" type="text/javascript" src="artu.js"></script>
<meta name="theme-color" content="#41a6f6">

<!-- Font awesome -->
<script src="https://kit.fontawesome.com/949bd93ad6.js"></script>
 <!-- Latest compiled and minified CSS -->
<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css">

<!-- jQuery library -->
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script>

<!-- Popper JS -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js"></script>

<!-- Latest compiled JavaScript -->
<script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js"></script> 
</head>

<style>
    body{
        font-family: arial, verdana, sans-serif;
    }
    .tooldiv{
        display: inline-block;
        border-radius: 5px;
        background-color: white;
        padding: 2px 0px;
        text-align: center;
        height: 36px;
        vertical-align: middle;
        min-width: 40px;
        box-sizing: border-box;
        border: 2px solid white;
    }
    .tooldiv-text{
        display: inline-block;
        border-radius: 5px;
        background-color: white;
        padding: 0px 4px;
        text-align: center;
        min-height: 28px;
        vertical-align: middle;
        padding-top: 4px;
        box-sizing: border-box;
        height: 36px;
        min-width: 40px;
    }
    .tooldiv-border{
        border: 2px solid gray;
    }
    .tooldiv:hover, .tooldiv-text:hover{
        border-color: #FF9900;
        background-color: #EEE;
        cursor: pointer;
    }
    .vsmall{
        display: inline-block;
        width: 4px;
        height: 4px;
        border-radius: 16px;
        background-color: black;
        vertical-align: middle;
        margin-top: 12px;
    }
    .small{
        display: inline-block;
        width: 10px;
        height: 10px;
        border-radius: 16px;
        background-color: black;
        vertical-align: middle;
        margin-top: 9px;
    }
    .medium{
        display: inline-block;
        width: 18px;
        height: 18px;
        border-radius: 18px;
        background-color: black;
        vertical-align: middle;
        margin-top: 5px;
    }
    .large{
        display: inline-block;
        width: 24px;
        height: 24px;
        border-radius: 16px;
        background-color: black;
        vertical-align: middle;
        margin-top: 2px;
    }
    .done{
        background-color: #FF9900;
        color: white;
        border-color: #FF9900;
        font-weight: 600;
        padding-left: 10px;
        padding-right: 10px;
        width: 84px;
    }
    .done:hover{
        background-color: #FFBB22;
        border-color: #FFBB22;
    }
    .noselect{
        -webkit-touch-callout: none; /* iOS Safari */
        -webkit-user-select: none; /* Safari */
        -khtml-user-select: none; /* Konqueror HTML */
        -moz-user-select: none; /* Firefox */
        -ms-user-select: none; /* Internet Explorer/Edge */
        user-select: none; /* Non-prefixed version, currently upported by Chrome and Opera */
    }
    .iconbutton{
        padding-top: 6px;
        font-size: 20px;
    }
}
</style>

<body>
<p style="text-align: center">Draw Something or <a href="gallery.php">see all drawings</a></p>
<p id="timeleft" style="text-align: center; font-color: #333; font-size: 24px;">Loading...</p>
<!-- Canvas -->
<div style="text-align: center">
<div id="canvas" style="width: 98%; max-width: 500px; touch-action: none; display: inline-block;"></div>
</div>
<!-- Color palette -->
<div style="text-align: center; margin-top: 10px;" class="noselect" unselectable="on">
    <div class="tooldiv" onclick="setColor('#1a1c2c')" style="background-color: #1a1c2c;"></div>
    <div class="tooldiv" onclick="setColor('#333c57')" style="background-color: #333c57;"></div>
    <div class="tooldiv" onclick="setColor('#5d275d')" style="background-color: #5d275d;"></div>
    <div class="tooldiv" onclick="setColor('#ef7d57')" style="background-color: #ef7d57;"></div>
    <div class="tooldiv" onclick="setColor('#38b764')" style="background-color: #38b764;"></div>
    <div class="tooldiv" onclick="setColor('#3b5dc9')" style="background-color: #3b5dc9;"></div>
    <div class="tooldiv-text tooldiv-border iconbutton" onclick="undo()"><i class="fa fa-undo"></i></div>
</div>
<div style="text-align: center; margin-top: 4px;" class="noselect" unselectable="on">
    <div class="tooldiv" onclick="setColor('#f4f4f4')" style="background-color: #f4f4f4;"></div>
    <div class="tooldiv" onclick="setColor('#94b0c2')" style="background-color: #94b0c2;"></div>
    <div class="tooldiv" onclick="setColor('#b13e53')" style="background-color: #b13e53;"></div>
    <div class="tooldiv" onclick="setColor('#ffcd75')" style="background-color: #ffcd75;"></div>
    <div class="tooldiv" onclick="setColor('#a7f070')" style="background-color: #a7f070;"></div>
    <div class="tooldiv" onclick="setColor('#73eff7')" style="background-color: #73eff7;"></div>
    <div class="tooldiv-text tooldiv-border iconbutton" onclick="fillBack()"><i class="fas fa-fill"></i></div>
</div>
<div style="text-align: center; margin-top: 4px; margin-bottom: 10px;" class="noselect" unselectable="on">
    <div class="tooldiv tooldiv-border" onclick="setWidth(4)"><div class="vsmall"></div></div>
    <div class="tooldiv tooldiv-border" onclick="setWidth(10)"><div class="small"></div></div>
    <div class="tooldiv tooldiv-border" onclick="setWidth(20)"><div class="medium"></div></div>
    <div class="tooldiv tooldiv-border" onclick="setWidth(40)"><div class="large"></div></div>
    <div class="tooldiv-text tooldiv-border iconbutton" onclick="clearCanvas()"><i class="fa fa-trash"></i></div>
    <div class="tooldiv-text tooldiv-border done iconbutton" onclick="saveToServer()"><i class="fa fa-check"></i></div>
</div>
</div>
</body>

<div style="display:none">
<form action="submitimage.php" method="post" id="imageform">
<input type="hidden" id="image" name="image" value="">
</form>
</div>

<script>
// Enable navigation prompt
window.onbeforeunload = function() {
    return "Do you really want to leave our brilliant application?";
};
</script>

</html>
