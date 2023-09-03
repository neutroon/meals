$(function () {

  const endSide_offset = $("nav .endSide").width() + 15;
  const navLinks = Array.from($("nav .startSide .links .link"));
  const [search, categories, area, ingredients, contactUs] = navLinks;

  const mainSection = $("#main .container");
  const byID = "https://themealdb.com/api/json/v1/1/lookup.php?i=";
  const byName = "https://www.themealdb.com/api/json/v1/1/search.php?s=";
  const byFirstLetter = "https://www.themealdb.com/api/json/v1/1/search.php?f=";
  const byArea = "https://www.themealdb.com/api/json/v1/1/filter.php?a=";
  const byCategories = "https://www.themealdb.com/api/json/v1/1/filter.php?c=";
  const byIngredient = "https://themealdb.com/api/json/v1/1/filter.php?i=";

  const filterByCategory = "https://www.themealdb.com/api/json/v1/1/categories.php";
  const filterByArea = "https://themealdb.com/api/json/v1/1/list.php?a=list";
  const filterByIngredient =
  "https://www.themealdb.com/api/json/v1/1/list.php?i=list";

  const nameRegex = /^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/;
  const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
  const phoneRegex = /^01[0125][0-9]{8}$/m;
  const ageRegex = /^(1[89]|[1-9]\d)$/m;
  const passRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/m;

  // navbar -----------------------------------------------------------------------------------------
  $("nav .endSide button").on("click", function () {
    let Links = $(".links .link");
    let navClosed = $(this).attr("data-closed");
    if (navClosed == "true") {
      $(this).attr("data-closed", "false");

      $(`nav .endSide button i`).fadeOut(500, function () {
        $(this).toggleClass("fa-bars fa-close").fadeIn(500);
      });
      $("nav").css("transform", `translateX(0)`);

      setTimeout(function () {
        for (let i = 0; i <= Array.from(Links).length; i++) {
          setTimeout(function () {
            $(Links).eq(i).css({ transform: "translateY(0px)" });
          }, i * 50);
        }
      }, 300);
    } else {
      for (let i = 0; i <= Array.from(Links).length; i++) {
        setTimeout(function () {
          $(Links).eq(i).css({ transform: "translateY(200px)" });
        }, i * 10);
      }

      $(`nav .endSide button i`).toggleClass("fa-bars fa-close");
      $("nav").css(
        "transform",
        `translateX(calc(-100% + ${endSide_offset}px))`
      );
      $(this).attr("data-closed", "true");
    }
  });

  function closeNav() {
    $(`nav .endSide button i`).toggleClass("fa-bars fa-close");

    $("nav").css("transform", `translateX(calc(-100% + ${endSide_offset}px))`);
    $("nav .endSide button").attr("data-closed", "true");
  }
  // navbar end -----------------------------------------------------------------------------------------


  // loodingFun -----------------------------------------------------------------------------------------
  function loodingStart(time = 500) {
    $("body").addClass("overflow-hidden");
    $("#loodingScreen").fadeIn(time);
  }
  function endLooding(time = 500) {
    $("#loodingScreen").fadeOut(time, function () {
      $("body").removeClass("overflow-hidden");
    });
  }
  function endInnLooding(time = 500) {
    $(" #spinner").fadeOut(time);
  }
  // loodingFun end -----------------------------------------------------------------------------------------

  // getData (main function)-----------------------------------------------------------------------------------------
  async function getData(url, param = "", looding = true) {
    // the looding param here will be false when this func called in search func becuase in search fun there is another different looding screen
    // it works with all api's (pass url as argu in Dispaly func & return json data)
    if (looding) {
      loodingStart();
    }
    let meals = await fetch(url + param);

    return (meals = await meals.json());
  }
  //  -----------------------------------------------------------------------------------------

  // Display func  -----------------------------------------------------------------------------------------
  showMeals(byName);
  async function showMeals(url, param, selector = mainSection, looding) {
    // it works with 5 api's bath to it 1 requried param url and other params are optional||||| Api's --> (byName)&(byFirstLetter)&(byCategories)&(byArea)&(byIngredient)
    const meals = await getData(url, param, looding);
    endLooding();

    let galleryDemo = "";
    if (meals.meals != null) {
      for (const meal of meals.meals) {
        galleryDemo += `        
                    <div class="col-md-4 col-lg-3">
                        <div role="button" class="meal rounded-4 shadow-lg position-relative overflow-hidden" data-mDetails="${meal.idMeal}">
                            <img class="w-100 rounded-4" src="${meal.strMealThumb}" alt="meal">
                            <div class="layer rounded-4 position-absolute start-0 end-0 top-0 bottom-0 bg-white bg-opacity-75 d-flex justify-content-center align-items-center">
                                <h2>${meal.strMeal}</h2>
                            </div>
                        </div>
                    </div>`;
      }
      $(selector).html(`

        <div class="row g-3">
            ${galleryDemo}
        </div>

        <div
        id="spinner"
        class="bg-black position-absolute start-0 end-0 top-0 bottom-0 w-100"
      >

      <div class='d-flex justify-content-center align-items-center h-100'>
      <i style="font-size: 5rem" class="fa-solid fa-yin-yang fa-spin fa-2xl text-white"></i>
      </div>
      </div>
        `);
    }

    $(".meal").on("click", function () {
      showMealDetails(byID, this.getAttribute("data-mDetails"));
    });

    endInnLooding();
  }

  async function showCategories(url, selector = mainSection) {
    closeNav();
    const categories = await getData(url);
    endLooding();

    let categorieDemo = "";
    if (categories != null) {
      for (const categorie of categories.categories) {
        categorieDemo += `        
                    <div class="col-md-4 col-lg-3">
                        <div role="button" class="meal rounded-4 shadow-lg position-relative overflow-hidden" CName=${
                          categorie.strCategory
                        }>
                            <img class="w-100 rounded-4" src="${
                              categorie.strCategoryThumb
                            }" alt='categorie'>
                            <div class="layer rounded-4 position-absolute start-0 end-0 top-0 bottom-0 bg-white bg-opacity-75 d-flex flex-column text-center p-2 justify-content-center overflow-hidden">
                                <h4>${categorie.strCategory}</h4>
                                <p class='fs-6'>${categorie.strCategoryDescription.slice(
                                  0,
                                  80
                                )}</p>
                            </div>
                        </div>
                    </div>`;
      }
      $(selector).html(`

        <div class="row g-2">
            ${categorieDemo}
        </div>

        <div
        id="spinner"
        class="bg-black position-absolute start-0 end-0 top-0 bottom-0 w-100"
      >

      <div class='d-flex justify-content-center align-items-center h-100'>
      <i style="font-size: 5rem" class="fa-solid fa-yin-yang fa-spin fa-2xl text-white"></i>
      </div>
      </div>
        `);

      $(".meal").on("click", function () {
        showMeals(byCategories, this.getAttribute("CName"));
      });
    }

    endInnLooding();
  }

  async function showArea() {
    closeNav();
    let areas = await getData(filterByArea);
    areas = areas.meals;
    endLooding();
    let areaDemo = "";
    for (const area of areas) {
      if (area.strArea != "Unknown") {
        areaDemo += `
    <div class="col-md-4 col-lg-3">
      <div role="button" class="area bg-white bg-opacity-25 rounded-3 p-3" data-area="${area.strArea}">
        <i class="fa-solid fa-house-flag fa-6x"></i>
        <h2>
          ${area.strArea}
        </h2>
      </div>
  </div>`;
      }
    }
    $(mainSection).html(
      `
        <div class="row text-white text-center g-4">
        ${areaDemo}
        </div>
        `
    );
    $(".area").on("click", function () {
      showMeals(byArea, this.getAttribute("data-area"));
    });
  }

  async function showMealDetails(url, param) {
    let details = await getData(url, param);
    endLooding();
    details = details.meals[0];
    let tagsDemo = "";
    let hideIfnoTags = "d-none";
    if (details.strTags) {
      let tags = Array.from(details.strTags.split(","));
      hideIfnoTags = "d-block";
      for (const tag of tags) {
        tagsDemo += `
        <li class="bg-danger-subtle  text-danger py-2 px-2 rounded-2">${[
          tag,
        ]}</li>
        `;
      }
    }

    const mealDetailsDemo = `        <div class="row text-white">
    <div class="col-md-5">
      <figure class="py-2 text-center">
        <img
          class="w-100 rounded-3"
          src="${details.strMealThumb}"
          alt="burger"
        />
        <figcaption class="py-2">
          <h2>${details.strMeal}</h2> 
        </figcaption>
      </figure>
    </div>
    <div class="col-md-7">
      <div class="mealDetails">
        <h3 class="py-2">Instruction</h3>
        <p class="py-2">${details.strInstructions}</p>
        <h3 class="py-2">
          Area: ${details.strArea}
        </h3>
        <h3 class="py-2">
          Category: ${details.strCategory} 
        </h3>
        <h3 class="py-2">
          Recipes:
        </h3>
        <div class="recipes py-2">
         <ul class="list-unstyled d-flex flex-wrap gap-3">
          <li class="bg-info-subtle  py-2 px-2  rounded-2 text-black">1kg Beef</li>
          <li class="bg-info-subtle  py-2 px-2  rounded-2 text-black">2 tbs Plain Flour</li>
          <li class="bg-info-subtle  py-2 px-2  rounded-2 text-black">2 tbs Rapeseed Oil</li>
        
         </ul>
        </div>
        <h3 class="py-2 ${hideIfnoTags}">Tags :</h3>
        <div class="tags py-2">
          <ul class="list-unstyled d-flex flex-wrap gap-2">
           ${tagsDemo}
           </ul>
  
        </div>
        <div class="links py-2">
          <a href="${details.strSource}" target="_blank" class="btn btn-success px-2 py-1">source</a>
          <a href="${details.strYoutube}" target="_blank" class="btn btn-danger  px-2 py-1">Youtube</a>
        </div>
  
      </div>
    </div>
  </div>`;
    $(mainSection).html(mealDetailsDemo);
  }

  async function showIngredient() {
    closeNav();
    let ingredients = await getData(filterByIngredient);
    ingredients = ingredients.meals;
    endLooding();
    let ingredientDemo = ``;
    for (let i = 0; i < 20; i++) {
      const ingredient = ingredients[i];
      ingredientDemo += `        <div class="col-md-4 col-lg-3">
        <div role="button" class="ingredient bg-white bg-opacity-25 rounded-3 p-3" data-ingred="${
          ingredient.strIngredient
        }">
          <i class="fa-solid fa-utensils fa-6x"></i>
          <h2>
            ${ingredient.strIngredient}
          </h2>
          <p>${ingredient.strDescription.slice(0, 80)}</p>
        </div>
    </div>`;
    }
    $(mainSection).html(`
    <div class="row text-white text-center g-4">
    ${ingredientDemo}
    </div>
    `);
    $(".ingredient").on("click", function () {
      showMeals(byIngredient, this.getAttribute("data-ingred"));
    });
  }

  function showSearch() {
    closeNav();
    const searchDemo = $(`
    <div id="search" class="py-5 position-relative z-1">
      <div class="row g-3">
        <div class="col-md-6">
          <div class="input">
            <input type="text" class="form-control p-2 bg-black text-white" placeholder="Search by name">
          </div>
          </div>
          <div class="col-md-6">
            <div class="input">
              <input type="text" class="form-control p-2 bg-black text-white" maxlength="1" placeholder="Search by first letter">
            </div>

          </div>
      </div>
    </div>
    <div class="result position-relative">
      
    </div>
    
    `);

    $(mainSection).html(searchDemo);

    $(".input input")
      .eq(0)
      .on("keyup", function () {
        showMeals(byName, this.value, ".result", false);
      });
    $(".input input")
      .eq(1)
      .on("keyup", function () {
        showMeals(byFirstLetter, this.value, ".result", false);
      });
  }

  function showContact() {
    closeNav();
    const contactDemo = $(`
    <div id='conatctSec' class="d-flex justify-content-center align-items-center vh-100">
    
    <div class="contact-info px-4 bg-body rounded-5 p-3 bg-opacity-50 shadow-lg">
    <div class="row">
        <div class="col-md-6">
            <div class="py-2 px-2">
                <input id="name" class="form-control py-2" placeholder="Your name" type="text">
                <div style="display:none" class="myAlert alert alert-danger mb-0 mt-1 p-1" role="alert">Special characters and numbers not allowed</div>
            </div>
        </div>
        <div class="col-md-6">
            <div class="py-2 px-2">
                <input id="email" class="form-control py-2" placeholder="Your email" type="text">
                <div style="display:none" class="myAlert alert alert-danger mb-0 mt-1 p-1" role="alert">Email not valid *exemple@yyy.zzz</div>
            </div>
        </div>
        <div class="col-md-6">
            <div class="py-2 px-2">
                <input id="phone" class="form-control py-2" placeholder="Your phone" type="text">
                <div style="display:none" class="myAlert alert alert-danger mb-0 mt-1 p-1" role="alert">Enter valid Egyptian Phone Number</div>
            </div>
        </div>
        <div class="col-md-6">
            <div class="py-2 px-2">
                <input id="age" class="form-control py-2" placeholder="Your age" type="number">
                <div style="display:none" class="myAlert alert alert-danger mb-0 mt-1 p-1" role="alert">Enter valid age between 10 & 99</div>
            </div>
        </div>
        <div class="col-md-6">
            <div class="py-2 px-2">
                <input id="pass" class="form-control py-2" placeholder="Your password" type="password">
                <div style="display:none" class="myAlert alert alert-danger mb-0 mt-1 p-1" role="alert">Minimum eight characters, at least two letters one of them is captalized and one number</div>
            </div>
        </div>
        <div class="col-md-6">
            <div class="py-2 px-2">
                <input id="rePass" class="form-control py-2" placeholder="Repassword" type="password">
                <div style="display:none" class="myAlert alert alert-danger mb-0 mt-1 p-1" role="alert">Passwords doesn't match</div>
            </div>
        </div>
        <div class="col-md-12">
            <div class="pt-4 text-center px-2">
    <button disabled='true' class="btn btn-outline-light">Submit</button>
            </div>
        </div>
    
    </div>
    </div>
    </div>
    `);
    $(mainSection).fadeOut(10).html(contactDemo).fadeIn(1000);

    $("#name").on("keyup", function () {
      validation(this, nameRegex);
    });
    $("#email").on("keyup", function () {
      validation(this, emailRegex);
    });
    $("#phone").on("keyup", function () {
      validation(this, phoneRegex);
    });
    $("#age").on("keyup", function () {
      validation(this, ageRegex);
    });
    $("#pass").on("keyup", function () {
      validation(this, passRegex);
      rePassValidation();
    });
    $("#rePass").on("keyup", function () {
      rePassValidation();
    });
  }
  // -----------------------------------------------------------------------------------------

  // validation ----------------------------------------------------------------------------------
  function validation(ele, regEx) {
    if (regEx.test(ele.value)) {
      $(ele).removeClass("is-invalid");
      $(ele).addClass("is-valid");
      $(ele).siblings(".myAlert").fadeOut(300);
    } else {
      $(ele).removeClass("is-valid");
      $(ele).addClass("is-invalid");

      $(ele).siblings(".myAlert").fadeIn(300);
    }
    disBtn();
  }

  function disBtn() {
    if (
      nameRegex.test($("#name").val()) &&
      emailRegex.test($("#email").val()) &&
      phoneRegex.test($("#phone").val()) &&
      ageRegex.test($("#age").val()) &&
      passRegex.test($("#pass").val()) &&
      passRegex.test($("#rePass").val())
    ) {
      $("#conatctSec button").removeAttr("disabled");
    } else {
      $("#conatctSec button").attr("disabled", "disabled");
    }
  }

  function rePassValidation() {
    const passVal = $("#pass").val();
    const rePassVal = $("#rePass").val();
    if (passVal == rePassVal) {
      $("#rePass").removeClass("is-invalid");
      $("#rePass").addClass("is-valid");
      $("#rePass").siblings(".myAlert").fadeOut(300);
    } else {
      $("#rePass").removeClass("is-valid");
      $("#rePass").addClass("is-invalid");
      $("#rePass").siblings(".myAlert").fadeIn(300);
    }
  }
  // -----------------------------------------------------------------------------------------

  // events  -----------------------------------------------------------------------------------------

  $(contactUs).on("click", function () {
    showContact();
  });

  $(search).on("click", function () {
    showSearch();
  });

  $(categories).on("click", function () {
    showCategories(filterByCategory);
  });

  $(area).on("click", function () {
    showArea();
  });
  $(ingredients).on("click", function () {
    showIngredient();
  });
});