import React from "react"
import axios from "axios"
import './App.css';

function App() {
  const [itemText, setItemText] = React.useState("")
  const [listItems, setListItems] = React.useState([])
  const [isUpdating, setIsUpDating] = React.useState("")
  const [updatedItemText, setUpdatedItemText] = React.useState("")


  // add new todo item to database
  const addItem = async (e) => {
    e.preventDefault()
    try {
      const res = await axios.post("http://localhost:5000/api/item", {item: itemText})
      // doing this so only update data that i need to get
      setListItems(prev => [...prev, res.data])
      // clear text
      setItemText("")
    } catch(err) {
      console.log(err)
    }
  }

  // create function to fetch all todo's from database
  React.useEffect(() => {
    const getItemList = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/items")
        setListItems(res.data)
      } catch(err) {
        console.log(err)
      }
    }

    getItemList()
  }, [listItems])


  // Delete item
  const deleteItem = async (itemId) => {
    try {
      const res = await axios.delete(`http://localhost:5000/api/item/${itemId}`)
      const newListItems = listItems.filter((el) => el._id !== itemId)
      setListItems(newListItems)
    }catch(err) {
      console.log(err)
    }
  }


  // update item
  const updateItem = async (e) => {
    e.preventDefault()
    try {
      const res = await axios.put(`http://localhost:5000/api/item/${isUpdating}`, {item: updatedItemText})
      console.log(res.data)
      const updateItemIdIndex = listItems.findIndex(item => item._id === isUpdating)
      const updatedItem = listItems[updateItemIdIndex].item = updatedItemText
      setUpdatedItemText("")
      setIsUpDating("")
    } catch(err) {

    }
  }
  // before updating need to show input field where we will create our updated item
  const renderUpdateForm = () => (
    <form className="update-form" onSubmit={(e) => updateItem(e)}>
      <input className="update-new-input" type="text" placeholder="new item" onChange={e => { setUpdatedItemText(e.target.value) }} value={updatedItemText}/>
      <button className="update-new-btn" type="submit">update</button>
    </form>
  )


  return (
    <div className="App">
      <h1>Todo List</h1>
      <form onSubmit={e => addItem(e)}>
        <input type="text" placeholder="add todo item" onChange={e => setItemText(e.target.value)} value={itemText}/>
        <button type="submit">Add</button>
      </form>
      <div className="todo-listItems">
        {listItems.map((el) => {
          return (
            <div className="todo-item" key={el._id}>
              {
                isUpdating === el._id
                ? renderUpdateForm()
                : (
                <>
                  <p className="item-content">{el.item}</p>
                  <button className="update-item" onClick={() => setIsUpDating(el._id)}>update</button>
                  <button className="delete-item" onClick={() => deleteItem(el._id)}>Delete</button>
                </>
                )
              }
              
            </div>
          )
        })}
      </div>
    </div>
  );
}

export default App;
