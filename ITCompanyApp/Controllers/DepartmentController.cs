using ITCompanyApp.Helpers.DBClasses;
using ITCompanyApp.Models;
using Microsoft.AspNetCore.Mvc;

namespace ITCompanyApp.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class DepartmentController : Controller
    {
        private DBContext _context;
        public DepartmentController(DBContext context)
        {
            _context = context;
        }
        [HttpGet]
        public IEnumerable<Department> Get()
        {
            return _context.Departments;
        }
        [HttpGet("{id}")]
        public Department Get(int id)
        {
            return _context.Departments.FirstOrDefault(d => d.DepartmentId == id);
        }
    }
}
