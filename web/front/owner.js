const addStoreModalBtn = document.getElementById("addStoreButton");
const modal = document.getElementById("modalWrapper");
const addStoreBtn = document.getElementById("submit Store Button");
const storeList = document.getElementById("storeListContainer");
const addMenuModalBtn = document.getElementById("addMenuButton");

const platformSelect = document.getElementById("platform");
const storeNameInput = document.getElementById("storeName");
const storeIDInput = document.getElementById("storeID");
const roadAddressInput = document.getElementById("roadAddress");
const postalCodeInput = document.getElementById("postalCode");
const detailAddressInput = document.getElementById("detailAdd");


const menuListSide = document.getElementById("menuListSide");
const menuModal = document.getElementById("menuModalWrapper");
const menuNameInput = document.getElementById("menuName");
const menuPriceInput = document.getElementById("menuPrice");
const menuAllergyButtons = document.querySelectorAll("#menuAllergySelector .AllergyTagButton");
const addMenuButton = document.getElementById("submit Menu Button");
const menuList = document.getElementById("menuListContainer");

const sideBar = document.getElementById("sideBar");
let storeListObjects = document.querySelectorAll("#storeListContainer .storeInformContainer");
let menuListObjects = document.querySelectorAll("#menuListContainer .menuInformContainer")

let storeCount=0;
let selectedStoreID = "";

let menuAllergySelected = [];

let userData = {
    id: "abcd",
    name:"USER",
};

let storeData = {


};

addStoreModalBtn.addEventListener("click", () => {
    modal.classList.add("active");
});

addMenuModalBtn.addEventListener("click", () => {
    menuModal.classList.add("active");
})

addStoreBtn.addEventListener("click", () => {
    const storeName = storeNameInput.value;
    const storeID = storeIDInput.value;
    const postalCode = postalCodeInput.value;
    const roadAddress = roadAddressInput.value;
    const detailAddress = detailAddressInput.value;
    const selectedPlatform = platformSelect.value;

    const newStore = document.createElement("div");
    const newID = selectedPlatform+storeID;

    storeData[newID] = {
        name: storeName,
        platform: selectedPlatform,
        store_road_address: roadAddress, 
        store_postal_code: postalCode,
        store_detail_address: detailAddress, 
        menus: {},
    };

    newStore.classList.add("storeInformContainer");
    newStore.id=newID;
    newStore.innerHTML = `
    <div  style="height:40%; flex-direction:row;">
        <div>
            <span style="font-size:20px; margin-bottom: 10px;">가게 이름: ${storeName}</span>
        </div>
        <div style="margin-bottom: 10px;">
            <span>가게 ID: ${storeID}</span>
        </div>
        <div>
            <span >도로명주소: ${roadAddress+detailAddress}</span>
        </div>
    </div>
    `;
    console.log("eventListener added");
    newStore.addEventListener("click", () => {loadMenus(newStore)})
    storeList.appendChild(newStore);
    storeListObjects = document.querySelectorAll("#storeListContainer .storeInformContainer");
    ++storeCount;

    storeNameInput.value="";
    storeIDInput.value="";
    postalCodeInput.value = "";
    roadAddressInput.value="";
    detailAddressInput.value = "";
    platformSelect.value="배달의 민족";

    console.log(storeData);

    modal.classList.remove("active");
});

function getMenuHtml(menuName, menuPrice, allergyList){
     let allergyStr = "";
    allergyList.forEach((allergys) =>{
        allergyStr += menuAllergyButtons[allergys].textContent + ", ";
    })

    allergyStr = allergyStr.slice(0, -2);
    allergyStr = "알러지 정보: " + allergyStr;

    const innerHTML = `
    <div  style="height:40%; flex-direction:row;">
        <div>
            <span style="font-size:20px; margin-bottom: 10px;">메뉴 이름: ${menuName}</span>
        </div>
        <div>
            <span>메뉴 가격: ${menuPrice}</span>
        </div>
        <div>
            <span style="font-size: 10px;">${allergyStr}</span>
        </div>
    </div>
    `;

    return innerHTML;
}

addMenuButton.addEventListener("click", () => {
    console.log(selectedStoreID);
    const menuName= menuNameInput.value;
    const menuPrice = menuPriceInput.value;
    
    if(!storeData[selectedStoreID].menus.hasOwnProperty(menuName)){
        
        storeData[selectedStoreID].menus[menuName] = 
        {
            name: menuName,
            price: menuPrice,
            allergies : [...menuAllergySelected],
            options : {},
        };

        
        menuNameInput.value = "";
        menuPriceInput.value = "";
        menuAllergyButtons.forEach((item) => {
            if(item.classList.contains("pressed")){
                item.classList.remove("pressed");
            }
        })
        
        let allergyStr = "";
        menuAllergySelected.forEach((allergys) =>{
            allergyStr += menuAllergyButtons[allergys].textContent + ", ";
        })

        allergyStr = allergyStr.slice(0, -2);
        allergyStr = "알러지 정보: " + allergyStr;

        const newMenu = document.createElement("div");
        newMenu.classList.add("menuInformContainer");
        newMenu.id=menuName;
        newMenu.innerHTML = `
        <div  style="height:40%; flex-direction:column;">
            <div>
                <span style="font-size:20px; margin-bottom: 10px;">${menuName}</span>
            </div>
            <div>
                <span>${menuPrice}</span>
            </div>
            <div>
                <span style="font-size: 10px;">${allergyStr}</span>
            </div>
        </div>
        `;
        const newBox = document.createElement("div");
        newBox.classList.add("menu-option");

        const newWrapper = document.createElement("div");
        newWrapper.classList.add("optionWrapper");

        const newButton = document.createElement("div");
        newButton.classList.add("optionAddButton")
        newButton.textContent = "+";

        newBox.appendChild(newMenu);
        newBox.appendChild(newWrapper);
        newBox.appendChild(newButton);
        menuList.appendChild(newBox);
        newButton.addEventListener("click", () => {optionAdder(newButton)})
        newMenu.addEventListener("click", () => {optionOn(newWrapper, newButton)});
        console.log(storeData);
        menuAllergySelected = [];
        
    }
    menuModal.classList.remove("active");
});

// 배경 눌러도 닫히게 하기
modal.addEventListener("click", (e) => {
    // 모달 박스 클릭은 제외
    if (!e.target.closest(".modalBox")) {
        modal.classList.remove("active");
    }
});

menuModal.addEventListener("click", (e) =>{
    if (!e.target.closest(".modalBox")) {
        menuModal.classList.remove("active");
    }
})

menuAllergyButtons.forEach((btn, index) => {
    btn.addEventListener("click", () =>{
        btn.classList.toggle("pressed");

        if(btn.classList.contains("pressed")){
            menuAllergySelected.push(index);
        } else{
            menuAllergySelected = menuAllergySelected.filter(i=>i!= index);
        }
    });
});

storeListObjects.forEach((store) =>{
    store.addEventListener("click", () => {
        loadMenus(store)
    })
})

function loadMenus(store){

    if(!menuListSide.classList.contains("active")) {
        menuListSide.classList.add("active");
    }

    while(menuList.firstChild){
        menuList.removeChild(menuList.firstChild);
    }
    if(selectedStoreID == store.id){
        menuListSide.classList.remove("active");
        selectedStoreID = "";
        return;
    }

    selectedStoreID = store.id;
    Object.keys(storeData[store.id].menus).forEach((key) => {
        const newBox = document.createElement("div");
        newBox.classList.add("menu-option");
        const data = storeData[store.id].menus[key];
        const newMenu = document.createElement("div");
        const newWrapper = document.createElement("div");
        newWrapper.classList.add("optionWrapper");
        Object.keys(data.options).forEach((key)=> {
            addOption(data.options[key].name, data.options[key].price, newWrapper);
        })

        const newButton = document.createElement("div");
        newButton.classList.add("optionAddButton")
        newButton.textContent = "+";

        console.log(storeData);
        newMenu.classList.add("menuInformContainer");
        newMenu.id=data.name;
        newMenu.innerHTML = getMenuHtml(data.name, data.price, data.allergies);
        newBox.appendChild(newMenu);
        newBox.appendChild(newWrapper);
        newBox.appendChild(newButton);
        newMenu.addEventListener("click", () => {optionOn(newWrapper, newButton)});
        newButton.addEventListener("click", () => {optionAdder(newButton)})
        menuList.appendChild(newBox);
        
    });
}


function optionOn(wrapper, button){
    console.log("clicked", wrapper, button);
    wrapper.classList.toggle("active");
    button.classList.toggle("active");
    
}


function optionAdder(button){
    console.log("clickedOption");
    const parent = button.parentElement;
    const menuID = parent.querySelector(".menuInformContainer").id;
    const wrapper = parent.querySelector(".optionWrapper");
    const temp = document.createElement("div");
    temp.classList.add("optionInformContainer");
    temp.innerHTML = `
    <div  style="height:40%; flex-direction:row;">
        <div class="input-group" style="flex-direction:column; height:20px; width:40px; margin-right:20px;">
                    <input type="text" id="optionName" placeholder="옵션 이름" required>
        </div>
        <div class="input-group" style="flex-direction:column; height:20px; width:40px;">
                    <input type="number" id="optionPrice" placeholder="옵션 가격" required>
        </div>
    </div>
    `;
    wrapper.appendChild(temp);

    
    
    function removeTemp(e){
        if (!temp.contains(e.target)) {
            let nameValue= temp.querySelector("#optionName").value;
            let priceValue= temp.querySelector("#optionPrice").value;
        if(nameValue != "" && priceValue != ""){
            console.log(storeData, selectedStoreID, menuID);
            console.log(storeData[selectedStoreID].menus[menuID]);
            storeData[selectedStoreID].menus[menuID].options[menuID+nameValue] = {name: nameValue, price:priceValue};
            addOption(nameValue, priceValue, wrapper);
        }
        
        temp.remove();           
        document.removeEventListener("click", removeTemp);
        }
    }
    setTimeout(()=>{
    document.addEventListener("click", removeTemp);
    },0);
}

function addOption(nameValue, priceValue, wrapper){
    const newOption = document.createElement("div");
    newOption.classList.add("optionInformContainer");

    newOption.innerHTML=`
    <div style="display:flex; height:40%; flex-direction:row; align-items:center;">
        <div>
            <span style="font-size:20px; margin-right: 20px;">옵션: ${nameValue}</span>
        </div>
        <div>
            <span>가격: ${priceValue}</span>
        </div>
    </div>`
    wrapper.appendChild(newOption);
}

function init(){
    const userName = document.createElement("h2");

    userName.textContent="이름: " + userData.name;

    userName.style.color="white";
    userName.style.textAlign="center";

    sideBar.appendChild(userName);
}

init();