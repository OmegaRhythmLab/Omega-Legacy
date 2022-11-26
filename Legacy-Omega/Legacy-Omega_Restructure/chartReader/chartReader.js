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
    chart = chart.split("\n")
    document.getElementById("chart").innerHTML = chart
}