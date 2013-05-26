var balls = [];
var ball_cnt = 10;
var radius = 32;
var ratio = 10000;
var points = 0;
var appw = 0, apph = 0;
var gamew = 0, gameh = 0, offsetLeft = 0, offsetTop = 0;
var interval;
    
ball = function(index){
    this.x = getRandom($("#app").offset().left, appw+$("#app").offset().left - (radius * 2));
    this.y = getRandom($("#app").position().top, apph+$("#app").position().top - (radius * 2));
    this.color = "#FF0000";
    this.speedx = 0.2 + Math.random() * 5;
    this.speedy = 0.2 + Math.random() * 5;
    this.radius = radius;
    this.name = "ball"+index;
    this.ball = document.createElement("div");
}

var move = function(){
	for(var key in balls)
	{
		balls[key].x += balls[key].speedx;
		balls[key].y += balls[key].speedy;
		//if ball hits bottom or top side of screen
		if(balls[key].y + (2 * radius) >= apph + $("#app").position().top 
				|| balls[key].y <= $("#app").position().top)
		{
			balls[key].speedy *= -1;
		}
		//if ball hits right or left side of screen
		if(balls[key].x + (2* radius) >= appw + $("#app").position().left 
				|| balls[key].x <= $("#app").position().left)
		{
			balls[key].speedx *= -1;
		}
		balls[key].ball.style.left = balls[key].x+"px";
		balls[key].ball.style.top = balls[key].y+"px";
		
		if((parseInt(key)+1) === balls.length)
		{
			clearTimeout(interval);
			interval = setInterval(move, 20);
		}
	}
} 

function getRandom (min, max) {
    return Math.random() * (max - min) + min;
}

function ballClick(e){
    var index = e.target.parentNode.id.split("_");
    $(e.target).remove();
    delete(balls[index[1]]);
}

$(document).ready(function(){
	$("#container").hide();
	$(window).resize(onResize);
	$("#app").css ("height",$("#app").width());
	setTimeout(function(){
		m_top = $("#container").height() / 2;
		$("#container").css("margin-top","-"+m_top+"px");
		$("#container").show();
	},100);
	
    $("#pixel").text(screen.width+"x"+screen.height);
    $("#game").hide();
    $("#btn_start").click(function()
    {
        
        onResize();
		$("#game").show();
        for(var i = ball_cnt; i > 0; i--)
        {
            balls.push(new ball());
            $("#app").append(balls[balls.length - 1].ball);
            var img = document.createElement("img");
                img.src = "./images/ball.png";
                img.style.width = (radius * 2)+"px";
                img.style.height = (radius * 2)+"px";
            balls[balls.length - 1].ball.id = "ball_"+(balls.length - 1);
            balls[balls.length - 1].ball.style.position = "absolute";
            balls[balls.length - 1].ball.appendChild(img);
            balls[balls.length - 1].ball.img = img;
            balls[balls.length - 1].ball.style.left = 
                 (balls[balls.length - 1].x)+"px";
            balls[balls.length - 1].ball.style.top = 
                 (balls[balls.length - 1].y)+"px";
            balls[balls.length - 1].ball.onclick = ballClick;
        }
		
        interval = setInterval(move,20);
        $("#pagewrap").hide();
        
    });
});

onResize = function()
{
	$("#made_by").html($("html").width());
	$("#app").css ("height",$("#app").width());
	m_top = $("#container").height() / 2;
	$("#container").css("margin-top","-"+m_top+"px");
    var oldw = appw;
    var oldh = apph;
	var oldOfTop = offsetTop;
	var oldOfLeft = offsetLeft;
	var oldgamew = gamew;
    var oldgameh = gameh;
	console.log(oldgamew,$("html").width());
    if(oldw != $("#app").width() || oldh != $("#app").height() || oldgamew != $("html").width() || oldgameh != $("html").height())
    {
        appw = $("#app").width();
        apph = $("#app").height();
		gamew = $("html").width();
        gameh = $("html").height();
		offsetTop = $("#app").offset().top;
		offsetLeft = $("#app").offset().left;
        radius = Math.floor((appw * apph) / ratio);
        console.log("resize from",oldw,"x",oldh,"to", appw, "x",apph, "radius:",radius);
        for(var key in balls)
        {
            balls[key].radius = radius;
            balls[key].ball.style.width = (radius*2)+"px";
            balls[key].ball.style.height = (radius*2)+"px";
            balls[key].ball.img.style.width = (radius*2)+"px";
            balls[key].ball.img.style.height = (radius*2)+"px";
            balls[key].x = balls[key].x * gamew / oldgamew;
            balls[key].y = balls[key].y * apph / oldh;
        }
    }
}