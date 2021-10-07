// collect DOM elmts // branch1
const header = document.getElementsByTagName('header')[0];
const articleRecipes = document.getElementById('article_recipes');
const inputIngredients = document.getElementById('ingredients');
const inputUstensils = document.getElementById('ustensils');
const inputAppliance = document.getElementById('appliance');



// let suggests;
const inputSearch = document.getElementsByTagName('input');
const tags = document.getElementById('tags');
let suggests;

// any elmts
let ingredientsList = [];
let applianceList = [];
let ustensilsList = [];
let namesList= [];
let tagsArray = [];
let tagsIngredients = [];
let tagsAplliance = [];
let tagsUstensils = [];
let tagsName = [];
let itemArray = [];
let ingrdSuggest;
let itemToLowerCase;
let recipesArray = [];
let updateRecipe = [];
let numb = 0;
let sectionRecipe = "";
let liRecipe;
let ulRecipe;
let inputId;

// Call class to use easyly data
class RecipeClass{
  constructor(id, name, servings, ingredients, time, description, appliance, ustensils){
    this.id = id;
    this.name = name;
    this.servings = servings;
    this.ingredients = ingredients;
    this.time = time;
    this.description = description;
    this.appliance = appliance;
    this.ustensils = ustensils;
  }
}

// Collect JSON to init datas 
function initData(){
    fetch('recipes.json')
    .then(res => res.json())
    .then( function(datas){
      for ( data of datas.recipes){
        recipesArray.push(data);
      }
      setData();
      suggestList(recipesArray);
      // console.log(ingredientsList.sort())
    })
    .catch(error => alert ("Erreur : " + error));
  }

function setData(){
  showCards(recipesArray);
}

function updateData(){
  // const found = ingredientsList.some( res => { console.log(tagsArray[0] === res) }) // autre facon de faire
  console.log(tagsArray)
  tagsArray.forEach ( elmt => {
    articleRecipes.innerHTML = "";
    if (ingredientsList.includes(elmt) || ustensilsList.includes(elmt) || applianceList.includes(elmt) || namesList.includes(elmt)){
      var cache = {};
      updateRecipe = updateRecipe.filter(function(elem){
        return cache[elem.id]?0:cache[elem.id]=1;
        ;})
        console.log(updateRecipe);
        numb = 0;
  showCards(updateRecipe)
  suggestList(updateRecipe)
    }else{
      alert('Aucun résultat ne correspond à votre recherche')

    }
  }
  )
}

function suggestList(array){
  ingredientsList = [];
  ustensilsList = [];
  applianceList = [];
  namesList = [];
  array.forEach(
    elmt => {
      elmt.ingredients.forEach(ingredient => {
        ingredient = ingredient.ingredient[0].toUpperCase() + ingredient.ingredient.slice(1);
        ingredientsList.push(ingredient);
      });
      elmt.ustensils.forEach(app =>{ 
          // app = app[0].toUpperCase() + app.slice(1);
          ustensilsList.push(app)
        });
      applianceList.push(elmt.appliance);
      namesList.push(elmt.name);
    }
  );
  ingredientsList = [...new Set(ingredientsList)];
  ustensilsList = [...new Set(ustensilsList)];
  applianceList = [...new Set(applianceList)];
}


// factory node
const elmtFactory = (nodeName, attribute, ...children) => {
  const elmt = document.createElement(nodeName)
    for(key in attribute){
      elmt.setAttribute(key, attribute[key])
    }
    
    children.forEach(child => {
      if (typeof child === 'string'){
        elmt.appendChild(document.createTextNode(child))
      } else {
        elmt.appendChild(child)
      }
    })
    return elmt;
  }

// header

const logo = elmtFactory('img',{ id: 'logo', src: './public/chiefCap.svg'}, );

// Search
const title = elmtFactory('h1', { id: 'header_h1'}, "Les petits plats")
const formSearchBar = elmtFactory('form', { class: "form_search"},elmtFactory('input', { type: 'text', class: 'header_nav', autocomplete: 'off', placeholder: "Rechercher un ingredient, appareil, ustensiles ou une recette"},),
elmtFactory('button', { type: 'submit'},
elmtFactory('i',{ class: 'bi bi-search'}, ) ),
    // elmtFactory('i',{ class: 'bi bi-search'}, ),
    elmtFactory('div', { id: 'suggestsGlobal'},
    )  )
const topNav = elmtFactory('input', { type: 'text', class: 'header_nav'},
  elmtFactory('i',{ class: 'bi bi-search'}, ));

header.appendChild(logo);
header.appendChild(title);
header.appendChild(formSearchBar);

// select ingredients
const selectsArticle = elmtFactory('article', { class: 'article_selects'},
  elmtFactory('select', )
);

// main - show all recipe
function showCards (element) {
  for ( recipe of element){ 
    let Recipe = new 
    RecipeClass(recipe.id, recipe.name, recipe.servings, recipe.ingredients, recipe.time, recipe.description, recipe.appliance, recipe.ustensils) 

    sectionRecipe = elmtFactory('section', {class: 'section_recipe col col-lg-4'}, 
    elmtFactory('img', { class: 'recipe_img'}, ),
    elmtFactory('div', { class: 'recipe_footer'},
      elmtFactory('h2', { class: 'recipe_h2'}, Recipe.name ),
      elmtFactory('p', {class: 'recipe_time'}, Recipe.time.toString()),
      ),
    elmtFactory('div', {class:"recipe_footer"}, 
      elmtFactory('ul', { class: 'recipe_ul'}, ),
      elmtFactory('p', {class: 'recipe_descr'}, Recipe.description ),
      )
    );
    articleRecipes.appendChild(sectionRecipe);
    liRecipe = Recipe.ingredients;
    ulRecipe = document.getElementsByClassName('recipe_ul') ;
    for ( li of  liRecipe){
      if ( li.unit){
        let liUnit = li.unit;
        let ingredientLi = elmtFactory('li', { class: 'li_recipe'}, li.ingredient +': ' + li.quantity + li.unit )
        ulRecipe[numb].appendChild(ingredientLi);
      } else {
        let ingredientLi = elmtFactory('li', { class: 'li_recipe'}, li.ingredient +': ' + li.quantity )
        ulRecipe[numb].appendChild(ingredientLi);
      }
    }
    numb++;;
}
}


//  run function to update
initData();
function render() {
  (recipesArray.length !== 0) ?  updateData() : setData() ;
};

// addEventListener on input
for ( let input of inputSearch){
  input.addEventListener('keyup', (e) => {
    console.log(e.key)
    inputEvent(e,input);
    e.preventDefault();
  })

  input.addEventListener('keydown', (e) => {
    if( e.key === "enter"){
      e.stopPropagation();
      e.preventDefault();
      return false
    }
    console.log(e.key);
  })
}

function inputEvent(e, input){
    let inputValue;
    let lettersLowerCase;
    let brutItem;
    if ( updateRecipe.length === 0 ){
      showSuggest(recipesArray, e, input)
    } else {
      showSuggest(updateRecipe, e, input)
    }
    
}

function showSuggest(array, e, input){
  suggests = e.target.parentNode.lastElementChild;
  inputId = input.getAttribute('id');
  let inputValue = input.value ;
  let lettersLowerCase = inputValue.toLowerCase();
  suggests.innerHTML = "";
  itemArray = [];

  if(inputValue.length>=3){
    if(inputId === "ingredients"){
      array.forEach( elmt => {
        let foundIngrd = elmt.ingredients.some( res => {
          let igrdLower = res.ingredient.toLowerCase();
          if( igrdLower.includes(lettersLowerCase)){
            itemArray.push(res.ingredient);
            itemArray = [...new Set(itemArray)];
            updateRecipe.push(elmt);
            updateRecipe = [...new Set(updateRecipe)];
          }
        });
      });
    }

    if(inputId === "appliance"){
      array.forEach( elmt => {
        let applianceLower = elmt.appliance.toLowerCase();
        if ( applianceLower.includes(lettersLowerCase)){
          itemArray.push(elmt.appliance);
          itemArray = [...new Set(itemArray)];
          updateRecipe.push(elmt);
          updateRecipe = [...new Set(updateRecipe)];
        }
      });
    }

    if(inputId === "ustensils"){
      array.forEach( elmt => {
        let foundUstensil = elmt.ustensils.some( res => {
          let ustensilsLower = res.toLowerCase();
          if ( ustensilsLower.includes(lettersLowerCase)){
            itemArray.push(res);
            itemArray = [...new Set(itemArray)];
            updateRecipe.push(elmt);
            updateRecipe = [...new Set(updateRecipe)];
          }
        });
      } );
    }

    if(inputId === null){
      array.forEach( elmt => {
        elmt.ingredients.forEach ( igr => {
          if(igr.ingredient.includes(inputValue)){
            updateRecipe.push(elmt);
            updateRecipe = [...new Set(updateRecipe)];
          }
        });
        elmt.ustensils.forEach( ustl => {
          if(ustl.includes(inputValue)){
            updateRecipe.push(elmt);
            updateRecipe = [...new Set(updateRecipe)];
          }
        });
        if( elmt.appliance.toLowerCase().includes(inputValue.toLowerCase())){
          updateRecipe.push(elmt);
          updateRecipe = [...new Set(updateRecipe)];
        }
      });
    }
  }
  itemArray.forEach( sug => {
    ingrdSuggest = elmtFactory('p', { class: "suggest", value: inputId, onclick: "suggestFunction(this)"}, sug );
    suggests.appendChild(ingrdSuggest);
  }) ;
}


// function on suggests when we click on a suggest
function suggestFunction(element){
  let cacheUpdate = [];
  // updateRecipe = [];
  let tag = [];
  tags.innerHTML = "";
  let text = element.textContent;
  let valuElmt = element.getAttribute('value');
  let valueM = valuElmt[0].toUpperCase() +valuElmt.slice(1);
  let suggestById = "suggests"+ valueM ;
  console.log(element);

  if( valuElmt === 'ingredients' ){
    tagsIngredients.push(text);
    tagsIngredients = [...new Set(tagsIngredients)];
    updateRecipe.forEach( elmt => {
      console.log(elmt);
      const foundIngrd = elmt.ingredients.some( res => {
        let igrdLower = res.ingredient.toLowerCase();
        if( igrdLower === text.toLowerCase() ){
          articleRecipes.innerHTML = "";
          updateRecipe.push(elmt);
          cacheUpdate.push(elmt);
          console.log(elmt);
         inputIngredients.value = "";
        }
      })
    })
  } else if( valuElmt === 'appliance'){
    tagsAplliance.push(text);
    tagsAplliance = [...new Set(tagsAplliance)];
    console.log(tagsAplliance);
    updateRecipe.forEach( elmt => {
      let applianceLower = elmt.appliance.toLowerCase();
      if( applianceLower === text.toLowerCase()){
        articleRecipes.innerHTML = "";
          updateRecipe.push(elmt);
          cacheUpdate.push(elmt);
          console.log(elmt);
         inputAppliance.value = "";
      }
    })
  } else if( valuElmt === 'ustensils'){
    tagsUstensils.push(text)
    tagsUstensils = [...new Set(tagsUstensils)];
    updateRecipe.forEach( elmt=> {
      const foundUstensil = elmt.ustensils.some( res => {
        let ustensilsLower = res.toLowerCase();
        if ( ustensilsLower === text.toLowerCase()){
          articleRecipes.innerHTML = "";
          updateRecipe.push(elmt);
          cacheUpdate.push(elmt);
          console.log(elmt);
         inputUstensils.value = "";
        }
      })
    } )
  }
  console.log(updateRecipe);
  tagsArray.push(text);
tagsArray = [...new Set(tagsArray)];
tagsArray.forEach( elmt => {
  tag = elmtFactory('p', { class: "bg-primary text-white"}, elmt);
  tags.appendChild(tag);
})
  console.log(updateRecipe);
  cacheUpdate = [...new Set(cacheUpdate)];
  updateRecipe = [...cacheUpdate];
  console.log(eval(suggestById));
  eval(suggestById).innerHTML = "";
  render();
}

const spans = document.getElementsByTagName('span');

for ( let span of spans){
  span.addEventListener('click', (e) => {
    // e.preventDefault();
    let spanValue = span.getAttribute('value');
    let spanValueM = spanValue[0].toUpperCase() + spanValue.slice(1);
    let suggestById = "suggests"+ spanValueM ;
    let suggestId = document.getElementById(suggestById);
    suggestId.innerHTML = "";
    // let inputId = document.getElementById(suggestById);
    let nomming = spanValue+"List";
    let dynamicName = eval(nomming)
    for( let li of dynamicName){
      let listSuggest = elmtFactory('p', { class: "suggest", value: spanValue, onclick: "listFunction(this)"}, li );
      suggestId.appendChild(listSuggest);
    }
  })
}


function listFunction(element){
  let cacheUpdate = [];
  let tag = [];
  tags.innerHTML = "";
  let text = element.textContent;
  let valuElmt = element.getAttribute('value');
  console.log(valuElmt)
  let valueM = valuElmt[0].toUpperCase() + valuElmt.slice(1);
    let suggestId = "suggests"+ valueM ;
    console.log(eval(suggestId));
  

  if( valuElmt === 'ingredients' ){
    tagsIngredients.push(text);
    tagsIngredients = [...new Set(tagsIngredients)];
    console.log(tagsIngredients.length);
  } else if( valuElmt === 'appliance'){
    tagsAplliance.push(text);
    tagsAplliance = [...new Set(tagsAplliance)];
    console.log(tagsAplliance);
  } else {
    tagsUstensils.push(text)
    tagsUstensils = [...new Set(tagsUstensils)];
    console.log(tagsUstensils);
  }

  tagsArray.push(text);
tagsArray = [...new Set(tagsArray)];
tagsArray.forEach( elmt => {
  tag = elmtFactory('p', { class: "bg-primary text-white"}, elmt);
  tags.appendChild(tag);
})

  if( updateRecipe.length === 0){
    sortArray( recipesArray, cacheUpdate, valuElmt, text );
    eval(suggestId).innerHTML = "";
  } else {
    sortArray(updateRecipe, cacheUpdate, valuElmt, text);
    eval(suggestId).innerHTML = "";
    suggestList(updateRecipe);
  }
  eval(suggestId).innerHTML = ""
  render();
}


function sortArray(array, cacheUpdate, valuElmt, text){
  array.forEach( elmt => {
    for ( let [key, value] of Object.entries(elmt)){
      // console.log(key, valuElmt);
      if( key === valuElmt && typeof value === 'object'){
        for ( let item of value){
          if( typeof item === 'object' && item.ingredient.toLowerCase() === text.toLowerCase()){
            tagsIngredients.forEach( igrd => {
              if( item.ingredient.toLowerCase() === igrd.toLowerCase()){
                articleRecipes.innerHTML = "";
                updateRecipe.push(elmt);
                cacheUpdate.push(elmt);
              }
            })
          } else if (typeof item === 'string' && item.toLowerCase() === text.toLowerCase()){
            tagsUstensils.forEach( ustl => {
              if( item.toLowerCase() === ustl.toLowerCase()){
                console.log(elmt)
                articleRecipes.innerHTML = "";
                updateRecipe.push(elmt);
                cacheUpdate.push(elmt);
                
              }
                })
              }
            }
          } else if ( key === valuElmt && typeof value === 'string' && value.toLowerCase() === text.toLowerCase() ){
            tagsAplliance.forEach( apl => {
              if( apl.toLowerCase() === apl.toLowerCase()){
                console.log(elmt);
                articleRecipes.innerHTML = "";
            updateRecipe.push(elmt);
            cacheUpdate.push(elmt);
              }
            })
            
  
          }
        }
      })
      console.log(updateRecipe);
      cacheUpdate = [...new Set(cacheUpdate)];
      updateRecipe = [...cacheUpdate];
      console.log(updateRecipe);
}

