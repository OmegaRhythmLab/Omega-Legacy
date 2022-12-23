// 游戏运行的唯一标识
const GAME_START = 1;
const GAME_STOP = 0;
var game_statue = GAME_STOP;

// 读取谱面
function openChart(path){
    let req = new XMLHttpRequest();
    var res = {};
    req.onreadystatechange = function(){
        if (this.readyState == 4 && this.status == 200){
            res = chartReader(this.responseText);
            return;
        }
    }
    req.open("GET", path, false);
    req.send();
    return res;
}

// 分析谱面
function chartReader(chart){
    // chart转为列表
    chart = chart.split("\n");
    // OMEGA标识符
    if (chart.indexOf("!ChartType OMEGA\r") != -1){
        // 铺面信息
        var chartInfo = {
            bpm: 0,
            bpm_ms: 0,
            notespeed: [],
            composer: "<nameless>",
            artist: "<nameless>",
            chart: "<nameless>",
            name: "<nameless>",
            level: "<nameless>",
            path: "<pathless>",
            offset: 0,
            combos: 0,
            score_per_one: 0,
            notes: [],
            time_all: 0,
        }
        // 遍历chart获取信息
        for(var i=0; i<=chart.length-1; i++){
            var item = chart[i].replace(/\r/g,"")

            // bpm ... 唯一标识符
            switch (item){

                // bpm, bpm_ms
                case "bpm":
                    chartInfo["bpm"] = parseInt(chart[i+1])
                    chartInfo["bpm_ms"] = parseInt(60/parseInt(chart[i+1])*1000)
                    break;
                
                // artist
                case "artist":
                    chartInfo["artist"] = chart[i+1].replace(/\r/g,"")
                    break;

                // composer
                case "composer":
                    chartInfo["composer"] = chart[i+1].replace(/\r/g,"")
                    break;
                
                // chart
                case "chart":
                    chartInfo["chart"] = chart[i+1].replace(/\r/g,"")
                    break;
                
                // level
                case "level":
                    chartInfo["level"] = chart[i+1].replace(/\r/g,"")
                    break;
                
                // name
                case "name":
                    chartInfo["name"] = chart[i+1].replace(/\r/g,"")
                    break;

                // path(musicPath)
                case "musicPath":
                    chartInfo["path"] = chart[i+1].replace(/\r/g,"")
                    break;

                // offset
                case "offset":
                    chartInfo["offset"] = parseInt(chart[i+1])
                    break;
                
                // notespeed, time_all, notes...
                default:
                    // n/n m 类型的数据
                    if (item.indexOf("/") == 1){
                        item = item.split(" ")

                        // time_all 所有时间(ms)
                        chartInfo["time_all"] += parseInt(parseInt(item[0][0])/parseInt(item[0][2])*parseInt(chartInfo["bpm_ms"]))
                        
                        // 长度为2的数据后都带有notespeed属性(ms)
                        if (item.length == 2){
                            // notespeed
                            chartInfo["notespeed"].push([chartInfo["time_all"],parseInt(item[1])]);
                        }
                        
                        // nnnn 或 nnnnmmmm 类型的数据
                        var temp_noteAry = []
                        for (var j=0; j<chart[i+1].replace(/\r/g,"").length; j++){
                            temp_noteAry.push(parseInt(chart[i+1][j]));
                        }

                        // notes
                        chartInfo["notes"].push([chartInfo["time_all"],temp_noteAry]);
                    }
            }
        }
    }
    return chartInfo;
}


// 开始函数
function game_statue_switch(){
    // 状态切换
    switch (game_statue){
        // 切换: 停止 -> 开始
        case GAME_STOP:
            game_statue = GAME_START;
            let chartSelect = document.getElementById("openFile").value;
            let chartPath = `chart/${chartSelect}.txt`;
            document.getElementById("openFile").setAttribute("disabled", true);
            document.getElementById("auto").setAttribute("disabled", true);
            main(openChart(chartPath));
            break;
        // 切换: 开始 -> 停止
        case GAME_START:
            game_statue = GAME_STOP;
            break;
    } 
}


function main(chart){
    console.log(chart)

    // 生成音符
    function getNotes(notes,speed,offset,fps){
        // 1:tap; 2:hold_head; 4:hold_end; 5:motion
        // notes = [[time,[a,b,c,d(,e,f,g,h)]],..]
        // speed = [[time,spd],..]
        // tap = [L1->[y],L2->[y],L3->[y],L4->[y]]
        var tap = [[],[],[],[]];
        var hold = [];
        var hold_start_time = [[],[],[],[]];
        var motion = [];
        var notespeed = 10;
        var yTotal = -offset/(1000/fps)*notespeed;
        for(let i in notes){
            for(let j = speed.length-1; j >= 0; j--){
                if(notes[i][0] >= speed[j][0]){
                    notespeed = 500/(speed[j][1]/(1000/fps));
                    break;
                }
            }
            for(let j in notes[i][1]){
                if(notes[i][1].length <= 4){
                    let spawnPos = -parseInt(notes[i][0] / (1000/fps)) * (1000/fps) * notespeed / 10 + yTotal
                    switch (notes[i][1][j]){
                        case 1:
                            tap[j].push(spawnPos);
                            break;
                        case 2:
                            hold_start_time[j] = spawnPos;
                            break;
                        case 4:
                            hold.push([parseInt(j),hold_start_time[j],spawnPos,false])
                            break;
                    }
                }
            }
        }
        return [tap,hold]
    }

    // 移动音符
    function moveNotes(notes,notespeed){
        // tap
        for(let j = 0; j <= notes[0].length-1; j++){
            for(let k = notes[0][j].length-1; k >= 0; k--){
                // console.log(notes[i][j][k])
                notes[0][j][k] += notespeed
            }
        }
        // hold
        for(let j = 0; j <= notes[1].length-1; j++){
            notes[1][j][2] += notespeed
            if(notes[1][j][3] == false){
                notes[1][j][1] += notespeed
            }
        }
        return notes
    }

    // 切换速度
    function changeSpeed(time,notespeed,fps){
        for(let i = notespeed.length-1; i >= 0; i--){
            if(time > notespeed[i][0]){
                return (500/(notespeed[i][1]/(1000/fps)));
            }
        }
        return 5;
    }

    // 判定
    function getJudge(notes,speed,autoplay){
        // 判定5(6?)种
        // 500±speed*2 = ±1*0.008s = ±8ms(16ms) -> Aperfect(For Autoplay)
        // 500±speed*8 = ±8*0.008s = ±64ms(128ms) -> perfect
        // 500±speed*16 = ±12*0.008s = ±96ms(192ms) -> great
        // 500±speed*20 = ±20*0.008s = ±160ms(320ms) -> good
        // 500±speed*25 = ±25*0.008s = ±200ms(200ms) -> bad
        // noclicks -> miss
        // tap [l1[y1],l2[y2],l3[y3],l4[y4]]
        for(let j in notes[0]){
            for(let k = notes[0][j].length-1; k >= 0; k--){
                notes[0][j] = Judges(notes[0][j][k],speed,autoplay,notes[0][j],k,"tap",null)
            }
        }
        // hold [[l,yStart,yEnd,touch]]
        for(let j in notes[1]){
            [notes[1],noteTouch] = Judges(notes[1][j][1],speed,autoplay,notes[1],j,"hold",notes[1][j][3])
            if(noteTouch == true || noteTouch == false){
                notes[1][j][3] = noteTouch
            }
        }
        return [notes[0],notes[1]]
    }

    // 判定的反应
    function Judges(noteY,speed,autoplay,note,index,type,holdTouch){
        if(noteY >= 500-1*speed && noteY <= 500+1*speed){
            switch (autoplay){
                case true:
                    switch (type){
                        case "tap":
                            note.splice(index,1);
                            hit.currentTime = 0
                            hit.play();
                            // 反应动画
                            break;
                        case "hold":
                            if(holdTouch == false){
                                holdTouch = true;
                                hit.currentTime = 0
                                hit.play();
                            }
                            if(note[index][2] > note[index][1]){
                                note.splice(index,1);
                                holdTouch = null
                            }
                            // 反应动画
                            break;
                    }
                    break;
                case false:
                    break;
            }
        }else if(noteY >= 500-8*speed && noteY <= 500+8*speed){
            
        }else if(noteY >= 500-16*speed && noteY <= 500+16*speed){
            
        }else if(noteY >= 500-20*speed && noteY <= 500+20*speed){
            
        }else if(noteY >= 500-25*speed && noteY <= 500+25*speed){
            
        }
        if(type == "tap")  return note;
        if(type == "hold") return [note,holdTouch];
    }

    // 画图片
    function drawImg(notes){
        ctx.clearRect(0,0,405,684);
        for(let i = 0; i < 4; i++){
            ctx.drawImage(lineImg,i*103,0)
        }
        // tap [l1[y1],l2[y2],l3[y3],l4[y4]]
        for(let i = 0; i <= notes[0].length-1; i++){
            for(let j = notes[0][i].length-1; j >= 0; j--){
                if(notes[0][i][j] >= 700){
                    notes[0][i].splice(j,1);
                    continue;
                }
                ctx.drawImage(tapImg,i*103+5,notes[0][i][j]);
            }
        }
        // hold [[l,yStart,yEnd],..]
        for(let i = notes[1].length-1; i >= 0; i--){
            if(notes[1][i][1] >= 700){
                notes[1].splice(i,1);
                continue;
            }
            ctx.drawImage(holdImg,notes[1][i][0]*103+5,notes[1][i][2],93,notes[1][i][1]-notes[1][i][2])
        }
    }

    // 新图片
    function newImage(path){
        let res = new Image()
        res.src = path
        return res
    }

    // 总毫秒
    var time = 0
    // 帧数
    var fps = 100
    // 音效
    var hit = new Audio("audio/hit.wav")
    hit.load()
    //音乐
    var audio = new Audio(chart["path"])
    audio.load()
    audio.play()

    // 画笔
    var ctx = document.getElementById("canvas").getContext("2d")
    
    // 图片
    var tapImg = newImage("imgs/tap.jpg")
    var lineImg = newImage("imgs/line.jpg")
    var holdImg = newImage("imgs/hold.jpg")

    let [tapAry,holdAry] = getNotes(chart["notes"],chart["notespeed"],chart["offset"],fps,time)
    // console.log(tapAry[0].length+tapAry[1].length+tapAry[2].length+tapAry[3].length)
    // console.log(tapAry)

    // 自动
    var autoplay = document.getElementById("auto").checked
    
    // 游戏主体
    function gameHandler(){
        // 判断状态
        switch(game_statue){
            // 开始状态
            case GAME_START:
                let speed = changeSpeed(time,chart["notespeed"],fps)
                let temp = moveNotes([tapAry,holdAry],speed)
                tapAry = temp[0]
                holdAry = temp[1]
                temp = getJudge([tapAry,holdAry],speed,autoplay)
                tapAry = temp[0]
                holdAry = temp[1]
                console.log(holdAry)
                drawImg([tapAry,holdAry])
                time += 1000/fps
                break;
            // 停止状态
            case GAME_STOP:
                audio.currentTime = 0
                ctx.clearRect(0,0,405,684)
                clearInterval(gameHandler)
                break;
        }
    }
    setInterval(gameHandler,1000 / fps)
}