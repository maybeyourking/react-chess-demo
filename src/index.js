import React , {Fragment} from 'react';
import ReactDOM from 'react-dom';
import './index.css';

//tic-tac-toe(三连棋)游戏demo
/**
 * react官方教程案例，此教程很好的阐述了react框架的思想，即props和state
 * 若有不足，请多多指正
 */

function Square(props){
    return (
        <button className={props.class?"square square-win":"square"}
                onClick = {props.onClick}>
          {props.value}
        </button>
    );
}
class Board extends React.Component {
    render() {
        const row = Array(3).fill(null);
        const cel = Array(3).fill(null);
        const renderboards = row.map((a,b)=>{
            return(
                <div className="board-row" key={b}>
                    {cel.map((item,index)=>{
                        const prop = b*cel.length+index;
                        return(
                            <Square 
                                value = {this.props.squares[prop]}
                                onClick = { () => this.props.onClick(prop)}
                                key = {index}
                                class = {this.props.class[prop]}
                            />
                        )
                    })}   
                </div>
            )
        })
      return (
        <Fragment>
            {renderboards}
        </Fragment>
      );
    }
  }
  
  class Game extends React.Component {
     constructor(props){
        super(props)
        this.state = {
            history:[{
                squares : Array(9).fill(null),
                coordinate : null,
                ClassArray : Array(9).fill(null),
                draw:false
            }],
            xIsNext:true,
            stepNumber:0,
            sort:true,
            layer:false
        }
         
     }
     handelClick(i){
        const history = this.state.history.slice(0,this.state.stepNumber+1);
        const current = history[history.length-1];
        const squares = current.squares.slice();
        const winClass = JSON.parse(JSON.stringify(current.ClassArray));//需深拷贝
        let drawFlag = false;//平局标识
        const coordinate = calculateCoordinate(i);//记录落子坐标
        if( calculateWinner(squares) || squares[i] ){
            return;
        }
        
        squares[i] = this.state.xIsNext ?  "X" : "O" ;
        if( squares[i] && squares.indexOf(null) === -1){//当无人获胜时，显示一个平局的消息
            if( calculateWinner(squares) === null ){
                drawFlag = true;
            }
        }
        if( calculateWinner(squares) ){//每当有人获胜时，高亮显示连成一线的 3 颗棋子
            const winClassArray = calculateWinner(squares)[1];
           // eslint-disable-next-line no-redeclare
           for( var i = 0 ; i < winClassArray.length ; i++ ){
               winClass[winClassArray[i]] = true;
           }
        }
        this.setState({
            history:history.concat([{//这里使用concat而不用push
                squares:squares,
                coordinate:coordinate,
                ClassArray:winClass,
                draw:drawFlag
            }]),
            xIsNext:!this.state.xIsNext,
            stepNumber: history.length
        });
     }
     jumpTo(step){
         this.setState({
             stepNumber: step,
             xIsNext: (step % 2) === 0 
         })

     }
     handelSort(){
         this.setState({
            sort:!this.state.sort
         })
     }
     handellayer(){
         this.setState({
             layer:!this.state.layer
         })
     }
     shouldComponentUpdate(state,props){//当只有一个参数时，默认接收state
         //console.log(this.state,props);//this.stata与this.props为数据更改之前的state和props
         return true;//此生命周期必须return
     }
     componentDidUpdate(){
         console.log(this.state);
     }
    render() {
        const {history} = this.state;
        const current = history[this.state.stepNumber];//当前记录序列
        const winner = calculateWinner(current.squares);//获胜者
        const renderMoves = history.map( (item,index) => {//渲染历史记录
            const coordinate = item.coordinate;
            const desc = index ? //历史记录渲染信息
                'go to move #' + index + "坐标：" + coordinate :
                'go to game start';
            return (
                <li key={index}>
                    <button onClick={()=>this.jumpTo(index)} className={index === this.state.stepNumber ? "desc-active":""}>{desc}</button>
                </li>
            )
        })
        const sortBtn = ()=>{
            return( <button onClick={()=>this.handelSort()} style={{float:"right"}}>{this.state.sort?"Ascending↑":"descending↓"}</button> )
        }
        const showMoves = this.state.sort ? renderMoves : renderMoves.reverse();

        let status;
        if( winner ){
            status = "Winner: "+ winner[0];
        }else{
            status = 'Next player:' + (this.state.xIsNext ? "X" : "O" );
        }
      return (
        <div className="game">
          <div className="game-title">井字棋（tic-tac-toe）</div>
          <div className="game-author"><button className="authorbtn" onClick={()=>{this.handellayer()}}>查看规则</button></div>
          <div className="game-board">
            <Board 
                squares = {current.squares}
                onClick = { i=>this.handelClick(i) }
                class = {this.state.history[this.state.stepNumber].ClassArray}
            />
            {this.state.history[this.state.stepNumber].draw?<div className="draw">平了！！</div>:""}
          </div>
          <div className="game-info">
            <div>{status}</div>
            <div>历史记录{sortBtn()}</div>
            <ol>{showMoves}</ol>
          </div>
          <div className="layer" style={{display:this.state.layer?"block":"none"}} onClick={()=>{this.handellayer()}}></div>
          <div className="author-info" style={{display:this.state.layer?"block":"none"}}>
              <ol>
                  <li>起手任意一方落子</li>
                  <li>三点一线者胜</li>
                  <li>九步未果，平</li>
              </ol>
              <div>作者：孙一一的王小小</div>
          </div>
        </div>
      );
    }
  }

  function calculateWinner(squares) {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return[squares[a],[a,b,c]] ;
      }
    }
    return null;
  }
  function calculateCoordinate(coord){//显示落子坐标（列，行）
      const coordinate = [
          "(1,1)",
          "(2,1)",
          "(3,1)",
          "(1,2)",
          "(2,2)",
          "(3,2)",
          "(1,3)",
          "(2,3)",
          "(3,3)",
      ]
      return coordinate[coord];
  }

  ReactDOM.render(
    <Game />,
    document.getElementById('root')
  );
  