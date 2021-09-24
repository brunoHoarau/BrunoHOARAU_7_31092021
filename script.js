// collect DOM elmts
const header = document.getElementsByTagName('header')[0];
const articleRecipes = document.getElementById('article_recipes');
const inputIngredients = document.getElementById('ingredientsInput');
// let suggests;
const inputSearch = document.getElementsByTagName('input');
const tags = document.getElementById('tags');
let suggests;

// any elmts
let ingredientsList = [];
let appareilsList = [];
let ustensilsList = [];
let tagsArray = [];
let tagsIngredients = [];
let tagsAplliance = [];
let tagsUstensils = [];
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
  suggests.innerHTML = "";
  console.log(tagsArray)
  tagsArray.forEach ( elmt => {
    articleRecipes.innerHTML = "";
    if (ingredientsList.includes(elmt) || ustensilsList.includes(elmt) || appareilsList.includes(elmt)){
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
      appareilsList.push(elmt.appliance);
    }
  );
  ingredientsList = [...new Set(ingredientsList)];
  ustensilsList = [...new Set(ustensilsList)];
  appareilsList = [...new Set(appareilsList)];
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
const formSearchBar = elmtFactory('form', { class: "form_search"},elmtFactory('input', { type: 'text', class: 'header_nav', autocomplete: 'off'},
  elmtFactory('i',{ class: 'bi bi-search'}, )),
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
    let Recipe = new RecipeClass(recipe.id, recipe.name, recipe.servings, recipe.ingredients, recipe.time, recipe.description, recipe.appliance, recipe.ustensils) 

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
    e.preventDefault();
    inputEvent(e,input)
  })
}

async function inputEvent(e, input){
    let inputValue;
    let lettersLowerCase;
    let brutItem;
    if ( updateRecipe.length === 0 ){
      showSuggest(recipesArray, e, input)
    } else {
      showSuggest(updateRecipe, e, input)
    }
}

async function showSuggest(array, e, input){
  suggests = e.target.nextElementSibling;
  inputId = input.getAttribute('id');
  let inputValue = input.value ;
  let lettersLowerCase = inputValue.toLowerCase();
  let brutItem;
  array.forEach( (elmt) => {
    if(inputValue.length>=3){
      for ( let [key, value] of Object.entries(elmt)){
        if( key === inputId && typeof value === 'object'){
          for( item of value) {
            if(typeof item === "string" ){
              itemToLowerCase = item.toLowerCase();
              brutItem = item;
            } else {
              itemToLowerCase = item.ingredient.toLowerCase();
              brutItem = item.ingredient;
            };
            if(itemToLowerCase.includes(lettersLowerCase)){
                  itemArray.push(brutItem);
                  itemArray = [...new Set(itemArray)];
                  updateRecipe.push(elmt);
            }
          } 
        }else if( key === inputId && typeof value === 'string' && value.toLowerCase().includes(inputValue.toLowerCase())){
          itemArray.push(value);
          itemArray = [...new Set(itemArray)]
          updateRecipe.push(elmt);
        } else if ( inputId === null ){
            if( isNaN(value) && key !== 'description'){
              for( item of value) {
                if( typeof value === 'string' && value.toLowerCase().includes(inputValue.toLowerCase()) ){
                  itemArray.push(value);
                  itemArray = [...new Set(itemArray)];
                  updateRecipe.push(elmt);
                } else if (typeof value === 'object' && typeof item === 'string' && item.toLowerCase().includes(inputValue.toLowerCase())){
                  itemArray.push(item);
                  itemArray = [...new Set(itemArray)];
                  updateRecipe.push(elmt);
                } else if( typeof value === 'object' && typeof item === 'object' && item.ingredient.toLowerCase().includes(inputValue.toLowerCase())){
                    itemArray.push(item.ingredient);
                    itemArray = [...new Set(itemArray)];
                    updateRecipe.push(elmt);
                  }
                }
              } else if (key === 'name' && value.toLowerCase().includes(inputValue.toLowerCase())) {
              }
            }
      }
    }
  })
  suggests.innerHTML = "";
  itemArray.forEach( sug => {
    ingrdSuggest = elmtFactory('p', { class: "suggest", value: inputId, onclick: "suggestFunction(this)"}, sug )
    suggests.appendChild(ingrdSuggest);
  }) 
  console.log(itemArray)
  if(inputValue.length >= 3) {
    itemArray = [] ;
  } else {suggests.innerHTML = ""; itemArray = [] };
}


function suggestFunction(element){
  let cacheUpdate = [];
  let tag = [];
  tags.innerHTML = "";
  let text = element.textContent;
  let valuElmt = element.getAttribute('value');
  // console.log(valuElmt);
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
  console.log(updateRecipe);
  tagsArray.push(text);
tagsArray = [...new Set(tagsArray)];
tagsArray.forEach( elmt => {
  tag = elmtFactory('p', { class: "bg-primary text-white"}, elmt);
  tags.appendChild(tag);
})
updateRecipe.forEach( elmt => {
  // console.log(elmt)
  for ( let [key, value] of Object.entries(elmt)){
    // console.log(typeof value)
    if( key === inputId && typeof value === 'object'){
      for ( let item of value){
        if( typeof item === 'object' && item.ingredient.toLowerCase() === text.toLowerCase()){
          // console.log(item);
          tagsIngredients.forEach( igrd => {
            if( item.ingredient.toLowerCase() === igrd.toLowerCase()){
              // console.log(item.ingredient, igrd)
              articleRecipes.innerHTML = "";
              updateRecipe.push(elmt);
              cacheUpdate.push(elmt);
            }
          })
        } else if (typeof item === 'string' && item.toLowerCase() === text.toLowerCase()){
          // text = text.toLowerCase();
          // console.log(item);
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
        } else if ( key === inputId && typeof value === 'string' && value.toLowerCase() === text.toLowerCase() ){
          // console.log(key, typeof value);
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

  cacheUpdate = [...new Set(cacheUpdate)];
  updateRecipe = [...cacheUpdate];
  console.log(updateRecipe);
  element.textContent = "vide";
  render();
}