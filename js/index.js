var balls = {};
var ball_counter = 0;
var balls_size = 0;
var ball_cnt = 5;
var radius = 32;
var ratio = 10000;
var points = 0;
var appw = 0, apph = 0;
var gamew = 0, gameh = 0, offsetLeft = 0, offsetTop = 0;
var interval;
var game_time;
var time_milisec = 6000;
var milisec_gone = 0;
var addBallInterval;
    
var ball = function(index){
	this.x = getRandom($("#app").offset().left, appw+$("#app").offset().left - (radius * 2));
	this.y = getRandom($("#app").position().top, apph+$("#app").position().top - (radius * 2));
    this.color = "#FF0000";
    this.speedx = 0.2 + Math.random() * 5;
    this.speedy = 0.2 + Math.random() * 5;
    this.radius = radius;
    this.ball = document.createElement("div");
}

var setUpNewBall = function(){
	if(balls_size < 10)
	{	
		ball_counter++;
		balls_size++;
		balls[ball_counter] = new ball();
		$("#app").append(balls[ball_counter].ball);
		var img = document.createElement("img");
			img.src = "./images/ball.png";
			img.style.width = (radius * 2)+"px";
			img.style.height = (radius * 2)+"px";
		balls[ball_counter].ball.id = ball_counter;
		balls[ball_counter].ball.style.position = "absolute";
		balls[ball_counter].ball.appendChild(img);
		balls[ball_counter].ball.img = img;
		balls[ball_counter].ball.style.left = (balls[ball_counter].x)+"px";
		balls[ball_counter].ball.style.top = (balls[ball_counter].y)+"px";
		balls[ball_counter].ball.onmousedown = ballClick;
	}
}

var move = function(){
	for(var key in balls)
	{
		balls[key].x = getRandom($("#app").offset().left, appw+$("#app").offset().left - (radius * 2));
		balls[key].y = getRandom($("#app").position().top, apph+$("#app").position().top - (radius * 2));
		balls[key].ball.style.left = balls[key].x+"px";
		balls[key].ball.style.top = balls[key].y+"px";
		if((parseInt(key)+1) === balls.length)
		{
			clearInterval(interval);
			interval = setInterval(move, 3000);
		}
	}
} 

function getRandom (min, max) {
    return (Math.random() * (max - min) + min);
}

function ballClick(e){
	//some bug workaround
	if(e.target.parentNode.id != "app")
	{
		console.log("Delete ", e.target.parentNode);
		balls_size--;
		var id = e.target.parentNode.id;
		$(e.target.parentNode).remove();
		delete(balls[id]);
		points++;
		$("#points").text(points);
	}
}

timeTick = function(){
	milisec_gone++;
	var time_left = time_milisec - milisec_gone;
	if(time_left > 0)
	{
		var date = new Date(time_left * 10);
		var milisec = date.getMilliseconds();
		var sec = date.getSeconds();
		var min = date.getMinutes();
		$("#time").text(min+" : "+sec+" : "+milisec);
	}
	else
	{
		$("#time").text("00 : 00 : 000");
		clearInterval(interval);
		clearInterval(addBallInterval);
		clearInterval(game_time);
		for(var key in balls)
		{
			$("#"+balls[key].ball.id).remove();
			delete(balls[key]);
		}
		balls_size = 0;
		showEndScreen($("#points").text());
		console.log("Tavs rezultâts - savâktas",$("#points").text(),"futbola bumbas!");
	}
}

function showEndScreen(points) {

	$('#end_screen').reveal({ // The item which will be opened with reveal
		animation: 'none',                   // fade, fadeAndPop, none
		animationspeed: 600,                       // how fast animtions are
		closeonbackgroundclick: false,              // if you click background will modal close?
		dismissmodalclass: 'close'    // the class of a button or element that will close an open modal
	});
	$("#end_result").html(points);
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
			setUpNewBall();
        }
		
        interval = setInterval(move,3000);
        $("#pagewrap").hide();
		game_time = setInterval(timeTick,10);
		addBallInterval = setInterval(setUpNewBall, 500);
    });
	
	$("#play_again").click(function()
	{
		$("#game").show();
		points = 0;
		$("#points").text(points);
		balls = {};
		ball_counter = 0;
		ball_size = 0;
		milisec_gone = 0;
		interval = setInterval(move,3000);
		game_time = setInterval(timeTick,10);
		addBallInterval = setInterval(setUpNewBall, 500);
		for(var i = ball_cnt; i > 0; i--)
        {
			setUpNewBall();
        }
	});
	
	$("#to_home").click(function()
	{
		points = 0;
		$("#points").text(points);
		balls = {};
		ball_counter = 0;
		ball_size = 0;
		milisec_gone = 0;
		$("#pagewrap").show();
		$("#game").hide();
	});
	
	$("#about").click(function()
	{
		$('#info_screen').reveal({ // The item which will be opened with reveal
			animation: 'fade',                   // fade, fadeAndPop, none
			animationspeed: 600,                       // how fast animtions are
			closeonbackgroundclick: true,              // if you click background will modal close?
			dismissmodalclass: 'close'    // the class of a button or element that will close an open modal
		});
	});
});

onResize = function(){
	$("#app").css ("height",$("#app").width());
	m_top = $("#container").height() / 2;
	$("#container").css("margin-top","-"+m_top+"px");
    var oldw = appw;
    var oldh = apph;
	var oldOfTop = offsetTop;
	var oldOfLeft = offsetLeft;
	var oldgamew = gamew;
    var oldgameh = gameh;
    if(oldw != $("#app").width() || oldh != $("#app").height() || oldgamew != $("html").width() || oldgameh != $("html").height())
    {
        appw = $("#app").width();
        apph = $("#app").height();
		gamew = $("html").width();
        gameh = $("html").height();
		offsetTop = $("#app").offset().top;
		offsetLeft = $("#app").offset().left;
        radius = Math.floor((appw * apph) / ratio);
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