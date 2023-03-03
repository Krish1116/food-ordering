let frm = document.getElementById('reg');
let editingId = null;

frm.addEventListener('submit', saveToLocalStorage);

async function saveToLocalStorage(e) {
    e.preventDefault();

    try {
        let dish = e.target.dish.value;
        let price = e.target.price.value;
        let list = e.target.list.value;
        // let table = e.target.table.value;

        let obj = { dish, price, list, table };

        if (editingId == null) {
            const res = await axios.post(`https://crudcrud.com/api/eb86ff48644b4d6da5fd9d585769fce1/orderData`, obj);
            showUserDetailOnScreen(res.data);
        } else {
            const res = await updateOrder(editingId, dish, price, list, table);
            if (res._id === editingId) {
                // remove the existing order from the screen 
                removeUserFromScreen(editingId, res);
                // show the updated order on the screen
                obj._id = editingId;
                showUserDetailOnScreen(obj);
                // reset editingId to null
                editingId = null;
            }
        }
    } catch (err) {
        console.error((err));
        document.body.innerHTML = document.body.innerHTML + '<h4>Something went wrong</h4>'
    }
}


window.addEventListener('DOMContentLoaded', () => {
    async function getData() {
        try {
            let res = await axios.get(`https://crudcrud.com/api/eb86ff48644b4d6da5fd9d585769fce1/orderData`);
            for (let i = 0; i < res.data.length; i++) {
                showUserDetailOnScreen(res.data[i]);
            }
        } catch (err) {
            console.error(err);
        }
    }
    getData();
})

function showUserDetailOnScreen(user) {
    document.getElementById('dish').value = '';
    document.getElementById('price').value = '';
    document.getElementById('list').value = '';

    let parentNode;
    let childele = `<li id='${user._id}'>${user.dish} - ${user.price} - ${user.list}
        <button style='padding: 5px 5px' onclick=deleteOrder('${user._id}') class='btn'>Delete Order</button><button class='button-3' onclick="editOrder('${user._id}','${user.dish}','${user.price}','${user.list}', '${user.table}')">Edit Order</button>
        </li>`;


    if (user.list == 'Table 1') {
        parentNode = document.getElementById('user1')
    }

    else if (user.list == 'Table 2') {
        parentNode = document.getElementById('user2');
    }

    else {
        parentNode = document.getElementById('user3');

    }

    parentNode.innerHTML = parentNode.innerHTML + childele;
}

function editOrder(userID, dish, price, list, table) {
    document.getElementById('dish').value = dish;
    document.getElementById('price').value = price;
    document.getElementById('list').value = list;
    document.getElementById('list').selectedIndex = table - 1;

    editingId = userID;
}

async function updateOrder(id, dish, price, list, table) {
    try {
      const obj = { dish, price, list, table };
      const res = await axios.put(`https://crudcrud.com/api/eb86ff48644b4d6da5fd9d585769fce1/orderData/${id}`, obj);
      console.log(res.data);
      return res.data; // return the updated order details
    } catch (err) {
      console.error(err);
      throw new Error('Failed to update order');
    }
  }
   


async function deleteOrder(userID) {
    try {
        const res = await axios.get(`https://crudcrud.com/api/eb86ff48644b4d6da5fd9d585769fce1/orderData/${userID}`);
        const user = res.data;
        await axios.delete(`https://crudcrud.com/api/eb86ff48644b4d6da5fd9d585769fce1/orderData/${userID}`);
        removeUserFromScreen(userID, user);
    } catch (err) {
        console.error(err);
    }
}

async function removeUserFromScreen(userID, user) {
    try {
        let parentNode;
        if (user && user.list == 'Table 1') {
            parentNode = document.getElementById('user1')
        } else if (user && user.list == 'Table 2') {
            parentNode = document.getElementById('user2');
        } else if (user) {
            parentNode = document.getElementById('user3');
        }
        const childNodeTobeDeleted = document.getElementById(userID);
        if (childNodeTobeDeleted && parentNode && parentNode.contains(childNodeTobeDeleted)) {
            parentNode.removeChild(childNodeTobeDeleted);
        }
    } catch (err) {
        console.error(err);
    }
}

