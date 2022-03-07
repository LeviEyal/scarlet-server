const req = {
  details: {
    CustomerFirstName: "sadwqd",
    CustomerLastName: "שדגשדג",
    EmailAddress: "asd@sdfasf.com",
    PhoneNumber: "123123123",
    IdNumber: "12134123",
    Comments: "wdqwedcqwcsa\ndas\ndsa\nd",
    SendMail: true,
  },
  Items: [
    {
      CatalogNumber: "1111",
      Quantity: 1,
    },
    {
      CatalogNumber: "3333",
      Quantity: 2,
    },
    {
      CatalogNumber: "6666",
      Quantity: 1,
    },
  ],
};

async function make_payment_request(payment_obj) {
  await fetch("http://scarlet-server.herokuapp.com/api/purchase", {
    method: "POST",
      body: payment_obj,
      headers: {
        'Content-Type': 'application/json',
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
  })
    .then(function (response) {
      if (response.ok) {
        console.log(1);
        return response.json();
      } else {
        console.log(0);
        return Promise.reject(response);
      }
    })
    .then(function (data) {
      console.log(data);
    });
}

make_payment_request(req);