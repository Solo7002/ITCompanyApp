using ITCompanyApp.Helpers.DBClasses;
using ITCompanyApp.Models;
using Microsoft.AspNetCore.Mvc;

namespace ITCompanyApp.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class UserController : Controller
    {
        private DBContext _context;
        public UserController(DBContext context)
        {
            _context = context;
        }
        [HttpGet]
        public IEnumerable<User> Get()
        {
           return _context.Users;
        }
        [HttpGet("{id}")]
        public User Get(int id)
        {
            return _context.Users.FirstOrDefault(u=>u.Id==id);
        }
       
    }
}
