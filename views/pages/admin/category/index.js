// 자식요소에 데이터를 넣기위한 부모 요소 가져오기
const nested = document.querySelector('.nested-li');

// 카테고리 tree 구현을 위해 상위 엘리먼트를 가져온다
const toggler = document.getElementsByClassName('caret');
// 카테고리 추가 버튼 엘리먼트
const addButton = document.querySelector('.addCategory');
// 카테고리 삭제 버튼 엘리멘트
const deleteButton = document.querySelector('.deleteCategory');
// 카테고리 수정 버튼 엘리먼트
const updateButton = document.querySelector('.updateCategory');
// 수정 후 저장버튼
const saveButton = document.querySelector('.button.saveCategory');

// 카테고리 API 호출
const getCateList = () => {
  fetch('/api/admin/subcategory')
    .then((response) => response.json())
    .then((data) => data.data)
    .then((result) => {
      // getAttribute("categoryId")
      result.map((item) => {
        nested.insertAdjacentHTML(
          'beforeend',
          `<div>
    <span class="caret" id=${item._id}>${item.categoryName}</span>
    <ul class="nested">
    ${item.data
      .map(
        (items) =>
          `<li class="lowCateLi" id=${items._id}>${items.subCategoryName}</li>`,
      )
      .join('')}
    </ul>
    </div>`,
        );
        nodeSet();
      });
    })
    .catch((error) => {
      // 에러 처리하는 코드 작성
      console.log('Error:', error);
    });
};
getCateList();

function arrowClick() {
  // 토글 클래스 추가
  this.parentElement.querySelector('.nested').classList.toggle('active');
  this.classList.toggle('caret-down');
  // 하위, 상위 카테고리가 활성화 된 상태에서 전체를 누르면
  // 선택 해제
  const caretCheck = document.querySelectorAll('.caret-down');
  const caret_down = document.querySelector('.top');
  const nested_active = document.querySelectorAll('.nested .active');
  // 전체를 눌렀을 때 상위 카테고리 선택해제
  if (caret_down.className !== 'caret top caret-down') {
    caretCheck.forEach((item) => {
      item.classList.remove('caret-down');
    });
    nested_active.forEach((item) => {
      item.classList.remove('active');
    });
  }
  // 상위 카테고리를 한번 더 눌렀을 때 하위 카테고리 선택해제
  if (this.className === 'caret') {
    const lowCate = this.parentElement.querySelectorAll('.lowCateLi');
    lowCate.forEach((item) => {
      item.classList.remove('active');
    });
  }
}
// 선택한 하위카테고리에 active 클래스 추가
function addToggle() {
  this.classList.toggle('active');
}
// 하위 카테고리를 클릭 했을 때 이벤트
function lowCateClick() {
  const lowCateItem = document.querySelectorAll('.lowCateLi');
  lowCateItem.forEach((item) => {
    item.addEventListener('click', addToggle);
  });
}
// click 이벤트로 active, caret-down 클래스를 부여해 tree 구조로 보이도록 구현
const nodeSet = () => {
  Array.from(toggler).forEach((data) => {
    data.addEventListener('click', arrowClick);
  });
  lowCateClick();
};

// 카테고리 가져오기 실행

// 카테고리 추가 클릭 이벤트
addButton.addEventListener('click', function () {
  // 카테고리 이름 입력값
  // let inputValue = document.getElementById('cate-input').value;
  const inputValue = document.getElementById('cate-input');

  // 선택된 카테고리 하위에 값을 넣기 위해 선택한 요소
  const caretDown = document.querySelector('.nested .active');

  // 선택된 카테고리의 개수
  const caretCheck = document.querySelectorAll('.caret-down');

  // input 값이 없을 때
  if (!inputValue.value) {
    alert('카테고리 이름을 입력하세요');
    return;
  }
  //카테고리를 선택 안했을 때
  if (caretCheck.length < 1) {
    alert('추가 할 카테고리를 선택해주세요');
    return;
  }

  // 전체 카테고리만 선택 했을 때 상위 카테고리를 만들기 위해 구분
  if (caretCheck.length === 1) {
    // 상위 카테고리 추가 API
    fetch('/api/admin/category', {
      method: 'POST', // 요청 방식 설정 (POST)
      headers: {
        'Content-Type': 'application/json', // 요청 헤더 설정
      },
      body: JSON.stringify({
        categoryName: inputValue.value,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        const result = data.data;
        console.log(data);
        nested.insertAdjacentHTML(
          'beforeend',
          `<div>
          <span class="caret" id=${result._id}>${inputValue.value}</span>
          <ul class="nested">
          </ul>
          </div>`,
        );
        // window.location.reload(true);
        nodeSet();
        inputValue.value = '';
      })
      .catch((error) => {
        // 에러 처리하는 코드 작성
        console.log('Error:', error);
      });

    return;
  }

  // 상위 카테고리가 하나 이상일 때
  if (caretCheck.length >= 3) {
    alert('추가 할 하나의 카테고리만 선택해주세요.');
    return;
  }
  const categoryName = caretCheck[caretCheck.length - 1];
  // console.log(categoryName.id, categoryName.textContent);
  // 하위 카테고리 추가 API
  fetch('/api/admin/subcategory', {
    method: 'POST', // 요청 방식 설정 (POST)
    headers: {
      'Content-Type': 'application/json', // 요청 헤더 설정
    },
    body: JSON.stringify({
      categoryId: categoryName.id,
      subCategoryName: inputValue.value,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      const result = data.data;
      // console.log(data._id);
      // 하위 카테고리 추가
      if (!data.success) {
        alert('중복된 카테고리입니다');
        return;
      }
      caretDown.insertAdjacentHTML(
        'beforeend',
        `<li class="lowCateLi" id=${result._id}>${inputValue.value}</li>`,
      );
      lowCateClick();
      nodeSet();
      inputValue.value = '';
    })
    .catch((error) => {
      // 에러 처리하는 코드 작성
      console.log('Error:', error);
    });
});
// 카테고리 삭제 메서드
const deleteCate = () => {
  const cateArray = document.querySelectorAll('.lowCateLi.active');
  const caretCheck = document.querySelectorAll('.caret-down');
  // 아무것도 선택되지 않을 때
  if (caretCheck.length === 0) {
    alert('삭제 할 카테고리를 선택하세요');
    return;
  }
  const lowCateItem = document.querySelectorAll('.lowCateLi');
  // 하위 카테고리를 선택하지 않고 상위카테고리를 선택 했을때를 구분하기 위함
  const nullArrayCheck = Array.from(lowCateItem).filter((item) => {
    return item.className === 'lowCateLi active';
  });
  // 전체 카테고리만 선택했을 때
  if (caretCheck.length === 1) {
    alert('전체 카테고리를 삭제 할 수 없습니다');
    return;
  }
  // 상위 카테고리가 여러개 일 때
  if (caretCheck.length >= 3) {
    alert('삭제 할 하나의 카테고리만 선택해주세요.');
    return;
  }
  // 하위 카테고리가 선택되지않고 상위 카테고리를 선택 했을 때
  if (nullArrayCheck.length === 0) {
    if (confirm('정말 상위카테고리를 삭제하시겠습니까?')) {
      console.log(caretCheck[caretCheck.length - 1].id);
      fetch(`/api/admin/category/${caretCheck[caretCheck.length - 1].id}`, {
        method: 'DELETE',
      }).then();
      caretCheck[caretCheck.length - 1].parentElement.remove();
      nodeSet();
      return;
    }
  }
  if (nullArrayCheck.length >= 2) {
    alert('삭제 할 하나의 카테고리만 선택해주세요');
    return;
  }

  fetch(`/api/admin/subcategory/${cateArray[0].id}`, {
    method: 'DELETE',
  }).then();
  cateArray.forEach((item) => {
    item.remove();
  });
  nodeSet();
};
// 카테고리 수정 메서드
const updateCate = () => {
  const cateArray = document.querySelectorAll('.lowCateLi.active');
  const caretCheck = document.querySelectorAll('.caret-down');
  const saveButton = document.querySelector('.button.saveCategory');
  const inputValue = document.getElementById('cate-input');
  // 하위 카테고리를 선택하지 않고 상위카테고리를 선택 했을때를 구분하기 위함
  const lowCateItem = document.querySelectorAll('.lowCateLi');
  const nullArrayCheck = Array.from(lowCateItem).filter((item) => {
    return item.className === 'lowCateLi active';
  });
  // 아무것도 선택되지 않을 때
  if (caretCheck.length <= 1) {
    alert('수정 할 카테고리를 선택하세요');
    return;
  }
  // 상위 카테고리가 여러개 일 때
  if (caretCheck.length >= 3) {
    alert('수정 할 하나의 카테고리만 선택해주세요.');
    return;
  }

  // 하위 카테고리가 선택되지않고 상위 카테고리를 선택 했을 때
  if (nullArrayCheck.length === 0) {
    // 수정하는 동안 다른 버튼 비활성화
    updateButton.disabled = true;
    addButton.disabled = true;
    deleteButton.disabled = true;
    inputValue.disabled = true;

    // span을 input으로 변환
    const spanEle = caretCheck[caretCheck.length - 1];
    const spanValue = spanEle.textContent;
    // console.log(spanEle.id);
    let input = document.createElement('input');
    input.type = 'text';
    input.value = spanValue;
    input.classList.add('updateInput');
    if (spanEle.parentNode) {
      spanEle.parentNode.replaceChild(input, spanEle);
    }
    saveButton.classList.add('active');
    // 저장 수정 API가 들어갈 곳
    saveButton.addEventListener('click', function () {
      console.log(spanEle.id);
      console.log(input.value);
      // 상위 카테고리 수정 API
      fetch(`/api/admin/category/${spanEle.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json', // 요청 헤더 설정
        },
        body: JSON.stringify({
          categoryName: input.value,
        }),
      })
        .then((response) => response.json())
        .then((result) => {
          console.log(result);
          if (!result.success) {
            alert(result.message);
            return;
          }
          addButton.disabled = false;
          deleteButton.disabled = false;
          updateButton.disabled = false;
          inputValue.disabled = false;
          // 원래대로 변환
          let span = document.createElement('span');
          span.className = spanEle.className;
          span.textContent = input.value;
          if (input.parentNode) {
            input.parentNode.replaceChild(span, input);
          }
          saveButton.classList.remove('active');
          nodeSet();
        });
      // 비활성화 해제
    });
    return;
  }
  if (cateArray.length >= 2) {
    alert('수정 할 하나의 하위 카테고리를 선택하세요.');
    return;
  }
  updateButton.disabled = true;
  addButton.disabled = true;
  deleteButton.disabled = true;
  inputValue.disabled = true;
  const liEle = document.querySelector('.lowCateLi.active');
  const liValue = liEle.textContent;
  let input = document.createElement('input');
  input.type = 'text';
  input.value = liValue;
  if (liEle.parentNode) {
    liEle.parentNode.replaceChild(input, liEle);
  }
  // liEle.parentNode.replaceChild(input, liEle);
  saveButton.classList.add('active');

  saveButton.addEventListener('click', function () {
    // 상위 카테고리 수정 API
    console.log(liEle.id);
    console.log(input.value);
    fetch(`/api/admin/subcategory/${liEle.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json', // 요청 헤더 설정
      },
      body: JSON.stringify({
        subCategoryName: input.value,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (!data.success) {
          alert(data.message);
          return;
        }
        addButton.disabled = false;
        deleteButton.disabled = false;
        updateButton.disabled = false;
        liEle.classList.remove('active');
        let li = document.createElement('li');
        li.className = liEle.className;
        li.textContent = input.value;
        if (input.parentNode) {
          input.parentNode.replaceChild(li, input);
        }
        saveButton.classList.remove('active');
        liEle.classList.remove('active');
        nodeSet();
      });
  });
};

// 카테고리 삭제 이벤트
deleteButton.addEventListener('click', deleteCate);
// 카테고리 수정 이벤트
updateButton.addEventListener('click', updateCate);
