using ITCompanyApp.Helpers.DBClasses;
using ITCompanyApp.Models;
using ITCompanyApp.Models.AuthModels;
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
            try
            {
                User user = _context.Users.First(u => u.Login == model.Login);
                if (BCrypt.Net.BCrypt.Verify(model.Password, user.Password))
                {
                    var token = GenerateJwtToken(user.Login,user.Id);

                    return Ok(new { token });
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

        private string GenerateJwtToken(string userName,int id)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var jwtkey = _configuration["Jwt:Key"];
            var key = jwtkey != null? Encoding.ASCII.GetBytes(jwtkey) : null;
            
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new Claim[]
                {
                new Claim(ClaimTypes.Name, userName), 
                new Claim(ClaimTypes.NameIdentifier, id.ToString()),
                }),
                Expires = DateTime.UtcNow.AddHours(2),//time live token
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };
            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }
    }
}
