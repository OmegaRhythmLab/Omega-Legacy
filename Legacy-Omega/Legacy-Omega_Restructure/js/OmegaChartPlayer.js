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
    
    // 音符直接生成函数
    function noteSummon(chart){
        // 获取音符,速度
        var notes = chart["notes"]
        var times = chart["notespeed"]
        // 重置时间,初始速度,y值
        var timeStamp = 0
        var speed = 5
        var y = 0
        // 需要返回的数据
        var result = []
        // notes = [[xxx,[n,n,n,m]],..] or [[xxx,[n,n,n,m,x,x,x,y]],..]
        for (var i = 0; i <= notes.length-1; i++){
            // 单个音符的时间和音符类型
            var singleNote = notes[i]
            var time = singleNote[0]
            var note = singleNote[1]
            // 重设速度downspeed
            for (var j = 0; j <= times.length-1; j++){
                var notespeedTime = times[j]
                if (time == notespeedTime[0]){
                    speed = 500/(notespeedTime[1]/(1000/fps))
                    break;
                }
            }
            // 重设y值
            y = parseInt(time/speed)*speed
            // tap & hold两种的note
            for (var lineNum = 0; lineNum <= note.length-1; lineNum++){
                var note_type = note[lineNum]
                if (lineNum <= 4){
                    switch (note_type){
                        // tap
                        case 1:
                            var tap_data = {
                                "type": 1,
                                "x": lineNum*103+5,
                                "y": y+10,
                                "speed": speed,
                                "img": tap
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
                else if (lineNum > 4){
                    
                }
            }
        }
        return result
    }
    
    // 图片对象
    var line = newImage("../images/line.jpg")
    var tap = newImage("../images/tap.jpg")

    // 帧数
    var fps = 200

    // 音符列表
    var noteAry = noteSummon(charts)
    console.log(noteAry)

    // 游戏主体
    function gameHandler(){
        // 判断状态
        switch(game_statue){
            // 开始状态
            case GAME_START:
                ctx.drawImage(line,0,0)
                break;
            
            // 停止状态
            case GAME_STOP:
                ctx.clearRect(0,0,405,683)
                clearInterval(gaming)
        }
    }

    // 游戏对象
    var gaming = setInterval(gameHandler, 1000 / fps)


    // 画笔对象
    var ctx = document.getElementById("canvas").getContext("2d")


}