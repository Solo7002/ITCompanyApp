using ITCompanyApp.Helpers;
using ITCompanyApp.Helpers.DBClasses;
using ITCompanyApp.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace ITCompanyApp.Controllers.Sign_Auth
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly DBContext _context;
        public AuthController(IConfiguration configuration,DBContext context)
        {
            _configuration = configuration;
            _context = context;
        }
        [HttpPost("login")]
        [AllowAnonymous]
        public IActionResult Login(UserLoginModel model)
        {
            
            User user=_context.Users.FirstOrDefault(u=>u.Login == model.Login);
            if(user != null) {
                if (BCrypt.Net.BCrypt.Verify(model.Password, user.Password))
                {
                    var token = GenerateJwtToken(model.Login);

                    return Ok(new { token });
                }
               
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
                User user = _context.Users.FirstOrDefault(u => u.Login == u.Login);
                if(user != null)
                {
                    return BadRequest("Login busy");
                }
                else
                {
                    string hashPassword = BCrypt.Net.BCrypt.HashPassword(userRegisterModel.Password, 10).ToString();
                    User newUser = new User
                    {
                        Login = userRegisterModel.Login,
                        Password = hashPassword,
                        AccessLevel = _context.AccessLevels.FirstOrDefault(a => a.AccessLevelName == userRegisterModel.RoleName),
                      
                    };
                    Employee employee = new Employee
                    {
                        BirthDate = DateTime.Now,
                        User = newUser,
                        Email = "arrt@gmail.com",
                        Salary = 2000,
                        HireDate = DateTime.Now,
                        LastName="Aaf",
                        FirstName="Afds",
                        PhoneNumber="2131234142",
                        PhotoFile="",


                    };
                    newUser.Employee=employee;

                    _context.Employees.Add(employee);
                    _context.Users.Add(newUser);
                    _context.SaveChanges();
                    return Ok("User registered successfully.");
                }
            }
        }

        private string GenerateJwtToken(string userName)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_configuration["Jwt:Key"]);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new Claim[]
                {
                new Claim(ClaimTypes.Name, userName) 
                }),
                Expires = DateTime.UtcNow.AddHours(2),//time live token
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };
            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }
    }
}
