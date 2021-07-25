import styled from "@emotion/styled";
import * as React from "react";
import Column from "./Column";
import Navbar from "./Navbar";

const Button = styled.button`
  position: absolute;
  right: 60px;
  top: 90px;
`;

const Main = () => {
  const [tasks, setTasks] = React.useState(() =>
    localStorage.getItem("tasks")
      ? JSON.parse(localStorage.getItem("tasks"))
      : []
  );
  const [columnEditing, setColumnEditing] = React.useState(() =>
    localStorage.getItem("columnEditing")
      ? JSON.parse(localStorage.getItem("columnEditing"))
      : false
  );
  React.useEffect(() => {
    localStorage.setItem("dimention", JSON.stringify([]));
  }, []);
  const textInput = React.useRef();
  const renderColumn = () => {
    return columnEditing ? (
      <div>
        <form className="task-card add-column-form" onSubmit={onSubmitListName}>
          <input
            type="text"
            autoFocus
            ref={textInput}
            aria-label="Add a List"
            placeholder="Type here"
          />
          <div className="text-right">
            <button className="waves-effect waves-light btn confirm-btn add-update-button ">
              Add List
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
    ) : (
      <div onClick={() => setEditing(true)}>
        <Button
          className="btn waves-effect waves-light"
          type="button"
          name="action"
        >
          ADD LIST
        </Button>
      </div>
    );
  };
  const getDimention = (cardId) => {
    const dimention = JSON.parse(localStorage.getItem("dimention"));
    let cardFound = false;
    for (var i = 0; i < dimention.length; i++) {
      if (dimention[i].id === cardId) {
        cardFound = true;
        break;
      }
    }
    if (cardFound) {
      return {
        dimentionArr: dimention,
        index: i,
      };
    }
  };
  const setCardDimention = (cardId, dim) => {
    let dimentionArr = JSON.parse(localStorage.getItem("dimention"));
    let dimObj = getDimention(cardId);
    if (dimObj) {
      dimentionArr = dimObj.dimentionArr;
      dimentionArr[dimObj.index].dimention = dim;
    } else {
      dimentionArr.push({
        id: cardId,
        dimention: dim,
      });
    }
    localStorage.setItem("dimention", JSON.stringify(dimentionArr));
  };
  const addNewCard = (content, columnId) => {
    const newCard = {
      ...content,
      columnId,
      id: new Date().valueOf(),
    };
    tasks[columnId].cards.push(newCard);
    localStorage.setItem("tasks", JSON.stringify(tasks));
    setTasks(JSON.parse(JSON.stringify(tasks)));
  };
  const updateCardContent = (content, columnId, cardId) => {
    tasks[columnId].cards.forEach((card) => {
      if (card.id === cardId) {
        card.title = content.title;
        card.description = content.description;
      }
    });
    localStorage.setItem("tasks", JSON.stringify(tasks));
    setTasks(tasks);
  };
  const handleCardDragStart = (e, columnId) => {
    console.log(columnId);
    const dimObj = getDimention(Number(e.currentTarget.id));
    const diff = e.pageY - dimObj.dimentionArr[dimObj.index].dimention.top;
    const dragInfo = {
      cardId: e.currentTarget.id,
      fromColumn: columnId,
      dragStartPageY: e.pageY,
      diff,
    };
    localStorage.setItem("dragInfo", JSON.stringify(dragInfo));
  };
  const arraymove = (arr, fromIndex, toIndex) => {
    const element = arr[fromIndex];
    arr.splice(fromIndex, 1);
    arr.splice(toIndex, 0, element);
  };
  const handleDrop = (e, columnId) => {
    const dragInfo = JSON.parse(localStorage.getItem("dragInfo"));
    const cardY = dragInfo.yVal;
    const tasks = JSON.parse(localStorage.getItem("tasks"));
    const cardsArray = tasks[dragInfo.fromColumn].cards;
    const card = cardsArray.find((card) => card.id === Number(dragInfo.cardId));
    const indexOfCard = cardsArray.findIndex(
      (card) => card.id === Number(dragInfo.cardId)
    );
    let dimObj,
      bottom,
      positionIndex = tasks[columnId].cards.length;
    for (let i = 0; i < tasks[columnId].cards.length; i++) {
      dimObj = getDimention(Number(tasks[columnId].cards[i].id));
      bottom = dimObj.dimentionArr[dimObj.index].dimention.bottom;
      if (bottom > cardY) {
        positionIndex = i;
        break;
      }
    }
    if (columnId === Number(dragInfo.fromColumn)) {
      if (positionIndex !== indexOfCard && positionIndex !== indexOfCard + 1) {
        arraymove(
          tasks[dragInfo.fromColumn].cards,
          indexOfCard,
          indexOfCard - positionIndex < 0 ? positionIndex - 1 : positionIndex
        );
      }
    } else {
      tasks[dragInfo.fromColumn].cards.splice(indexOfCard, 1);
      tasks[columnId].cards.splice(positionIndex, 0, {
        ...card,
        columnId: Number(columnId),
      });
    }
    setTasks(tasks);
    localStorage.setItem("tasks", JSON.stringify(tasks));
    localStorage.removeItem("dragInfo");
  };
  const handleDragOver = (e) => {
    e.preventDefault();
    const dragInfo = JSON.parse(localStorage.getItem("dragInfo"));
    dragInfo.yVal = e.pageY - dragInfo.diff;
    localStorage.setItem("dragInfo", JSON.stringify(dragInfo));
  };
  const deleteTask = (cardId, columnId) => {
    const tasks = JSON.parse(localStorage.getItem("tasks"));
    const newCardArr = tasks[columnId].cards.filter((card) => {
      return card.id !== cardId;
    });
    tasks[columnId].cards = newCardArr;
    setTasks(tasks);
    localStorage.setItem("tasks", JSON.stringify(tasks));
  };
  const deleteColumn = (columnId) => {
    const tasks = JSON.parse(localStorage.getItem("tasks"));
    delete tasks[columnId];
    const newTasks = tasks.filter((_, index) => columnId !== index);
    setTasks(newTasks);
    localStorage.setItem("tasks", JSON.stringify(newTasks));
  };
  const setEditing = (columnEditing) => {
    setColumnEditing(columnEditing);
    localStorage.setItem("columnEditing", JSON.stringify(columnEditing));
  };
  const onSubmitListName = (event) => {
    event.preventDefault();
    const content = textInput.current.value.trim();
    if (content) {
      const newTasks = tasks.concat({
        column: content,
        id: tasks.length,
        cards: [],
      });
      setTasks(newTasks);
      setColumnEditing(false);
      localStorage.setItem("tasks", JSON.stringify(newTasks || []));
      localStorage.setItem("columnEditing", JSON.stringify(false));
      textInput.current.value = "";
    }
  };
  return (
    <div>
      <Navbar />
      <div onDragOver={handleDragOver}>
        <div className="wrapper-cont">
          <ul className="task-column">
            {tasks.map(
              (task) =>
                task && (
                  <div
                    className="transparent-wrapper"
                    key={task.id}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, task.id)}
                  >
                    <li className="column-wrapper z-depth-3">
                      <Column
                        {...task}
                        setCardDimention={setCardDimention}
                        updateCardContent={updateCardContent}
                        handleCardDragStart={(e) =>
                          handleCardDragStart(e, task.id)
                        }
                        addNewCard={addNewCard}
                        deleteTask={deleteTask}
                        deleteColumn={() => deleteColumn(task.id)}
                      />
                    </li>
                  </div>
                )
            )}
            <li className="column-wrapper add-column">{renderColumn()}</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
export default Main;
