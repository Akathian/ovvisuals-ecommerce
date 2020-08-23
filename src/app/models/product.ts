import { ThrowStmt } from '@angular/compiler';

export class Product {
    id: number;
    name: string;
    type: string;
    description: string;
    price: number;
    imageUrl: string;

    constructor(id: number, name: string, type: string, description: string, price: number, imageUrl: string) {
        this.id = id
        this.name = name
        this.type = type
        this.description = description
        this.price = price
        this.imageUrl = imageUrl
    }
}
