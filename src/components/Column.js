import React from "react";
import Card from "./Card";
import AddCard from "./AddCard";

const Column = ({
  deleteColumn,
  column,
  cards,
  id,
  updateCardContent,
  setCardDimention,
  handleCardDragStart,
  deleteTask,
  addNewCard,
}) => (
  <div>
    <ul className="list">
      <li>
        <div className="flex-vertical-center">
          <div className="column-header">
            <h5 className="name-header">{column}</h5>
          </div>
          <div className="column-header-del">
            <img
              src="/img/close.png"
              width="24"
              height="24"
              alt="close"
              onClick={deleteColumn}
            />
          </div>
        </div>
      </li>
      <li>
        <div className="partition"></div>
      </li>
      {cards.map((card, index) => (
        <li key={index}>
          <Card
            card={card}
            columnId={id}
            updateCardContent={updateCardContent}
            setCardDimention={setCardDimention}
            handleCardDragStart={handleCardDragStart}
            deleteTask={deleteTask}
          />
        </li>
      ))}
      <li className="add-list-wrapper">
        <AddCard columnId={id} addNewCard={addNewCard} />
      </li>
    </ul>
  </div>
);

export default Column;
