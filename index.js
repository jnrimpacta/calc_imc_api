function calculateImcAPI(person) {
  
    fetch('http://localhost:8080/imc/calculate', {
      method: 'post',
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        'height': person.height,
        'weight': person.weight
      })
    })
    .then((response)=>{
  
      if (!response.ok) {
        return new Error('falhou a requisição')
      }
  
      // verificando pelo status
      if (response.status === 404) {
        return new Error('não encontrou qualquer resultado')
      }
  
      response.text().then((text)=>{
  
        resp_imc = JSON.parse(text);
        renderImc(resp_imc)
          
      })
  
    });
  
  }
  
  function renderImc(person) {
    document.getElementById('imc').innerHTML = parseFloat(person.imc).toFixed(2) + ' ' + person.imcDescription;
  }
  
  function Person(height, weight) {
  
    if (typeof(height) !== 'number' || isNaN(height))
      throw Error('height is not a number!');
  
    if (typeof(weight) !== 'number' || isNaN(weight))
      throw Error('weight is not a number!');
  
    this.height = height;
    this.weight = weight;
  
  }
  
  function Dietician(height, weight) {
    Person.call(this, height, weight);
  }
  
  Dietician.prototype = Object.create(Person.prototype);
  Dietician.prototype.constructor = Dietician;
  console.log(Dietician.prototype.constructor);
  
  function calculateImc(dietician) {
    console.log('dietician is a person?');
    console.log(dietician instanceof Person);
    calculateImcAPI(dietician);
  }
  
  function buildCalculateImc() {
  
    var heightEl = document.getElementById('altura');
    var weightEl = document.getElementById('peso');
  
    return function(evt) {
      calculateImc(new Dietician(parseFloat(heightEl.value), parseFloat(weightEl.value)));
    }
  
  }
  
  window.onload = function() {
  
    var btn = document.querySelector('.data .form button');
    btn.addEventListener('click', buildCalculateImc());
  
    var resp_imc = "";
  
    fetch("http://localhost:8080/imc/table")
    .then((response)=>{
      response.text().then((text)=>{
  
        resp_imc = JSON.parse(text);
  
        var table = "";
  
        Object.entries(resp_imc).forEach(([key, value]) => {
  
          table += '<tr>';        
          table += '<td>' + key + '</td>';
          table += '<td>' + value + '</td>';
          table += '</tr>';
  
        });
  
        document.getElementById("table_id").innerHTML = table;
          
      })
    })
    .catch(error => console.log("Oooops, error: ", error));
  
  }