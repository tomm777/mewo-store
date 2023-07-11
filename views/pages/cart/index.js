let savedCartData = JSON.parse(localStorage.getItem('meowStoreCart')) || [];
const cartList = document.querySelector('.cart_list');
let priceSum = 0;
const priceSumElement = document.querySelector('#price_sum');

// savedCartData의 상품목록을 장바구니 페이지에 그려주는 반복문
for (let i = 0; i < savedCartData.length; ++i) {
  let data = savedCartData[i];
  const content = `
    <div class="product_wrap" product_id="${data._id}">
      <div class="thumbnail_wrap">
        <img src="${data.repImgUrl}" class="product_thumbnail" alt="thumbnail"/>
      </div>
      <div class="product_info">
        <span>${data.name}</span>
        <span class="qty_wrap">
          <button class="qty_down" onclick="qtyDown(event)">-</button>
          <span class="product_qty" name="product_qty" >${data.qty}</span>
          <button class="qty_up" onclick="qtyUp(event)">+</button>
        </span>
        <span class="product_price">${data.price.toLocaleString()}</span>
        <button class="delete_each" onclick="deleteEach(event)">삭제</button>
      </div>
    </div>
  `;

  const newLi = document.createElement('li');
  newLi.innerHTML = content;
  cartList.appendChild(newLi);
  priceSum += data.price * data.qty;
}
priceSumElement.innerText = `${priceSum.toLocaleString()} 원`;

const qtyUpBtns = document.querySelectorAll('.qty_up');
const qtyDownBtns = document.querySelectorAll('.qty_down');
const qtyElements = document.querySelectorAll('.product_qty');
const deleteEachBtns = document.querySelectorAll('.delete_each');
const deleteAllBtn = document.querySelector('.delete_all');

function qtyUp(event) {
  const qtyElement = event.target.closest('span').querySelector('[name=product_qty]');
  const id = event.target.closest('.product_wrap').getAttribute('product_id');

  if (qtyElement.innerText === '9') {
    alert('최대 구매 수량은 9개입니다.');
  } else {
    qtyElement.innerText = Number(qtyElement.innerText) + 1;
    savedCartData = savedCartData.map((o) => {
      if (o._id === id) {
        o.qty += 1;
        priceSum += o.price;
        priceSumElement.innerText = `${priceSum.toLocaleString()} 원`;
      }
      return o;
    });
    localStorage.setItem('meowStoreCart', JSON.stringify(savedCartData));
  }
}

function qtyDown(event) {
  const qtyElement = event.target.closest('span').querySelector('[name=product_qty]');
  const id = event.target.closest('.product_wrap').getAttribute('product_id');

  if (Number(qtyElement.innerText) > 1) {
    qtyElement.innerText = Number(qtyElement.innerText) - 1;
    savedCartData = savedCartData.map((o) => {
      if (o._id === id) {
        o.qty -= 1;
        priceSum -= o.price;
        priceSumElement.innerText = `${priceSum.toLocaleString()} 원`;
      }
      return o;
    });
    localStorage.setItem('meowStoreCart', JSON.stringify(savedCartData));
  }
}

function deleteEach(event) {
  const id = event.target.closest('.product_wrap').getAttribute('product_id');
  const li = event.target.closest('.product_wrap').parentElement;
  li.remove();

  const price = event.target.closest('.product_wrap').querySelector('.product_price');
  const qty = event.target.closest('.product_wrap').querySelector('.product_qty');
  priceSum -= Number(price.innerText) * Number(qty.innerText);
  priceSumElement.innerText = `${priceSum.toLocaleString()} 원`;

  savedCartData = savedCartData.filter((o) => o._id !== id);
  localStorage.setItem('meowStoreCart', JSON.stringify(savedCartData));
}

function deleteAll() {
  const userConfirm = confirm('장바구니를 비우시겠습니까?');
  if (userConfirm) {
    localStorage.removeItem('meowStoreCart');
    cartList.innerHTML = '';
    priceSumElement.innerText = '0 원';
  }
}
deleteAllBtn.addEventListener('click', deleteAll);