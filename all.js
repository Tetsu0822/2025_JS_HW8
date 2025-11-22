// 請代入自己的網址路徑
const baseUrl = "https://livejs-api.hexschool.io/api/livejs/v1/customer/";
const api_path = "ttgchang";
const token = "0T7kWNAmaTZXRmTjmnIAYLCAMcv2";
const productsApiUrl = `${baseUrl}${api_path}/products`;
const cartApiUrl = `${baseUrl}${api_path}/carts`;
// 宣告
const productWrap = document.querySelector(".productWrap");
const productSelect = document.querySelector(".productSelect");
const shoppingCartTable = document.querySelector(".shoppingCart-table tbody");
const shoppingCartTotal = document.querySelector(".total");
const discardAllBtn = document.querySelector(".discardAllBtn");
// console.log(shoppingCartTable);
let productData = [];
let carts = [];
let finalTotal = 0;
// 取得產品列表
function getProductList() {
  axios
    .get(productsApiUrl)
    .then(function (response) {
      productData = response.data.products;
      renderProducts(productData);
      getCategories();
    })
    .catch(function (error) {
      console.log(error.response.data.message || "無法取得產品列表");
    });
}

// 渲染產品列表
function renderProducts(product) {
  let str = "";
  product.forEach((item) => {
    str += `<li class="productCard">
            <h4 class="productType">新品</h4>
            <img
            src="${item.images}"
            alt="${item.title}"
            />
            <a href="#" class="addCardBtn" data-id="${item.id}">加入購物車</a>
            <h3>${item.title}</h3>
            <del class="originPrice">NT$${item.origin_price}</del>
            <p class="nowPrice">NT$${item.price}</p>
        </li>`;
  });
  productWrap.innerHTML = str;
}

// 加入購物車
productWrap.addEventListener("click", function(e) {
    e.preventDefault();
    const id = e.target.dataset.id;
    let addCartClass = e.target.getAttribute("class");
    if (addCartClass !== "addCardBtn") {
        return;
    } else {
        addCartItem(id);
    }
});

function addCartItem(id) {
    const data = {
        data: {
            productId: id,
            quantity: 1
        }
    };
    axios
        .post(cartApiUrl, data)
        .then(function (response) {
            carts = response.data.carts;
            finalTotal = response.data.finalTotal;
            renderCarts();
        })
        .catch(function (error) {
            console.log(error.response.data.message || "無法加入購物車");
        });
}

// 篩選分類選單
function getCategories() {
  // 篩選前
  let unSort = productData.map((item) => {
    return item.category;
  });
  //篩選後
  let sorted = unSort.filter((item, i) => {
    return unSort.indexOf(item) === i;
  });
  // 炫覽選單
  renderCategories(sorted);
}

// 渲染分類選單
function renderCategories(sorted) {
  let str = `<option value="全部" selected>全部</option>`;
  sorted.forEach((item) => {
    str += `<option value="${item}">${item}</option>`;
  });
  productSelect.innerHTML = str;
}

// 商品篩選功能
productSelect.addEventListener("change", selectFilter);
function selectFilter(e) {
  let category = e.target.value;
  if (category === "全部") {
    renderProducts(productData);
    return;
  } else {
    let targetProducts = [];
    productData.forEach((item) => {
      if (item.category === category) {
        targetProducts.push(item);
      }
    });
    renderProducts(targetProducts);
  }
}

// 取得購物車列表
function getCarts() {
  axios
    .get(cartApiUrl)
    .then(function (response) {
        carts = response.data.carts;
        finalTotal = response.data.finalTotal;
        renderCarts();
    })
    .catch(function (error) {
      console.log(error.response.data.message || "無法取得購物車列表");
    });
}

// 刪除購物車內特定產品
function deleteCartItem(cartId) {
  axios
    .delete(`${baseUrl}${api_path}/carts/${cartId}`)
    .then(function (response) {
        carts = response.data.carts;
        finalTotal = response.data.finalTotal;
        renderCarts();
    })
    .catch(function (error) {
      console.log(error.response.data.message || "無法刪除購物車產品");
    });
}

shoppingCartTable.addEventListener("click" , function(e) {
    e.preventDefault();
    const cartId = e.target.dataset.id;
    let discardClass = e.target.getAttribute("class");
    if (discardClass !== "material-icons") {
        return;
    } else {
        deleteCartItem(cartId);
    }
});

// 刪除所有品項
discardAllBtn.addEventListener("click", delAllCartItem);
function delAllCartItem(e) {
    e.preventDefault();
    axios
        .delete(cartApiUrl)
        .then((response) => {
            carts = response.data.carts;
            finalTotal = response.data.finalTotal;
            renderCarts();
        })
        .catch( (error) => {
            console.log(error.response.data.message || "無法刪除購物車產品");
        });
}

// 渲染購物車列表
function renderCarts() {
    let cartList = "";
    carts.forEach((item) => {
        cartList += `<tr>
            <td>
            <div class="cardItem-title">
                <img src="${item.product.images}" alt="" />
                <p>${item.product.title}</p>
            </div>
            </td>
            <td>NT$${item.product.price}</td>
            <td>${item.quantity}</td>
            <td>NT$${item.product.price * item.quantity}</td>
            <td class="discardBtn">
            <a href="#" class="material-icons" data-id="${item.id}"> clear </a>
            </td>
        </tr>`;
    });
    shoppingCartTable.innerHTML = cartList;
    shoppingCartTotal.textContent = `NT$ ${finalTotal}`;
}


function init() {
  getProductList();
  getCarts();
}

// 預設載入
init();
