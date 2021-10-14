// collect DOM elmts
const header = document.getElementsByTagName('header')[0];
const articleRecipes = document.getElementById('article_recipes');
const inputIngredients = document.getElementById('ingredientsInput');
const inputUstensils = document.getElementById('ustensils');
const inputAppliance = document.getElementById('appliance');
const inputSearch = document.getElementsByTagName('input');
const tags = document.getElementById('tags');
let sectionR ;
let suggests;

// any elmts
let ingredientsList = [];
let applianceList = [];
let ustensilsList = [];
let nameList = [];
let tagsArray = [];
let tagsArrayTest = [];
let tagsIngredients = [];
let tagsAppliance = [];
let tagsUstensils = [];
let objIngredients = [];
let objAppliance = [];
let objUstensils = [];
let objTags = [];
// let tagsDescription = [];
// let tagsName = [];
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
        let cache = [];
        recipesArray = recipesArray.filter( elmt => {
          return cache[elmt.id]? 0 : cache[elmt.id]=1;
        });
      }
      console.log(recipesArray);
      setData();
      suggestList(recipesArray);
      // console.log(ingredientsList.sort())
      sectionR = document.getElementsByClassName('sectionRecipe');
    })
    .catch(error => alert ("Erreur : " + error));
  }

function setData(){
  showCards(recipesArray);
}

function updateData(){
  // const found = ingredientsList.some( res => { console.log(tagsArray[0] === res) }) // autre facon de faire
  console.log(tagsArray)
  // suggests.innerHTML = "";
  if(tagsArray.length > 0){
    tagsArray.forEach ( elmt => {
    articleRecipes.innerHTML = "";
    console.log(elmt)
    let nameListF = nameList.some( res => {
      res = res.toLowerCase();
      return res.includes(elmt.toLowerCase());
    })
    console.log(nameListF);
    if (ingredientsList.includes(elmt) || ustensilsList.includes(elmt) || applianceList.includes(elmt) || nameListF ){
      let cache = {};
      updateRecipe = updateRecipe.filter(function(elem){
        return cache[elem.id]?0:cache[elem.id]=1;
        ;})
        console.log(updateRecipe);
        numb = 0;
  showCards(updateRecipe);
  suggestList(updateRecipe);
    }else{
      const messageError = elmtFactory('p', { class: "ErrorMessage"}, "Aucun résultat ne correspont à votr recherche");
      articleRecipes.appendChild(messageError);

    }
  }
  )}else{
    // articleRecipes.innerHTML = "";
    initData();
  }
}

function suggestList(array){
  ingredientsList = [];
  applianceList = [];
  ustensilsList = [];
  nameList = [];
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
      nameList.push(elmt.name);
    }
  );
  ingredientsList = [...new Set(ingredientsList)];
  ustensilsList = [...new Set(ustensilsList)];
  applianceList = [...new Set(applianceList)];
  nameList = [...new Set(nameList)];
  // console.log(ingredientsList);
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
    )
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
      elmtFactory( "div", {class: 'recipe_time'},
      elmtFactory('i', {class: "bi bi-clock"}, ),
      elmtFactory( 'p', {}, Recipe.time.toString() + "min"),
       ),
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
  sectionRecipe.innerHTML = "";
  (recipesArray.length !== 0) ?  updateData() : setData() ;
};


// addEventListener on input
for ( let input of inputSearch){
  input.addEventListener('keyup', (e) => {
    e.preventDefault();
    inputEvent(e,input)
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
  let brutItem;
  console.log(input === inputSearch[0]);
  input !== inputSearch[0] ? suggests.innerHTML = "" : "";
  itemArray = [] 
  
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
            }
          } 
        }else if( key === inputId && typeof value === 'string' && value.toLowerCase().includes(inputValue.toLowerCase())){
          itemArray.push(value);
          itemArray = [...new Set(itemArray)];
        } else if ( inputId === null ){
            if( isNaN(value) && key !== 'description'){
              for( item of value) {
                if( typeof value === 'string' && value.toLowerCase().includes(inputValue.toLowerCase()) ){
                  itemArray.push(value);
                  itemArray = [...new Set(itemArray)];
                } else if (typeof value === 'object' && typeof item === 'string' && item.toLowerCase().includes(inputValue.toLowerCase())){
                  itemArray.push(item);
                  itemArray = [...new Set(itemArray)];
                } else if( typeof value === 'object' && typeof item === 'object' && item.ingredient.toLowerCase().includes(inputValue.toLowerCase())){
                    itemArray.push(item.ingredient);
                    itemArray = [...new Set(itemArray)];
                  }
                }
              }
            }
      }
    }
  })

   if(input !== inputSearch[0]){itemArray.forEach( sug => {
    ingrdSuggest = elmtFactory('p', { class: "suggest", value: inputId, onclick: "suggestFunction(this)"}, sug )
    suggests.appendChild(ingrdSuggest);
  }) }
  console.log(itemArray);
}

function suggestFunction(element){
  let parent = element.parentNode.parentNode.firstChild ;
  console.log(parent.id)
  let cacheUpdate = [];
  let tag = [];
  tags.innerHTML = "";
  let text = element.textContent;
  let valuElmt = element.getAttribute('value');

  if( valuElmt === 'ingredients' ){
    tagsIngredients.push(text);
    tagsIngredients = [...new Set(tagsIngredients)];
    console.log(tagsIngredients.length);
  } else if( valuElmt === 'appliance'){
    tagsAppliance.push(text);
    tagsAppliance = [...new Set(tagsAppliance)];
    console.log(tagsAppliance);
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

if( updateRecipe.length === 0 ){
    recipesArray.forEach ( elmt => {
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
          if(itemToLowerCase.includes(text.toLowerCase())){
                updateRecipe.push(elmt);
          }
        } 
      }else if( key === inputId && typeof value === 'string' && value.toLowerCase().includes(text.toLowerCase())){
        updateRecipe.push(elmt);
      } else if ( inputId === null ){
          if( isNaN(value) && key !== 'description'){
            for( item of value) {
              if( typeof value === 'string' && value.toLowerCase().includes(text.toLowerCase()) ){
                updateRecipe.push(elmt);
              } else if (typeof value === 'object' && typeof item === 'string' && item.toLowerCase().includes(text.toLowerCase())){
                updateRecipe.push(elmt);
              } else if( typeof value === 'object' && typeof item === 'object' && item.ingredient.toLowerCase().includes(text.toLowerCase())){
                  updateRecipe.push(elmt);
                }
              }
            }
          }
    }
  }
  )}




updateRecipe.forEach( elmt => {
  // console.log(elmt)
  for ( let [key, value] of Object.entries(elmt)){
    if( key === inputId && typeof value === 'object'){
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
        } else if ( key === inputId && typeof value === 'string' && value.toLowerCase() === text.toLowerCase() ){
          tagsAppliance.forEach( apl => {
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

const spans = document.getElementsByTagName('span');

for ( let span of spans){
  span.nextElementSibling.hidden = true;
  span.addEventListener('click', (e) => {
    // e.preventDefault();
    let spanValue = span.getAttribute('value');
    let spanValueM = spanValue[0].toUpperCase() + spanValue.slice(1);
    let suggestById = "suggests"+ spanValueM ;
    // console.log(suggestById);
    let suggestId = document.getElementById(suggestById);
    suggestId.innerHTML = "";
    let nomming = spanValue+"List";
    let dynamicName = eval(nomming);
    let thisInput = e.target.parentNode.previousElementSibling.getAttribute('id');
    thisInput = document.getElementById(thisInput);
    let i = 0;
    for( let li of dynamicName){
      let listSuggest = elmtFactory('p', { class: "suggest", value: spanValue, onclick: "listFunction(this)"}, li );
      suggestId.appendChild(listSuggest);
      if( i === 29){
        break;
      }
      i++;
    }
    span.parentNode.className = "col col-lg-6";
    span.parentNode.hidden = false;
    thisInput.style.width = "92.8%";
  })
}

const arrayId = ['suggestsIngredients', 'suggestsAppliance', 'suggestsUstensils'];

for (let id of arrayId){
  document.addEventListener('click', (e)=>{
    let word = id.slice(8).toLowerCase();
    let spanValue;

    if(e.target.parentNode){
        spanValue = e.target.parentNode.getAttribute('value');
        if( e.target !== document.getElementById(id) && word !== spanValue ){
          document.getElementById(id).innerHTML = "";
          document.getElementById(id).hidden = true;
          document.getElementById(id).parentNode.className = "col col-lg-2";
          document.getElementById(id).parentNode.firstElementChild.style.width = "110px";
        }else{
          document.getElementById(id).hidden = false;
        }
      }
  })
}


function listFunction(element){
  let tag = [];
  tags.innerHTML = "";
  let text = element.textContent;
  let valuElmt = element.getAttribute('value');
  let valueM = valuElmt[0].toUpperCase() + valuElmt.slice(1);
    let suggestId = "suggests"+ valueM ;
    document.getElementById(valuElmt).parentNode.className = "col col-lg-2";
    document.getElementById(valuElmt).parentNode.lastElementChild.hidden = true;

  if( valuElmt === 'ingredients' ){
    tagsIngredients.push(text);
    tagsIngredients = [...new Set(tagsIngredients)];
    tagsArray.push(text);
      objTags.push({ ingredient : ''+text+''});
      let cache = {};
      objIngredients = objIngredients.filter(function(elmt){
        return cache[elmt.ingredient]?0:cache[elmt.ingredient]=1;
        ;})
        console.log(objTags);
  } else if( valuElmt === 'appliance'){
    tagsAppliance.push(text);
    tagsAppliance = [...new Set(tagsAppliance)];
    tagsArray.push(text);
    objTags.push({ appliance : ''+text+''});
      let cache = {};
      objTags = objTags.filter(function(elmt){
        return cache[elmt.appliance]?0:cache[elmt.appliance]=1;
        ;})
        console.log(objTags);

  } else if ( valuElmt === 'ustensils') {
    tagsUstensils.push(text)
    tagsUstensils = [...new Set(tagsUstensils)];
    tagsArray.push(text);
    objTags.push({ ustensil : ''+text+''});
      let cache = {};
      objTags = objTags.filter(function(elmt){
        return cache[elmt.ustensil]?0:cache[elmt.ustensil]=1;
        ;})
      console.log(objTags);
    }
    
    
//   tagsArray.push(text);
tagsArray = [...new Set(tagsArray)];
  objTags.forEach( elmt => {
    for( let [key, value] of Object.entries(elmt)){
      console.log(key)
      if( key === "ingredient"){
        tag = elmtFactory( 'div', { class: "tag bg-primary text-white"},
          elmtFactory('p', { }, value),
          elmtFactory( 'i', { class: "bi bi-x-circle", onclick: "removeTag('"+value+"')"},)
        );
      tags.appendChild(tag);
    } else if( key === "appliance"){
      tag = elmtFactory( 'div', { class: "tag bg-success text-white"},
        elmtFactory('p', { }, value),
        elmtFactory( 'i', { class: "bi bi-x-circle", onclick: "removeTag('"+value+"')"},)
      );
      tags.appendChild(tag);
    } else if( key === "ustensil"){
      tag = elmtFactory( 'div', { class: "tag bg-danger text-white"},
        elmtFactory('p', { }, value),
        elmtFactory( 'i', { class: "bi bi-x-circle", onclick: "removeTag('"+value+"')"},)
      );
      tags.appendChild(tag);
    }
  }
})
  console.log(tagsIngredients)
  if( updateRecipe.length === 0){
    sortArray( recipesArray, valuElmt, text );
    eval(suggestId).innerHTML = "";
  } else {
    sortArray(updateRecipe, valuElmt, text);
    eval(suggestId).innerHTML = "";
    suggestList(updateRecipe);
  }
  eval(suggestId).innerHTML = "";
  render();
}


function sortArray(array, valuElmt, text){
  let cacheUpdate = [];
  array.forEach( elmt => {
    for ( let [key, value] of Object.entries(elmt)){
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
                // console.log(elmt)
                articleRecipes.innerHTML = "";
                updateRecipe.push(elmt);
                cacheUpdate.push(elmt);
                
              }
                })
              }
            }
          } else if ( key === valuElmt && typeof value === 'string' && value.toLowerCase() === text.toLowerCase() ){
            tagsAppliance.forEach( apl => {
              if( apl.toLowerCase() === apl.toLowerCase()){
                // console.log(elmt);
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

}

const buttonSearch = document.getElementsByTagName('button')[0];
buttonSearch.addEventListener('click', e => {
  e.preventDefault();
  searchMain();
})

function searchMain() {
  console.log(inputSearch[0].value);
  let research = inputSearch[0].value;
  tagsArray.push(research);
  objTags.push({ general : research})

tagsArray = [...new Set(tagsArray)];
tagsArray.forEach( elmt => {
  tag = elmtFactory('div', { class: "tag bg-secondary text-white"},
   elmtFactory('p', {}, elmt),
   elmtFactory( 'i', { class: "bi bi-x-circle", onclick: "removeTag('"+elmt+"')"},))
  tags.appendChild(tag);
})

  recipesArray.forEach ( elmt => {
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
          if(itemToLowerCase.includes(research.toLowerCase())){
                updateRecipe.push(elmt);
                console.log(key)
                itemArray.push(brutItem);
                itemArray = [...new Set(itemArray)];
          }
        } 
      }else if( typeof value === 'string' && value.toLowerCase().includes(research.toLowerCase())){
        updateRecipe.push(elmt);
        itemArray.push(value);
        itemArray = [...new Set(itemArray)];
      } else if ( inputId === null ){
          if( isNaN(value) && key !== 'description'){
            for( item of value) {
              if( typeof value === 'string' && value.toLowerCase().includes(research.toLowerCase()) ){
                updateRecipe.push(elmt);
                itemArray.push(value);
          itemArray = [...new Set(itemArray)];
              } else if (typeof value === 'object' && typeof item === 'string' && item.toLowerCase().includes(research.toLowerCase())){
                updateRecipe.push(elmt);
                itemArray.push(value);
          itemArray = [...new Set(itemArray)];
              } else if( typeof value === 'object' && typeof item === 'object' && item.ingredient.toLowerCase().includes(research.toLowerCase())){
                  updateRecipe.push(elmt);
                  itemArray.push(value);
          itemArray = [...new Set(itemArray)];
                }
              }
            }
          }
    }
  }
  )
  console.log(updateRecipe);
  render();
}

function removeTag(element) {
  console.log(tagsIngredients)
  tags.innerHTML = "";
let cacheRecipe = [];


  let indexElmtObj = objTags.map( e => {
    for( let [key,value] of Object.entries(e)){
      if( key === "ingredient"){
        return e.ingredient;
      } else if( key === "appliance"){
        return e.appliance;
      } else if(key === "ustensil") {
        return e.ustensil;
      } else {
        return e.general;
      }
    }
    console.log(tagsIngredients)
  }).indexOf(element);
  let indexElmtIngr = tagsIngredients.indexOf(element);
  let indexElmtAppl = tagsAppliance.indexOf(element);
  let indexElmtUstl = tagsUstensils.indexOf(element);
  let indexTagsArray = tagsArray.indexOf(element);
  console.log(indexElmtIngr);
  
  if( objTags.length > -1){
    objTags.splice(indexElmtObj, 1, );
    indexElmtIngr > -1 ? tagsIngredients.splice(indexElmtIngr, 1, ) : "";
    indexElmtAppl > -1 ? tagsAppliance.splice(indexElmtAppl, 1, ) : "" ;
    indexElmtUstl > -1 ? tagsUstensils.splice(indexElmtUstl, 1, ) : "" ;
    indexTagsArray > -1 ? tagsArray.splice(indexTagsArray, 1, ) : "" ;
  console.log(tagsArray)

  objTags.forEach( elmt => {
    for( let [key, value] of Object.entries(elmt)){
      console.log(key)
      if( key === "ingredient"){
        tag = elmtFactory( 'div', { class: "tag bg-primary text-white"},
          elmtFactory('p', { }, value),
          elmtFactory( 'i', { class: "bi bi-x-circle", onclick: "removeTag('"+value+"')"},)
        );
      tags.appendChild(tag);
    } else if( key === "appliance"){
      tag = elmtFactory( 'div', { class: "tag bg-success text-white"},
        elmtFactory('p', { }, value),
        elmtFactory( 'i', { class: "bi bi-x-circle", onclick: "removeTag('"+value+"')"},)
      );
      tags.appendChild(tag);
    } else if( key === "ustensil"){
      tag = elmtFactory( 'div', { class: "tag bg-danger text-white"},
        elmtFactory('p', { }, value),
        elmtFactory( 'i', { class: "bi bi-x-circle", onclick: "removeTag('"+value+"')"},)
      );
      tags.appendChild(tag);
    } else {
      tag = elmtFactory( 'div', { class: "tag bg-secondary text-white"},
        elmtFactory('p', { }, value),
        elmtFactory( 'i', { class: "bi bi-x-circle", onclick: "removeTag('"+value+"')"},)
      );
      tags.appendChild(tag);
    }
  }
})


console.log(updateRecipe)
recipesArray.forEach( elmt => {
  for ( let [key, value] of Object.entries(elmt)){
    if( key === "ingredients" && typeof value === 'object'){
      for ( let item of value){
        
        if( typeof item === 'object' && item.ingredient.toLowerCase() !== element.toLowerCase()){
          // console.log(tagsIngredients);
        tagsIngredients.forEach( igrd => {
            console.log(key)
            if( item.ingredient.toLowerCase() === igrd.toLowerCase()){
              articleRecipes.innerHTML = "";
              // updateRecipe.push(elmt);
              cacheRecipe.push(elmt);
            }
          })
        } else if (typeof item === 'string' && item.toLowerCase() !== element.toLowerCase()){
          tagsUstensils.forEach( ustl => {
            if( item.toLowerCase() === ustl.toLowerCase()){
              console.log(elmt)
              articleRecipes.innerHTML = "";
              // updateRecipe.push(elmt);
              cacheRecipe.push(elmt);
              
            }
              })
            }
          }
        } else if ( key === "appliance" && typeof value === 'string' && value.toLowerCase() !== element.toLowerCase() ){
          tagsAppliance.forEach( apl => {
            if( apl.toLowerCase() === apl.toLowerCase()){
              console.log(elmt);
              articleRecipes.innerHTML = "";
              // updateRecipe.push(elmt);
              cacheRecipe.push(elmt);
            }
          })
        }
      }
    })
  }
  
  
  // articleRecipes.innerHTML = "";
  //   cacheRecipe = [...new Set(cacheRecipe)];
  //   updateRecipe = [...cacheRecipe];
    
    cacheRecipe = [...new Set(cacheRecipe)];
    updateRecipe = [...cacheRecipe];
    updateRecipe = updateRecipe.filter( elmt => {
      return cache[elmt.id]? 0 : cache[elmt.id]=1;
    });
    console.log(sectionR);
  

// console.log(updateRecipe)
  render();
}

// document.body.addEventListener('click', (e)=> console.log(e.target))