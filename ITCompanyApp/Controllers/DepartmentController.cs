using ITCompanyApp.Helpers.DBClasses;
using ITCompanyApp.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

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

        [HttpPost]
        public ActionResult<Department> PostDepartment(Department department)
        {
            _context.Departments.Add(department);
            _context.SaveChanges();

            return RedirectToAction("Get");
        }

        [HttpPut("{id}")]
        public IActionResult PutDepartment(int id, Department department)
        {
            if (id != department.DepartmentId)
            {
                return BadRequest();
            }

            _context.Entry(department).State = EntityState.Modified;
            _context.SaveChanges();

            return RedirectToAction("Get");
        }

        [HttpDelete("{id}")]
        public IActionResult DeleteDepartment(int id)
        {
            if (_context.Departments == null)
            {
                return NotFound();
            }
            Department department = _context.Departments.FirstOrDefault(d => d.DepartmentId == id);
            if (department == null)
            {
                return NotFound();
            }

            _context.Departments.Remove(department);
            _context.SaveChanges();

            return RedirectToAction("Get");
        }
    }
}
