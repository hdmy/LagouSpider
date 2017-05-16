var nodemailer = require("nodemailer");
var config = require('config-lite').email;

// 30号后再开
function warn(msg) {
  // 开启一个 SMTP 连接池
  var smtpTransport = nodemailer.createTransport("SMTP", {
    host: "smtp.qq.com", // 主机
    secureConnection: true, // 使用 SSL
    port: 465, // SMTP 端口
    auth: {
      user: config.user, // 账号
      pass: config.pass// 密码
    }
  });
  // 设置邮件内容
  var mailOptions = {
    from: "测试专用 <hd_mysky@qq.com>", // 发件地址
    to: "907180541@qq.com", // 收件列表
    subject: "An error has occurred in crawlers", // 标题
    html: `<h3>An error has occurred in crawlers:</h3><h4>${msg}</h4>` // html 内容
  }

  // 发送邮件
  smtpTransport.sendMail(mailOptions, function (error, response) {
    if (error) {
      console.log(error);
    } else {
      console.log("Message sent: " + response.message);
    }
    smtpTransport.close(); // 如果没用，关闭连接池
  });
}
