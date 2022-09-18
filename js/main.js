// 必看！！！
// 此js文件为运行音游的主要文件

// ! 禁止删除或乱改 !

// 此文件会经常改变
// 不允许在没通过授权的情况下进行修改!
// 否则后果自负

// 代码开始更新于 4/26/2022 (April 26th, 2022)
// 最后一次更新于 8/28/2022 (August 27th, 2022)
// 版本 v1.0.3

// 版本更新公告
// # v1.0.0 - 主要更新了此音游的游玩内容，新增单曲：Maozon - Stasis
// # v1.0.1 - 对移动端兼容性做了提升
// # v1.0.2 - 修复了Hold音符miss判定删除其他hold的Bug
// # v1.0.3 - 选歌切换成为列表选择，新增单曲：Xomu - Lanterns
// # v1.1.0 - 正式更名Omega Legacy，并且不再在此处更新版本更新公告
// # ui很差 不喜勿喷
// # 暂时在html文件运行

// Omega官方：https://space.bilibili.com/1681367755

//  前置  //

/* 注意：该文档使用斜杠加星号风格的注释大多为MFn233所创作和维护 */

//定义gameStart用于开始游戏的标识
var gameStart = false

var temp, noteList, audio

//承接html onclick的函数
function main() {
    //缓存记录歌曲信息
    temp = document.getElementById("files").value
        //noteList记录铺面信息
    noteList = document.getElementById(temp).innerHTML
        //记录歌名
    temp = temp.split(" - ")[0]
        //定义audio音乐
    audio = new Audio("../charts/" + temp + "/" + temp + ".mp3")
        //重置音乐
    audio.load()
        //将gameStart变为true
    gameStart = true
        /* 禁用需要禁用的设置控件 */
    document.getElementById("files").setAttribute("disabled", true);
    document.getElementById("autoplay").setAttribute("disabled", true);
    document.getElementById("start").setAttribute("disabled", true);
    document.getElementById("stop").setAttribute("enabled", true);
    //导入文件读取函数(主函数)
    imports()

}

/* 为了跳出建议谱面偏移而专门写的函数 */
function importMsg() {
    //缓存记录歌曲信息
    temp = document.getElementById("files").value
        //noteList记录铺面信息
    noteList = document.getElementById(temp).innerHTML
        //记录歌名
    temp = temp.split(" - ")[0]
        //定义audio音乐
    audio = new Audio("../charts/" + temp + "/" + temp + ".mp3")
        //重置音乐
    imports()
}
//文件读取函数(主函数)
function imports() {
    //定义useableList记录谱面信息
    var useableList = []
        //变速列表
    var changeSpeed = []
        //音乐时间
    var musicTime = 0
        //音符列表
    noteList = noteList.split("/n")
        //对音符列表进行反向遍历
    for (var i = noteList.length - 1; i >= 0; i--) {
        //缓存
        var temp = noteList[i].split(",")
            //data标识
        if (temp[0] == "data") {
            //将data里的数据导出并进行操作
            //bpm
            var bpm = parseInt(temp[1])
                //偏移值
                /* 设置偏移 */
            var offset = document.getElementById("OffsetOption").value;
            /* 弹出建议偏移 */
            var suggestOffset = parseInt(temp[2]);
            /* 写入 */
            document.getElementById("SuggestOffset").innerHTML = "<br>建议偏移：" + suggestOffset;
            //音乐时间
            musicTime = parseInt(temp[3]) * 1000
                //铺面信息(名称,难度,作曲)
            var chartData = { "name": temp[5], "difficult": temp[4], "music": temp[6] }
                //谱面有用信息添加音乐时间
            useableList.push(musicTime)
                //将其在音符列表中删除
            noteList.splice(0, 1)
                //变速标识
        } else if (temp.length == 4) {
            //变速列表添加变速信息
            changeSpeed.push([parseInt(temp[0]), parseInt(temp[3])])
                //将其在音符列表中删除
            noteList.splice(i, 1)
                //长条标识
        } else if (parseInt(temp[1]) >= 1) {
            //将其进行正序遍历
            for (var q = 0; q < temp.length; q++) {
                //缓存
                temp[q] = parseInt(temp[q])
            }
            //处理后的长条
            noteList[i] = temp
        }
    }
    //处理后的变速列表添加useableList
    useableList.push(changeSpeed)
        //处理后的音符列表添加useableList
    useableList.push(noteList)
        //开始游戏
    if (gameStart == true) {
        //播放音乐
        audio.play()

        //图片
        //背景图
        var bgImg = new Image()
        bgImg.src = "../images/bg.jpg"

        //音符图
        var noteImg = new Image()
            // noteImg.src = "../images/note.png"
        noteImg.src = "../images/tap1.jpg"
        var noteImg2 = new Image()
        noteImg2.src = "../images/tap2.jpg"

        //hold图
        var holdHeadImg = new Image()
            // holdHeadImg.src = "../images/holdHead.png"
        holdHeadImg.src = "../images/holdHead1.PNG"

        var holdMidImg = new Image()
            // holdMidImg.src = "../images/holdMid.png"
        holdMidImg.src = "../images/holdMid1.PNG"

        //点击图
        var pressImg = new Image()
        pressImg.src = "../images/press.png"

        //miss图
        var missImg = new Image()
        missImg.src = "../images/miss.png"

        //perfect图
        var perfectImg = new Image()
        perfectImg.src = "../images/perfect.png"

        //good图
        var goodImg = new Image()
        goodImg.src = "../images/good.png"

        //暂停图
        var pauseImg = new Image()
        pauseImg.src = "../images/pause.png"

        //暂停的背景图
        var pauseBackgroundImg = new Image()
        pauseBackgroundImg.src = "../images/pauseBackground.png"

        //鼠标静止图片
        var mouseImg = new Image()
        mouseImg.src = "../images/mouse.png"

        //鼠标移动图片
        var mouseMovingImg = new Image()
        mouseMovingImg.src = "../images/mousemoving.png"

        //宽高
        //画布的宽高
        var canvasWidth = 405
        var canvasHeight = 684

        //按键对象
        var pressAry = { "d": false, "f": false, "j": false, "k": false }

        //按键按下的时间
        var pressTimeAry = { "d": 0, "f": 0, "j": 0, "k": 0 }

        //动画计数
        var count = 0

        //反馈类型
        var drawResultType = false

        //combo
        var combo = 0

        //score
        var score = 0

        //accuracy
        var accuracy = []

        //alpha0
        var alpha0 = false

        //widthLeftOverResult
        var widthLeftOverResult = -200

        //widthAddOverResult
        var widthAddOverResult = 10

        //allResultCount
        var allResultCount = {
            "perfect": 0,
            "good": 0,
            "miss": 0
        }

        //downSpeed
        var downSpeed = 7

        //autoPlay
        var autoplayStatue = document.getElementById("autoplay").checked
            //判断autoplay是否开启
            //开启模式
        if (autoplayStatue == true) {
            var autoplay = { "mode": true, "l1": 0, "l2": 0, "l3": 0, "l4": 0 }
                //关闭模式
        } else if (autoplayStatue == false) {
            var autoplay = { "mode": false, "l1": 0, "l2": 0, "l3": 0, "l4": 0 }
        }

        //BPM时间戳
        var BPMTime = -offset

        //已经删除的combo
        var deletedCombo = noteList.length

        //已经发出的combo
        var overCombo = deletedCombo

        //所有combo
        var allCombo = deletedCombo

        //每个音符增加的分数
        var addScore = 1000000 / allCombo

        //hold计数
        var holdCount = []

        //holdID
        var hold_id = 0

        //删除的hold_id
        var removeHM = []

        //自定义下落(暂时不用)
        var customStatue = document.getElementById("custom").value
        if (customStatue != "") {
            var customDown = {
                "mode": true,
                "count": 0,
                "style": []
            }
            for (var i = 0; i < customStatue.length; i++) {
                customDown.style.push(parseInt(customStatue[i]))
            }
        } else {
            var customDown = {
                "mode": false,
                "count": 0,
                "style": [1, 1, 4, 5, 1, 4],
            }
        }

        //音符数组
        var noteAry = []

        //游戏是否暂停
        var isGamePause = false

        //鼠标对象
        var mouseData = {
            x: 0,
            y: 0,
            pressTime: 0,
        }

        //鼠标是否抬起
        var isMouseDown = false

        //获取画布对象
        var canvas = document.getElementById("main")

        //获取画笔
        var ctx = canvas.getContext("2d")

        //设置帧数
        var total = setInterval(gameHandler, 1000 / 125)
            //=====游戏内容=====//
            //依据BPM来推送音符
        var BPMSend = setInterval(function() {
            //若音符全部判定完毕
            if (overCombo <= 1) {
                //停止运行此函数
                clearInterval(BPMSend)
                    //若不暂停
            }
            if (isGamePause == false) {
                //bpm总时间+1
                BPMTime += 1
                    //正序遍历变速列表
                for (var i = 0; i < changeSpeed.length; i++) {
                    //若时间相同
                    if (changeSpeed[i][0] == BPMTime) {
                        //改变音符下落速度
                        downSpeed = changeSpeed[i][1]
                    }
                    //正序遍历音符列表
                }
                for (var i = 0; i < noteList.length; i++) {
                    //若时间相同
                    if (noteList[i][0] == BPMTime) {
                        //若为tap音符
                        if (noteList[i][2] == 0) {
                            //推送音符至音符数组
                            noteAry.push(makeNote(null, noteList[i][1]))
                        }
                    }
                }
            }
            //定义运行时间(bpm下的16分音符)
        }, 1000 * 60 / (bpm * 8))

        var holdMaker = setInterval(function() {
            if (musicTime <= 0) {
                clearInterval(holdMaker)
            } else if (isGamePause == false) {
                for (var i = 0; i < noteList.length; i++) {
                    if (noteList[i][0] == BPMTime + 3 && noteList[i][2] > 0) {
                        holdCount.push([noteList[i][1], noteList[i][2], 0, hold_id])
                        hold_id += 1
                    }
                }
                for (var i = holdCount.length - 1; i >= 0; i--) {
                    if (holdCount[i][2] == 0) {
                        var note = {
                            type: "hold_head",
                            img: holdHeadImg,
                            x: (holdCount[i][0] - 1) * 103,
                            y: 546 - (95 * downSpeed),
                            down: downSpeed,
                            test: "none",
                            holdID: holdCount[i][3],
                            addCombo: false,
                        }
                        noteAry.push(note)
                    } else if (holdCount[i][2] > 0 && holdCount[i][1] - holdCount[i][2] > 1) {
                        var note = {
                            type: "hold_mid",
                            img: holdMidImg,
                            x: (holdCount[i][0] - 1) * 103,
                            y: 546 - (95 * downSpeed),
                            down: downSpeed,
                            test: "none",
                            holdID: holdCount[i][3],
                            addCombo: false,
                        }
                        noteAry.push(note)
                    } else if (holdCount[i][1] - holdCount[i][2] == 1) {
                        var note = {
                            type: "hold_mid",
                            img: holdMidImg,
                            x: (holdCount[i][0] - 1) * 103,
                            y: 546 - (95 * downSpeed),
                            down: downSpeed,
                            test: "none",
                            holdID: holdCount[i][3],
                            addCombo: true,
                        }
                        noteAry.push(note)
                    } else if (holdCount[i][2] >= holdCount[i][1]) {
                        holdCount.splice(i, 1)
                        continue
                    }
                    holdCount[i][2] += 1
                }
            }
        }, 1000 * 60 / (bpm * 8))

        //创造音符
        function makeNote(custom, lineNum) {
            if (customDown.mode == true) {
                var note = {
                    img: noteImg,
                    x: (customDown.style[customDown.count] - 1) * 103,
                    y: 0,
                }
                customDown.count += 1
                if (customDown.count == customDown.style.length) {
                    customDown.count = 0
                }
            } else if (custom == null) {
                if (lineNum == 1 || lineNum == 4) {
                    var note = {
                        type: "tap",
                        img: noteImg,
                        x: (lineNum - 1) * 103,
                        y: 546 - (78 * downSpeed),
                        down: downSpeed,
                    }
                } else if (lineNum == 2 || lineNum == 3) {
                    var note = {
                        type: "tap",
                        img: noteImg2,
                        x: (lineNum - 1) * 103,
                        y: 546 - (78 * downSpeed),
                        down: downSpeed,
                    }
                }
            }
            return note
        }

        //检测按下按键并作出反应
        function showPressBackGround() {
            //按键按下
            document.onkeydown = function(e) {
                    if (isGamePause == false) {
                        if (e.key == "d" && autoplay.mode == false) {
                            pressAry.d = true
                        }
                        if (e.key == "f" && autoplay.mode == false) {
                            pressAry.f = true
                        }
                        if (e.key == "j" && autoplay.mode == false) {
                            pressAry.j = true
                        }
                        if (e.key == "k" && autoplay.mode == false) {
                            pressAry.k = true
                        }
                        if (e.key == "r" && widthLeftOverResult >= 20) {
                            main()
                        }
                    }
                    if (e.key == "Escape") {
                        ctx.globalAlpha = 0.65
                        ctx.drawImage(pauseBackgroundImg, 0, 0, 405, 684)
                        ctx.globalAlpha = 1
                        ctx.drawImage(pauseImg, canvasWidth / 2 - 400 / 2, canvasHeight / 2 - 170, 400, 220)
                        pauseAndStart()
                    }
                    if (e.key == "r" && isGamePause == true) {
                        pressAry = { "d": false, "f": false, "j": false, "k": false }
                        pressTimeAry = { "d": 0, "f": 0, "j": 0, "k": 0 }
                        count = 0
                        drawResultType = false
                        combo = 0
                        score = 0
                        accuracy = []
                        alpha0 = false
                        widthLeftOverResult = -200
                        widthAddOverResult = 10
                        allResultCount = {
                            "perfect": 0,
                            "good": 0,
                            "miss": 0
                        }
                        autoplayStatue = document.getElementById("autoplay").checked
                        if (autoplayStatue == true) {
                            autoplay = { "mode": true, "l1": 0, "l2": 0, "l3": 0, "l4": 0 }
                        } else if (autoplayStatue == false) {
                            autoplay = { "mode": false, "l1": 0, "l2": 0, "l3": 0, "l4": 0 }
                        }
                        BPMTime = -offset
                        deletedCombo = useableList[2].length
                        overCombo = deletedCombo
                        allCombo = deletedCombo
                        addScore = 1000000 / allCombo
                        holdCount = []
                        hold_id = 0
                        removeHM = []
                        noteAry = []
                        isGamePause = false
                        audio.load()
                        musicTime = useableList[0]
                        changeSpeed = useableList[1]
                        audio.play()
                    }
                }
                //按键抬起
            if (autoplay.mode == false && isGamePause == false) {
                document.onkeyup = function(u) {
                    if (u.key == "d") {
                        pressAry.d = false
                        pressTimeAry.d = 0
                    }
                    if (u.key == "f") {
                        pressAry.f = false
                        pressTimeAry.f = 0
                    }
                    if (u.key == "j") {
                        pressAry.j = false
                        pressTimeAry.j = 0
                    }
                    if (u.key == "k") {
                        pressAry.k = false
                        pressTimeAry.k = 0
                    }
                }
            }
            //按键按的时间
            if (pressAry.d == true && isGamePause == false) {
                pressTimeAry.d = pressTimeAry.d + 1
                ctx.drawImage(pressImg, 103 * 0, 0)
            }
            if (pressAry.f == true) {
                pressTimeAry.f = pressTimeAry.f + 1
                ctx.drawImage(pressImg, 103 * 1, 0)
            }
            if (pressAry.j == true) {
                pressTimeAry.j = pressTimeAry.j + 1
                ctx.drawImage(pressImg, 103 * 2, 0)
            }
            if (pressAry.k == true) {
                pressTimeAry.k = pressTimeAry.k + 1
                ctx.drawImage(pressImg, 103 * 3, 0)
            }
        }

        //绘制音符函数
        function drawNote() {
            if (noteAry != []) {
                for (var i = 0; i < noteAry.length; i++) {
                    var note = noteAry[i]
                    ctx.drawImage(note.img, note.x, note.y)
                }
            }

        }

        //音符移动函数
        function moveNote() {
            if (noteAry != []) {
                for (var i = 0; i < noteAry.length; i++) {
                    var note = noteAry[i]
                    if (note.y > (575 + 11 * downSpeed) && note.y < 700) {
                        note.y = 700
                    }
                    note.y = note.y + note.down
                        // if(note.y>=0&&note.y<=575+(11*downSpeed)){console.log(note.y/downSpeed)}
                }
            }

        }

        //处理判定结果后函数
        function afterTP(mode, dD) {
            if (mode == "p") {
                noteAry.splice(noteAry.indexOf(dD), 1)
                drawResultType = "Perfect"
                count = 1
                combo += 1
                score += addScore
                deletedCombo -= 1
                allResultCount.perfect += 1
                accuracy.push(1)
            }
            if (mode == "g") {
                noteAry.splice(noteAry.indexOf(dD), 1)
                drawResultType = "Good"
                count = 1
                combo += 1
                score += (addScore * 0.65)
                deletedCombo -= 1
                allResultCount.good += 1
                accuracy.push(0.65)
            }
            if (mode == "m") {
                combo = 0
                drawResultType = "Miss"
                count = 1
                noteAry.splice(noteAry.indexOf(dD), 1)
                deletedCombo -= 1
                allResultCount.miss += 1
                accuracy.push(0)
            }
            if (mode == "hp") {
                drawResultType = "Perfect"
                count = 1
                noteAry.splice(noteAry.indexOf(dD), 1)
            }
            if (mode == "hg") {
                drawResultType = "Good"
                count = 1
                noteAry.splice(noteAry.indexOf(dD), 1)
            }
            if (mode == "hm") {
                drawResultType = "Miss"
                count = 1
                combo = 0
                deletedCombo -= 1
                allResultCount.miss += 1
                accuracy.push(0)
                if (removeHM.indexOf(String(dD.holdID)) == -1) {
                    removeHM.push(String(dD.holdID))
                }
                noteAry.splice(noteAry.indexOf(dD), 1)
            }
            if (mode == "hpa") {
                combo += 1
                score += addScore
                deletedCombo -= 1
                allResultCount.perfect += 1
                accuracy.push(1)
                noteAry.splice(noteAry.indexOf(dD), 1)
            }
            if (mode == "hpg") {
                combo += 1
                score += (addScore * 0.65)
                deletedCombo -= 1
                allResultCount.good += 1
                accuracy.push(0.65)
                noteAry.splice(noteAry.indexOf(dD), 1)
            }
        }

        //判定结果函数
        function testPerfects() {
            if (noteAry != []) {
                for (var k = noteAry.length - 1; k > 0; k--) {
                    if (noteAry[k].type == "hold_head" || noteAry[k].type == "hold_mid") {
                        var holdid = noteAry[k].holdID
                        if (removeHM.indexOf(String(holdid)) != -1) {
                            noteAry.splice(k, 1)
                        }
                    }
                }
                for (var j = noteAry.length - 1; j >= 0; j--) {
                    if (noteAry[j].type == "hold_mid" && noteAry[j].test == "none") {
                        for (var i = noteAry.length - 1; i >= 0; i--) {
                            if (noteAry[i].type == "hold_mid" && noteAry[i].test != "none") {
                                if (noteAry[i].holdID == noteAry[i].holdID) {
                                    noteAry[j].test = noteAry[i].test
                                    break
                                }
                            }
                        }
                    }
                }
                for (var i = (noteAry.length - 1); i >= 0; i--) {
                    var notes = noteAry[i] //包含x,y,type
                        //Perfect判定区间：判定线前30px,判定线后30px
                        //Good判定区间：判定线前31px-50px,判定线后31px-50px
                        //Miss判定区间：根本没点到那种
                    if (notes.type == "tap") {
                        if (pressTimeAry.d > 1 && pressTimeAry.d < 10) { //L1
                            if (notes.y >= 575 - (8 * notes.down) && notes.y <= 575 + (8 * downSpeed) && notes.x == 103 * 0) { //perfect
                                afterTP("p", notes)
                            } else if (575 - (11 * notes.down) < notes.y && notes.y < 575 - (8 * notes.down) && notes.x == 103 * 0) { //good1
                                afterTP("g", notes)
                            } else if (575 + (11 * notes.down) > notes.y && notes.y > 575 + (8 * notes.down) && notes.x == 103 * 0) { //good2
                                afterTP("g", notes)
                            }
                        }
                        if (pressTimeAry.f > 1 && pressTimeAry.f < 10) { //L2
                            if (notes.y >= 575 - (8 * notes.down) && notes.y <= 575 + (8 * notes.down) && notes.x == 103 * 1) { //perfect
                                afterTP("p", notes)
                            } else if (575 - (11 * notes.down) < notes.y && notes.y < 575 - (8 * notes.down) && notes.x == 103 * 1) { //good1
                                afterTP("g", notes)
                            } else if (575 + (11 * notes.down) > notes.y && notes.y > 575 + (8 * notes.down) && notes.x == 103 * 1) { //good2
                                afterTP("g", notes)
                            }
                        }
                        if (pressTimeAry.j > 1 && pressTimeAry.j < 10) { //L3
                            if (notes.y >= 575 - (8 * notes.down) && notes.y <= 575 + (8 * notes.down) && notes.x == 103 * 2) { //perfect
                                afterTP("p", notes)
                            } else if (575 - (11 * notes.down) < notes.y && notes.y < 575 - (8 * notes.down) && notes.x == 103 * 2) { //good1
                                afterTP("g", notes)
                            } else if (575 + (11 * notes.down) > notes.y && notes.y > 575 + (8 * notes.down) && notes.x == 103 * 2) { //good2
                                afterTP("g", notes)
                            }
                        }
                        if (pressTimeAry.k > 1 && pressTimeAry.k < 10) { //L4
                            if (notes.y >= 575 - (8 * notes.down) && notes.y <= 575 + (8 * notes.down) && notes.x == 103 * 3) { //perfect
                                afterTP("p", notes)
                            } else if (575 - (11 * notes.down) < notes.y && notes.y < 575 - (8 * notes.down) && notes.x == 103 * 3) { //good1
                                afterTP("g", notes)
                            } else if (575 + (11 * notes.down) > notes.y && notes.y > 575 + (8 * notes.down) && notes.x == 103 * 3) { //good2
                                afterTP("g", notes)
                            }
                        }
                        if (notes.y > 575 + (11 * notes.down)) { //miss
                            afterTP("m", notes)
                        }
                    } else if (notes.type == "hold_head" || notes.type == "hold_mid") {
                        if (notes.type == "hold_head") {
                            var get_hold_id = notes.holdID
                            if (notes.x == 103 * 0 && pressTimeAry.d >= 1 && pressTimeAry.d <= 10) {
                                if (notes.y >= 575 - (8 * notes.down) && notes.y <= 575 + (8 * notes.down)) {
                                    notes.test = "perfect"
                                    afterTP("hp", notes)
                                } else if (575 - (11 * notes.down) < notes.y && notes.y < 575 - (8 * notes.down)) {
                                    notes.test = "good"
                                    afterTP("hg", notes)
                                } else if (575 + (11 * notes.down) > notes.y && notes.y > 575 + (8 * notes.down)) {
                                    notes.test = "good"
                                    afterTP("hg", notes)
                                }
                            } else if (notes.x == 103 * 1 && pressTimeAry.f >= 1 && pressTimeAry.f <= 10) {
                                if (notes.y >= 575 - (8 * notes.down) && notes.y <= 575 + (8 * notes.down)) {
                                    notes.test = "perfect"
                                    afterTP("hp", notes)
                                } else if (575 - (11 * notes.down) < notes.y && notes.y < 575 - (8 * notes.down)) {
                                    notes.test = "good"
                                    afterTP("hg", notes)
                                } else if (575 + (11 * notes.down) > notes.y && notes.y > 575 + (8 * notes.down)) {
                                    notes.test = "good"
                                    afterTP("hg", notes)
                                }
                            } else if (notes.x == 103 * 2 && pressTimeAry.j >= 1 && pressTimeAry.j <= 10) {
                                if (notes.y >= 575 - (8 * notes.down) && notes.y <= 575 + (8 * notes.down)) {
                                    notes.test = "perfect"
                                    afterTP("hp", notes)
                                } else if (575 - (11 * notes.down) < notes.y && notes.y < 575 - (8 * notes.down)) {
                                    notes.test = "good"
                                    afterTP("hg", notes)
                                } else if (575 + (11 * notes.down) > notes.y && notes.y > 575 + (8 * notes.down)) {
                                    notes.test = "good"
                                    afterTP("hg", notes)
                                }
                            } else if (notes.x == 103 * 3 && pressTimeAry.k >= 1 && pressTimeAry.k <= 10) {
                                if (notes.y >= 575 - (8 * notes.down) && notes.y <= 575 + (8 * notes.down)) {
                                    notes.test = "perfect"
                                    afterTP("hp", notes)
                                } else if (575 - (11 * notes.down) < notes.y && notes.y < 575 - (8 * notes.down)) {
                                    notes.test = "good"
                                    afterTP("hg", notes)
                                } else if (575 + (11 * notes.down) > notes.y && notes.y > 575 + (8 * notes.down)) {
                                    notes.test = "good"
                                    afterTP("hg", notes)
                                }
                            }
                            var get_test = notes.test
                            for (var j = noteAry.length - 1; j >= 0; j--) {
                                if (noteAry[j].holdID == get_hold_id) {
                                    noteAry[j].test = get_test
                                }
                            }
                        } else if (notes.type == "hold_mid" && notes.addCombo == false) {
                            if (notes.x == 103 * 0 && notes.y > 575 + (11 * notes.down)) {
                                afterTP("hm", notes)
                            }
                            if (notes.x == 103 * 1 && notes.y > 575 + (11 * notes.down)) {
                                afterTP("hm", notes)
                            }
                            if (notes.x == 103 * 2 && notes.y > 575 + (11 * notes.down)) {
                                afterTP("hm", notes)
                            }
                            if (notes.x == 103 * 3 && notes.y > 575 + (11 * notes.down)) {
                                afterTP("hm", notes)
                            }
                            if (notes.x == 103 * 0 && pressTimeAry.d >= 1 && notes.y >= 575 - (8 * notes.down) && notes.y <= 575 + (8 * notes.down)) {
                                noteAry.splice(noteAry.indexOf(notes), 1)
                            }
                            if (notes.x == 103 * 1 && pressTimeAry.f >= 1 && notes.y >= 575 - (8 * notes.down) && notes.y <= 575 + (8 * notes.down)) {
                                noteAry.splice(noteAry.indexOf(notes), 1)
                            }
                            if (notes.x == 103 * 2 && pressTimeAry.j >= 1 && notes.y >= 575 - (8 * notes.down) && notes.y <= 575 + (8 * notes.down)) {
                                noteAry.splice(noteAry.indexOf(notes), 1)
                            }
                            if (notes.x == 103 * 3 && pressTimeAry.k >= 1 && notes.y >= 575 - (8 * notes.down) && notes.y <= 575 + (8 * notes.down)) {
                                noteAry.splice(noteAry.indexOf(notes), 1)
                            }
                        } else if (notes.type == "hold_mid" && notes.addCombo == true) {
                            if (notes.x == 103 * 0 && pressTimeAry.d == 0 && notes.y > 575 + (11 * notes.down)) {
                                afterTP("hm", notes)
                            }
                            if (notes.x == 103 * 1 && pressTimeAry.f == 0 && notes.y > 575 + (11 * notes.down)) {
                                afterTP("hm", notes)
                            }
                            if (notes.x == 103 * 2 && pressTimeAry.j == 0 && notes.y > 575 + (11 * notes.down)) {
                                afterTP("hm", notes)
                            }
                            if (notes.x == 103 * 3 && pressTimeAry.k == 0 && notes.y > 575 + (11 * notes.down)) {
                                afterTP("hm", notes)
                            }
                            if (notes.x == 103 * 0 && pressTimeAry.d >= 1 && notes.y >= 575 - (8 * notes.down) && notes.y <= 575 + (8 * notes.down)) {
                                if (notes.test == "perfect") {
                                    afterTP("hpa", notes)
                                } else if (notes.test == "good") {
                                    afterTP("hpg", notes)
                                }
                            }
                            if (notes.x == 103 * 1 && pressTimeAry.f >= 1 && notes.y >= 575 - (8 * notes.down) && notes.y <= 575 + (8 * notes.down)) {
                                if (notes.test == "perfect") {
                                    afterTP("hpa", notes)
                                } else if (notes.test == "good") {
                                    afterTP("hpg", notes)
                                }
                            }
                            if (notes.x == 103 * 2 && pressTimeAry.j >= 1 && notes.y >= 575 - (8 * notes.down) && notes.y <= 575 + (8 * notes.down)) {
                                if (notes.test == "perfect") {
                                    afterTP("hpa", notes)
                                } else if (notes.test == "good") {
                                    afterTP("hpg", notes)
                                }
                            }
                            if (notes.x == 103 * 3 && pressTimeAry.k >= 1 && notes.y >= 575 - (8 * notes.down) && notes.y <= 575 + (8 * notes.down)) {
                                if (notes.test == "perfect") {
                                    afterTP("hpa", notes)
                                } else if (notes.test == "good") {
                                    afterTP("hpg", notes)
                                }
                            }
                        }
                    }
                }
            }
        }

        //画结果
        function drawResult() {
            if (drawResultType == "Perfect") {
                if (count >= 1 && count <= 2) {
                    count += 1
                    ctx.drawImage(perfectImg, (canvasWidth / 2) - (160 * 1.5 / 2), canvasHeight - 300, 160 * 1.5, 37 * 1.3)
                } else if (count >= 3 && count <= 4) {
                    count += 1
                    ctx.drawImage(perfectImg, (canvasWidth / 2) - (160 * 1.65 / 2), canvasHeight - 300, 160 * 1.65, 37 * 1.4)
                } else if (count >= 5 && count <= 35) {
                    count += 1
                    ctx.drawImage(perfectImg, (canvasWidth / 2) - (160 * 1.8 / 2), canvasHeight - 300, 160 * 1.8, 37 * 1.5)
                } else if (count == 36) {
                    count = 0
                    drawResultType = null
                    ctx.drawImage(perfectImg, (canvasWidth / 2) - (160 * 1.8 / 2), canvasHeight - 300, 160 * 1.8, 37 * 1.5)
                }
            } else if (drawResultType == "Miss") {
                if (count >= 1 && count <= 2) {
                    count += 1
                    ctx.drawImage(missImg, (canvasWidth / 2) - (84 * 1.5 / 2), canvasHeight - 300, 84 * 1.5, 37 * 1.3)
                } else if (count >= 3 && count <= 4) {
                    count += 1
                    ctx.drawImage(missImg, (canvasWidth / 2) - (84 * 1.65 / 2), canvasHeight - 300, 84 * 1.65, 37 * 1.4)
                } else if (count >= 5 && count <= 35) {
                    count += 1
                    ctx.drawImage(missImg, (canvasWidth / 2) - (84 * 1.8 / 2), canvasHeight - 300, 84 * 1.8, 37 * 1.5)
                } else if (count == 36) {
                    count = 0
                    drawResultType = null
                    ctx.drawImage(missImg, (canvasWidth / 2) - (84 * 1.8 / 2), canvasHeight - 300, 84 * 1.8, 37 * 1.5)
                }
            } else if (drawResultType == "Good") {
                if (count >= 1 && count <= 2) {
                    count += 1
                    ctx.drawImage(goodImg, (canvasWidth / 2) - (84 * 1.5 / 2), canvasHeight - 300, 84 * 1.5, 37 * 1.3)
                } else if (count >= 3 && count <= 4) {
                    count += 1
                    ctx.drawImage(goodImg, (canvasWidth / 2) - (84 * 1.65 / 2), canvasHeight - 300, 84 * 1.65, 37 * 1.4)
                } else if (count >= 5 && count <= 35) {
                    count += 1
                    ctx.drawImage(goodImg, (canvasWidth / 2) - (84 * 1.8 / 2), canvasHeight - 300, 84 * 1.8, 37 * 1.5)
                } else if (count == 36) {
                    count = 0
                    drawResultType = null
                    ctx.drawImage(goodImg, (canvasWidth / 2) - (84 * 1.8 / 2), canvasHeight - 300, 84 * 1.8, 37 * 1.5)
                }
            }
        }

        //在autoplay模式下游玩的情况：
        function autoPlaying() {
            if (autoplay.mode == true) {
                if (autoplay.l1 > 0) {
                    autoplay.l1 = 0
                    pressAry.d = false
                    pressTimeAry.d = 0
                }
                if (autoplay.l2 > 0) {
                    autoplay.l2 = 0
                    pressAry.f = false
                    pressTimeAry.f = 0
                }
                if (autoplay.l3 > 0) {
                    autoplay.l3 = 0
                    pressAry.j = false
                    pressTimeAry.j = 0
                }
                if (autoplay.l4 > 0) {
                    autoplay.l4 = 0
                    pressAry.k = false
                    pressTimeAry.k = 0
                }
                if (noteAry != []) {
                    for (var i = 0; i < noteAry.length; i++) {
                        if (noteAry[i].y >= 564 - (4 * downSpeed) && noteAry[i].y <= 575 + (8 * downSpeed)) {
                            if ((noteAry[i].x) / 103 == 0 && autoplay.l1 <= 0) {
                                autoplay.l1 += 1
                                pressAry.d = true
                                pressTimeAry.d += 1
                            }
                            if ((noteAry[i].x) / 103 == 1 && autoplay.l2 <= 0) {
                                autoplay.l2 += 1
                                pressAry.f = true
                                pressTimeAry.f += 1
                            }
                            if ((noteAry[i].x) / 103 == 2 && autoplay.l3 <= 0) {
                                autoplay.l3 += 1
                                pressAry.j = true
                                pressTimeAry.j += 1
                            }
                            if ((noteAry[i].x) / 103 == 3 && autoplay.l4 <= 0) {
                                autoplay.l4 += 1
                                pressAry.k = true
                                pressTimeAry.k += 1
                            }
                        }
                    }
                }
            }
        }

        //展示combo
        function showCombo() {
            if (combo >= 3) {
                ctx.font = "bold 50px Agency FB"
                ctx.fillstyle = "#FFFFFF"
                if (autoplay.mode == true) {
                    ctx.fillText("AUTO", (canvasWidth / 2) - (ctx.measureText("AUTO").width / 2), 50)
                } else if (autoplay.mode == false) {
                    ctx.fillText("Combo", (canvasWidth / 2) - (ctx.measureText("Combo").width / 2), 50)
                }
                ctx.font = "bold 40px Agency FB"
                ctx.fillstyle = "#FFFFFF"
                ctx.fillText(combo + "", (canvasWidth / 2) - (ctx.measureText(combo + "").width / 2), 90)
            }
            ctx.font = "bold 40px Agency FB"
            ctx.fillstyle = "#FFFFFF"
            ctx.fillText("Score", (canvasWidth / 2) - (ctx.measureText("Score").width / 2) + 125, 50)
            ctx.fillText("" + Math.ceil(score), (canvasWidth - 80) - (ctx.measureText("" + Math.ceil(score)).width / 2), 90)
            musicTime -= 8
        }

        //游戏结束结算
        function gameOver() {
            if (alpha0 == false) {
                ctx.clearRect(0, 0, canvasWidth, canvasHeight)
                ctx.globalAlpha -= 0.01
                ctx.drawImage(bgImg, 0, 0)
                showCombo()
                drawRealAccuracy()
                if (ctx.globalAlpha <= 0.01) {
                    ctx.globalAlpha = 0
                    alpha0 = true
                }
            } else if (alpha0 == true) {
                ctx.clearRect(0, 0, canvasWidth, canvasHeight)
                ctx.globalAlpha = 1
                if (combo == allCombo) {
                    if (allResultCount.perfect == allCombo) {
                        ctx.font = "bold 60px Agency FB"
                        ctx.fillStyle = "#FFC90E"
                        if (autoplay.mode == false) { ctx.fillText("ALL PERFECT", widthLeftOverResult + widthAddOverResult, 85 + 75) } else if (autoplay.mode == true) { ctx.fillText("AUTO PLAY", widthLeftOverResult + widthAddOverResult, 85 + 75) }
                    } else if (allResultCount.perfect + allResultCount.good == allCombo && allResultCount.miss == 0) {
                        ctx.font = "bold 60px Agency FB"
                        ctx.fillStyle = "#3F48CC"
                        ctx.fillText("Full Combo", widthLeftOverResult + widthAddOverResult, 85 + 75)
                    }
                }
                ctx.font = "bold 180px Agency FB"
                ctx.fillStyle = "#B5E61D"
                if (Math.ceil(score) == 1000000 || Math.ceil(score) == 999999 || Math.ceil(score) == 1000001) {
                    ctx.fillText("U", canvasWidth - 120, 80 + 75)
                } else if (score < 1000000 && score >= 950000) {
                    ctx.fillText("V", canvasWidth - 120, 80 + 75)
                } else if (score < 950000 && score >= 900000) {
                    ctx.fillText("S", canvasWidth - 120, 80 + 75)
                } else if (score < 900000 && score >= 850000) {
                    ctx.fillText("A", canvasWidth - 120, 80 + 75)
                } else if (score < 850000 && score >= 800000) {
                    ctx.fillText("B", canvasWidth - 120, 80 + 75)
                } else if (score < 800000 && score >= 750000) {
                    ctx.fillText("C", canvasWidth - 120, 80 + 75)
                } else if (score < 750000 && score >= 700000) {
                    ctx.fillText("D", canvasWidth - 120, 80 + 75)
                } else if (score < 700000) {
                    ctx.fillText("F", canvasWidth - 120, 80 + 75)
                }
                ctx.fillstyle = "#FFC90E"
                ctx.drawImage(perfectImg, widthLeftOverResult + widthAddOverResult, 70 + 100, 200, 37 * 1.2)
                ctx.drawImage(goodImg, widthLeftOverResult + widthAddOverResult, 120 + 100, 120, 37 * 1.2)
                ctx.drawImage(missImg, widthLeftOverResult + widthAddOverResult, 170 + 100, 110, 37 * 1.2)
                ctx.font = "60px Agency FB"
                ctx.fillStyle = "#FFF200"
                ctx.fillText("x " + allResultCount.perfect, widthLeftOverResult + widthAddOverResult + 205, 70 + 100 + 45)
                ctx.font = "60px Agency FB"
                ctx.fillStyle = "#00A2E8"
                ctx.fillText("x " + allResultCount.good, widthLeftOverResult + widthAddOverResult + 133, 120 + 100 + 45)
                ctx.font = "60px Agency FB"
                ctx.fillStyle = "#ED1C24"
                ctx.fillText("x " + allResultCount.miss, widthLeftOverResult + widthAddOverResult + 130, 170 + 100 + 45)
                ctx.font = "bold 65px Agency FB"
                ctx.fillStyle = "#424242"
                if (Math.ceil(score) == 1000000 || Math.ceil(score) == 999999 || Math.ceil(score) == 1000001) {
                    ctx.fillText("" + 1000000, widthLeftOverResult + widthAddOverResult, 10 + 60)
                } else {
                    ctx.fillText("" + Math.ceil(score), widthLeftOverResult + widthAddOverResult, 10 + 60)
                }
                ctx.font = "bold 35px Agency FB"
                ctx.fillStyle = "#B3B3B3"
                ctx.fillText(realAccuracy + "%", widthLeftOverResult + widthAddOverResult + 3, 10 + 60 + 33)
                widthLeftOverResult += widthAddOverResult
                if (widthLeftOverResult >= 20) {
                    alpha0 = null
                    clearInterval(total)
                    gameStart = false
                    audio.pause()
                }
            }
        }

        //获取准确率
        function drawRealAccuracy() {
            realAccuracy = 0
            if (accuracy.length == 0) {
                realAccuracy = false
            } else if (accuracy.length > 0) {
                for (var i = 0; i <= accuracy.length - 1; i++) {
                    realAccuracy = realAccuracy + accuracy[i]
                }
                realAccuracy = parseFloat(parseFloat(realAccuracy / (accuracy.length)) * 100)
                realAccuracy = realAccuracy.toFixed(2)
            }
            if (realAccuracy != false) {
                ctx.fillStyle = "FFFFFF"
                ctx.font = "bold 40px Agency FB"
                ctx.fillText(realAccuracy + "%", 15, 90)
            }
        }

        //游戏暂停与继续
        function pauseAndStart() {
            if (musicTime > 0) {
                if (isGamePause == false) {
                    isGamePause = true
                } else if (isGamePause == true) {
                    ctx.globalAlpha = 1
                    isGamePause = false
                }
                if (isGamePause == true) {
                    audio.pause()
                } else if (isGamePause == false) {
                    audio.play()
                }
            }
        }


        //鼠标事件
        // function mouseEvent(){
        //     if(canvas.ontouchstart == null) {
        //         canvas.onmousedown = gameDownEvent
        //     }else{
        //         canvas.ontouchstart = gameDownEvent
        //     }

        //     window.onload = function(){
        //         $("#canvas").on("swipe",function(){console.log("1")})
        //     }

        //     // canvas.onmouseup = gameDownEvent
        //     document.getElementById("nothing").innerHTML = isMouseDown
        //         // if(isGamePause == false){
        //         //     temp = down.touches[0]
        //         //     mouseData.x = temp.pageX,
        //         //     mouseData.y = temp.pageY,
        //         //     isMouseDown = true
        //         // }
        //         // canvas.ontouchmove = function(move){
        //         //     if(isGamePause == false && isMouseDown == true){
        //         //         temp = move.touches[0]
        //         //         mouseData.x = temp.pageX
        //         //         mouseData.y = temp.pageY
        //         //     }
        //         // }
        //     // }
        //     // if(isMouseDown == true){
        //     //     mouseData.pressTime += 1
        //     //     pressAry.d = false
        //     //     pressAry.f = false
        //     //     pressAry.j = false
        //     //     pressAry.k = false
        //     //     pressTimeAry.d = 0
        //     //     pressTimeAry.f = 0
        //     //     pressTimeAry.j = 0
        //     //     pressTimeAry.k = 0
        //     //     if(mouseData.x <= 104){
        //     //         pressAry.d = true
        //     //         pressTimeAry.d = mouseData.pressTime
        //     //     }else if(mouseData.x >= 105 && mouseData.x <= 208){
        //     //         pressAry.f = true
        //     //         pressTimeAry.f = mouseData.pressTime
        //     //     }else if(mouseData.x >= 209 && mouseData.x <= 312){
        //     //         pressAry.j = true
        //     //         pressTimeAry.j = mouseData.pressTime
        //     //     }else if(mouseData.x >= 313){
        //     //         pressAry.k = true
        //     //         pressTimeAry.k = mouseData.pressTime
        //     //     }
        //     // }
        //     // canvas.ontouchend = function(){
        //     //     isMouseDown = false
        //     //     mouseData = {
        //     //         x: 0,
        //     //         y: 0,
        //     //         pressTime: 0,
        //     //     }
        //     //     pressAry.d = false
        //     //     pressAry.f = false
        //     //     pressAry.j = false
        //     //     pressAry.k = false
        //     //     pressTimeAry.d = 0
        //     //     pressTimeAry.f = 0
        //     //     pressTimeAry.j = 0
        //     //     pressTimeAry.k = 0
        //     // }
        //     // // console.log(mouseData.pressTime)
        //     // document.getElementById("nothing").innerHTML = [mouseData.x,mouseData.y,mouseData.pressTime]
        // }

        // function gameDownEvent(d){
        //     isMouseDown = true
        //     console.log(d)
        // }

        // function gameMoveEvent(m){
        //     console.log(m)
        // }

        // function gameUpEvent(u){
        //     isMouseDown = false
        //     console.log(u)
        // }

        //游戏主函数
        function gameHandler() {
            //判断时间
            if (musicTime > 0 && isGamePause == false) {
                //清空画布
                ctx.clearRect(0, 0, canvasWidth, canvasHeight)
                    //绘画背景
                ctx.drawImage(bgImg, 0, 0)
                    //autoplay模式
                autoPlaying()
            }
            if (musicTime > 0) {
                //按键按下情况
                showPressBackGround()
            }
            if (musicTime > 0 && isGamePause == false) {
                //移动音符
                moveNote()
                    //绘画音符
                drawNote()
                    //展示combo
                showCombo()
                    //检测判定情况
                testPerfects()
                    //绘画判定结果
                drawResult()
                    //绘画准确率
                drawRealAccuracy()
                    //鼠标事件
                    // mouseEvent()
            } else if (musicTime <= 0) {
                audio.pause()
                gameOver()
            }
        }
    }
}