// 读取谱面
var openFile = function(event){
    var chart = ""
    var input = event.target;
    var reader = new FileReader()
    reader.onload = function(){
        if (reader.result){
            // 结果储存到谱面
            chart = reader.result
            chartReader(chart)
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
        chartInfo = {
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
                        // notes
                        var temp_noteAry = []
                        for (var j=0; j<chart[i+1].replace(/\r/g,"").length; j++){
                            temp_noteAry.push(parseInt(chart[i+1][j]))
                        }
                        chartInfo["notes"].push([chartInfo["time_all"],temp_noteAry])
                    }
            }
        Gaming(chartInfo)
        }
    }
}

// 主函数
function Gaming(charts){
    
}