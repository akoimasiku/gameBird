const amountPayEl = document.querySelector(".amount_pay");
const discountEl = document.querySelector(".filldiscount");
const totalPriceEl = document.querySelector(".totalprice");
const priceDetailsEl = document.querySelector(".pricedets");

const cartarr = JSON.parse(localStorage.getItem("BagListObj")) || [];

function parsePrice(priceStr) {
  const price = priceStr.match(/\d+/); // Extract numeric value using regex
  return price ? parseFloat(price[0]) : 0;
}

function updateCartSummary() {
  const itemCount = cartarr.length;
  const MRP = cartarr.reduce((sum, item) => sum + +item.strikedoffprice.split(" ")[1], 0);
  const amount = cartarr.reduce((sum, item) => sum + +item.price.split(" ")[1], 0);
  const discount = MRP - amount;

  localStorage.setItem("itemcount", itemCount);
  localStorage.setItem("MRP", MRP);
  localStorage.setItem("amount", amount);
  localStorage.setItem("discount", discount);
  
  amountPayEl.innerText = amount.toFixed(2);
  discountEl.innerText = `- ${discount.toFixed(2)}`;
  totalPriceEl.innerText = MRP.toFixed(2);
  priceDetailsEl.innerText = `PRICE DETAILS (${itemCount} Items)`;

}

function createCartItemElement(item, index) {
  const box = document.createElement("div");
  box.className = "main";

  const imgbox = document.createElement("div");
  const image = document.createElement("img");
  image.src = item.image_url;
  imgbox.append(image);

  const detailsbox = document.createElement("div");
  const name = document.createElement("p");
  name.innerText = item.brand;
  name.style.fontSize = "20px";
  name.style.marginBottom = "-8px";

  const para = document.createElement("p");
  para.innerText = item.para;
  para.style.color = "gray";

  const price = document.createElement("span");
  price.innerText = item.price;

  const strikedprice = document.createElement("span");
  strikedprice.innerText = item.strikedoffprice;
  strikedprice.style.textDecoration = "line-through";
  strikedprice.style.color = "gray";

  const offer = document.createElement("span");
  offer.innerText = item.offer;
  offer.style.color = "red";

  const pricepara = document.createElement("p");
  pricepara.append(price, strikedprice);

  detailsbox.append(name, para, pricepara, offer);

  const buttonbox = document.createElement("div");
  const remove = document.createElement("button");
  remove.innerText = "REMOVE";
  remove.addEventListener("click", () => removeItem(index));
  buttonbox.append(remove);

  box.append(imgbox, detailsbox, buttonbox);
  return box;
}

function renderCartItems() {
  document.querySelector(".container").innerHTML = ""; // Clear existing items
  cartarr.forEach((item, index) => {
    const cartItemElement = createCartItemElement(item, index);
    document.querySelector(".container").append(cartItemElement);
  });
}

function removeItem(index) {
  cartarr.splice(index, 1);
  localStorage.setItem("BagListObj", JSON.stringify(cartarr));
  updateCartSummary();
  renderCartItems();
}

function applyDiscount() {
  let amount = +localStorage.getItem("amount");
  let discount = +localStorage.getItem("discount");
  const promoCode = document.querySelector("#promo").value;

  if (amount > 300 && promoCode === "MYNTRA300") {
    amount -= 300;
    discount += 300;
    localStorage.setItem("amount", amount);
    localStorage.setItem("discount", discount);
    updateCartSummary();

    document.querySelector(".apply").removeEventListener("click", applyDiscount);
  }
}

updateCartSummary();
renderCartItems();

document.querySelector(".wishlistlink").addEventListener("click", () => {
  window.location.href = "wishlist.html";
});

document.querySelector(".makeorder").addEventListener("click", () => {
  window.location.href = "../Profile/signup.html";
});

document.querySelector(".apply").addEventListener("click", applyDiscount);

document.getElementById('landingPage').addEventListener('click', () => {
  window.location.href = "../Landingpage/index.html";
});

document.querySelector("#second").addEventListener("click", () => {
  window.location.href = "../Profile/signup.html";
});
