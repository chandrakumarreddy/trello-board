import * as React from "react";

const AddCard = ({ columnId, addNewCard }) => {
  const [editing, setEditing] = React.useState(false);
  const textInput = React.useRef();
  const descriptionInput = React.useRef();
  const onSubmit = (event) => {
    event.preventDefault();
    const cardContent = textInput.current.value.trim();
    if (cardContent && addNewCard) {
      addNewCard(
        { title: cardContent, description: descriptionInput.current.value },
        columnId
      );
      setEditing(false);
    }
    textInput.current.value = "";
    descriptionInput.current.value = "";
  };
  if (!editing) {
    return (
      <div onClick={() => setEditing(true)}>
        <button className="waves-effect waves-light btn-small light-green darken-2 flex-vertical-center flex-horizantal-center w100">
          <img
            src="/img/plus.png"
            width="16"
            height="16"
            alt="add task"
            className="mr-2"
          />
          Add Task
        </button>
      </div>
    );
  }
  return (
    <div>
      <form
        className="task-card add-task-form text-right"
        onSubmit={(e) => onSubmit(e)}
      >
        <input type="text" autoFocus ref={textInput} aria-label="Add a task" />
        <textarea
          rows="5"
          ref={descriptionInput}
          aria-label="Add description"
        />
        <div>
          <button className="waves-effect waves-light btn confirm-btn add-update-button ">
            Add Task
          </button>
          <button
            className="waves-effect waves-light btn confirm-btn cancel-button red darken-1"
            onClick={() => setEditing(false)}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddCard;
