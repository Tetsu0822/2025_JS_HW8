// 請代入自己的網址路徑
const baseUrl = "https://livejs-api.hexschool.io/api/livejs/v1/customer/";
const api_path = "ttgchang";
const token = "0T7kWNAmaTZXRmTjmnIAYLCAMcv2";
const productsApiUrl = `${baseUrl}${api_path}/products`;

// 宣告
const productWrap = document.querySelector(".productWrap");
const productSelect = document.querySelector(".productSelect");
// console.log(productSelect);
let productData = [];

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
            <a href="#" class="addCardBtn">加入購物車</a>
            <h3>${item.title}</h3>
            <del class="originPrice">NT$${item.origin_price}</del>
            <p class="nowPrice">NT$${item.price}</p>
        </li>`;
    });
    productWrap.innerHTML = str;
}

// 篩選分類選單
function getCategories() {
    // 篩選前
    let unSort = productData.map((item) => { return item.category; });
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
productSelect.addEventListener('change', selectFilter);
function selectFilter(e) {
    let category = e.target.value;
    if(category === "全部"){
        renderProducts(productData);
        return;
    }
    let targetProducts = [];
    productData.forEach((item) => {
        if (item.category === category) {
            targetProducts.push(item);
        }
    });
    renderProducts(targetProducts);
}

function init() {
    getProductList();
}

// 預設載入
init();
