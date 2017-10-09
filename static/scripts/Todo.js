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
    return fetch('/todos/')
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({todos: responseJson.result, incomplete: responseJson.incomplete});
      })
      .catch((error) => {
        console.error(error);
      });
  }

  updateState(data) {
    let updatedTodos = data.result;
    let incompletedTodos = data.incomplete;

    this.setState({todos: updatedTodos, incomplete: incompletedTodos});
  }

  markAllAsComplete() {
    const request = ['update'];

    fetch('/todos/update/all/', {
      method: 'POST',
      headers : {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
      },
      body: JSON.stringify(request)
    })
    .then((response) => response.json())
    .then((responseJson) => {
      this.setState({todos: responseJson.result, incomplete: responseJson.incomplete});
    })
    .catch((error) => {
      console.error(error);
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

      fetch('/todos/order/', {
        method: 'PATCH',
        headers : {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
        },
        body: JSON.stringify(request)
      })
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({todos: responseJson.result, incomplete: responseJson.incomplete});
      })
      .catch((error) => {
        console.error(error);
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

      fetch('/todos/order/', {
        method: 'PATCH',
        headers : {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
        },
        body: JSON.stringify(request)
      })
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({todos: responseJson.result, incomplete: responseJson.incomplete});
      })
      .catch((error) => {
        console.error(error);
      });
    }
  }

  renderTodos() {
    return this.state.todos.map((todo) => {
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
    })
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
