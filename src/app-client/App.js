import React, {Component} from 'react';
import { render } from 'react-dom';

class App extends Component {
    
    constructor() {
        super();
        this.state = {
            title: '',
            description: '',
            tasks: [],
            _id: ''
        };
        this.addTask = this.addTask.bind(this);
        this.handleChange = this.handleChange.bind(this);
        //this.fetchTasks = this.fetchTasks.bind(this);
    }


    deleteTask(id) {
        if(confirm("Quere eliminar?")){
            fetch(`api/tasks/${id}`, {
                method: 'DELETE',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            })
            .then(res => res.json())
            .then(data => {
                console.log(data);
                M.toast({html: 'Task Deleted'}); 
                this.fetchTasks();
            });
        }
    }

    editTask(id) {
        fetch(`/api/tasks/${id}`)
            .then(res => res.json())
            .then(data => {
                console.log(data)
                this.setState({
                    title: data.title,
                    description: data.description,
                    _id: data._id
                })
            })     
    }

    addTask(e) {
        if(this.state._id) {
            fetch(`/api/tasks/${this.state._id}`, {
                method: 'PUT',
                body: JSON.stringify(this.state),
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            })
            .then(res => res.json())
            .then(data => {
                console.log(data);
                M.toast({html: 'Task Updated'});
                this.setState({ title: '', description: '', _id: '' });
                this.fetchTasks();
            })
        } else { 
            fetch('/api/tasks', {
                method: 'POST',
                body: JSON.stringify(this.state),
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            })
                .then(res => res.json())
                .then(data => {
                    console.log(data);
                    M.toast({html: 'Task Saved'}); // variable de materialize, es para mostrar una especie de notificacion con ese tezto
                    this.setState({ title: '', description: '' });
                    this.fetchTasks();
                })
                .catch(err => console.log(err));
        }
        e.preventDefault();
    }

    componentDidMount() { // cuando llamemos este evento apenas la palicacion cargue vamos a poder ejecutar cualquier cosa de js    
        this.fetchTasks();
    }

    fetchTasks() { // obtener tareas 
        fetch('/api/tasks') // fetch, por defecto peticion get
            .then(res => res.json())
            .then(data => { 
                this.setState({tasks: data});
                console.log(this.state.tasks)
            } );
    }

    handleChange(e) {
        const { name, value } = e.target;
        this.setState({
            [name]: value
        })  
    }
    
    render(){
        return(
           <div>

               { /*Navegation*/ }
                <nav className="light-blue darken-4">
                    <div className="container">
                        <a className="brand-logo" href="/">MERN Stack</a>
                    </div>     
                </nav>

                <div className="container">
                    <div className="row">
                        <div className="col s5">
                            <div className="card">
                                <div className="card-content">
                                    <form onSubmit={this.addTask}>
                                        <div className="row">
                                            <div className="input-field col s12">
                                                <input value={this.state.title} name="title" onChange={this.handleChange} type="text" placeholder="Task"/>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="input-field col s12">
                                                <textarea name="description" value={this.state.description} onChange={this.handleChange} placeholder="Task Description" className="materialize-textarea"></textarea>
                                            </div>
                                        </div>
                                        <button type="submit" className="btn light-blue darken-4">
                                            Send
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div>
                        <div className="col s7">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Title</th>
                                        <th>Description</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        this.state.tasks.map(task => {
                                            return (
                                                <tr key={task._id}>
                                                    <td>{task.title}</td>
                                                    <td>{task.description}</td>
                                                    <td>
                                                        <button onClick={() => this.deleteTask(task._id)} className="btn light-blue darken-4">
                                                            <i className="material-icons">delete</i> 
                                                        </button>
                                                        
                                                        <button onClick={() => this.editTask(task._id)} 
                                                            className="btn light-blue darken-4"
                                                           // style={{margin: '4px'}} // sintaxis Materialize
                                                        > <i className="material-icons">edit</i>
                                                        </button>
                                                    </td>
                                                </tr>
                                            )
                                        })
                                    }
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
           </div>
        )
    }
}

export default App;