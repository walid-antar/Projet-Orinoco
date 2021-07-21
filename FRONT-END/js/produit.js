//RECUPERATION DE L URL
let params = (new URL(document.location)).searchParams;

//STOCK L ID 
const id = params.get("id");

//EMPLACEMENT HTML
let container = document.getElementById("container");

// FONCTION ENVOIE LOCAL STORAGE
const addLocalStorage = panier => {
  localStorage.setItem('panier', JSON.stringify(panier));
};

// INCLUS HTML
const display = camera => {
  container.innerHTML +=`
    <div class="appareil" id="cardsProduct">
      <img src=${camera.imageUrl} alt="">
      <div class="description">
        <p class="nom">${camera.name}</p>
        <span class="appareil-description">
          ${camera.description}
        </span>
        <select class="options" id ="option">
          <option>Choix options</option>
        </select>
        <p class="prix"> Prix Unitaire: ${camera.price/ 100}€</p>
        <select class="quantite" id="quantity">           
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
        </select>         
        <a href ="../pages/panier.html"><button type ="submit" id="panier" value="submit"> Ajouter au panier</button></a>
      </div>
    </div>
  `;
  // CHOIX OPTIONS
  for (let lenses of camera.lenses){
    document.getElementById('option').innerHTML+=
    `<option value="1">${lenses}</option>`
  }
  // ECOUTE EVENEMENT AU CLICK + FNCT addProductBasket
  document.getElementById('panier').addEventListener('click', function () {
    addProductBasket(camera)
  });
};

//FONCTION AJOUTER PANIER 
const addProductBasket = camera=> {
  camera.quantity = parseInt(document.getElementById('quantity').value);

  //RECUPERE PANIER//memo : let variable=(condition)? "valeursi vrai": "valeur si faux"
  let panier = localStorage.getItem('panier') ? JSON.parse(localStorage.getItem('panier')) : [];

  //BOUCLE FOR PARCOUR LIGNE PANIER
  let cameraExistIndex = false;
  for (let i = 0; i < panier.length; i++) {
    let product = panier[i];
    //CONDITION CI PRODUIT EXISTE
    if (product.id === camera.id) {
      cameraExistIndex = i;
    }
  };
  // Caméra existe dans le panier
  if (false !== cameraExistIndex) {
    panier[cameraExistIndex].quantity = parseInt(panier[cameraExistIndex].quantity) + camera.quantity;
  } else {
    panier.push(camera);
  };
  addLocalStorage(panier)
};

// APPELLE API AVEC FETCH
fetch("http://localhost:3000/api/cameras/" + id)
  .then(response => response.json())
  .then(function (product) {
    let camera = new Camera(product)
    display(camera);
  })
  // SI PROBLEME API
  .catch(function(err){
  console.log("fetch Error")
});