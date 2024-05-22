using ITCompanyApp.Helpers;
using ITCompanyApp.Helpers.DBClasses;
using ITCompanyApp.Models;
using ITCompanyApp.Models.ViewModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ITCompanyApp.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class UserController : Controller
    {
        private DBContext _context;
        public UserController(DBContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IEnumerable<User> GetUsers()
        {
           return _context.Users;
        }

        [HttpGet("{id}")]
        public ActionResult<User> GetUser(int id)
        {
            if (!_context.Users.Any(u => u.Id == id))
            {
                return NotFound();
            }

            return _context.Users.First(u => u.Id == id);
        }

        [HttpPut("{id}")]
        public IActionResult UpdateUser(int id, UserViewModel model)
        {
            if (model == null || !ModelState.IsValid)
            {
                return BadRequest();
            }
            else if (!_context.Users.Any(u => u.Id == id))
            {
                return NotFound();
            }
            else if (!_context.AccessLevels.Any(al => al.AccessLevelId == model.AccessLevelId))
            {
                return NotFound();
            }

            string hashPassword = BCrypt.Net.BCrypt.HashPassword(model.Password, 10).ToString();

            User user = _context.Users.First(u => u.Id == id);
            user.Login = model.Login;
            user.Password = hashPassword;
            user.AccessLevel = _context.AccessLevels.First(al => al.AccessLevelId == model.AccessLevelId);

            _context.Entry(user).State = EntityState.Modified;
            _context.SaveChanges();

            return RedirectToAction("GetUsers");
        }

        [HttpDelete("{id}")]
        public IActionResult DeleteUser(int id)
        {
            if (_context.Users == null || !_context.Users.Any(u => u.Id == id))
            {
                return NotFound();
            }
            User user = _context.Users.First(u => u.Id == id);
            Employee employee = _context.Employees.First(e => e.Id == user.Id);
            _context.Users.Remove(user);
            _context.Employees.Remove(employee);
            _context.SaveChanges();

            return RedirectToAction("GetUsers");
        }
    }
}
