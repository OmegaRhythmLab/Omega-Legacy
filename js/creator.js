var audio = new Audio("../charts/Lanterns/Lanterns.mp3")
audio.load()
var count = 0
var pressAry = {"d":[false,0],"f":[false,0],"j":[false,0],"k":[false,0]}
function main(){
    count = 0
    audio.play()
    setInterval(function(){
        count += 1
        if(count % 4 == 0){
            console.log(count)
        }
        var area = document.getElementById("texts")
        document.onkeydown = function(d){
            if(d.key == "d"){
                pressAry.d[0] = true
            }if(d.key == "f"){
                pressAry.f[0] = true
            }if(d.key == "j"){
                pressAry.j[0] = true
            }if(d.key == "k"){
                pressAry.k[0] = true
            }
        }
        document.onkeyup = function(u){
            if(u.key == "d"){
                pressAry.d[0] = false
                if(pressAry.d[1] > 4){
                    area.innerHTML += ("/n"+(count-pressAry.d[1])+","+1+","+pressAry.d[1])
                }else if(pressAry.d[1] <= 4){
                    area.innerHTML += ("/n"+(count-pressAry.d[1])+","+1+",0")
                }
                pressAry.d[1] = 0
            }if(u.key == "f"){
                pressAry.f[0] = false
                if(pressAry.f[1] > 4){
                    area.innerHTML += ("/n"+(count-pressAry.f[1])+","+2+","+pressAry.f[1])
                }else if(pressAry.f[1] <= 4){
                    area.innerHTML += ("/n"+(count-pressAry.f[1])+","+2+",0")
                }
                pressAry.f[1] = 0
            }if(u.key == "j"){
                pressAry.j[0] = false
                if(pressAry.j[1] > 4){
                    area.innerHTML += ("/n"+(count-pressAry.j[1])+","+3+","+pressAry.j[1])
                }else if(pressAry.j[1] <= 4){
                    area.innerHTML += ("/n"+(count-pressAry.j[1])+","+3+",0")
                }
                pressAry.j[1] = 0
            }if(u.key == "k"){
                pressAry.k[0] = false
                if(pressAry.k[1] > 4){
                    area.innerHTML += ("/n"+(count-pressAry.k[1])+","+4+","+pressAry.k[1])
                }else if(pressAry.k[1] <= 4){
                    area.innerHTML += ("/n"+(count-pressAry.k[1])+","+4+",0")
                }
                pressAry.k[1] = 0
            }
        }
        if(pressAry.d[0] == true){
            pressAry.d[1] += 1
        }if(pressAry.f[0] == true){
            pressAry.f[1] += 1
        }if(pressAry.j[0] == true){
            pressAry.j[1] += 1
        }if(pressAry.k[0] == true){
            pressAry.k[1] += 1
        }
    },1000*60/(128*8))
//     setInterval(main,1000/60)
// }
// function main(){
    
}