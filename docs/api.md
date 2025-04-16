# Fashion AI API Documentation

## Base URL
```
http://localhost:3001/api
```

## Authentication
All authenticated endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

## Endpoints

### Products

#### Get All Products
```
GET /products
```
Query Parameters:
- category (optional): Filter by category (women, men, accessories)
- page (optional): Page number (default: 1)
- limit (optional): Items per page (default: 10)
- sort (optional): Sort field (price, name, createdAt)
- order (optional): Sort order (asc, desc)

Response:
```json
{
  "products": [
    {
      "id": "string",
      "name": "string",
      "price": "number",
      "image": "string",
      "category": "string",
      "sizes": ["string"],
      "description": "string",
      "color": "string",
      "brand": "string"
    }
  ],
  "total": "number",
  "page": "number",
  "limit": "number"
}
```

#### Get Product by ID
```
GET /products/:id
```

Response:
```json
{
  "id": "string",
  "name": "string",
  "price": "number",
  "image": "string",
  "category": "string",
  "sizes": ["string"],
  "description": "string",
  "color": "string",
  "brand": "string"
}
```

### Categories

#### Get All Categories
```
GET /categories
```

Response:
```json
[
  {
    "id": "string",
    "name": "string",
    "description": "string",
    "image": "string"
  }
]
```

### Users

#### Register
```
POST /users/register
```

Request Body:
```json
{
  "email": "string",
  "password": "string",
  "name": "string"
}
```

Response:
```json
{
  "id": "string",
  "email": "string",
  "name": "string",
  "token": "string"
}
```

#### Login
```
POST /users/login
```

Request Body:
```json
{
  "email": "string",
  "password": "string"
}
```

Response:
```json
{
  "id": "string",
  "email": "string",
  "name": "string",
  "token": "string"
}
```

### Cart

#### Get Cart
```
GET /cart
```

Response:
```json
{
  "items": [
    {
      "productId": "string",
      "quantity": "number",
      "size": "string"
    }
  ],
  "total": "number"
}
```

#### Add to Cart
```
POST /cart
```

Request Body:
```json
{
  "productId": "string",
  "quantity": "number",
  "size": "string"
}
```

Response:
```json
{
  "items": [
    {
      "productId": "string",
      "quantity": "number",
      "size": "string"
    }
  ],
  "total": "number"
}
```

#### Update Cart Item
```
PUT /cart/:productId
```

Request Body:
```json
{
  "quantity": "number",
  "size": "string"
}
```

Response:
```json
{
  "items": [
    {
      "productId": "string",
      "quantity": "number",
      "size": "string"
    }
  ],
  "total": "number"
}
```

#### Remove from Cart
```
DELETE /cart/:productId
```

Response:
```json
{
  "items": [
    {
      "productId": "string",
      "quantity": "number",
      "size": "string"
    }
  ],
  "total": "number"
}
``` 