class User {
  constructor() { }

  async login(user) {
    const result = await new Promise((resolve, reject) => {
      db.users.find({ email: user.email, pass: user.pass }, (err, data) => {
        resolve(data);
      });
    });

    return {
      status: result.length > 0,
      id: result.length > 0 ? result[0]._id : null
    }

  }

  register(user) {
    const data = {
      email: user.email,
      pass: user.pass,
      recoveryCode: Math.random().toString().substr(2, 6)
    }

    db.users.insert(data, function (err, doc) {
    });

    return { status: true }
  }

  addProduct(product) {
    db.products.insert(product, (err, doc) => {

    });

    return {
      status: true
    }
  }

  async deleteProduct(id) {
    // Delete image in firebase first (to save space)   

    db.products.remove({ _id: id }, {}, function (err, numRemoved) { });

    return {
      status: true
    }
  }

  updateProfile(profile, user) {
    db.users.find({ _id: user }, (err, data) => {
      const newProfile = profile;
      newProfile.email = data[0].email;
      newProfile.pass = data[0].pass;
      newProfile.recoveryCode = data[0].recoveryCode;

      db.users.update({ _id: user }, newProfile, {}, function (err, numReplaced) {
        // console.log(numReplaced);
      });
    })

    return {
      status: true
    }
  }

  async editProduct(data, user) {

    db.products.update({ _id: data.id }, {
      $set: {
        title: data.title, price: data.price, description: data.description, promotional: data.promotional, productCategory: data.productCategory
      }
    }, { multi: true }, function (err, numReplaced) {
      // console.log(numReplaced)
    });

    return {
      status: true
    }
  }

  async updateLocation(data, userId) {
    db.users.update({ _id: userId }, {
      $set: {
        userLocation: { lat: data.lat, long: data.long }
      }
    }, { multi: true }, function (err, numReplaced) {
      console.log(numReplaced);
    });

    return {
      status: true
    }
  }
}

module.exports = User;