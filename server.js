const express = require("express");
const cors = require("cors");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Hello World" });
});

const port = 8080;

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});

app.get("/users", async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    if (users.length === 0) {
      return res
        .status(400)
        .json({ ok: false, message: "Danh sách người dùng trống" });
    }
    return res.json({ ok: true, data: users });
  } catch (error) {
    res.status(500).json({
      ok: false,
      error: "Đã xảy ra lỗi!",
    });
  } finally {
    async () => await prisma.$disconnect();
  }
});

app.get("/users/:id", async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { user_id: Number(req.params.id) },
    });
    if (user) {
      return res.json({ ok: true, data: user });
    }
    return res
      .status(400)
      .json({ ok: false, message: "Tài khoản này không tồn tại" });
  } catch (error) {
    res.status(500).json({
      ok: false,
      error: "Đã xảy ra lỗi!",
    });
  } finally {
    async () => await prisma.$disconnect();
  }
});

app.post("/users", async (req, res) => {
  try {
    if (!req.body.name || !req.body.email) {
      return res
        .status(400)
        .json({ ok: false, message: "Vui lòng nhập dữ liệu" });
    }
    const user = await prisma.user.findUnique({
      where: { email: req.body.email },
    });
    if (user) {
      return res.status(400).json({ ok: false, message: "Email đã tồn tại" });
    } else {
      const userNew = await prisma.user.create({
        data: {
          name: req.body.name,
          email: req.body.email,
        },
      });
      return res.json({ ok: true, data: userNew });
    }
  } catch (error) {
    res.status(500).json({
      ok: false,
      error: "Đã xảy ra lỗi!",
    });
  } finally {
    async () => await prisma.$disconnect();
  }
});

app.put("/users/:id", async (req, res) => {
  try {
    if (!req.body.name) {
      return res
        .status(400)
        .json({ ok: false, message: "Vui lòng nhập dữ liệu" });
    }
    const user = await prisma.user.update({
      where: { user_id: Number(req.params.id) },
      data: {
        name: req.body.name,
      },
    });
    return res.json({ ok: true, data: user });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      error: "Đã xảy ra lỗi!",
    });
  } finally {
    async () => await prisma.$disconnect();
  }
});
app.delete("/users/:id", async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { user_id: Number(req.params.id) },
    });
    if (!user) {
      return res
        .status(400)
        .json({ ok: false, message: "Tài khoản này không tồn tại" });
    }
    const userDelete = await prisma.user.delete({
      where: { user_id: Number(req.params.id) },
    });
    return res.json({ ok: true, message: "Xóa thành công" });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      error: "Đã xảy ra lỗi!",
    });
  } finally {
    async () => await prisma.$disconnect();
  }
});
