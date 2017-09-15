class AddTodo extends React.Component {
  constructor(props) {
    super(props);
    this.state =  { value: ''}

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    event.preventDefault();
    this.setState({value: event.target.value});
  }

  handleSubmit(event) {
    event.preventDefault();
    let val = this.state.value.trim();

    if (val === '') {
      alert('Your todo is empty!');
    } else {
      var order;
      if (this.props.todoList.length == 0) {
        order = 1;
      } else {
        order = (this.props.todoList[this.props.todoList.length - 1].order) + 1;
      }
      const request = [val, order]
      axios.post('/todos/add/', request)
        .then((response) => {
          this.props.updateParent(response.data);
          this.setState({ value: ''});
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }

  render() {
    return (
      <form className="todo-form" onSubmit={this.handleSubmit}>
        <input
          type="text"
          name="todo"
          className="todo-input"
          placeholder="What needs to be done?"
          value={this.state.value}
          onChange={this.handleChange}
        />
        <input className="todo-form-submit" type="submit" value="Add Todo"/>
      </form>
    );
  }
}
