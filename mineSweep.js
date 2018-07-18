let width = 30, height = 16;
let timerInterval;

function customMapGen(){
  clearInterval(timerInterval)
  secs = 0;
  document.getElementsByClassName("timer")[0].innerHTML = "000";
  document.getElementsByClassName("restart")[0].style.backgroundImage = "url('./Pic/smiley.png')"

  let w = Number(document.getElementsByClassName("width")[0].value);
  if(w === 0)w = 30;
  else if(w < 8)w = 8;
  let h = Number(document.getElementsByClassName("height")[0].value);
  if(h === 0)h = 16;
  else if(h < 8)h = 8;
  let backgr = document.getElementsByClassName("backgr")[0];
  let table = document.getElementsByClassName("table")[0];
  let bombCount;

  width = w;
  height = h;

  if(w === 30 && h === 16){
    bombCount = 99;
  }
  else if (w === 16 && h === 16) {
    bombCount = 40;
  }
  else if (w === 8 && h === 8) {
    bombCount = 10;
  }
  else{
    bombCount = Math.ceil(width*height*0.15625);
  }

  while (table.firstChild) {
    table.removeChild(table.firstChild);
  }
  mapGen(bombCount);
}

function mapGen(bombCount){
  let table = document.getElementsByClassName("table")[0];
  let tdGet = document.getElementsByTagName("td");
  let borderRight = [], borderLeft = [], borderTop = [], borderBottom = [], greyOpenArray = [], blackList = [], openBlocked = [];
  let offSets = [1, -1, width, -width, width+1, -width+1, width-1, -width-1];
  let tr, td, timerActive = false, secs = 0, freez = false;

  document.getElementsByClassName("bombCount")[0].innerHTML = (bombCount < 100 ? "0"+bombCount: bombCount) ;

  for(i = 0; i < height; i++){
    tr = document.createElement("tr");
    table.appendChild(tr);
    for(j = 0; j < width; j++){
      td = document.createElement("td");
      document.getElementsByTagName("tr")[i].appendChild(td);
    }
  }

  for(i = 0; i < bombCount; i++){
    let bombIndex = Math.ceil(Math.random()*(width*height-1));
    if(tdGet[bombIndex].classList[0] !== "bomb"){
      tdGet[bombIndex].classList.add("bomb");
    }
    else{
      i--
    }
  }

  for(let i = 0; i < width; i++){
    borderTop[i] = i;
    borderBottom[i] = width*height-width+i;
  }
  for(let i = 0; i < height-2; i++){
    borderLeft[i] = width+(i*width);
    borderRight[i] = width*2-1+i*width;
  }

  mainClassGiv(borderTop, 1, true);
  mainClassGiv(borderBottom, -1, true);
  mainClassGiv(borderLeft, 1, false);
  mainClassGiv(borderRight, -1, false);

  function mainClassGiv(border, direction, UpDown){
    for(let i = 0; i < border.length; i++){
      if(tdGet[border[i]].classList[0] !== "bomb"){
        let bombNear = 0;
        if (UpDown) {
          if(i != (border.length-1) && tdGet[border[i]+1].classList[0] === "bomb"){bombNear++}
          if(i != 0 && tdGet[border[i]-1].classList[0] === "bomb"){bombNear++}
          if(tdGet[border[i]+(direction*width)].classList[0] === "bomb"){bombNear++}
          if(i != (border.length-1) && tdGet[border[i]+(direction*width)+1].classList[0] === "bomb"){bombNear++}
          if(i != 0 && tdGet[border[i]+(direction*width)-1].classList[0] === "bomb"){bombNear++}
        }
        else {
          if(tdGet[border[i]+width].classList[0] === "bomb"){bombNear++}
          if(tdGet[border[i]-width].classList[0] === "bomb"){bombNear++}
          if(tdGet[border[i]+direction].classList[0] === "bomb"){bombNear++}
          if(tdGet[border[i]+direction+width].classList[0] === "bomb"){bombNear++}
          if(tdGet[border[i]+direction-width].classList[0] === "bomb"){bombNear++}
        }
        if(bombNear != 0){
          tdGet[border[i]].classList.add("bombNear" + bombNear);
        }
        else{
          tdGet[border[i]].classList.add("noBomb");
        }
      }
    }
  }
  for(let i = 1; i < height-1; i++){
    for(let j = 1; j < width-1; j++){
      if(tdGet[i*width+j].classList[0] !== "bomb"){
        let bombNear = 0;
        for (index in offSets){
          if(tdGet[i*width+j+offSets[index]].classList[0] === "bomb"){bombNear++}
        }
        if(bombNear != 0){tdGet[i*width+j].classList.add("bombNear" + bombNear);}
        else{tdGet[i*width+j].classList.add("noBomb");}
      }
    }
  }

  for(let i = 0; i < width*height; i++){
    tdGet[i].style.backgroundImage = "url('./Pic/closed.png')";
    tdGet[i].addEventListener("click", () => {if(!(openBlocked.includes(i)) && !(freez)){open(i);}});

    document.getElementsByTagName("td")[i].oncontextmenu = () =>{ //right click
      if (tdGet[i].style.backgroundImage === 'url("./Pic/closed.png")' || tdGet[i].style.backgroundImage === 'url("./Pic/flag.png")'){}
      else{return;}

      function bombCounter(bombCount) {
        if (bombCount < 10){
          document.getElementsByClassName("bombCount")[0].innerHTML = "00" + bombCount;
        }
        else if (bombCount < 100){
          document.getElementsByClassName("bombCount")[0].innerHTML = "00" + bombCount;
        }
        else{
          document.getElementsByClassName("bombCount")[0].innerHTML = bombCount;
        }
      }

      if (openBlocked.includes(i)){
        openBlocked = openBlocked.filter((num) => {return !(num === i);});
        tdGet[i].style.backgroundImage = "url('./Pic/closed.png')";
        bombCount++;
        bombCounter(bombCount);
      }
      else {
        openBlocked[openBlocked.length] = i;
        tdGet[i].style.backgroundImage = "url('./Pic/flag.png')";
        bombCount--;
        bombCounter(bombCount);
      }
      return false;
    }
  }

  function open(i){
    if (tdGet[i].classList[0] == "noBomb"){
      if(!(blackList.includes(i))){
        greyOpenArray[greyOpenArray.length] = i;
        greyOpen(i);
      }
    }
    else if (tdGet[i].classList[0] === "bomb"){
      for (let j = 0; j < width*height-1; j++){
        if (tdGet[j].style.backgroundImage === 'url("./Pic/flag.png")' && tdGet[j].classList[0] !== "bomb"){
          tdGet[j].style.backgroundImage = "url('./Pic/xbomb.png')";
        }
        else if (tdGet[j].classList[0] === "bomb" && tdGet[j].style.backgroundImage !== 'url("./Pic/flag.png")'){
            tdGet[j].style.backgroundImage = "url('./Pic/bomb.png')";
        }
      }
      tdGet[i].style.backgroundImage = "url('./Pic/redBgBomb.png')";
      freez = true;
      document.getElementsByClassName("restart")[0].style.backgroundImage = "url('./Pic/deadSmiley.png')"
      clearInterval(timerInterval)
    }
    else{
      if (!(timerActive)){
        timerActive = true;
        timerInterval = setInterval(() => {
          let timer = document.getElementsByClassName("timer")[0];
          if(secs < 10){
            timer.innerHTML = "00" + secs;
          }
          else if (secs < 100){
            timer.innerHTML = "0" + secs;
          }
          secs++;}, 1000);
      }
      tdGet[i].style.backgroundImage = "url('./Pic/openedNums/open" + tdGet[i].classList[0].substr(8,1) + ".png')";
      tdGet[i].style.backgroundColor = "#909090";

      if (bombCount === 0){
        let win = true;
        for (let j = 0; j < openBlocked.length; j++){
          if (tdGet[openBlocked[j]].classList[0] !== "bomb"){
            win = false;
            break;
          }
        }
        if (win){
          freez = true;
          document.getElementsByClassName("restart")[0].style.backgroundImage = "url('./Pic/coolSmiley.png')"
          clearInterval(timerInterval)
        }
      }
    }
  }

  function greyOpen(i){
    tdGet[i].style.backgroundImage = "url('./Pic/openedNums/open0.png')";
    for (let index = 0; index < offSets.length; index++){
      if(i+offSets[index] < 0 ||
         i+offSets[index] > width*height-1 ||
         (i === width-1 && (index == 0 || index == 4 || index == 5)) ||
         (i === width*height-width && (index == 1 || index == 6 || index == 7)) ||
         (i === width*height-1 && index == 5) ||
         (i === 0 && index == 6) ||
         (borderLeft.includes(i) && (index == 1 || index == 6 || index == 7)) ||
         (borderRight.includes(i) && (index == 0 || index == 4 || index == 5))
       ){continue;}
      if(tdGet[i+offSets[index]].classList[0] == "noBomb"){
        if(!(blackList.includes(i+offSets[index]))){
          greyOpenArray[greyOpenArray.length] = i+offSets[index];
          blackList[blackList.length] = i;
        }
      }
      else{
        open(i+offSets[index]);
      }
    }
    greyOpenArray.shift();
    if (greyOpenArray.length !== 0){
      greyOpen(greyOpenArray[0]);
    }
  }

}
