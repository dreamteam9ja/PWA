async function getMenuitems() {
  try {
    const response = await fetch(
      `https://prog8110-adaf3-default-rtdb.firebaseio.com/meals.json`
    );

    const data = await response.json();

    const menuItems = Object.keys(data).map((key) => ({
      id: key,
      ...data[key],
    }));

    return menuItems;
  } catch (err) {
    console.log(err);
  }
}

const menuContainer = document.querySelector(".menu-lister");

const renderMenuItems = async () => {
  const menuItems = await getMenuitems();

  menuItems.forEach(
    (
      {
        title,
        id,
        cost,
        date,
        featured_image,
        full_description,
        meta_description,
      },
      index
    ) => {
      menuContainer.innerHTML += `<div class="col-lg-4 col-md-6 special-grid drinks">
                        <div class="gallery-single fix">
                          <img
                            src="${featured_image}"
                            class="img-fluid"
                            alt="Image"
                          />
                          <div class="why-text">
                            <h4>${title}</h4>
                            <p>${meta_description}</p>
                            <h5>$${Number(cost).toFixed(2)}</h5>
                          </div>
                        </div>
                        <form>
                           <button id="btn_${index}" disabled class="paypal_button" data-cost="${cost}">
                              Order now
                              </button>
                           </form>
                      </div>`;
    }
  );

  const onApprove = (data, actions) => {
    // This function captures the funds from the transaction.
    return actions.order.capture().then(function (details) {
      // This is where you would save the order to firebase and pouchdb
      console.log(details);
      alert("thank-you for your payment");
    });
  };

  $(document).ready(() => {
    const aPaypalButtons = $(".paypal_button");
    console.log(aPaypalButtons);
    for (let n = 0; n < aPaypalButtons.length; n++) {
      let sCost = $(aPaypalButtons[n]).attr("data-cost");
      $(aPaypalButtons[n]).replaceWith(
        `<div id="${aPaypalButtons[n].id}"></div>`
      );

      paypal_sdk
        .Buttons({
          onApprove: onApprove,
          createOrder: function (data, actions) {
            // This function sets up the details of the transaction, including the amount and line item details.
            return actions.order.create({
              purchase_units: [
                {
                  amount: {
                    value: sCost,
                  },
                },
              ],
            });
          },
        })
        .render(`#${aPaypalButtons[n].id}`);
    }
  });
};

$(document).ready(() => {
  renderMenuItems();
});
