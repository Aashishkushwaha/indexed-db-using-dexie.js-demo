import { ChangeEvent, FC, FormEvent, useState } from "react";
import { Dexie } from "dexie";
import { useLiveQuery } from "dexie-react-hooks";
import "./App.css";

interface TodoItem {
  id: number;
  title: string;
  completed: boolean;
}

const db: Dexie = new Dexie("todoApp");
db.version(1).stores({
  todoItems: "++id,title,completed",
});

const { todoItems } = db;

const App: FC = () => {
  const [title, setTitle] = useState<string>("");

  const allItems: TodoItem[] = useLiveQuery(() => todoItems.toArray(), []);

  const addTaskHandler = async (
    event: FormEvent<HTMLFormElement>
  ): Promise<void> => {
    event.preventDefault();
    const newTodoItem = {
      title,
      completed: false,
    };

    await todoItems.add(newTodoItem);
    setTitle("");
  };

  const deleteTaskHandler = async (id: number): Promise<void> => {
    todoItems.delete(id);
  };

  const toggleTaskHandler = async (
    event: ChangeEvent<HTMLInputElement>,
    id: number
  ) => {
    event.preventDefault();
    await todoItems.update(id, { completed: !!event.target.checked });
  };

  return (
    <div className="container">
      <h3 className="teal-text center-align">Todo App</h3>
      <form className="add-item-form" onSubmit={addTaskHandler}>
        <input
          required
          type="text"
          value={title}
          className="itemField"
          placeholder="What do you want to do today?"
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setTitle(e.target.value)
          }
        />
        <button type="submit" className="waves-effect btn teal right">
          Add
        </button>
      </form>

      <div className="card white darken-1">
        <div className="card-content">
          {!allItems ||
            (!allItems.length && (
              <div className="row">Please add few tasks...</div>
            ))}
          {allItems &&
            allItems?.map((todoItem: TodoItem) => {
              return (
                <div key={todoItem.id} className="row">
                  <p className="col s10">
                    <label>
                      <input
                        type="checkbox"
                        checked={todoItem.completed}
                        onChange={(event) =>
                          toggleTaskHandler(event, todoItem.id)
                        }
                        className="checkbox-blue"
                      />
                      <span
                        className={`${
                          todoItem.completed ? "strike-text" : "black-text"
                        } `}
                      >
                        {todoItem.title}
                      </span>
                    </label>
                  </p>
                  <i
                    onClick={() => deleteTaskHandler(todoItem.id)}
                    className="col s2 material-icons delete-button"
                  >
                    delete
                  </i>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default App;
