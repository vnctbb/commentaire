const formulaire = document.querySelector('form');
const div = document.querySelector('div');
const input = document.querySelector('input');
const button = document.querySelector('button');

const dateDuJour = () => {
  const date = new Date();
  let jour = date.getDay();
  if(jour < 10){
    const jourString = jour.toString();
    jour = `0${jourString}`;
  }
  let mois = date.getMonth();
  if(mois < 10){
    mois= mois + 1;
    if(mois < 10){
      const monthString = mois.toString();
      mois = `0${monthString}`;
    }
  } else {
    mois+= 1;
  }
  let heure = date.getHours();
  if(heure < 10){
    const dateString = heure.toString();
    heure = `0${dateString}`;
  }
  let minute = date.getMinutes();
  if(minute < 10){
    const minuteString = minute.toString();
    minute = `0${minuteString}`;
  }
  return `${jour}/${mois} - ${heure}h${minute}`;
};

fetch('/requete-initial-com')
  .then(response => {
    return response.json();
  }).then(response => {
    response.forEach(commentaire => {
      const newDiv = document.createElement('div');
      newDiv.innerHTML = `<div>
        <p>${commentaire.date}</p>
        </div>
        <div>
        </p>${commentaire.com}<p/>
        </div>`;
      div.appendChild(newDiv);
    });
  });

button.addEventListener('click', () => {
  div.innerText = '';
  fetch('/requete-initial-com')
  .then(response => {
    return response.json();
  }).then(response => {
    response.forEach(commentaire => {
      const newDiv = document.createElement('div');
      newDiv.innerHTML = `<div>
        <p>${commentaire.date}</p>
        </div>
        <div>
        </p>${commentaire.com}<p/>
        </div>`;
      div.appendChild(newDiv);
    });
  });
})
 
formulaire.addEventListener('submit', (evt) => {
  div.innerText = '';
  evt.preventDefault();
  const date = dateDuJour();
  fetch('/post-coms', {
    method : 'POST',
    headers: {'Content-Type': 'application/json'},
    body : JSON.stringify({
      'com' : input.value,
      'date' : date,
      'timestamp' : Date.now()}),
  }).then(response => {
    return response.json();
  }).then(json => {
    json.forEach(commentaire => {
      const newDiv = document.createElement('div');
      newDiv.innerHTML = `<div>
        <p>${commentaire.date}</p>
        </div>
        <div>
        </p>${commentaire.com}<p/>
        </div>`;
      div.appendChild(newDiv);
    });
  });
  input.value='';
});