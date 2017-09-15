class Todo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      todos: [],
      incomplete: 0
    }

    this.updateState = this.updateState.bind(this);
    this.orderUp = this.orderUp.bind(this);
    this.orderDown = this.orderDown.bind(this);
  }

  componentDidMount() {
    this.getTodos();
  }

  getTodos() {
    axios.get('/todos/')
      .then((response) => {
        this.setState({todos: response.data.result, incomplete: response.data.incomplete});
      })
      .catch((error) => {
        console.log(error);
      });
  }

  updateState(data) {
    let updatedTodos = data.result;
    let incompletedTodos = data.incomplete;
    
    this.setState({todos: updatedTodos, incomplete: incompletedTodos});
  }

  markAllAsComplete() {
    const request = 'update';
    axios.post('/todos/update/all/', request)
      .then((response) => {
        this.setState({todos: response.data.result, incomplete: response.data.incomplete});
      })
      .catch((error) => {
        console.log(error);
      });
  }

  orderUp(id) {
    const todos = this.state.todos;
    let index = todos.findIndex(i => i.id == id);
    if (index == 0) {
      alert("Can't move this up anymore!");
    } else {
      const currentId = id;
      const switchingId = todos[index - 1].id;
      const request = [currentId, switchingId];
      axios.post('/todos/order/', request)
        .then((response) => {
          this.setState({todos: response.data.result, incomplete: response.data.incomplete});
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }

  orderDown(id) {
    const todos = this.state.todos;
    let index = todos.findIndex(i => i.id == id);
    let lastIndex = todos.length - 1;
    if (index == lastIndex) {
      alert("Can't move this down anymore!");
    } else {
      const currentId = id;
      const switchingId = todos[index + 1].id;
      const request = [currentId, switchingId];
      axios.post('/todos/order/', request)
        .then((response) => {
          this.setState({todos: response.data.result, incomplete: response.data.incomplete});
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }

  renderTodos() {
    return _.map(this.state.todos, todo => {
      return (
        <TodoItem
          id={todo.id}
          done={todo.done}
          content={todo.todo}
          todoState={this.state.todos}
          key={todo.id}
          updateParent={this.updateState}
          moveUp={this.orderUp}
          moveDown={this.orderDown}
        />
      );
    });
  }

  render() {
    return (
      <div className="todo-container">
        <h1 className="todo-heading">Todos</h1>
        <AddTodo updateParent={this.updateState} todoList={this.state.todos} />
        <div className="todo-list">
          {this.renderTodos()}
        </div>
        {
          this.state.todos.length == 0 ?
          null :
          <div className="todo-footer">
            <div>{this.state.incomplete} items left</div>
            <a className="mark-all" onClick={() => this.markAllAsComplete()}>Mark all as complete</a>
          </div>
        }
      </div>
    );
  }
}
