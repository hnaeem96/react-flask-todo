class TodoItem extends React.Component {
  constructor(props) {
    super(props);
  }

  handleCheckbox(id) {
    axios.post('/todos/update/', id)
      .then((response) => {
        this.props.updateParent(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  handleDelete(id) {
    axios.post('/todos/delete/', id)
      .then((response) => {
        this.props.updateParent(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  render() {
    return (
      <div className="todo-card" key={this.props.id}>
        <div className="todo-content">
          <input
            className="todo-done"
            type="checkbox"
            onChange={() => this.handleCheckbox(this.props.id)}
            checked={this.props.done}
          />
        <p className={"todo-text " + (this.props.done ? 'completed' : '')}>{this.props.content}</p>
        </div>
        <div className="todo-buttons">
          <div className="order-buttons">
            <a className="move-up" onClick={() => this.props.moveUp(this.props.id)}>
              <svg className="svg-btn" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 306 306">
                <path fill="#aaa" d="M270.3 58.6L153 176 35.7 58.6 0 94.3l153 153 153-153"/>
              </svg>
            </a>
            <a className="move-down" onClick={() => this.props.moveDown(this.props.id)}>
              <svg className="svg-btn" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 306 306">
                <path fill="#aaa" d="M270.3 58.6L153 176 35.7 58.6 0 94.3l153 153 153-153"/>
              </svg>
            </a>
          </div>
          <a className="todo-remove" onClick={() => this.handleDelete(this.props.id)}>&#10005;</a>
        </div>
      </div>
    );
  }
}
