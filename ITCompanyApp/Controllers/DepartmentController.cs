using ITCompanyApp.Helpers.DBClasses;
using ITCompanyApp.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ITCompanyApp.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DepartmentController : Controller
    {
        private DBContext _context;
        public DepartmentController(DBContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IEnumerable<Department> GetDepartments()
        {
            return _context.Departments;
        }
        
        [HttpGet("{id}")]
        public ActionResult<Department> GetDepartment(int id)
        {
            if (!_context.Departments.Any(d => d.DepartmentId == id))
            {
                return NotFound();
            }

            return _context.Departments.First(d => d.DepartmentId == id);
        }

        [HttpPost]
        public ActionResult<Department> CreateDepartment(Department department)
        {
            if (department == null)
            {
                return BadRequest();
            }
            _context.Departments.Add(department);
            _context.SaveChanges();

            return RedirectToAction("GetDepartments");
        }

        [HttpPut("{id}")]
        public IActionResult UpdateDepartment(int id, Department department)
        {
            if (department == null || id != department.DepartmentId)
            {
                return BadRequest();
            }

            _context.Entry(department).State = EntityState.Modified;
            _context.SaveChanges();

            return RedirectToAction("GetDepartments");
        }

        [HttpDelete("{id}")]
        public IActionResult DeleteDepartment(int id)
        {
            if (_context.Departments == null || !_context.Departments.Any(al => al.DepartmentId == id))
            {
                return NotFound();
            }
            Department department = _context.Departments.First(d => d.DepartmentId == id);

            _context.Departments.Remove(department);
            _context.SaveChanges();

            return RedirectToAction("GetDepartments");
        }
    }
}
