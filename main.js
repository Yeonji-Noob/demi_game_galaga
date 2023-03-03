// 캔버스 세팅

let canvas;
let ctx;

canvas = document.createElement("canvas")
ctx = canvas.getContext("2d")

canvas.width=400;
canvas.height=700;

document.body.appendChild(canvas);


// 이미지 변수 설정
let backgroundImage,spaceshipImage,bulletImage,enemyImage,gameOverImage;

let gameOver=false
// true=게임이 끝남 
let score=0

// 우주선 좌표
let spaceshipX = canvas.width/2 - 34
let spaceshipY = canvas.height - 70

let bulletList = [] //총알저장배열
function Bullet(){
  this.x=0;
  this.y=0;
  this.init=function(){
    this.x = spaceshipX+28;
    this.y = spaceshipY;
    this.alive=true //총알 뒤지면 false

    bulletList.push(this);
  };

  this.update =  function() {
    this.y -= 7;
  };

  // 총알이 적을 쳤을때 
  this.checkHit=function() {
  //총알.y <= 적.y and
  //총알.x >= 적.x and 총알.x <= 적.x + 적의 넓이

    for(let i=0;i < enemyList.length;i++){
      if(this.y <=enemyList[i].y && this.x >= enemyList[i].x && this.x <= enemyList[i].x+36)
      {score++;
        this.alive=false //총알주금
        enemyList.splice(i,1);
      }
    }
    
  }
}

function generateRandomValue(min,max) {
  let randomNum = Math.floor(Math.random()*(max-min+1))+min
  return randomNum
}

let enemyList=[]
function Enemy() {
  this.x=0;
  this.y=0;
  this.init =function() {
    this.y=0
    this.x=generateRandomValue(0,canvas.width-42)
    enemyList.push(this);
  };

  this.update=function(){
    this.y += 2; //적 속도 조절

    if(this.y >= canvas.height - 36) {
    gameOver=true;
    }
  };
}

// 이미지 불러오기
function loadImage() {
  backgroundImage = new Image();
  backgroundImage.src="images/background.png";

  spaceshipImage = new Image();
  spaceshipImage.src="images/spaceship.png";

  bulletImage = new Image();
  bulletImage.src="images/bullet.png";

  enemyImage = new Image();
  enemyImage.src="images/invader.png";

  gameOverImage = new Image();
  gameOverImage.src="images/gameover.png";
}

// 방향키 이벤트
let keysDown={}
function setupKeyboardListener() {
  document.addEventListener("keydown",function(event){ 
     keysDown[event.key] = true;

  });
  document.addEventListener("keyup",function(event){
    delete keysDown[event.key];

    if(event.key == ' ') {createBullet()}
  });
}

// 하나의 함수에는 하나의 역할,,,

function createBullet() {
  let b = new Bullet();
  b.init();
}

function createEnemy() {
  const interval = setInterval(function(){
    let e = new Enemy()
    e.init()
  },1000)
}
// 시간 딜레이해서 호출해서 찍어내기
// 단위가 ms이므로 1초하려면 1000ms



// 없데이트
function update() {
  if ('ArrowRight' in keysDown){
    spaceshipX += 5;
  } // right
  if ('ArrowLeft' in keysDown){
    spaceshipX -= 5;
  } // left
  
  // 우주선 x값 한정시키기(밖으로안나가게)
  if (spaceshipX <= 0) {
    spaceshipX=0
  }
  if (spaceshipX >= canvas.width-68){
    spaceshipX = 400 - 68;
  }

  //총알의 y좌표 없데이트
  for(let i=0;i<bulletList.length;i++)
  if(bulletList[i].alive){
    bulletList[i].update();
    bulletList[i].checkHit();
  }


  for(let i=0;i<enemyList.length;i++)
  {enemyList[i].update();
  }
}

function render() {
  ctx.drawImage(backgroundImage,0,0,canvas.width, canvas.height);
  ctx.drawImage(spaceshipImage,spaceshipX,spaceshipY)

  ctx.fillText(`Score:${score}`, 20, 40);
  ctx.fillStyle = "white"
  ctx.font = "20px arial"

  for(let i=0;i<bulletList.length;i++){
    if (bulletList[i].alive) {
      ctx.drawImage(bulletImage,bulletList[i].x,bulletList[i].y)
    }
  }


  for(let i=0;i<enemyList.length;i++){
    ctx.drawImage(enemyImage,enemyList[i].x, enemyList[i].y)
  }
}

function main() {
  if (!gameOver) {
  update();  //좌표값 업데이트
  render(); //그려주기
  requestAnimationFrame(main);
  }

  else{
    ctx.drawImage(gameOverImage, 73, 240,gameOverImage.width,gameOverImage.height)
  }
}

// 웹사이트 시작하자마자 호출
loadImage();
setupKeyboardListener();
createEnemy();
main();



// 총알
// 1.스페이스바를 누르면 총알 발사
// 2.총알의 y값 변경 (시작은 우주선 위치)
// 3.발사된 총알들은 배열에 저장
// 4.x,y 좌표값이 있어야 함
// 5.총알 배열을 가지고 render