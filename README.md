**Copyright 2022/7/1 @OmegaOfficial**

# 这是 Omega Legacy 网页 demo 的项目文件

This is the project file of Omega Legacy webpage demo

该项目由**MFn233**(github.com/MFn233)维护，原作者是**小煜**和**BallThe**。

This project is maintained by * * MFn233 * * (github. com/MFn233). The original authors are * * Xiao Yu * * and * * BallThe * *.

~~由于写得实在是太稀烂和各种差~~，该项目最终被放弃，游戏转战 Unity 引擎

~~Due to the poor coding~~, the project was finally abandoned and the game switched to Unity engine

~~unity 那边的效率很低~~，如果你想看看 Omega 一开始的样子，不妨来这里先看看

~~The efficiency of unity is very low~~.If you want to see what Omega looks like at the beginning, you can come here first

这个项目最终会出现在 Omega 官方主页上，敬请期待

This project will eventually appear on Omega's official homepage. 

附：

Attachment:

为什么说 Omega Legacy 的代码稀烂？

Why is Omega Legacy's code so poor?

```Javascript
//并非我不写注释，这个刚项目开始写的时候就是这样的
//It's not that I don't write comments. It was like this at the beginning of this project
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
```
