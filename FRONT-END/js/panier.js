//// GESTION DU PANIER////

//RECUPERATION DU PANIER DANS LE LOCAL STORAGE 
let cameras = JSON.parse(localStorage.getItem("panier")) ? JSON.parse(localStorage.getItem("panier")) : [];

//EMPLACEMENT DU HTML
let container = document.getElementById("container");

// INITIALISE LE PRIX TOTAL DU PANIER A 0
let prixPanier = 0;

//RECUPERATION ID PRODUIT
let addIdBasket = [];

//FONCTION CALCUL PRIX TOTAL DU PANIER ET ENVOIE AU LOCAL STORAGE
function priceTotalBasket(camera){
  prixPanier += camera.quantity * camera.price / 100;
  //AFFICHE PRIX TOTAL DU PANIER // ENVOI AU LOCALSTORAGE
  let prixTotal = document.getElementById('prixTotal').textContent = prixPanier + " € ";
  localStorage.setItem('prixTotal', JSON.stringify(prixTotal));
};

//BOUCLE SUR LE PANIER
cameras.forEach((camera, i) => {
  container.innerHTML += `
    <tr>
        <td class="srcimage"><img src=${camera.imageUrl} alt="" /></td>
        <td>${camera.name}</td>
        <td>${camera.price / 100} €</td>
        <td>${camera.quantity}</td>
        <td><a href="#" class="deleteCamera" data-id="${i}"> <i class="fas fa-trash-alt"></i></a></td>
        <td >${camera.quantity * camera.price / 100} €</td>
    </tr>
  `;
  //APPEL FONCTION
  priceTotalBasket(camera)
 
 // BOUCLE INCREMENT ID PRODUIT
  for (let i = 0; i < camera.quantity; i++) {
    addIdBasket .push(camera.id);
  }
});

function deleteCamera(id) {
    let camera = cameras[id];
    if (camera.quantity > 1) {
      camera.quantity--;
    } else {
      cameras.splice(id, 1);
    }
    localStorage.setItem('panier', JSON.stringify(cameras));
    window.location.reload();
  }

// SUPPRIMER 1 PRODUIT DU PANIER
document.querySelectorAll(".deleteCamera").forEach(delBtn => {
  delBtn.addEventListener('click', () => deleteCamera(delBtn.dataset.id))
});

let viderPanier = document.getElementById('viderPanier')
viderPanier.addEventListener('click',  deleteBasket);

//FONCTION SUPPRIME TOUT LE PANIER
function deleteBasket() {
  if (cameras == null) {
  } else {
    container.remove();
    localStorage.clear();
    window.location.reload();
  }
};

//// GESTION DU FORMULAIRE ////

function sendOrder() {
  let form = document.getElementById("form");
  if (form.reportValidity() == true && addIdBasket.length>0) {
    let contact = {
      'firstName': document.getElementById("nom").value,
      'lastName': document.getElementById("prenom").value,
      'address': document.getElementById("adresse").value,
      'city': document.getElementById("ville").value,
      'email': document.getElementById("email").value
    };
 
    let products = addIdBasket;

    let formulaireClient = JSON.stringify({
      contact,
      products,
    });

    // APEL API AVEC FETCH // ENVOIE DES DONNEES AVEC POST 
    fetch('http://localhost:3000/api/cameras/order', {
      method: 'POST',
      headers: {
        'content-type': "application/json"
      },
      mode: "cors",
      body: formulaireClient
      })
      .then(function (response) {
        return response.json()
      })
      .then(function (r) {
        localStorage.setItem("contact", JSON.stringify(r.contact));
        window.location.assign("confirmation.html?orderId=" + r.orderId);
      })
      //SI PROBLEME API
      .catch(function (err) {
        console.log("fetch Error");
      });
  }
  else{
    alert(" Une erreur est survenue votre panier est  peux étre vide ou le formulaire n'a pas été correctement rempli!")
  };
}

let envoiFormulaire = document.getElementById("envoiFormulaire");

envoiFormulaire.addEventListener('click', function (event) {
  event.preventDefault();
  sendOrder();
});