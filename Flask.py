from flask import Flask, jsonify, abort, request, render_template
from flask.ext.sqlalchemy import SQLAlchemy
from sqlalchemy import asc
from marshmallow import Serializer

class TodoSerializer(Serializer):
    class Meta:
        fields = ('id', 'todo', 'done', 'order')

def get_todos_serialized(todo):
    return TodoSerializer(todo).data

app = Flask(__name__)
app.config.from_pyfile('config.py')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = True
db = SQLAlchemy(app)

class TodoList(db.Model):
    id = db.Column(db.Integer, primary_key = True)
    todo = db.Column(db.Text)
    order= db.Column(db.Integer)
    done = db.Column(db.Boolean, default = False)

    def __init__(self, todo, order):
        self.todo = todo
        self.done = False
        self.order = order

db.create_all()


@app.route('/')
def index():
    return render_template('index.html')

@app.route('/todos/', methods = ['GET'])
def get_todos():
    todos = TodoList.query.order_by(asc(TodoList.order)).all()
    incomplete = TodoList.query.filter_by(done = False).count()
    serialized = [get_todos_serialized(todo) for todo in todos]
    return jsonify({'incomplete': incomplete, 'result': serialized})

@app.route('/todos/add/', methods = ['POST'])
def add_todo():
    todo = request.json[0]
    order = request.json[1]

    new_todo = TodoList(todo, order)
    db.session.add(new_todo)
    db.session.commit()
    todos = TodoList.query.order_by(asc(TodoList.order)).all()
    incomplete = TodoList.query.filter_by(done = False).count()
    serialized = [get_todos_serialized(todo) for todo in todos]
    return jsonify({'incomplete': incomplete, 'result': serialized})

@app.route('/todos/update/', methods = ['PATCH'])
def update_todo():
    id = request.json[0]

    todo = TodoList.query.get(id)
    if todo.done:
        todo.done = False
    else:
        todo.done = True

    db.session.commit()
    todos = TodoList.query.order_by(asc(TodoList.order)).all()
    incomplete = TodoList.query.filter_by(done = False).count()
    serialized = [get_todos_serialized(todo) for todo in todos]
    return jsonify({'incomplete': incomplete, 'result': serialized})

@app.route('/todos/update/all/', methods = ['PATCH'])
def complete_all():
    todos = TodoList.query.all()
    for todo in todos:
        todo.done = True

    db.session.commit()
    todos = TodoList.query.order_by(asc(TodoList.order)).all()
    incomplete = TodoList.query.filter_by(done = False).count()
    serialized = [get_todos_serialized(todo) for todo in todos]
    return jsonify({'incomplete': incomplete, 'result': serialized})

@app.route('/todos/order/', methods = ['PATCH'])
def todo_order():
    current_id = request.json[0]
    other_id = request.json[1]

    current = TodoList.query.get(current_id)
    other = TodoList.query.get(other_id)
    current_order = current.order
    other_order = other.order

    current.order = other_order
    other.order = current_order

    db.session.commit()
    todos = TodoList.query.order_by(asc(TodoList.order)).all()
    incomplete = TodoList.query.filter_by(done = False).count()
    serialized = [get_todos_serialized(todo) for todo in todos]
    return jsonify({'incomplete': incomplete, 'result': serialized})

@app.route('/todos/delete/', methods = ['DELETE'])
def delete_todo():
    id = request.json[0]

    todo = TodoList.query.get(id)
    db.session.delete(todo)
    db.session.commit()
    todos = TodoList.query.order_by(asc(TodoList.order)).all()
    incomplete = TodoList.query.filter_by(done = False).count()
    serialized = [get_todos_serialized(todo) for todo in todos]
    return jsonify({'incomplete': incomplete, 'result': serialized})

if __name__ == "__main__":
    app.run()
