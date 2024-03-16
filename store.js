const products = [
    { name: 'product 1', price: 20, image: '/product/product.avif', intro: 'product description' },
    { name: 'product 2', price: 15, image: '/product/product.avif', intro: 'product description' },
    { name: 'product 3', price: 150, image: '/product/product.avif', intro: 'product dyescription' },
];

displayProducts();

function displayProducts() {
    const productListDiv = document.getElementById('product-list');
    productListDiv.innerHTML = '';

    products.forEach(product => {
        // replace product img later with ${product.name}
        const productCard = `
            <div class="col-lg-4 col-md-6 mb-4">
                <div class="card">
                    <img src="${product.image}" class="card-img-top" alt="product img ">
                    <div class="card-body">
                        <h5 class="card-title">${product.name}</h5>
                        <q>${product.intro}</q><br><hr>
                        <p class="card-text">Price: ${product.price}.<small>00</small>TND</p>
                        <button class="btn btn-primary" onclick="buyProduct('${product.name}', ${product.price})">Buy</button>
                    </div>
                </div>
            </div>
        `;
        productListDiv.innerHTML += productCard;
    });
}

function buyProduct(productName, price) {
    Swal.fire({
        title: 'Confirm Purchase',
        html: `You are about to buy ${productName} <br>for ${price}.<small>00</small> TND`,
        icon: 'info',
        showCancelButton: true,
        confirmButtonText: 'Yes!',
        confirmButtonColor: "#FED058",
        cancelButtonText: 'Cancel'
    }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire({
                title: 'Enter Your Phone Number',
                input: 'tel',
                inputPlaceholder: 'Phone Number',
                confirmButtonText: 'Next',
                confirmButtonColor: "#FC3882",
                showProgressBar: true,
                inputValidator: (value) => {
                    if (!value) {
                        return 'Please enter your phone number';
                    }
                    const phoneRegex = /^\d{8}$/;
                    if (!phoneRegex.test(value)) {
                        return 'Invalid phone number';
                    }
                }
            }).then((phoneResult) => {
                if (phoneResult.isConfirmed) {
                    const phone = phoneResult.value;
                    Swal.fire({
                        title: 'Enter Your Name',
                        input: 'text',
                        inputPlaceholder: 'Full Name',
                        confirmButtonText: 'Next',
                        confirmButtonColor: "#FC3882",
                        showProgressBar: true,
                        inputValidator: (value) => {
                            if (!value) {
                                return 'Please enter your name';
                            }
                            const nameRegex = /^[a-zA-Z\s]*$/;
                            if (!nameRegex.test(value)) {
                                return 'Invalid Name';
                            }
                        }
                    }).then((nameResult) => {
                        if (nameResult.isConfirmed) {
                            const name = nameResult.value;
                            const cityOptions = {
                                Tunis: "Tunis",
                                Sfax: "Sfax",
                                Sousse: "Sousse",
                                Kairouan: "Kairouan",
                                Bizerte: "Bizerte",
                                Gabes: "Gabes",
                                Ariana: "Ariana",
                                Gafsa: "Gafsa",
                                Monastir: "Monastir",
                                Manouba: "Manouba",
                                'Ben Arous': "Ben Arous",
                                Kasserine: "Kasserine",
                                Medenine: "Medenine",
                                Mahdia: "Mahdia",
                                Zaghouan: "Zaghouan",
                                Beja: "Beja",
                                Jendouba: "Jendouba",
                                Nabeul: "Nabeul",
                                Kebili: "Kebili",
                                Siliana: "Siliana",
                                Tataouine: "Tataouine",
                                Tozeur: "Tozeur",
                                Kef: "Kef",
                                Kasserine: "Kasserine"
                            };

                            Swal.fire({
                                title: 'Select Your City',
                                input: 'select',
                                inputOptions: cityOptions,
                                inputPlaceholder: 'Select your city',
                                text:'then buy',
                                confirmButtonText: 'Buy 💰',
                                confirmButtonColor: "#F4f499",
                                showCancelButton: false,
                                showProgressBar: true,
                                inputValidator: (value) => {
                                    if (!value) {
                                        return 'Please select your city';
                                    }
                                }
                            }).then((locationResult) => {
                                if (locationResult.isConfirmed) {
                                    const location = locationResult.value;
                                    submitPurchaseToGoogleSheets(productName, price, phone, name, location);
                                }
                            });
                        }
                    });
                }
            });
        }
    });
}


function submitPurchaseToGoogleSheets(productName, price, phone, name, location) {

    Swal.fire({
       title: 'Sending...',
       titleColor:'red',
       text: 'Please wait while your purchase is being processed.',
       icon: 'info',
       allowOutsideClick: false,
       showConfirmButton: false,
       willOpen: () => {
           Swal.showLoading();
       }
   });
   const scriptUrl = 'https://script.google.com/macros/s/AKfycbzmoqbZ5ziKRxXWofBJkBj6eJJKxJjT5a6BKGcxIsPOVBfbHf-uAe0bGz1wpmdKTZtv/exec';

   const payload = {
       productName: productName,
       price: price,
       phone: phone,
       name: name,
       location: location
   };

   const formData = new FormData();
   for (const key in payload) {
       formData.append(key, payload[key]);
   }

   const xhr = new XMLHttpRequest();
   xhr.open('POST', scriptUrl);
   xhr.onload = function () {
       if (xhr.status === 200) {
           Swal.fire({
           title: 'Demand Reached',
           text: "Your purchase was successful. we'll contact you soon",
           imageUrl: '/img/logo.jpg',
           imageAlt: 'Custom Success Icon',
           confirmButtonText: 'Yeyy 🥳',
           confirmButtonColor: "dark-pink",
           icon: null
       });
       } else {
           Swal.fire({
               title: 'Error!',
               text: 'An error occurred while processing your purchase. Please try again later.',
               icon: 'error'
           });
       }
   };
   xhr.onerror = function () {
       Swal.fire({
           title: 'Error!',
           text: 'An error occurred while processing your purchase. Please try again later.',
           icon: 'error'
       });
   };
   xhr.send(formData);
}
