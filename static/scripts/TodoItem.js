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
    const { id, done, content } = this.props;

    return (
      <div className="todo-card" key={id}>
        <div className="todo-content">
          <input
            className="todo-done"
            type="checkbox"
            onChange={() => this.handleCheckbox(id)}
            checked={done}
          />
        <p className={"todo-text " + (done ? 'completed' : '')}>{content}</p>
        </div>
        <div className="todo-buttons">
          <div className="order-buttons">
            <a className="move-up" onClick={() => this.props.moveUp(id)}>
              <svg className="svg-btn" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 306 306">
                <path fill="#aaa" d="M270.3 58.6L153 176 35.7 58.6 0 94.3l153 153 153-153"/>
              </svg>
            </a>
            <a className="move-down" onClick={() => this.props.moveDown(id)}>
              <svg className="svg-btn" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 306 306">
                <path fill="#aaa" d="M270.3 58.6L153 176 35.7 58.6 0 94.3l153 153 153-153"/>
              </svg>
            </a>
          </div>
          <a className="todo-remove" onClick={() => this.handleDelete(id)}>&#10005;</a>
        </div>
      </div>
    );
  }
}
