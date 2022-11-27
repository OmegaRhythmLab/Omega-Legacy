// 打开谱面
var openFile = function(event){
    var chart = ""
    var input = event.target;
    var reader = new FileReader()
    reader.onload = function(){
        if (reader.result){
            // 结果储存到谱面
            chart = reader.result
            main(chart)
        }
    };
    reader.readAsText(input.files[0]);
}

// 主函数
function main(chart){
    // chart转为列表
    chart = chart.split("\n")
    // OMEGA标识符
    if (chart.indexOf("!ChartType OMEGA\r") != -1){
        // 铺面信息
        chartInfo = {
            bpm: 0,
            bpm_ms: 0,
            notespeed: [],
            artist: "",
            chart: "",
            name: "",
            level: "",
            combos: "",
            score_per_one: "",
            notes: [],
            time_all: 0,
        }
        // 遍历chart获取信息
        for(var i=0; i<=chart.length-1; i++){
            var item = chart[i].replace("\r","")
            // bpm ... 唯一标识符
            switch (item){
                // bpm, bpm_ms
                case "bpm":
                    chartInfo["bpm"] = parseInt(chart[i+1])
                    chartInfo["bpm_ms"] = parseInt(60/parseInt(chart[i+1])*1000)
                // notespeed, time_all, notes...
                default:
                    // n/n类型的数据
                    if (item.indexOf("/") == 1){
                        item = item.split(" ")
                        // time_all 所有时间(ms)
                        chartInfo["time_all"] += parseInt(item[0][0])/parseInt(item[0][2])*parseInt(chartInfo["bpm_ms"])
                        // 长度为2的数据后都带有notespeed属性(ms)
                        if (item.length == 2){
                            // notespeed
                            chartInfo["notespeed"].push([chartInfo["time_all"],parseInt(item[1])])
                        }
                    }
            }
        document.getElementById("chart").innerHTML = JSON.stringify(chartInfo)
        }
    }
}