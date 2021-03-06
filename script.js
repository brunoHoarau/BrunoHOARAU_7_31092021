// collect DOM elmts // branch1

const header = document.getElementsByTagName('header')[0];
const articleRecipes = document.getElementById('article_recipes');
const inputIngredients = document.getElementById('ingredientsInput');
const inputUstensils = document.getElementById('ustensils');
const inputAppliance = document.getElementById('appliance');
const inputSearch = document.getElementsByTagName('input');
const tags = document.getElementById('tags');
let suggests;

// any elmts
let tagsArray = [];
let objTags1 = { ingredients:[], appliances:[], ustensils:[], general: []};
let suggestArrayList = [];
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
      showCards(recipesArray);
      suggestList(recipesArray);

    })
    .catch(error => alert ("Erreur : " + error));
  }
  
  function updateData(){
    // const found = ingredientsList.some( res => { console.log(tagsArray[0] === res) }) // autre facon de faire
    console.log(updateRecipe);
    if(objTags1.ingredients.length > 0 || objTags1.appliances.length > 0 || objTags1.ustensils.length > 0 || objTags1.general.length > 0 ){
      if ( updateRecipe.length > 0){
        articleRecipes.innerHTML = "";
        showCards(updateRecipe);
        suggestList(updateRecipe);
    }else{
      articleRecipes.innerHTML = "";
      const messageError = elmtFactory('p', { class: "ErrorMessage"}, " Aucune recette ne correspond ?? votre crit??re");
          articleRecipes.appendChild(messageError);
    }
  } else {
    articleRecipes.innerHTML = "";
    render();
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
const formSearchBar = elmtFactory('form', { class: "form_search"},
          elmtFactory('input', { type: 'text', class: 'header_nav', autocomplete: 'off', placeholder: "Rechercher un ingredient, appareil, ustensiles ou une recette", minlength: "3" },),
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
  numb = 0;
  for ( recipe of element){ 
    let Recipe = new RecipeClass(recipe.id, recipe.name, recipe.servings, recipe.ingredients, recipe.time, recipe.description, recipe.appliance, recipe.ustensils) 

    sectionRecipe = elmtFactory('section', {class: 'section_recipe col- col-md-12'}, 
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
    let ingredientLi = "";
    for ( li of liRecipe){
      if (li.unit){
        ingredientLi = elmtFactory('li', { class: 'li_recipe'}, li.ingredient +': ' + li.quantity + li.unit )
        ulRecipe[numb].appendChild(ingredientLi);
      } else {
        ingredientLi = elmtFactory('li', { class: 'li_recipe'}, li.ingredient +': ' + li.quantity )
        ulRecipe[numb].appendChild(ingredientLi);
      }
    }
    numb++;;
}
}


//  run function to update
initData();
function render(){
 if(recipesArray.length !== 0){ updateData() }else{initData()}  ;
};

// addEventListener on input
for ( let input of inputSearch){
  input.addEventListener('keyup', (e) => {
    e.preventDefault();
    if ( updateRecipe.length === 0 ){
      showSuggest(recipesArray, e, input)
    } else {
      showSuggest(updateRecipe, e, input)
    }
  })
}

// show overtime suggest && take elmt for the suggest list to stock into suggestArraList
function showSuggest(array, e, input){
  suggests = e.target.parentNode.lastElementChild;
  inputId = input.getAttribute('id');
  let inputValue = input.value ;
  let lettersLowerCase = inputValue.toLowerCase();
  let brutItem;
  input !== inputSearch[0] ? suggests.innerHTML = "" : "";
  suggestArrayList = [] ;
  if(inputValue.length >= 3 ){
    inputValue = inputValue[0].toUpperCase() + inputValue.slice(1) ;
    array.forEach( (elmt) => {
      for ( let [key, value] of Object.entries(elmt)){
        if( key === inputId && typeof value === 'object'){
          for( item of value){
            if(typeof item === "string" ){
              itemToLowerCase = item.toLowerCase();
              brutItem = item;
            } else {
              itemToLowerCase = item.ingredient.toLowerCase();
              brutItem = item.ingredient;
            };
            if(itemToLowerCase.includes(lettersLowerCase)){
              suggestArrayList.push(brutItem);
              suggestArrayList = [...new Set(suggestArrayList)];
          }
        } 
      }else if( key === inputId && typeof value === 'string' && value.toLowerCase().includes(inputValue.toLowerCase())){
        suggestArrayList.push(value);
        suggestArrayList = [...new Set(suggestArrayList)];
      } else if ( inputId === null ){
        if( isNaN(value) && key !== 'description'){
          for( item of value) {
            if( typeof value === 'string' && value.toLowerCase().includes(inputValue.toLowerCase()) ){
              suggestArrayList.push(value);
              suggestArrayList = [...new Set(suggestArrayList)];
            } else if (typeof value === 'object' && typeof item === 'string' && item.toLowerCase().includes(inputValue.toLowerCase())){
              suggestArrayList.push(item);
              suggestArrayList = [...new Set(suggestArrayList)];
            } else if( typeof value === 'object' && typeof item === 'object' && item.ingredient.toLowerCase().includes(inputValue.toLowerCase())){
              suggestArrayList.push(item.ingredient);
              suggestArrayList = [...new Set(suggestArrayList)];
                }
              }
            }
          }
        }
      })
      if(input !== inputSearch[0]){
        suggests.hidden = false;
        input.parentNode.className = "col col-lg-6";
        // input.style.width = "92.8%";
      }
    } else if (suggestArrayList.length === 0 && input !== inputSearch[0] ){
      suggests.hidden = true;
      input.parentNode.className = "col col-sm-12 col-md-2 col-lg-2 bg-primary text-white";
    }
    if(input !== inputSearch[0]){suggestArrayList.forEach( sug => {
      ingrdSuggest = elmtFactory('p', { class: "suggest", value: inputId, onclick: "suggestSelect(this)"}, sug )
      suggests.appendChild(ingrdSuggest);
    }) }
}

// event when you click on one suggest in list 
function suggestSelect(element){
  let cacheUpdate = [];
  let tag = [];
  tags.innerHTML = "";
  let text = element.textContent; // collect the text 
  let valuElmt = element.getAttribute('value');

  if( valuElmt === 'ingredients' ){
    objTags1.ingredients.push(text); 
    objTags1.ingredients = [...new Set(objTags1.ingredients)]; 
  } else if( valuElmt === 'appliance'){
    objTags1.appliances.push(text); 
    objTags1.appliances = [...new Set(objTags1.appliances)]; 
  } else {
    objTags1.ustensils.push(text); 
    objTags1.ustensils = [...new Set(objTags1.ustensils)]; 
  }
  console.log(suggestArrayList);
showTags()

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
  for ( let [key, value] of Object.entries(elmt)){
    if( key === inputId && typeof value === 'object'){
      for ( let item of value){
        if( typeof item === 'object' && item.ingredient.toLowerCase() === text.toLowerCase()){
          objTags1.ingredients.forEach( igrd => {
            if( item.ingredient.toLowerCase() === igrd.toLowerCase()){
              // articleRecipes.innerHTML = "";
              // updateRecipe.push(elmt);
              cacheUpdate.push(elmt);
            }
          })
        } else if (typeof item === 'string' && item.toLowerCase() === text.toLowerCase()){
            objTags1.ustensils.forEach( ustl => {
              if( item.toLowerCase() === ustl.toLowerCase()){
                console.log(elmt)
                // articleRecipes.innerHTML = "";
                // updateRecipe.push(elmt);
                cacheUpdate.push(elmt);
               }
              })
            }
          }
        } else if ( key === inputId && typeof value === 'string' && value.toLowerCase() === text.toLowerCase() ){
          objTags1.appliances.forEach( apl => {
            if( apl.toLowerCase() === apl.toLowerCase()){
              console.log(elmt);
              // articleRecipes.innerHTML = "";
          // updateRecipe.push(elmt);
          cacheUpdate.push(elmt);
            }
          })
        }
      }
    })
  articleRecipes.innerHTML = "";
  cacheUpdate = [...new Set(cacheUpdate)];
  updateRecipe = [...cacheUpdate];
  element.textContent = "vide";
  render();
}

const spans = document.getElementsByTagName('span');

for ( let span of spans){
  span.addEventListener('click', (e) => {
    let dataVal = span.getAttribute("data-value");
    let spanValue = span.previousElementSibling.getAttribute("id");
    let spanValueM = spanValue[0].toUpperCase() + spanValue.slice(1);
    let suggestById = "suggests"+ spanValueM ;
    let suggestId = document.getElementById(suggestById);
    if(dataVal === "false"){
      console.log(dataVal)
    suggestId.innerHTML = "";
    let nomming = spanValue+"List";
    let dynamicName = eval(nomming);
    let thisInput = e.target.parentNode.previousElementSibling.getAttribute('id');
    thisInput = document.getElementById(thisInput);
    suggestId.style.display = 'flex'
    dataVal = 'true';
    let i = 0;
    for( let li of dynamicName){
      let listSuggest = elmtFactory('p', { class: "suggest", value: spanValue, onclick: "listFunction(this)"}, li );
      suggestId.appendChild(listSuggest);
      if( i === 29){
        break;
      }
      i++;
    }
    spanValue === "ingredients" ? span.parentNode.className = "col bg-primary col-lg-6" : "";
    spanValue === "appliance" ? span.parentNode.className = "col bg-success col-lg-6" : "";
    spanValue === "ustensils" ? span.parentNode.className = "col bg-danger col-lg-6" : "";
    console.log(spanValue)
    
    span.parentNode.hidden = false;
    // thisInput.style.width = "92.8%";
    span.setAttribute("data-value", "true")
    } else if (dataVal === "true") {
      suggestId.style.display = 'none'
      span.setAttribute("data-value", "false")
      spanValue === "ingredients" ? span.parentNode.className = "col col-sm-12 col-md-2 col-lg-2 bg-primary text-white" : "";
    spanValue === "appliance" ? span.parentNode.className = "col col-sm-12 col-md-2 col-lg-2 bg-success text-white" : "";
    spanValue === "ustensils" ? span.parentNode.className = "col col-sm-12 col-md-2 col-lg-2 bg-danger text-white" : "";

    }

    
    })
}

const arrayId = ['suggestsIngredients', 'suggestsAppliance', 'suggestsUstensils'];
for (let id of arrayId){
  document.getElementById(id).hidden = true;
  document.addEventListener('click', (e)=>{
    e.preventDefault();
    let word = id.slice(8).toLowerCase();
    let spanValue;
    console.log(document.getElementById(id).parentNode.childNodes[1].nextElementSibling)

    if(e.target.parentNode && e.target.parentNode.previousElementSibling ){
        spanValue = e.target.parentNode.previousElementSibling.getAttribute('id');
        if( e.target !== document.getElementById(id) && word !== spanValue ){
          document.getElementById(id).innerHTML = "";
          document.getElementById(id).hidden = true;
          document.getElementById(id).style.visibility = 'hidden';
          id.toLowerCase().includes('ingredients') ? document.getElementById(id).parentNode.className = "col col-sm-12 col-md-2 col-lg-2 bg-primary text-white" : "";
          id.toLowerCase().includes('appliance') ? document.getElementById(id).parentNode.className = "col col-sm-12 col-md-2 col-lg-2 bg-success text-white" : "";
          id.toLowerCase().includes('ustensils') ? document.getElementById(id).parentNode.className = "col col-sm-12 col-md-2 col-lg-2 bg-danger text-white" : "";
          document.getElementById(id).parentNode.childNodes[1].nextElementSibling.setAttribute("data-value", "false");
        }else{
          document.getElementById(id).hidden = false;
          document.getElementById(id).style.visibility = 'visible';

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
  document.getElementById(valuElmt).parentNode.className = "col col-sm-12 col-md-2 col-lg-2 bg-primary text-white";  
  document.getElementById(valuElmt).parentNode.lastElementChild.style.display = 'none';
  document.getElementById(valuElmt).parentNode.childNodes[1].nextElementSibling.setAttribute('data-value', 'false');
  
  // push into respective arrray to have selected
  if( valuElmt === 'ingredients' ){
    objTags1.ingredients.push(text); 
    objTags1.ingredients = [...new Set(objTags1.ingredients)]; 
  } else if( valuElmt === 'appliance'){
    objTags1.appliances.push(text); 
    objTags1.appliances = [...new Set(objTags1.appliances)]; 
  } else if ( valuElmt === 'ustensils') {

    objTags1.ustensils.push(text); 
    objTags1.ustensils = [...new Set(objTags1.ustensils)]; 
  }
  showTags();
  if( updateRecipe.length === 0){
    sortArray( recipesArray, valuElmt, text );
    eval(suggestId).innerHTML = "";
  } else {
    sortArray(updateRecipe, valuElmt, text);
    eval(suggestId).innerHTML = "";
    suggestList(updateRecipe);
  }
  console.log(tagsArray);
  eval(suggestId).innerHTML = "";
  render();
}

function showTags(){
  tags.innerHTML = "";
  for ( let [key, item] of Object.entries(objTags1)){
    if (key === "general"){
      item.forEach( value => {
        tag = elmtFactory( 'div', { class: "tag bg-secondary text-white"},
        elmtFactory('p', { }, value),
        elmtFactory( 'i', { class: "bi bi-x-circle", onclick: "removeTag('"+value+"')"},)
        );
        tags.appendChild(tag);
      })
    }
    else if(key === "ingredients" ){
      item.forEach( value => {
        tag = elmtFactory( 'div', { class: "tag bg-primary text-white"},
        elmtFactory('p', { }, value),
        elmtFactory( 'i', { class: "bi bi-x-circle", onclick: "removeTag('"+value+"')"},)
        );
        tags.appendChild(tag);
      })
    } else if( key === "appliances"){
      item.forEach( value => {
            tag = elmtFactory( 'div', { class: "tag bg-success text-white"},
              elmtFactory('p', { }, value),
              elmtFactory( 'i', { class: "bi bi-x-circle", onclick: "removeTag('"+value+"')"},)
            );
            tags.appendChild(tag);
    })}else if( key === "ustensils"){
            item.forEach( value => {
            tag = elmtFactory( 'div', { class: "tag bg-danger text-white"},
              elmtFactory('p', { }, value),
              elmtFactory( 'i', { class: "bi bi-x-circle", onclick: "removeTag('"+value+"')"},)
            );
            tags.appendChild(tag);
    })} else if ( key === "general"){
            item.forEach( value => {
            tag = elmtFactory( 'div', { class: "tag bg-secondary text-white"},
              elmtFactory('p', { }, value),
              elmtFactory( 'i', { class: "bi bi-x-circle", onclick: "removeTag('"+value+"')"},));
              tags.appendChild(tag);
          })}
  }
  
}

// sort Array with first paramatre the array to sort 
function sortArray(array, valuElmt, text){
  articleRecipes.innerHTML = "";
  let cacheUpdate = [];
  array.forEach( elmt => {
    for ( let [key, value] of Object.entries(elmt)){
      if( key === valuElmt && typeof value === 'object'){
        for ( let item of value){
          if( typeof item === 'object' && item.ingredient.toLowerCase() === text.toLowerCase()){
            objTags1.ingredients.forEach( igrd => {
              if( item.ingredient.toLowerCase() === igrd.toLowerCase()){
                cacheUpdate.push(elmt);
              }
            })
          } else if (typeof item === 'string' && item.toLowerCase() === text.toLowerCase()){
            objTags1.ustensils.forEach( ustl => {
              if( item.toLowerCase() === ustl.toLowerCase()){
                cacheUpdate.push(elmt);
              }
                })
              }
            }
          } else if ( key === valuElmt && typeof value === 'string' && value.toLowerCase() === text.toLowerCase() ){
            objTags1.appliances.forEach( apl => {
              if( apl.toLowerCase() === apl.toLowerCase()){
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
  let cache = {};
  let research = inputSearch[0].value;
  research = research[0].toUpperCase() + research.slice(1);
  objTags1.general.push(research)
  objTags1.general = [...new Set(objTags1.general)];

  showTags();

if (updateRecipe.length === 0 ) {

  recipesArray.forEach( elmt => {
    elmt.ingredients.forEach( item => {
      if ( item.ingredient.toLowerCase().includes(research.toLowerCase())){
        updateRecipe.push(elmt)
        suggestArrayList.push(item.ingredient);
      }
    });
    elmt.ustensils.forEach( item => {
      if(item.toLowerCase().includes(research.toLowerCase())){
      updateRecipe.push(elmt);
      suggestArrayList.push(item);
      }
      });
      if(elmt.appliance.toLowerCase().includes(research.toLowerCase())){
        updateRecipe.push(elmt);
        suggestArrayList.push(elmt.appliance);
      }
      if(elmt.name.toLowerCase().includes(research.toLowerCase())){
        updateRecipe.push(elmt);
        suggestArrayList.push(elmt.name);
      }
      if(elmt.description.toLowerCase().includes(research.toLowerCase())){
        updateRecipe.push(elmt);
        suggestArrayList.push(elmt.description);
      }
  });
} else {
  let cacheUpdate = [];
  updateRecipe.forEach( elmt => {
    elmt.ingredients.forEach( item => {
      if ( item.ingredient.toLowerCase().includes(research.toLowerCase())){
        cacheUpdate.push(elmt)
        suggestArrayList.push(item.ingredient);
      }
    });
    elmt.ustensils.forEach( item => {
      if(item.toLowerCase().includes(research.toLowerCase())){
      cacheUpdate.push(elmt);
      suggestArrayList.push(item);
      }
      });
      if(elmt.appliance.toLowerCase().includes(research.toLowerCase())){
        cacheUpdate.push(elmt);
        suggestArrayList.push(elmt.appliance);
      }
      if(elmt.name.toLowerCase().includes(research.toLowerCase())){
        cacheUpdate.push(elmt);
        suggestArrayList.push(elmt.name);
      }
      if(elmt.description.toLowerCase().includes(research.toLowerCase())){
        cacheUpdate.push(elmt);
        suggestArrayList.push(elmt.description);
      }
    })
  updateRecipe = [...cacheUpdate];
}

  suggestArrayList = [...new Set(suggestArrayList)]
  updateRecipe = updateRecipe.filter( elmt => {
    return cache[elmt.id]? 0 : cache[elmt.id]=1;
  });
  render();
}


// to update after delete a tag
function removeTag(element) {
  articleRecipes.innerHTML = "";
  let cache = {};
  console.log(tagsArray)
  tags.innerHTML = "";
  let cacheRecipe = [];

  let indexIngr = objTags1.ingredients.indexOf(element);
  let indexApp = objTags1.appliances.indexOf(element);
  let indexUstl = objTags1.ustensils.indexOf(element);
  let indexGen = objTags1.general.indexOf(element);

  if( objTags1.ingredients.length > 0 || objTags1.appliances.length > 0 || objTags1.ustensils.length > 0 || objTags1.general.length > 0){
    indexIngr > -1 ? objTags1.ingredients.splice(indexIngr, 1, ) : "" ;
    indexApp > -1 ? objTags1.appliances.splice(indexApp, 1, ) : "";
    indexUstl > -1 ? objTags1.ustensils.splice(indexUstl, 1, ) : "";
    indexGen > -1 ? objTags1.general.splice(indexGen, 1, ) : "";

    showTags();

  for( let [key, value] of Object.entries(objTags1) ){
    key === "appliances" ? key = "appliance" : "";
    Object.entries(value).forEach( ([index,elmt]) => {
      sortArray(recipesArray, key, elmt);
    })
  }
}

 if( objTags1.ingredients.length === 0 && objTags1.appliances.length === 0 && objTags1.ustensils.length === 0 && objTags1.general.length === 0 ){
    updateRecipe = [];
    initData();
  } else {
    render()
   }

 
}



// ************** other way to search **************//

// if (updateRecipe.length === 0 ) {
//   for( let [index, elmt] of Object.entries(recipesArray)){
//     for( let [item, value] of Object.entries(elmt) ){
//       if( typeof value === 'object'){
//           for( item of value) {
//             if(typeof item === "string" ){
//               itemToLowerCase = item.toLowerCase();
//               brutItem = item;
//             } else {
//               itemToLowerCase = item.ingredient.toLowerCase();
//               brutItem = item.ingredient;
//             };
//             if(itemToLowerCase.includes(research.toLowerCase())){
//                   updateRecipe.push(elmt);
//                   suggestArrayList.push(brutItem);
//                   suggestArrayList = [...new Set(suggestArrayList)];
//             }
//           } 
//         } else if ( typeof value === 'string' && value.toLowerCase().includes(research.toLowerCase())){
//           updateRecipe.push(elmt);
//           suggestArrayList.push(value);
//           suggestArrayList = [...new Set(suggestArrayList)];
//         } else if ( inputId === null ){
//             if( isNaN(value) ){
//               for( item of value) {
//                 if( typeof value === 'string' && value.toLowerCase().includes(research.toLowerCase()) ){
//                   updateRecipe.push(elmt);
//                   suggestArrayList.push(value);
//                   suggestArrayList = [...new Set(suggestArrayList)];
//                 } else if (typeof value === 'object' && typeof item === 'string' && item.toLowerCase().includes(research.toLowerCase())){
//                   updateRecipe.push(elmt);
//                   suggestArrayList.push(value);
//                   suggestArrayList = [...new Set(suggestArrayList)];
//                 } else if( typeof value === 'object' && typeof item === 'object' && item.ingredient.toLowerCase().includes(research.toLowerCase())){
//                   updateRecipe.push(elmt);
//                   suggestArrayList.push(value);
//                   suggestArrayList = [...new Set(suggestArrayList)];
//                 }
//               }
//             }
//           }
//     }
      
        
//   }
//   } else {
//     let cacheUpdate = [];
//     for( let [index, elmt] of Object.entries(updateRecipe)){
//       for( let [item, value] of Object.entries(elmt) ){
//         if( typeof value === 'object'){
//             for( item of value) {
//               if(typeof item === "string" ){
//                 itemToLowerCase = item.toLowerCase();
//                 brutItem = item;
//               } else {
//                 itemToLowerCase = item.ingredient.toLowerCase();
//                 brutItem = item.ingredient;
//               };
//               if(itemToLowerCase.includes(research.toLowerCase())){
//                     cacheUpdate.push(elmt);
//                     suggestArrayList.push(brutItem);
//                     suggestArrayList = [...new Set(suggestArrayList)];
//               }
//             } 
//           } else if ( typeof value === 'string' && value.toLowerCase().includes(research.toLowerCase())){
//             cacheUpdate.push(elmt);
//             suggestArrayList.push(value);
//             suggestArrayList = [...new Set(suggestArrayList)];
//           } else if ( inputId === null ){
//               if( isNaN(value) ){
//                 for( item of value) {
//                   if( typeof value === 'string' && value.toLowerCase().includes(research.toLowerCase()) ){
//                     cacheUpdate.push(elmt);
//                     suggestArrayList.push(value);
//                     suggestArrayList = [...new Set(suggestArrayList)];
//                   } else if (typeof value === 'object' && typeof item === 'string' && item.toLowerCase().includes(research.toLowerCase())){
//                     cacheUpdate.push(elmt);
//                     suggestArrayList.push(value);
//                     suggestArrayList = [...new Set(suggestArrayList)];
//                   } else if( typeof value === 'object' && typeof item === 'object' && item.ingredient.toLowerCase().includes(research.toLowerCase())){
//                     cacheUpdate.push(elmt);
//                     suggestArrayList.push(value);
//                     suggestArrayList = [...new Set(suggestArrayList)];
//                   }
//                 }
//               }
//             }
//       }
        
//     }
//     updateRecipe = [...cacheUpdate];
//   }