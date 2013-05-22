var screenWidth = 0;
var screenHeigth = 0;
var balls = [];
var ball_cnt = 7;
var radius = 0;
var context = "";
var points = 0;

function ball(index){
    this.x = getRandom(radius, $("#myCanvas").width() - (2*radius));
    this.y = getRandom(radius, $("#myCanvas").height() - (2*radius));
    this.color = "#FF0000";
    this.speedx = Math.random();
    this.speedy = Math.random();
    this.radius = radius;
    this.name = "ball"+index;
}

function onResize(){
    if($(window).innerWidth() !== screenWidth || 
       $(window).innerHeight() !== screenHeigth)
    {
        screenWidth = $(window).innerWidth();
        screenHeigth = $(window).innerHeight();
        radius = screenWidth / 1000 * 25;
        document.getElementById("myCanvas").width = screenWidth / 100 * 95;
        document.getElementById("myCanvas").height = screenHeigth / 10 * 9;
    }
}

function draw(){
    context = $("#myCanvas")[0].getContext('2d');
    context.clearRect(0,0,screenWidth,screenHeigth / 10 * 9);
    context.beginPath();
    for(var key in balls)
    {
        balls[key].x += balls[key].speedx;
        balls[key].y += balls[key].speedy;
        //if ball hits bottom or top side of screen
        if(balls[key].y + radius >= $("#myCanvas").height() || balls[key].y - radius <= 0)
        {
            balls[key].speedy *= -1;
        }
        
        //if ball hits right or left side of screen
        if(balls[key].x + radius >= $("#myCanvas").width() || balls[key].x - radius <= 0)
        {
            balls[key].speedx *= -1;
        }
        context.fillStyle = balls[key].color;
        context.arc(balls[key].x,balls[key].y,radius,0,Math.PI*2, true);
    }
    context.closePath();
    context.fill();
} 

function getRandom (min, max) {
    return Math.random() * (max - min) + min;
}

function canvasOnClick(e)
{
    for(var key in balls)
    {
        //check if click is in rect of ball
        if(e.clientX >= (balls[key].x - radius) && e.clientX <= (balls[key].x + (radius*2)) &&
            e.clientY >= balls[key].y && e.clientY <= (balls[key].y + (radius*2)))
        {
            console.log("Ball min",(balls[key].x - radius),":", balls[key].y, "ball max",
            (balls[key].x + (radius * 2)),":",(balls[key].y + (radius * 2)),
            "mouseClick", e.clientX, ":", e.clientY);
            delete(balls[key]);
            points++;
        }
    }
}

$(document).ready(function()
{
    $("#info").text(screen.availHeight+"x"+screen.availWidth);
    $("#myCanvas").click(canvasOnClick)
    $(window).resize(onResize);
    onResize();
    for(var i = ball_cnt; i > 0; i--)
    {
        balls.push(new ball());
    }
    
    setInterval(draw,10);
});
