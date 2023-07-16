/* <div class="card">
            <img src="product1.jpg" alt="Product 1">
            <h3>Product 1</h3>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut varius ex quis lacus commodo, id ullamcorper felis hendrerit.</p>
            <a href="#" class="btn">Buy Now</a>
        </div> */
const html = String.raw;
const createProduct = (
  productImage,
  productTitle,
  productDescription,
  productPrice
) => {
  const productCard = document.createElement("div");
  productCard.classList.add("card");
  productCard.innerHTML = html`
    <img src=" ${productImage}" />
    <h3>${productTitle}</h3>
    <p>${productDescription}</p>
    <p>price : ${productPrice}</p>
    <a href="#" class="btn">Buy Now</a>
  `;
  const allProduct = document.querySelector(".all-product");
  allProduct.append(productCard);
};

async function showMeals(query) {
  const res = await fetch(
    `https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(
      query
    )}`
  );
  const { meals } = await res.json();
  document.querySelector(".all-product").innerHTML = "";
  meals.forEach((meal) => {
    const mealPrice = meal.idMeal;
    const mealName = meal.strMeal;
    const mealDescription = meal.strInstructions;
    const mealImage = meal.strMealThumb;
    createProduct(mealImage, mealName, mealDescription, mealPrice);
  });
}

const mealSearchForm = document.querySelector("#mealSearchForm");
mealSearchForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const searchInput = document.querySelector("#search").value;
  document.querySelector("#search").value = "";
  // showMeals(searchInput);

  const categorySelection = document.querySelector("#selectCategory");

  const allProductCatRes = await fetch(
    "https://www.themealdb.com/api/json/v1/1/filter.php?c=" +
      categorySelection.value
  );

  const { meals } = await allProductCatRes.json();
  document.querySelector(".all-product").innerHTML = "";
  const filteredMeals = meals.filter((meal) =>
    meal.strMeal.toLowerCase().startsWith(searchInput.toLowerCase())
  );

  filteredMeals.forEach(async (meal) => {
    const mealDeatailsRes = await fetch(
      "https://www.themealdb.com/api/json/v1/1/lookup.php?i=" + meal.idMeal
    );
    const mealDeatails = await mealDeatailsRes.json();

    const description = mealDeatails.meals[0].strInstructions;
    createProduct(meal.strMealThumb, meal.strMeal, description, meal.idMeal);
  });
});

async function showAllCategoryOptions() {
  const res = await fetch(
    "http://www.themealdb.com/api/json/v1/1/categories.php"
  );

  const { categories } = await res.json();
  const categoriesName = [];
  categories.forEach((category) => {
    categoriesName.push(category.strCategory);
  });

  const selectTag = document.querySelector("#selectCategory");
  categoriesName.forEach((catName) => {
    const option = document.createElement("option");
    option.innerText = catName;
    option.setAttribute("value", catName);
    selectTag.append(option);
  });
}

showAllCategoryOptions();
