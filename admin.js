// 請代入自己的網址路徑
const baseUrl = "https://livejs-api.hexschool.io/api/livejs/v1/admin/";
const api_path = "ttgchang";
const uid = "0T7kWNAmaTZXRmTjmnIAYLCAMcv2";
const orderApiUrl = `${baseUrl}${api_path}/orders`;

let orders = [];
const config = {
    headers: {
        Authorization: uid,
    },
};

const orderPageTableBody = document.querySelector(".orderPage-table tbody");

function renderOrders() {
    let orderList = "";
    orders.forEach(item => {
        const orderDate = new Date(item.createdAt * 1000)
            .toISOString()
            .slice(0, 10)
            .replaceAll("-", "/");
        const products = item.products;
        let productList = "";
        products.forEach(product => {
            productList += `<p>${product.title}</p>`;
        });
        orderList += `<tr>
            <td>${item.id}</td>
            <td>
                <p>${item.user.name}</p>
                <p>${item.user.tel}</p>
            </td>
            <td>${item.user.address}</td>
            <td>${item.user.email}</td>
            <td>
                ${productList}
            </td>
            <td>${orderDate}</td>
            <td class="orderStatus">
                <a href="#">未處理</a>
            </td>
            <td>
                <input type="button" class="delSingleOrder-Btn" value="刪除">
            </td>
        </tr>`;
    });
    orderPageTableBody.innerHTML = orderList;
}

// 取得訂單資料
function getOrders() {
    axios.get(orderApiUrl, config)
    .then(response => {
        orders = response.data.orders;
        console.log(orders);
        renderOrders();
    })
    .catch(error => {
        console.log(error.response.data.message);
    })
}

getOrders();

// C3.js
let chart = c3.generate({
    bindto: '#chart', // HTML 元素綁定
    data: {
        type: "pie",
        columns: [
        ['Louvre 雙人床架', 1],
        ['Antony 雙人床架', 2],
        ['Anty 雙人床架', 3],
        ['其他', 4],
        ],
        colors:{
            "Louvre 雙人床架":"#DACBFF",
            "Antony 雙人床架":"#9D7FEA",
            "Anty 雙人床架": "#5434A7",
            "其他": "#301E5F",
        }
    },
});