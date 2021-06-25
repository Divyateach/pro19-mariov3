  var mario, marioRunning, marioCollided;
  var ground, groundImg, invisibleGround;
  var bg, bgImg;
  var brick, brickImg;
  var obImg1, obImg2, obImg3, obImg4, obstacle;
  var gameOver, gameOverImg, restart, restartImg;
  var bricksGroup, obstaclesGroup;
  var PLAY = 1;
  var END = 0;
  var gameState = PLAY;
  var score=0;
  var jumpSound,checkPointSound,dieSound;

function preload() {
    bgImg = loadImage("bg.png");
   back1=loadAnimation("bk7.png");
    back2=loadAnimation("bk5.png");
   //bgImg2=loadImage("bgimg2.png");

    marioRunning = loadAnimation("mario00.png", "mario01.png", "mario02.png", "mario03.png");
    marioCollided = loadAnimation("collided.png");


    groundImg = loadImage("ground2.png");

    brickImg = loadImage("brick.png");

    obImg1 = loadImage("obstacle1.png");
    obImg2 = loadImage("obstacle2.png");
    obImg3 = loadImage("obstacle3.png");
    obImg4 = loadImage("obstacle4.png");
  
    coinImage=loadImage("coinmario-removebg-preview.png");
    gameOverImg = loadImage("gameOver.png");
    restartImg = loadImage("restart.png");

    checkPointSound=loadSound("checkPoint.mp3");
    jumpSound=loadSound("jump.mp3");
    dieSound=loadSound("die.mp3");

}

function setup() {
  background(0);
  createCanvas(600, 300);

  bg = createSprite(200, 200, 600, 300);
  bg.addImage("bg", bgImg);
  bg.addAnimation("background",back1);
  bg.x = bg.width / 2;
  bg.scale=1.6

  
  
  
  
  mario = createSprite(200, 230, 10, 40);
  mario.addAnimation("running", marioRunning);
  mario.addAnimation("collided", marioCollided);
  mario.scale = 1.7;
  mario.setCollider("circle",0,0,15);
 // mario.debug=true;
  

  ground = createSprite(100, 295, 600, 20);
  ground.addImage("ground", groundImg);
  ground.scale = 1;

  invisibleGround = createSprite(50, 270, 600, 20);
  invisibleGround.visible = false;

  gameOver = createSprite(300, 50);
  gameOver.addImage("gameOver", gameOverImg);
  gameOver.scale = 0.7;

  restart = createSprite(300, 200);
  restart.addImage("restart", restartImg);
  restart.scale = 0.7;

  bricksGroup = new Group();
  obstaclesGroup = new Group();
  coinGroup=new Group();
  
}

function draw() {

  
  drawSprites();
  textSize(25);
  fill("red");
  stroke("black");
  text("Score : "+score,400,40);
  if (gameState === PLAY)
  {
     
    gameOver.visible = false;
    restart.visible = false;
    

    if(score>0 && score%100===0){
    checkPointSound.play();
    }
    
    bg.velocityX = -3;

    ground.velocityX = -3;

    //console.log(frameCount);
    if (bg.x <= 300) {
      
      bg.x = bg.width / 2;
    }
    if (ground.x <= 0) {
      ground.x = ground.width / 2;
    }
    //console.log(mario.y);
    if (keyDown("space") && mario.y >= 220) {
      mario.velocityY = -13;
       jumpSound.play();
    }
    //adding gravity
    mario.velocityY = mario.velocityY + 0.7;
if(score>10)
  {
    bg.changeAnimation("background",back1);
    bg.x=300;
    bg.y=170;
     
  }
    if(score>20)
  {
    bg.changeAnimation("background",back2);
    bg.x=300;
    bg.y=170;
     
  }
    spawnBrick();
spawnCoin();
    spawnObstacles();
    if(bricksGroup.isTouching(mario)){
      score=score+2;
      bricksGroup.destroyEach();
    }
    if(coinGroup.isTouching(mario))
  {
    coinGroup.destroyEach();
    score=score+5;
  }
    
     if(obstaclesGroup.isTouching(mario)){
      dieSound.play();
      gameState=END;
      
      }
  

  } else if(gameState===END) {
    gameOver.visible=true;
      restart.visible=true;
    
      mario.velocityY=0;
      ground.velocityX=0;
    
    // to stop the clouds
      bg.velocityX=0;

    mario.collide(invisibleGround);                      mario.changeAnimation("collided",marioCollided);
    
    
      obstaclesGroup.setLifetimeEach(-1);
      bricksGroup.setLifetimeEach(-1);

      obstaclesGroup.setVelocityXEach(0);
      bricksGroup.setVelocityXEach(0);
    
      if(mousePressedOver(restart)){
       reset();
     }

  }


  mario.collide(invisibleGround);
}

  function spawnBrick() {

  if (frameCount % 60 === 0) {
    brick = createSprite(500, 120, 20, 20);
    brick.y = Math.round(random(100, 180));
    brick.addImage("brick", brickImg);

    brick.velocityX = -4;

    brick.lifetime = 200;

    brick.depth = mario.depth;
    mario.depth = mario.depth + 1;

    bricksGroup.add(brick);
  }
}

function spawnObstacles() {

  if (frameCount % 100 === 0) {

    obstacle = createSprite(500, 230, 20, 20);
    obstacle.velocityX = -4;
    obstacle.lifetime = width / obstacle.velocityX;
    obstacle.setCollider("circle",0,0,18);
    //obstacle.debug=true;
    
    var rand = Math.round(random(1, 4));
    switch (rand) {
      case 1:
        obstacle.addImage(obImg1);
        break;
      case 2:
        obstacle.addImage(obImg2);
        break;
      case 3:
        obstacle.addImage(obImg3);
        break;
      case 4:
        obstacle.addImage(obImg4);
        break;

      default:
        break;
    }
    obstaclesGroup.add(obstacle);


  }

}

  function reset(){
  
  gameState=PLAY;
  
  gameOver.visible=false;
  restart.visible=false;
  
  obstaclesGroup.destroyEach();
  bricksGroup.destroyEach();
  
  mario.changeAnimation("running",marioRunning);
  
  score=0;
  
  
}

  function spawnCoin()
{
  if (frameCount % 40 === 0) {

    coin = createSprite(500,130, 20, 20);
    coin.addImage(coinImage);
    coin.velocityX = -4;
    //coin.lifetime = width / coin.velocityX;
    coin.setCollider("circle",0,0,18);
    coin.scale=0.3;
    coinGroup.add(coin);
  }
}