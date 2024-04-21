const nodemailer = require("nodemailer");
const fs = require("fs");
const { query } = require("./database.js");
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;

const periyot = parseInt(process.env.PERIYOT);
const emailAdres = "ibrahimyahyaaydinli@gmail.com";

// const oauth2Client = new OAuth2(client_id, secret_id);

// oauth2Client.setCredentials({
//   refresh_token: refresh_token,
// });

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    type: "OAuth2",
    user: "nodeprojetbtu2024@gmail.com",
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.SECRET_ID,
    refreshToken: process.env.REFRESH_TOKEN,
    accessToken: process.env.ACCESS_TOKEN,
  },
});

async function haftalikOgrenciListesi() {
  const result = await query("SELECT * FROM ogrenci");
  const ogrenciler = result.rows;
  const jsonOgrenciler = JSON.stringify(ogrenciler);
  return jsonOgrenciler;
}

async function haftalikRapor() {
  const jsonOgrenciler = await haftalikOgrenciListesi();
  const dosyaAdı = `ogrenci-listesi-${Date.now()}.json`;
  fs.writeFileSync(dosyaAdı, jsonOgrenciler);

  const message = {
    from: "nodeprojetbtu2024@gmail.com",
    to: emailAdres,
    subject: `Haftalık Öğrenci Raporu `,
    text: "Haftalık öğrenci listesi ektedir.",
    attachments: [
      {
        filename: dosyaAdı,
        content: fs.readFileSync(dosyaAdı),
      },
    ],
  };

  try {
    await transporter.sendMail(message);
    console.log("Haftalık rapor başarıyla gönderildi!");
    fs.unlinkSync(dosyaAdı);
  } catch (error) {
    console.error("Haftalık raporu gönderirken hata oluştu:", error);
  }
}

setInterval(haftalikRapor, periyot * 1000 * 10);

module.exports = {
  haftalikRapor: haftalikRapor,
};
