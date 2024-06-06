using ITCompanyApp.Helpers.DBClasses;
using ITCompanyApp.Models;
using ITCompanyApp.Models.AuthModels;
using MailKit.Security;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using MimeKit.Text;
using MimeKit;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using static Org.BouncyCastle.Math.EC.ECCurve;
using MailKit.Net.Smtp;
using Microsoft.EntityFrameworkCore;

namespace ITCompanyApp.Controllers.Sign_Auth
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly DBContext _context;

        public AuthController(IConfiguration configuration, DBContext context)
        {
            _configuration = configuration;
            _context = context;
        }

        [HttpPost("login")]
        [AllowAnonymous]
        public IActionResult Login(UserLoginModel model)
        {
            try
            {
                User user = _context.Users.First(u => u.Login == model.Login);
                if (user != null)
                {
                    Employee employee = _context.Employees.First(e => e.Id == user.Id);
                    if (employee != null)
                    {

                        if (!employee.FireDate.HasValue)
                        {
                            if (BCrypt.Net.BCrypt.Verify(model.Password, user.Password))
                            {
                                string accessLevel = _context.AccessLevels.First(a => a.AccessLevelId == user.AccessLevelId).AccessLevelName;
                                var token = GenerateJwtToken(user, accessLevel);

                                return Ok(new { token });
                            }
                        }
                    }
                }
                
            }
            catch (Exception ex)
            {
                return BadRequest(ex);
            }
            return BadRequest();
        }

        [HttpPost("register")]
        [AllowAnonymous]
        public IActionResult Register(UserRegisterModel userRegisterModel) {
            if (!ModelState.IsValid)
            {
                return BadRequest();
            }
            else
            {
                if (_context.Users.Any(u => u.Login == userRegisterModel.Login))
                {
                    return BadRequest($"Such login already exists");
                }
                else if (!_context.AccessLevels.Any(al => al.AccessLevelName == userRegisterModel.RoleName))
                {
                    return BadRequest($"No roles with such name");
                }
                else if (!_context.Departments.Any(d => d.DepartmentName == userRegisterModel.DepartmentName))
                {
                    return BadRequest($"No departments with such name");
                }
                else if (!_context.Jobs.Any(j => j.JobName == userRegisterModel.JobName))
                {
                    return BadRequest($"No jobs wth siuch name");
                }

                string hashPassword = BCrypt.Net.BCrypt.HashPassword(userRegisterModel.Password, 10).ToString();
                User newUser = new User
                {
                    Login = userRegisterModel.Login,
                    Password = hashPassword,
                    AccessLevel = _context.AccessLevels.First(a => a.AccessLevelName == userRegisterModel.RoleName),
                };
                
                Employee employee = new Employee
                {
                    BirthDate = userRegisterModel.BirthDate,
                    User = newUser,
                    Email = userRegisterModel.Email,
                    Salary = userRegisterModel.Salary,
                    HireDate = DateTime.Now,
                    FireDate = null,
                    LastName = userRegisterModel.LastName,
                    FirstName = userRegisterModel.FirstName,
                    PhoneNumber = userRegisterModel.PhoneNumber,
                    PhotoFile = userRegisterModel.PhotoFile,
                    Department = _context.Departments.First(d => d.DepartmentName == userRegisterModel.DepartmentName),
                    Job = _context.Jobs.First(j => j.JobName == userRegisterModel.JobName),
                };
                newUser.Employee = employee;

                _context.Employees.Add(employee);
                _context.Users.Add(newUser);
                _context.SaveChanges();
                return Ok("User registered successfully.");
            }
        }

        private string GenerateJwtToken(User user,string accessLevels)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var jwtkey = _configuration["Jwt:Key"];
            var key = jwtkey != null? Encoding.ASCII.GetBytes(jwtkey) : null;

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new Claim[]
                {
                    new Claim(ClaimTypes.Name, user.Login),
                    new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                    new Claim(ClaimTypes.Actor, accessLevels)
                }),
                Expires = DateTime.UtcNow.Add(TimeSpan.FromHours(2)),//time live token,
                NotBefore = DateTime.UtcNow,
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };
            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }

        [HttpPost("sendConfirmationEmail")]
        [AllowAnonymous]
        public IActionResult SendConfirmToEmail(EmailConfirmModel model)
        {
            if (model.Email == null || !_context.Employees.Any(e => e.Email == model.Email))
            {
                return BadRequest();
            }

            if (!TempCodesStaticClass._temp_codes.Keys.Any(k => k == model.Email)) 
            {
                TempCodesStaticClass._temp_codes.Add(model.Email, new Random().Next(100000, 999999));
            }

            string htmlContent = $@"
            <!DOCTYPE html>
            <html lang='ru'>
            <head>
                <meta charset='UTF-8'>
                <meta name='viewport' content='width=device-width, initial-scale=1.0'>
                <title>Відновлення пароля</title>
            </head>
            <body style='font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0;'>
                <div style='max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);'>
                    <div style='background-color: #4CAF50; padding: 20px; text-align: center; color: white;'>
                        <h1 style='margin: 0;'>Відновлення пароля</h1>
                    </div>
                    <div style='padding: 20px; text-align: center; padding-bottom: 0px;'>
                        <p style='font-size: 16px; line-height: 1.5; color: #333333;'> Ви запросили відновлення пароля. Будь ласка, використовуйте наступний код для скидання вашого пароля: </p>
                        <div style='font-size: 24px; font-weight: bold; margin: 20px 0; padding: 10px; background-     color: #f0f0f0; display: inline-block; border-radius: 5px; letter-spacing: 10px;'><h2>{TempCodesStaticClass._temp_codes[model.Email] }</h2></div>
                        <p style='font-size: 16px; line-height: 1.5; color: #333333;'>Якщо ви не запитували відновлення пароля, просто проігноруйте цей лист.</p>
                    </div>
                    <div style='padding: 20px; text-align: center; color: #777777; padding-top: 5px;'>
                        <h4>Дякуємо, що користуєтеся нашим додатком!</h4>
                        <h4><a href='http://localhost:3000/login' style='color: #4CAF50; text-decoration: none;'>Назад до авторизації</a></h4>
                    </div>
                </div>
            </body>
            </html> ";

            var email = new MimeMessage();
            email.From.Add(MailboxAddress.Parse(_configuration.GetSection("EmailUsername").Value));
            email.To.Add(MailboxAddress.Parse(model.Email));
            email.Subject = "Password recovering";
            email.Body = new TextPart(TextFormat.Html) { Text = htmlContent };

            using var smtp = new SmtpClient();
            smtp.Connect(_configuration.GetSection("EmailHost").Value, 587, SecureSocketOptions.StartTls);
            smtp.Authenticate(_configuration.GetSection("EmailUsername").Value, _configuration.GetSection("EmailPassword").Value);
            smtp.Send(email);
            smtp.Disconnect(true);

            return Ok();
        }

        [HttpPost("ConfirmEmailByCode")]
        [AllowAnonymous]
        public IActionResult ConfirmEmailByCode(EmailConfirmModel model)
        {
            if (model.ConfirmationCode != TempCodesStaticClass._temp_codes[model.Email].ToString())
            {
                return BadRequest();
            }

            TempCodesStaticClass._temp_codes.Remove(model.Email);
            return Ok();
        }

        [HttpPost("setPassword")]
        [AllowAnonymous]
        public IActionResult setPassword(EmailConfirmModel model)
        {
            if (model.Email == null || !_context.Employees.Any(e => e.Email == model.Email) || model.NewPassword == null)
            {
                return BadRequest();
            }

            string hashPassword = BCrypt.Net.BCrypt.HashPassword(model.NewPassword, 10).ToString();
            
            Employee employee = _context.Employees.First(e => e.Email == model.Email);
            User user = _context.Users.First(u => u.Id == employee.Id);

            user.Password = hashPassword;
            _context.Entry(user).State = EntityState.Modified;
            _context.SaveChanges();

            return Ok();
        }
    }
}
