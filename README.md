# SST Random API with DynamoDB and RDS

## 🚀 Project Overview
This project is a **Serverless Stack (SST)** application built with **NestJS** and deployed to AWS. It features a REST API with endpoints for generating random numbers, logging data to **DynamoDB**, and storing additional data in **PostgreSQL (RDS)**.

---

## 📦 Features
- **Generate Random Numbers:** `GET /` returns data from DynamoDB.
- **Log Data to DynamoDB:** `POST /` stores data in DynamoDB.
- **Store Data in RDS (PostgreSQL):** `POST /data` stores custom data in RDS.
- **Serverless Architecture:** Deployed with SST and AWS Lambda.

---

## 🛠️ Technologies Used
- **Framework:** Serverless Stack (SST) with NestJS
- **Database:** AWS DynamoDB & Amazon RDS (PostgreSQL)
- **Cloud Provider:** AWS
- **Programming Language:** TypeScript (Node.js)

---

## ⚙️ Setup Instructions

### 1️⃣ Prerequisites
- **Node.js** (v16 or higher)
- **AWS CLI** configured
- **SST CLI** installed globally:
  ```bash
  npm install -g sst
  ```

### 2️⃣ Clone the Repository
```bash
git clone <repository-url>
cd sst-random-api
```

### 3️⃣ Install Dependencies
```bash
npm install
```

### 4️⃣ Deploy to AWS
```bash
npx sst deploy
```

After deployment, SST will output the API endpoint URL.

---

## 📡 API Endpoints

### 1️⃣ **GET /**  
**Description:** Fetch data from DynamoDB.

**Request:**
```bash
curl https://<api-endpoint>/
```

**Response:**
```json
{
  "userId": "123",
  "noteId": "note-1"
}
```

---

### 2️⃣ **POST /**  
**Description:** Log data to DynamoDB.

**Request:**
```bash
curl -X POST https://<api-endpoint>/ \
  -H "Content-Type: application/json" \
  -d '{"userId": "test-user", "noteId": "note-1"}'
```

**Response:**
```json
{
  "message": "Item created"
}
```

---

### 3️⃣ **POST /data**  
**Description:** Store custom data in RDS (PostgreSQL).

**Request:**
```bash
curl -X POST https://<api-endpoint>/data \
  -H "Content-Type: application/json" \
  -d '{"name": "Sample", "value": "Data"}'
```

**Response:**
```json
{
  "message": "Data stored in RDS successfully"
}
```

---

## 📊 Database Schema

### 🗂️ **DynamoDB (MyTable)**
- **Partition Key:** `userId` (string)
- **Sort Key:** `noteId` (string)

### 🗃️ **RDS (PostgreSQL)**
Table: `data`
- `id` (SERIAL PRIMARY KEY)
- `name` (VARCHAR)
- `value` (TEXT)

---

## ✅ Running Tests
The project includes unit tests using **Jest**.

### Run Tests
```bash
npx jest
```

---

## 🚀 Local Development
Run SST in local mode:
```bash
npx sst dev
```

---

## 🗑️ Remove Deployment
To remove the application from AWS:
```bash
npx sst remove
```

---

## 📜 Environment Variables
Ensure these variables are set during deployment (handled automatically by SST):

```env
TABLE_NAME=MyTable
RDS_HOST=<RDS-Endpoint>
RDS_PORT=5432
RDS_USER=postgres
RDS_PASSWORD=password
RDS_DB=randomdb
```

---

## 🚀 Deployment Details
- **Deployed via:** SST (Serverless Stack)
- **AWS Services Used:** Lambda, DynamoDB, RDS

---

## 👨‍💻 Contributing
1. Fork the repository
2. Create a new branch (`git checkout -b feature-branch`)
3. Commit your changes
4. Push to the branch (`git push origin feature-branch`)
5. Open a Pull Request

---

## 📞 Contact
For questions or support, reach out via [GitHub Issues](https://github.com/your-repo/issues).

---

## 📃 License
This project is licensed under the MIT License.

