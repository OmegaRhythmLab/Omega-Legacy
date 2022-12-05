// 游戏运行的唯一标识
const GAME_START = 1
const GAME_STOP = 0
var game_statue = GAME_STOP
var chart = []

// 读取谱面
function openFile(event){
    var input = event.target;
    var reader = new FileReader()
    reader.onload = function(){
        if (reader.result){
            // 结果储存到谱面
            chart = reader.result
        }
    };
    reader.readAsText(input.files[0]);
}

// 分析谱面
function chartReader(chart){
    // chart转为列表
    chart = chart.split("\n")
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
                            chartInfo["notespeed"].push([chartInfo["time_all"],parseInt(item[1])])
                        }
                        
                        // nnnn 或 nnnnmmmm 类型的数据
                        var temp_noteAry = []
                        for (var j=0; j<chart[i+1].replace(/\r/g,"").length; j++){
                            temp_noteAry.push(parseInt(chart[i+1][j]))
                        }

                        // notes
                        chartInfo["notes"].push([chartInfo["time_all"],temp_noteAry])
                    }
            }
        }
    }
    return chartInfo
}


// 开始函数
function game_statue_switch(){
    // 状态切换
    switch (game_statue){
        // 切换: 停止 -> 开始
        case GAME_STOP:
            game_statue = GAME_START
            main(chartReader(chart))
            break;
        // 切换: 开始 -> 停止
        case GAME_START:
            game_statue = GAME_STOP
            break;
    } 
}


// 前置函数
function main(charts){
    // 新图片
    function newImage(path){
        var Img = new Image()
        Img.src = path
        return Img
    }

    // 新音乐
    function newMusic(path){
        var music = new Audio(path)
        return music
    }
    
    // 音符生成函数
    function notes_init_set(chart){
        // 获取音符,速度
        var notes = chart["notes"]
        var times = chart["notespeed"]
        var offset = chart["offset"]
        // 初始速度
        var speed = 5
        // 需要返回的数据
        var result = []
        // notes = [[xxxx,[m,m,m,m,n,n,n,n]],..]   times = [[xxxx,m],..]
        for (var i = 0; i <= notes.length-1; i++){
            // 单个音符的时间、类型
            var singleNote = notes[i] // [xxx,[n,n,n,n,m,m,m,m]]
            var time = singleNote[0] // xxx
            var note = singleNote[1] // [n,n,n,n]
            // 音符速度
            for (var j = 0; j <= times.length-1; j++){
                // 寻找与时间相同的速度
                var noteSpeed = times[j]
                if (time == noteSpeed[0]){
                    speed = 500/(noteSpeed[1]/(1/fps*1000)) //不要问我这个公式怎么出来的,自己算一遍就知道了
                }
            }
            // 处理音符
            for (var lineNum = 0; lineNum <= note.length-1; lineNum++){
                var noteType = note[lineNum]
                if (lineNum <= 4){
                    switch (noteType){
                        // tap
                        case 1:
                            var tap_data = {
                                "type": 1,
                                "x": lineNum*103+5,
                                "y": -10,
                                "speed": speed,
                                "img": tapImg,
                                "time": time+offset,
                                "showed": false,
                            }
                            result.push(tap_data)
                        // hold_head
                        case 2:
                            var hold_top = {

                            }
                        // hold_bottom
                        case 4:
                            var hold_bottom = {

                            }
                    }
                }
                // motion
                else if (lineNum > 4){

                }
            }
        }
        return result
    }
    
    // 音符推送
    function pushNotes(tick,all_noteAry,noteAry){
        // 遍历
        for (var i = all_noteAry.length-1; i >= 0; i--){
            // showed用于音符是否已经送出
            if (tick >= all_noteAry[i].time && all_noteAry[i].showed == false){
                all_noteAry[i].showed = true
                noteAry.push(all_noteAry[i])
            }
        }
        return noteAry
    }

    // 移动音符
    function moveNotes(noteAry){
        for (var i = noteAry.length-1; i >= 0; i--){
            // y大于700px的进行删除
            if (noteAry[i].y >= 700){
                noteAry.splice(i,1)
                continue
            }
            // motion和其他音符的区别
            switch (noteAry[i].type){
                case 5:

                default:
                    noteAry[i].y += noteAry[i].speed
            }
        }
        return noteAry
    }

    // 绘画元素
    function drawImages(notes){
        // 清空画布
        ctx.clearRect(0,0,405,683)
        // 绘画轨道
        for (var i = 0; i <= 3; i++){
            ctx.drawImage(lineImg,i*103,0)
        }
        // 绘画音符
        for (var j = 0; j <= notes.length-1; j++){
            var note = notes[j]
            ctx.drawImage(note.img,note.x,note.y)
        }
    }

    // 图片对象
    var lineImg = newImage("../images/line.jpg")
    var tapImg = newImage("../images/tap.jpg")

    // 音乐对象
    var music = newMusic(charts["path"])
    console.log(charts)

    // 加载音乐
    music.load()

    // 帧数
    var fps = 125

    // 总帧数
    var frames = 0

    // 所有音符列表
    var all_noteAry = notes_init_set(charts)
    
    // 音符列表
    var noteAry = []

    // 导入ctx画笔对象
    var ctx = document.getElementById("canvas").getContext("2d")

    // 游戏主体
    function gameHandler(){
        // 判断状态
        switch(game_statue){
            // 开始状态
            case GAME_START:
                music.play()
                // 总帧数
                frames += 1000/fps
                // 获取音符
                noteAry = pushNotes(frames,all_noteAry,noteAry)
                // 移动音符
                noteAry = moveNotes(noteAry)
                drawImages(noteAry)
                break;
            
            // 停止状态
            case GAME_STOP:
                ctx.clearRect(0,0,405,683)
                clearInterval(gaming)
        }
    }

    // 游戏对象
    var gaming = setInterval(gameHandler, 1000 / fps)

}