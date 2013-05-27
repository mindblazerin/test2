var balls = {}; //objekts kur glab�sies bumbi�as
var ball_counter = 0; //bumbi�u identifikatora skait�t�js skait�t�js
var balls_size = 0; //bumbi�u objekta izm�rs - cik bumbi�as ir objekt�
var ball_cnt = 5; //s�kuma bumbi�u skaits
var radius = 32; //s�kuma bumbi�u r�diuss
var ratio = 10000; //bumbi�as un ekr�na attiec�ba - 1bumbi�a = 1/10000 da�a no ekr�na platuma * ekr�na garuma
var points = 0; //punkti
var appw = 0, apph = 0; //bumbi�u laukuma izm�rs
var gamew = 0, gameh = 0, offsetLeft = 0, offsetTop = 0; //sp�les loga izm�rs un t� nob�des
var interval; //interv�ls p�c kura main�s visu bumbi�u novietojums
var game_time; //sp�les laika interv�la main�gais
var time_milisec = 6000; //1 sp�les laiks milisekund�s
var milisec_gone = 0; //pag�ju��s milisekundes
var addBallInterval; //bumbi�u pievieno�anas interv�la main�gais
  
  
/*objekta bumbi�a konstruktora funkcija
	x un y argumenti tiek apr��in�ti p�c nejau��bas principa, ar noteikumu, ka bumbi�as koordin�t�m j�atbilst bumbi�u laukuma izm�riem
	color - kr�sa
	speedx , speedy - �trums p�c nejau��bas principa pareizin�ts ar konstanti un pieskait�ts 0.2, lai bumbi�as �trums nevar�tu b�t 0
	ball nepiecie�amais html elements, kur� att�lo bumbi�u
*/ 	  
var ball = function(index){
	this.x = getRandom($("#app").offset().left, appw+$("#app").offset().left - (radius * 2));
	this.y = getRandom($("#app").position().top, apph+$("#app").position().top - (radius * 2));
    this.color = "#FF0000";
    this.speedx = 0.2 + Math.random() * 5;
    this.speedy = 0.2 + Math.random() * 5;
    this.radius = radius;
    this.ball = document.createElement("div");
}

/*
	funkcija, kas pievieno jaunu bumbi�u sp�lei
*/
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

/*
	funkcija, kas p�rvieto bumbi�as
*/
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

/*
	funkcija, kas atgrie� nejau�u skaitli robe��s no - l�dz
*/
function getRandom (min, max) {
    return (Math.random() * (max - min) + min);
}

/*
	funkcija, kas uz notikumu onmousedown izpilda bumbi�u dz��anu no ekr�na un objekta un pieskaita lieto�jam punktus
*/
function ballClick(e){
	//some bug workaround
	if(e.target.parentNode.id != "app")
	{
		/*console.log("Delete ", e.target.parentNode);*/
		balls_size--;
		var id = e.target.parentNode.id;
		$(e.target.parentNode).remove();
		delete(balls[id]);
		points++;
		$("#points").text(points);
	}
}

/*
	sp�les laika skait��anas funkcija, par�da lietot�jam atliku�o sp�les laiku un ja laiks beidzies izvada rezult�tu
*/
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
	}
}

/*
	funkcija, kas par�da diva 'end_screen' saturu, kad spele ir beigusies
*/
function showEndScreen(points) {

	$('#end_screen').reveal({
		animation: 'none',                   // fade, fadeAndPop, none
		animationspeed: 600,                      
		closeonbackgroundclick: false,        
		dismissmodalclass: 'close'
	});
	$("#end_result").html(points);
}

/*
	JQUERY funkcija, kas nostr�d� br�d�, kad t�mek�a vietnes lapa iel�d�jusies
*/
$(document).ready(function(){
	$("#container").hide();
	$(window).resize(onResize);
	setTimeout(function(){
		m_top = $("#container").height() / 2;
		$("#container").css("margin-top","-"+m_top+"px");
		$("#container").show();
	},100);
	
    $("#pixel").text(screen.width+"x"+screen.height);
    $("#game").hide();
	//funcijas, kas nostr�d� uz pogas 'SP�L�T' klik��i
    $("#btn_start").click(function()
    {
        onResize();
		$("#game").show();
        for(var i = ball_cnt; i > 0; i--)
        {
			setUpNewBall();
        }
		//izsauc funkciju move ik p�c 3 sekund�m
        interval = setInterval(move,3000);
        $("#pagewrap").hide();
		//izsauc funkciju timeTick ik p�c 10 mikrosekund�m
		game_time = setInterval(timeTick,10);
		//izsauc funkciju setUpNewBall ik p�c pus sekundes
		addBallInterval = setInterval(setUpNewBall, 500);
    });
	
	/*
		tiek atstat�ti sp�les dati, lai s�ktu sp�li no jauna(tiek izpild�ts p�c pogas 'play_again' nospie�anas)
	*/
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
	
	/*
		tiek atv�rts aplik�cijas pirmais skats(tiek izpild�ts p�c pogas 'to_home' nospie�anas)
	*/
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
	
	/*
		par�d�s apraksts par sp�li (popup)
	*/
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

/*
	funkcija, kas maina bumbi�u izm�rus un novietojumu atkar�b� no da��d�m ekr�na izmai��m 
*/
onResize = function(){
	$("#app_div").css ("height",$("#app_div").width());
	$("#app").css ("height",$("#app").width());
	
	move();
	if($("html").height()>$("html").width())
	{
		$("#info").css({'float': 'none', 'width': '100%', 'margin': '0 auto', 'padding-top': '0px'});
		$("#app_div").css({'float': 'none', 'width': '100%'});
	}
	else
	{
		$("#info").css({'float': 'left', 'width': '25%', 'margin': 'auto', 'padding-top': '100px'});
		$("#app_div").css({'float': 'right', 'width': '75%'});
	}
	
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