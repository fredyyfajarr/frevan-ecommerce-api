```text
___________                                       _____ __________.___ 
\_   _____/______   _______  _______    ____     /  _  \\______   \   |
 |    __) \_  __ \_/ __ \  \/ /\__  \  /    \   /  /_\  \|     ___/   |
 |     \   |  | \/\  ___/\   /  / __ \|   |  \ /    |    \    |   |   |
 \___  /   |__|    \___  >\_/  (____  /___|  / \____|__  /____|   |___|
     \/                \/           \/     \/          \/              
```

<div align="center">
  <p align="center">
    <a href="https://github.com/fredyyfajarr/frevan-ecommerce-api/issues">
      <img src="https://img.shields.io/github/issues/fredyyfajarr/frevan-ecommerce-api?style=for-the-badge&color=green" alt="Issues" />
    </a>
    <a href="https://github.com/fredyyfajarr/frevan-ecommerce-api/pulls">
      <img src="https://img.shields.io/github/issues-pr/fredyyfajarr/frevan-ecommerce-api?style=for-the-badge&color=green" alt="Pull Requests" />
    </a>
    <a href="https://github.com/fredyyfajarr/frevan-ecommerce-api/stargazers">
      <img src="https://img.shields.io/github/stars/fredyyfajarr/frevan-ecommerce-api?style=for-the-badge&color=green" alt="Stars" />
    </a>
  </p>
</div>

## Table of Contents
- [About The Project](#about-the-project)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Usage](#usage)
- [Contributing](#contributing)
- [License / Copyright](#license--copyright)

## About The Project

Frevan API is the robust backend engine powering the Frevan Ecommerce ecosystem. Built on Node.js and Express, this RESTful API handles everything from user authentication and profile management to complex product catalogs, cart aggregations, and secure order processing.

The architecture emphasizes security and performance, integrating MongoDB for flexible NoSQL data storage alongside cloud solutions like Cloudinary for image hosting. It also integrates a seamless payment gateway via Midtrans to handle real-world e-commerce transactions, ensuring a complete, end-to-end purchasing workflow.

## Key Features

- **Secure Authentication:** JWT-based user authentication and authorization flows with bcrypt password hashing.
- **Product & Catalog Management:** Fully featured CRUD endpoints to list, filter, and modify products.
- **Cart & Order Processing:** Secure cart management linked to user sessions and an order processing system.
- **Payment Gateway Integration:** Integrated with Midtrans for secure and reliable transaction handling.
- **Cloud Media Storage:** Direct image uploads processed via Multer and stored on Cloudinary.
- **Robust Security Middleware:** Utilizes Helmet, express-mongo-sanitize, and custom error handling middlewares to prevent common web vulnerabilities.

## Tech Stack

- **Runtime:** [Node.js](https://nodejs.org/)
- **Framework:** [Express.js](https://expressjs.com/)
- **Database:** [MongoDB](https://www.mongodb.com/) & [Mongoose](https://mongoosejs.com/)
- **Authentication:** `jsonwebtoken`, `bcryptjs`
- **File Uploads:** `multer`, `cloudinary`, `streamifier`
- **Payments:** [Midtrans Client](https://midtrans.com/)
- **Security:** `helmet`, `cors`, `express-mongo-sanitize`

## Project Structure

```text
frevan-ecommerce-api/
├── controllers/          # Business logic for handling incoming requests
│   ├── authController.js
│   ├── cartController.js
│   ├── orderController.js
│   └── productController.js
├── middlewares/          # Custom middlewares (Auth, Error Handling, Async Wrapper)
├── models/               # Mongoose schema definitions (User, Product, Cart, Order)
├── routes/               # Express route definitions linking to controllers
├── scripts/              # Utility scripts (e.g., Database seeding)
├── utils/                # Helper utilities (e.g., uploadFileHandler)
├── app.js                # Express app entry point & global configuration
└── package.json          # Project metadata and dependencies
```

## Getting Started

### Prerequisites
- Node.js (v18.x or later)
- MongoDB (local instance or MongoDB Atlas)
- Cloudinary Account
- Midtrans Account

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/fredyyfajarr/frevan-ecommerce-api.git
   ```
2. Navigate into the project directory:
   ```bash
   cd frevan-ecommerce-api
   ```
3. Install the dependencies:
   ```bash
   npm install
   ```
4. Set up your environment variables. Create a `.env` file in the root directory:
   ```env
   PORT=...
   DATABASE_URL=...
   JWT_SECRET=...
   CLOUDINARY_CLOUD_NAME=...
   CLOUDINARY_API_KEY=...
   CLOUDINARY_API_SECRET=...
   MIDTRANS_SERVER_KEY=...
   ```

## Usage

1. **Seeding the Database:** (Optional) If you want to populate your database with dummy data, run:
   ```bash
   npm run seed
   ```
2. **Starting the Development Server:**
   ```bash
   npm run dev
   ```
   The API will be available at `http://localhost:<PORT>`.
3. You can now connect your Frevan Frontend client to interact with the endpoints.

## Contributing

We encourage open-source contributions! Whether it's reporting bugs, suggesting features, or submitting PRs, your help is appreciated.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'feat: Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License / Copyright

Copyright &copy; 2026 Fredy Fajar Adi Putra. All Rights Reserved.
