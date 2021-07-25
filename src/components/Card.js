/* eslint-disable react-hooks/exhaustive-deps */
import * as React from "react";

const Card = ({
  columnId,
  updateCardContent,
  card,
  deleteTask,
  setCardDimention,
  handleCardDragStart,
}) => {
  const [editing, setEditing] = React.useState("");
  const textInput = React.useRef();
  const descriptionInput = React.useRef();
  const onSubmit = (event) => {
    event.preventDefault();
    const title = textInput.current.value.trim();
    const description = descriptionInput.current.value.trim();
    if (title && updateCardContent) {
      updateCardContent({ title, description }, columnId, card.id);
      setEditing(false);
    }
    textInput.current.value = "";
  };

  const removeTask = () => {
    deleteTask(card.id, columnId);
  };

  const updateCardDimention = () => {
    let el = textInput.current,
      dim;
    if (el) {
      dim = el.getBoundingClientRect();
      setCardDimention(card.id, dim);
    }
  };

  React.useEffect(() => {
    updateCardDimention();
  }, [card.id]);

  if (editing) {
    return (
      <div>
        <form className="task-card add-task-form" onSubmit={onSubmit}>
          <input
            type="text"
            autoFocus
            ref={textInput}
            defaultValue={card.title}
          />
          <textarea
            rows="5"
            ref={descriptionInput}
            defaultValue={card.description}
          />
          <div>
            <button className="waves-effect waves-light btn confirm-btn add-update-button ">
              Update
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
  }
  return (
    <div>
      <div onClick={removeTask} className="bin">
        <img src="/img/bin.png" width="16" height="16" alt="delete" />
      </div>
      <div
        className="task-card z-depth-2 "
        onClick={(e) => {
          setEditing(true);
        }}
        ref={textInput}
        draggable="true"
        id={card.id}
        onDragStart={handleCardDragStart}
      >
        <h6 className="no-margin" id="title" ref={textInput}>
          {card.title}
        </h6>
        <p id="description" ref={descriptionInput}>
          {card.description}
        </p>
      </div>
    </div>
  );
};

export default Card;
