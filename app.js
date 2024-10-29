const levelMapper = {
    easy:{
        boardSize: 10,
        mineCount: 20
    },
    medium:{
        boardSize: 15,
        mineCount: 45
    },
    hard:{
        boardSize: 20,
        mineCount: 80
    }
}

function startGame(level="easy"){
    // console.log(level);
    
    const flags = document.querySelector('.minesweeper-flag-count');
    const board = document.querySelector('.minesweeper-board');
    flags.innerHTML="";
    board.innerHTML="";

    let boardSize = levelMapper[level].boardSize;
    let mineCount = levelMapper[level].mineCount;
    let mines = [];
    let flagsCount = mineCount;
    setFlagCount();
    let gameOver = false;

    createBoard();
    addMines();

    function setFlagCount(){
        flags.innerText = `${flagsCount}`;
    }

    function addMines(){
        while(mines.length < mineCount){
            let r = Math.floor(Math.random() * boardSize);
            let c = Math.floor(Math.random() * boardSize);
            let minePos = `${r}-${c}`;
            if (!mines.includes(minePos)){
                mines.push(minePos);
            }
        }
    }

    function createBoard(){
        for (let i=0; i<boardSize; i++){
            const row = document.createElement("div");
            row.classList.add("minesweeper-row", "row");
            for (let j=0; j<boardSize; j++){
                const box = document.createElement("div");
                box.classList.add("box");
                box.id = `${i}-${j}`;
                box.addEventListener("click", revealBox);
                box.addEventListener("contextmenu", flagBox);
                row.append(box);
            }
            board.append(row);
        }

        board.addEventListener("contextmenu", (event)=>{
            event.preventDefault();
            console.log("right click for board works");
        });
    }

    function revealBox(event){
        const box = event.target;
        const values = box.id.split("-");
        const r = parseInt(values[0]);
        const c = parseInt(values[1]);

        if (box.classList.contains("flag")){
            return;
        }
        if (box.classList.contains("revealed")){
            box.removeEventListener("click", revealBox);
            return;
        }

        checkMine(box);
        revealCount(r, c);

        if (document.querySelectorAll(".box.revealed:not(.mine)").length === (boardSize*boardSize - mineCount)){
            gameOver = true;
            board.querySelectorAll(".box").forEach(box => {
                if (mines.includes(box.id)){
                    box.classList.add("win");
                }
            });
            alert("You Won");
        }

        box.classList.add("revealed");
    }

    function flagBox(event){
        // console.log("control comes here..");
        event.preventDefault();
        const box = event.target;
        if (box.classList.contains("revealed")){
            return;
        }
        if (box.classList.contains("flag")){
            box.classList.remove("flag");
            flagsCount++;
        }else{
            box.classList.add("flag");
            flagsCount--;
        }
        setFlagCount();
    }

    function returnBox(r, c){
        return board.querySelector(`.minesweeper-row:nth-child(${r+1}) .box:nth-child(${c+1})`);
    }

    function checkMine(box){
        if (mines.includes(box.id)){
            revealMines();
            gameOver = true;
            alert("You Lost");
        }
    }

    function revealMines(){
        mines.forEach(coor =>{
            const values = coor.split("-");
            const r = parseInt(values[0]);
            const c = parseInt(values[1]);
            returnBox(r,c).classList.add("revealed", "mine");
        })
    }

    function revealCount(r, c){
        if (r<0 || c<0 || r>=boardSize || c>=boardSize || gameOver){
            return;
        }
        if (returnBox(r,c).classList.contains("revealed")){
            return;
        }
        returnBox(r,c).classList.add("revealed");
        let count = 0;
        for (let i=r-1; i<=r+1; i++){
            for (let j=c-1; j<=c+1; j++){
                if (i>-1 && i<boardSize && j>-1 && j<boardSize && mines.includes(`${i}-${j}`)){
                    count++;
                }
            }
        }
        if (count > 0){
            returnBox(r,c).innerText = count;
            returnBox(r,c).classList.add(`text-${count}`);
        }else{
            for (let i=r-1; i<=r+1; i++){
                for (let j=c-1; j<=c+1; j++){
                    revealCount(i,j);
                }
            }
        }
    }

}

document.addEventListener("DOMContentLoaded", startGame("easy"));

function selectLevel(){
    const levelSelect = document.querySelector('.minesweeper-level');
    levelSelect.addEventListener("change", (event)=>{
        let level = event.target.value;
        startGame(level);
        // console.log(level);
    });
}

function restartGame(){
    const restart = document.querySelector('.minesweeper-restart');
    restart.addEventListener("click", ()=>{
        startGame();
    });
}

selectLevel();
restartGame();


