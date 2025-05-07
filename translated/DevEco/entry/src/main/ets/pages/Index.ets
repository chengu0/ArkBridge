@Entry
@Component
struct Page2 {
  // 二维数组 表示运动区域
  @State area:number[][] = []
  // 当前运动方向
  @State directions: 'up'| 'down'| 'left'| 'right' = 'right'
  // 控制方向
  @State tryDirections: 'up'| 'down'| 'left'| 'right' = 'right'
  // 历史位置 用于蛇移动时更新蛇头和蛇尾
  @State historyPosition:number[][]=[]
  // 头部坐标
  @State headX:number = 0
  @State headY:number = 0
  // 蛇的长度
  @State length:number = 0
  // 颜色 不同的表示渲染不同等等颜色
  @State colors:ResourceColor[]=[Color.Black, Color.Black, Color.Orange]
  //结束提示
  @State end:string=''
  // 初始化
  initArea(){
    // 25 * 25 初始化地图
    this.area = []
    for(let i=0;i<25;i++){
      this.area.push([])
      for(let j=0;j<25;j++){
        this.area[i].push(0)
      }
    }
    // 对蛇初始化
    this.area[4][6]=1
    //this.area[4][7]=1
    //this.area[4][8]=1
    //this.area[4][9]=1
    //this.area[4][10]=1
    // 初始化历史位置
    this.historyPosition=[]
    this.historyPosition.push([6,4])
    //this.historyPosition.push([7,4])
    //this.historyPosition.push([8,4])
    //this.historyPosition.push([9,4])
    //this.historyPosition.push([10,4])
    // 初始化头部位置
    this.headX = 10
    this.headY = 4
    // 初始化蛇的长度
    this.length = 1
    // 初始化 结束提示
    this.end=''
    // 初始化方向以及想尝试的方向 为右
    this.directions = 'right'
    this.tryDirections = 'right'
  }

  aboutToAppear(): void {
    // 初始化
    this.initArea()
    // 随机生成能量的位置
    let foodX:number = Math.floor(Math.random()*this.area[0].length)
    let foodY:number = Math.floor(Math.random()*this.area[0].length)

    // 控制蛇的移动(更新坐标)
    setInterval(()=>{
      // 游戏结束后不做操作
      if(!this.end){
        //  上一个还没吃到 或 蛇的长度占满全屏 不用生成
        if(this.area[foodY][foodX]!=2&&this.length<25*25){
          while(true){
            // 生成的随机坐标为0时即为空位置时才生成能量退出循环
            if(this.area[foodY][foodX]==0){
              this.area[foodY][foodX]=2
              break
            }
            // 继续生成
            foodX = Math.floor(Math.random()*this.area[0].length)
            foodY = Math.floor(Math.random()*this.area[0].length)
          }
        }

        // 移动后头部的新位置
        let newHeadY:number
        let newHeadX:number
        // 当控制方向和当前移动的方向满足条件时 才改变当前位置 避免蛇头往身后走
        if(this.tryDirections == 'right' && this.directions != 'left') this.directions = 'right'
        else if(this.tryDirections == 'left' && this.directions != 'right') this.directions = 'left'
        else if(this.tryDirections == 'up' && this.directions != 'down') this.directions = 'up'
        else if(this.tryDirections == 'down' && this.directions != 'up') this.directions = 'down'

        // 不同的方向更新不同的头部
        if(this.directions == 'right'){
          newHeadY = this.headY
          newHeadX = this.headX+1
        }else if(this.directions == 'up'){
          newHeadY = this.headY-1
          newHeadX = this.headX
        }else if(this.directions == 'down'){
          newHeadY = this.headY+1
          newHeadX = this.headX
        }else{
          newHeadY = this.headY
          newHeadX = this.headX-1
        }

        // 判断是否撞墙
        if(newHeadY>=0 && newHeadY<this.area.length && newHeadX>=0 && newHeadX<this.area[0].length){
          // 未撞墙
          // 头部撞到自己
          if(this.area[newHeadY][newHeadX]==1){
            this.end = '吃到自己了 游戏结束！'
          }   // 未撞到
          else{
            // 是否吃到能量
            let eat:boolean = false
            // 如果头碰到2 则视为吃到能量
            if(this.area[newHeadY][newHeadX] == 2) eat = true
            // 将头的位置放入历史位置中
            this.historyPosition.push([newHeadX,newHeadY])
            // 获取头部的那一行
            let newRowHead = this.area[newHeadY]
            // 将头部的位置置为1 即变为蛇的一部分
            newRowHead[newHeadX] = 1
            // 更新蛇头的位置
            this.headY = newHeadY
            this.headX = newHeadX
            // 更新蛇头的那一行
            this.area.splice(newHeadY,1,newRowHead)

            // 吃到了能量 无需更新尾巴 长度加一
            if(!eat){
              // 没吃到能量 更新尾巴的那一行
              // 获取尾巴的位置
              let tailX = this.historyPosition[0][0]
              let tailY = this.historyPosition[0][1]
              // 移除尾巴
              this.historyPosition.shift()
              // 获取旧的尾巴的那一行
              let pastRowTail = this.area[tailY]
              // 将旧尾巴的位置置为0 表示尾巴移动
              pastRowTail[tailX] = 0
              // 更新旧的尾巴的那一行
              this.area.splice(tailY,1,pastRowTail)
            }else {
              // 吃到了 长度加一即可
              this.length++
            }
          }
        }   //跑出边界 即为撞墙
        else this.end='游戏结束！'
      }
    },100)    //200ms动一次

  }


  build() {
    Column() {
      Stack(){
        // 区域
        Column(){
          // 遍历每一行
          ForEach(this.area,(itemR:number[], indexR:number)=>{
            Row(){
              // 遍历每行的每一个位置
              ForEach(itemR,(itemC:number, indexC:number)=>{
                // 对每一个位置进行渲染 0:空位置 1:蛇的部位 2:能量 以及是否为蛇头
                Text(indexR == this.headY && indexC == this.headX?'·' : '')
                  .textAlign(TextAlign.Center)
                  .fontSize(12)
                  .fontWeight(900)
                  .fontColor(Color.White)
                  .width(12)
                  .aspectRatio(1)
                  .backgroundColor(this.historyPosition[this.historyPosition.length-1][0] == indexC &&
                    this.historyPosition[this.historyPosition.length-1][1] == indexR?
                  Color.Pink : this.colors[this.area[indexR][indexC]])
              })
            }
          })
        }
        .borderWidth(2)
        .borderColor(Color.Orange)
        // 结束时展示提示
        Column({space:10}){
          Text(this.end)
            .fontSize(20)
            .fontColor(Color.Red)
          Text(this.end?'重新开始':'')
            .fontSize(22)
            .fontColor(Color.Red)
            .onClick(()=>{
              this.initArea()
            })
        }
        .zIndex(this.end?1:-1)  //结束时置z轴为1 展示出来
      }
      // 控制键
      Stack(){
        // 上、下、左、右 逻辑一样   以"上"操作为例
        Button('W')
          .fontSize(20)
          .height(50)
          .width(80)
          .position({top:0, left:'50%'})
          .translate({x:'-50%'})
          .onClick(()=>{
            this.tryDirections = 'up'
          })
        Button('S')
          .fontSize(20)
          .height(50)
          .width(80)
          .position({bottom:0, left:'50%'})
          .translate({x:'-50%'})
          .onClick(()=>{
            this.tryDirections = 'down'
          })
        Button('A')
          .fontSize(20)
          .height(50)
          .width(70)
          .position({left:0, top:'50%'})
          .translate({y:'-50%'})
          .offset({left:0})
          .onClick(()=>{
            this.tryDirections = 'left'
          })
        Button('D')
          .fontSize(20)
          .height(50)
          .width(70)
          .position({right:0, top:'50%'})
          .translate({y:'-50%'})
          .onClick(()=>{
            this.tryDirections = 'right'
          })
      }
      .enabled(this.end?false:true)     // 游戏结束时为禁用态 按钮失效
      .width('45%')
      .aspectRatio(1)

    }
    .height('100%')
    .width('100%')
  }
}