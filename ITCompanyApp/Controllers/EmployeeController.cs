using ITCompanyApp.Helpers.DBClasses;
using ITCompanyApp.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ITCompanyApp.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class EmployeeController : Controller
    {
        private DBContext _context;
        public EmployeeController(DBContext context)
        {
            _context = context;
        }
        [HttpGet]
        public IEnumerable<Employee> Get()
        {
            return _context.Employees;
        }
        [HttpGet("{id}")]
        public Employee Get(int id)
        {
            return _context.Employees.FirstOrDefault(e => e.Id == id);
        }
    }
    
}
