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
const discardAllOrdersBtn = document.querySelector(".discardAllBtn");
// console.log(discardAllOrdersBtn);

function renderOrders() {
    let orderList = "";
    orders.forEach(item => {
        // 處理訂單日期格式
        const orderDate = new Date(item.createdAt * 1000)
            .toISOString()
            .slice(0, 10)
            .replaceAll("-", "/");
        // 訂單商品品項
        const products = item.products;
        let productList = "";
        products.forEach(product => {
            productList += `<p>${product.title}x${product.quantity}</p>`;
        });
        // 訂單狀態
        let orderStatus = (item.paid==true) ? "已處理" : "未處理";
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
                <a href="#" class="js-orderStatus" data-status="${item.paid}" data-id="${item.id}">${orderStatus}</a>
            </td>
            <td>
                <input type="button" class="delSingleOrder-Btn js-orderDelete" data-id="${item.id}" value="刪除">
            </td>
        </tr>`;
    });
    orderPageTableBody.innerHTML = orderList;
    renderC3();
}

orderPageTableBody.addEventListener("click", (e) => {
    e.preventDefault();
    const targetClass = e.target.getAttribute("class");
    console.log(targetClass);
    let id = e.target.getAttribute("data-id");
    if (targetClass == "delSingleOrder-Btn js-orderDelete") {
        deleteOrderItem(id);
        return;
    }

    if (targetClass == "js-orderStatus") {
        let status = e.target.getAttribute("data-status");
        changeOrderStatus(status, id);
        return;
    }
})

// 變更訂單狀態
function changeOrderStatus(status, id) {
    let newStatus = (status === true) ? false : true;
    console.log(status, id);
    axios.put(orderApiUrl, {
        data: {
            id,
            paid: newStatus,
        }
    }, config)
    .then(response => {
        console.log(response);
        getOrders();
    })
    .catch(error => {
        console.log(error.response.data.message);
    });
}

// 刪除特定訂單
function deleteOrderItem(id) {
    axios.delete(`${orderApiUrl}/${id}`, config)
    .then(response => {
        console.log(response);
        getOrders();
    })
    .catch(error => {
        console.log(error.response.data.message);
    });
}

// 刪除所有訂單
discardAllOrdersBtn.addEventListener("click", deleteAllOrders);
function deleteAllOrders(e) {
    e.preventDefault();
    axios.delete(orderApiUrl, config)
    .then(response => {
        alert("已刪除所有訂單");
        console.log(response);
        getOrders();
    })
    .catch(error => {
        console.log(error.response.data.message);
    });
}

// 取得訂單資料
function getOrders() {
    axios.get(orderApiUrl, config)
    .then(response => {
        orders = response.data.orders;
        console.log(orders);
        renderOrders();
        // renderC3();
        renderC3_lv2();
    })
    .catch(error => {
        console.log(error.response.data.message);
    })
}

// 渲染圖表
function renderC3() {
    console.log(orders);
    // 物件資料收集
    let total = {};
    orders.forEach(item => {
        item.products.forEach(product => {
            if (total[product.category] == undefined) {
                total[product.category] = product.price * product.quantity;
            }else {
                total[product.category] += product.price * product.quantity;
            }
        });
    });
    console.log(total);
    // 做出品項關聯
    let categoryAry = Object.keys(total);
    console.log(categoryAry);
    let newData = [];
    categoryAry.forEach(item => {
        let ary = [];
        ary.push(item);
        ary.push(total[item]);
        newData.push(ary);
    });
    console.log(newData);
    // C3.js
    let chart = c3.generate({
        bindto: '#chart', // HTML 元素綁定
        data: {
            type: "pie",
            columns: newData,
            colors:{
                "床架":"#DACBFF",
                "收納":"#9D7FEA",
                "窗簾": "#5434A7",
                "其他": "#301E5F",
            }
        },
    });
}

function renderC3_lv2() {
    // 資料蒐集
    let obj = {};
    orders.forEach(item => {
        item.products.forEach(product => {
            if (obj[product.title] == undefined) {
                obj[product.title] = product.price * product.quantity;
            } else {
                obj[product.title] += product.price * product.quantity;
            }
        });
    });
    // 資料轉換
    let titleAry = Object.keys(obj);
    // 透過 originAry，整理成 C3 格式
    let rankSortAry = [];
    titleAry.forEach(item => {
        let ary = [];
        ary.push(item);
        ary.push(obj[item]);
        rankSortAry.push(ary);
    });
    // 由大到小排序
    rankSortAry.sort((a, b) => {
        return b[1] - a[1];
    });
    // 如果筆數超過 4 筆，則把第四筆之後的資料歸類為「其他」
    if (rankSortAry.length > 3) {
        let otherTotal = 0;
        rankSortAry.forEach((item, index) => {
            if (index > 2) {
                otherTotal += rankSortAry[index][1];
            }
        });
    // 截取前三筆資料（注意：Array.prototype.slice 不會修改原陣列，需把結果指回變數）
    rankSortAry = rankSortAry.slice(0, 3);
    // 加入「其他」資料
    rankSortAry.push(["其他", otherTotal]);
    }
    console.log(rankSortAry);
    // C3.js
    c3.generate({
        bindto: '#chart_lv2', // HTML 元素綁定
        data: {
            type: "pie",
            columns: rankSortAry,
        },
        color:{
            pattern: ['#DACBFF', '#9D7FEA', '#5434A7', '#301E5F']
        }

    });
}

// 初始化
function init() {
    getOrders();
}

init();