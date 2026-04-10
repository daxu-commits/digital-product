// Sample Products
const products = [
  {id:1, title:"JavaScript eBook", price:10, image:"https://via.placeholder.com/150", description:"Learn JS basics."},
  {id:2, title:"CSS Mastery PDF", price:15, image:"https://via.placeholder.com/150", description:"Advanced CSS guide."},
  {id:3, title:"HTML Course", price:20, image:"https://via.placeholder.com/150", description:"Complete HTML course."}
];

let cart = JSON.parse(localStorage.getItem("cart")) || [];
let users = JSON.parse(localStorage.getItem("users")) || [];
let currentUser = JSON.parse(localStorage.getItem("currentUser")) || null;

// Page Navigation
function showPage(pageId){
  document.querySelectorAll(".page").forEach(p=>p.classList.add("hidden"));
  document.getElementById(pageId).classList.remove("hidden");
  if(pageId==="shop") renderProducts();
  if(pageId==="cart") renderCart();
  if(pageId==="dashboard") renderDashboard();
}

// Render Products
function renderProducts(){
  const grid = document.getElementById("productGrid");
  grid.innerHTML="";
  products.forEach(p=>{
    const card = document.createElement("div");
    card.className="product-card";
    card.innerHTML=`
      <img src="${p.image}" alt="${p.title}">
      <h3>${p.title}</h3>
      <p>$${p.price}</p>
      <button onclick="addToCart(${p.id})">Add to Cart</button>
    `;
    grid.appendChild(card);
  });
}

// Featured Products
document.getElementById("featuredProducts").innerHTML = products.map(p=>`
  <div class="product-card">
    <img src="${p.image}" alt="${p.title}">
    <h3>${p.title}</h3>
    <p>$${p.price}</p>
    <button onclick="addToCart(${p.id})">Add to Cart</button>
  </div>
`).join("");

// Cart
function addToCart(id){
  const product = products.find(p=>p.id===id);
  cart.push(product);
  localStorage.setItem("cart", JSON.stringify(cart));
  alert("Added to cart!");
}

function renderCart(){
  const cartDiv = document.getElementById("cartItems");
  cartDiv.innerHTML = cart.map(p=>`
    <div>${p.title} - $${p.price}</div>
  `).join("");
}

function checkout(){
  if(!currentUser){ alert("Login required!"); return; }
  currentUser.purchases = currentUser.purchases || [];
  cart.forEach(p=>currentUser.purchases.push(p));
  localStorage.setItem("currentUser", JSON.stringify(currentUser));
  cart=[];
  localStorage.setItem("cart", JSON.stringify(cart));
  alert("Purchase successful!");
}

// Login / Signup
function signup(){
  const username=document.getElementById("username").value;
  const password=document.getElementById("password").value;
  if(users.find(u=>u.username===username)){ alert("User exists!"); return; }
  users.push({username,password,purchases:[]});
  localStorage.setItem("users", JSON.stringify(users));
  alert("Signup successful!");
}

function login(){
  const username=document.getElementById("username").value;
  const password=document.getElementById("password").value;
  const user=users.find(u=>u.username===username && u.password===password);
  if(!user){ alert("Invalid credentials"); return; }
  currentUser=user;
  localStorage.setItem("currentUser", JSON.stringify(user));
  document.getElementById("loginLink").style.display="none";
  document.getElementById("profileLink").style.display="inline";
  showPage("dashboard");
}

function logout(){
  currentUser=null;
  localStorage.removeItem("currentUser");
  document.getElementById("loginLink").style.display="inline";
  document.getElementById("profileLink").style.display="none";
  showPage("home");
}

// Dashboard
function renderDashboard(){
  const div=document.getElementById("myProducts");
  if(!currentUser){ div.innerHTML="Login required"; return; }
  div.innerHTML=currentUser.purchases.map(p=>`
    <div>
      ${p.title} - <button onclick="downloadProduct('${p.title}')">Download</button>
    </div>
  `).join("");
}

function downloadProduct(title){
  alert(`Downloading ${title}...`);
}

// Search
function searchProducts(){
  const query=document.getElementById("searchBar").value.toLowerCase();
  const grid=document.getElementById("productGrid");
  grid.innerHTML="";
  products.filter(p=>p.title.toLowerCase().includes(query)).forEach(p=>{
    const card=document.createElement("div");
    card.className="product-card";
    card.innerHTML=`
      <img src
