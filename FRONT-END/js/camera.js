class Camera {
    constructor({
        name,
        imageUrl,
        price,
        _id,
        description,
        lenses,
        quantity
    }) {
        this.name = name;
        this.imageUrl = imageUrl;
        this.price = price;
        this.id = _id;
        this.description = description;
        this.lenses = lenses;
        this.quantity = parseInt(quantity, 10); // transforme chaine de caractère en nombre
    }
};