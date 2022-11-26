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
    document.getElementById("chart").innerHTML = chart
    // OMEGA标识符
    if (chart.indexOf("!ChartType OMEGA") != -1){
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
        }
        // 遍历
        for(var i=0; i++; i>=chart.length-1){
            var item = chart[i]
            // bpm notespeed ... 唯一标识符
            switch(item){
                case "bpm":
                    chartInfo[bpm] = parseInt(chart[i+1])
                    chartInfo[bpm_ms] = 60/parseInt(chart[i+1])*1000
                case "notespeed":
                    chartInfo[notespeed].push()
            }
        }
    }
}