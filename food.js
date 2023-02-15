let frm = document.getElementById('reg');
let dish = document.getElementById('dish');
let price = document.getElementById('price');
let list = document.getElementById('list');
let tbl = document.querySelectorAll('.lst');

frm.addEventListener('submit', showOnLocalStorage);

function showOnLocalStorage(e) {
    e.preventDefault();

    let dish = e.target.dish.value;
    let price = e.target.price.value;
    let list = e.target.list.value;

    let obj = { dish, price, list };
    // localStorage.setItem(obj.dish, JSON.stringify(obj));
    // showOnScreen(obj);

    axios
        .post('https://crudcrud.com/api/0d4949662a1c4779ab8017e046cf581f/orderData', obj)
        .then((res) => showOnScreen(res.data))
        .catch((err) => {
            document.body.innerHTML = document.body.innerHTML + '<h4>Something went wrong</h4>';
        })
}

function showOnScreen(user) {
    document.getElementById('dish').value = '';
    document.getElementById('price').value = '';
    document.getElementById('list').value = '';

    let parentele;  
    // console.log(parentele);

    let childele = `<li id='${user._id}'>${user.dish} - ${user.price} - ${user.list}
    <button style='padding 5px 5px' onclick=deletOrder('${user._id}') class='btn'>Delete Order</button>
    <button class='button-3' onclick=editOrder('${user._id}','${user.price}')>Edit Order</button>
    </li>`;

    // console.log(document.getElementById('Table 1').id);
    if (user.list == document.getElementById('Table 1').id) {
        parentele = document.getElementById('user1')
    }

    else if (user.list == document.getElementById('Table 2').id) {
        parentele = document.getElementById('user2');
    }

    else {
        parentele = document.getElementById('user3');

    }
    parentele.innerHTML = parentele.innerHTML + childele;
}

function editOrder(dish, price, list){
    document.getElementById('dish').value = dish;
    document.getElementById('price').value = price;
    document.getElementById('list').value = list;

    deletOrder(dish);
}

function deletOrder(userID) {
    // console.log(userID);
    // localStorage.removeItem(obj.dish);
    // removeUserFromScreen();
    axios
        .delete(`https://crudcrud.com/api/0d4949662a1c4779ab8017e046cf581f/orderData/${userID}`)
        .then((res) => removeUserFromScreen(userID))
        .catch((err) => console.error(err))
}

const parentele = document.getElementById('users')
parentele.innerHTML = parentele.innerHTML + childele;
function removeUserFromScreen(userID) {
    const childele = document.getElementById(userID);
    if (childele) {
        // parentele.removeChild(childele);
        childele.removeChild(parentele);
    }
}
