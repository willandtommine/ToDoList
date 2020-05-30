import React from 'react';

import './App.css';
import Axios from 'axios';
import {Users} from './Users.js';


export class ToDoList extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
    this.sortBy = this.sortBy.bind(this);
    this.removeItem = this.removeItem.bind(this);
    this.signIn = this.signIn.bind(this);
    this.state = {
      signedIn:false,
      name:"",
      users: [],
      items: [],
      sort: "none"
    }
  }
  removeItem(id) {
    
    let url = "/api/v1/todos/"+id;
    Axios.delete(url);

   const index = this.state.items.findIndex(item =>item.id === id)
  
  let start = this.state.items.splice(0,index)
  let end = this.state.items.splice(index+1)
  
    let newlist = start.concat(end)
    
    this.setState({
      items:newlist
    })
    
  }

  signIn(user,pass,bool){
    if(bool){
      this.setState({
        signedIn:true,
        name:user
      })
      
      return [true,user]
    }
    
      let userIndex = this.state.users.findIndex(item => item.username === user)
      
      if(userIndex === -1){
        return[false,user];
      }
      
      if(pass !== this.state.users[userIndex].password){
        return [false,user]
      }
      this.setState({
        signedIn:true,
        name:user
      })
      return [true,user];
      


  }

  getTodos(){
    Axios.get('/api/v1/todos')
    .then(resp =>{
      
      this.setState({
        items:resp.data
      })
    })
    Axios.get('/api/v1/users')
    .then(resp =>{
      this.setState({
        users:resp.data
      })
      
      
    })
  }

  componentDidMount() {
    this.getTodos()
    
    
  }

  handleClick(task, date, priority) {
if(!this.state.signedIn){
  alert("Not signed In Please Sign in")
  return
}


   // const list = this.state.items.concat(<ToDoItem removalFunc={this.removeItem} key={new Date().toLocaleString()} task={task} date={date} priority={priority} />);
   // this.setState({ items: list });

   Axios.post('api/v1/todos',{todo:{
     task:task,
     date:date,
     priority:priority,
     done:false,
     username: this.state.name
   }})
   .then(resp => {
     const list = this.state.items.concat(resp.data);
     this.setState({
       items:list
     })
   })


  }
  sortBy(type) {



    if (type === "task") {

      this.setState({
        sort: "task"
      })

    } else if (type === "date") {

      this.setState({
        sort: "date"
      })

    } else {
      this.setState({
        sort: "priority"
      })


    }
  }

  render() {

    if(!this.state.signedIn){
      
      return(
        
      <div>
        <Users onSubmit = {this.signIn}/>
        <AddItem onClick={this.handleClick} />
        <SortBy updateFunc={this.sortBy} />
        
      </div>
      )
    }




    let sorted = [];
    if (this.state.sort === "none") {
      sorted = this.state.items.map(item => {
        return item;
      })
    }
    else if (this.state.sort === "task") {
      let temp = this.state.items.map(item => {
        return item;
      })
      sorted = temp.sort((a, b) => a.task > b.task ? 1 : -1);


    } else if (this.state.sort === "date") {
      let temp = this.state.items.map(item => {
        return item;
      })
      sorted = temp.sort((a, b) => a.date > b.date ? 1 : -1);

    } else {
      let temp = this.state.items.map(item => {
        return item;
      })
      sorted = temp.sort((a, b) => a.priority < b.priority ? 1 : -1);
      sorted = sorted.map((item) => {
        return item;
      })
    }

    sorted = sorted.map((item) => {
      console.log(item)
      if(item.username===this.state.name){
        return item
      }
      return undefined;
    })
    

    return (
      <div>
        <Users onSubmit = {this.signIn}/>
        <AddItem onClick={this.handleClick} />
        <SortBy updateFunc={this.sortBy} />
        <ul>
          {sorted.map((item)=>{
            if(item === undefined){
              return ""
            }
            return <ToDoItem key={item.id} id = {item.id} removalFunc={this.removeItem}  task={item.task} date={item.date} priority={item.priority} done ={item.done} />
          })}
        </ul>
      </div>

    );

  }





}
class AddItem extends React.Component {
  constructor(props) {
    super(props);
    this.parseInput = this.parseInput.bind(this);
  }
  parseInput(e) {

    e.preventDefault();
    if (this.inputTask.value === "") {
      alert("no task Submitted")


    }
    if (isNaN(this.inputPriority.value)) {
      alert("Not a valid Priority");
      this.inputPriority.value = "0"
    }
    let string = "";
    string += this.inputDate.value;
    if (string.charAt(2) !== "/" && string.charAt(5) !== "/" && string.length !== 10) {
      alert("not a Valid Date format. Try DD/MM/YYYY")

      this.inputDate.value = "00/00/0000"
    }


    this.props.onClick(this.inputTask.value, this.inputDate.value, this.inputPriority.value);
    this.inputTask.value = "";
    this.inputDate.value = "";
    this.inputPriority.value = "";



  }
  render() {
    return (
      <div >
        <form onSubmit={this.parseInput}>
          <input placeholder="Enter a Task" ref={(a) => this.inputTask = a}>
          </input>
          <input placeholder="Enter a Due Date DD/MM/YYYY" ref={(a) => this.inputDate = a}>
          </input>
          <input placeholder="Enter a Priority ( 1-10 )" ref={(a) => this.inputPriority = a}>

          </input>
          <button type="submit" >
            Add!
      </button>
        </form>
      </div>

    )
  }
}
class ToDoItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id:this.props.id,
      task: this.props.task,
      date: this.props.date,
      priority: this.props.priority,
      Editing: false,
      done: this.props.done
    }
    
    this.handleClick = this.handleClick.bind(this);
    this.changeData = this.changeData.bind(this);
    this.handleRemoval = this.handleRemoval.bind(this);
    this.complete = this.complete.bind(this);
  }
  complete() {

    if (this.state.done === true) {
      this.setState({
        done: false
      })
    } else {
      this.setState({
        done: true
      })
    }
  }

  handleRemoval() {
    
    this.props.removalFunc(this.state.id);

  }
  changeData(id) {
    
    let t = this.state.task;
    if (this.inputTask.value !== "") {
      t = this.inputTask.value;
    }
    let d = this.state.date;
    if (this.inputDate.value !== "") {
      d = this.inputDate.value;
    }
    let p = this.state.priority
    if (this.inputPriority.value !== "") {
      p = this.inputPriority.value;
    }
    this.setState({
      task:t,
      date:d,
      priority:p
    })

    let url = "/api/v1/todos/" +id;
    Axios.put(url,{todo: {
      task:t,
      date:d,
      priority:p,
    }})



  }
  handleClick(e,id) {
    if (this.state.Editing) {
      this.changeData(id)
      this.setState({ Editing: false })
    } else {

      this.setState({ Editing: true })

    }
  }

  render() {
    if (this.state.Editing) {
      return (
        <div background="blue">
          <form onSubmit={this.handleClick}>

            <input placeholder={this.state.task} ref={(a) => this.inputTask = a} ></input>
            <input placeholder="DD/MM/YYYY" ref={(a) => this.inputDate = a} ></input>
            <input placeholder={this.state.priority} ref={(a) => this.inputPriority = a} ></input>
          </form>

          <button type="submit" onClick={(e)=> {this.handleClick(e,this.props.id)}} >Save</button>

        </div>
      )
    }

    return (
      <div background="blue">
        
        <p>Complete: {""+(this.state.done)} || {this.state.task} || Due By: {this.state.date} || Priority: {this.state.priority}</p>
        <button onClick={this.handleClick}>Edit</button>
        <button onClick={this.handleRemoval}>Remove</button>
        <button onClick={this.complete}>Toggle Completion</button>
      </div>
    );
  }

}



class SortBy extends React.Component {
  constructor(props) {
    super(props)
    this.byTask = this.byTask.bind(this);
    this.byDate = this.byDate.bind(this);
    this.byPriority = this.byPriority.bind(this);
  }
  byTask() {
    this.props.updateFunc("task");
  }

  byDate() {
    this.props.updateFunc("date");
  }

  byPriority() {
    this.props.updateFunc("priority");
  }

  render() {
    return (
      <div>
        <button onClick={this.byTask}>
          Sort By Task
        </button>
        <button onClick={this.byDate}>
          Sort By Date
        </button>
        <button onClick={this.byPriority}>
          Sort By Priority
        </button>
      </div>
    )
  }
}