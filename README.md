# 🏨 Hotel Booking API

API RESTful para gerenciamento de reservas de hotéis. Permite cadastro de usuários, hotéis, quartos, reservas, cancelamentos e envio de e-mails de confirmação.

---

## 🚀 Tecnologias

- Node.js + Fastify  
- Prisma ORM  
- PostgreSQL  
- Cloudinary (upload de imagens)  
- Mailtrap (simulação de envio de e-mails)

---

## 📦 Funcionalidades

👤 Usuários
- Cadastro e login (com JWT)
- Atualização de perfil

🏨 Hotéis e Quartos
- Cadastro de hotéis com imagens
- Adição de quartos (tipo, preço, capacidade)
- Upload de imagens via Cloudinary

📅 Reservas
- Verificação de disponibilidade por data
- Criação de reserva
- Cancelamento com validação de política (ex: 24h antes)
- Envio de e-mail de confirmação

---

🛠 Instalação

bash
git clone https://github.com/seu-usuario/travel-booking-api.git
cd travel-booking-api
npm install


Configuração do .env

```env
DATABASE_URL=postgresql://user:password@localhost:5432/dbname
JWT_SECRET=suachavesecreta
CLOUDINARY_CLOUD_NAME=seu-cloud-name
CLOUDINARY_API_KEY=sua-api-key
CLOUDINARY_API_SECRET=sua-api-secret
MAILTRAP_HOST=smtp.mailtrap.io # Hotel-Booking-API
