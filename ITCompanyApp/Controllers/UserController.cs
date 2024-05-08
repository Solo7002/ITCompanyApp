using ITCompanyApp.Helpers.DBClasses;
using ITCompanyApp.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ITCompanyApp.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
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

        [HttpPost]
        public ActionResult<User> CreateUser(User user)
        {
            if (user == null)
            {
                return BadRequest();
            }

            _context.Users.Add(user);
            _context.SaveChanges();

            return RedirectToAction("GetUsers");
        }

        [HttpPut("{id}")]
        public IActionResult UpdateUser(int id, User user)
        {
            if (user == null || id != user.Id)
            {
                return BadRequest();
            }

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

            _context.Users.Remove(user);
            _context.SaveChanges();

            return RedirectToAction("GetUsers");
        }
    }
}
