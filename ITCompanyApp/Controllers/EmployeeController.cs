using ITCompanyApp.Helpers.DBClasses;
using ITCompanyApp.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ITCompanyApp.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EmployeeController : Controller
    {
        private DBContext _context;
        public EmployeeController(DBContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IEnumerable<Employee> GetEmployees()
        {
            return _context.Employees;
        }

        [HttpGet("{id}")]
        public ActionResult<Employee> GetEmployee(int id)
        {
            if (!_context.Employees.Any(e => e.Id == id))
            {
                return NotFound();
            }

            return _context.Employees.First(e => e.Id == id);
        }

        [HttpPost]
        public ActionResult<Employee> CreateEmployee(Employee employee)
        {
            if (employee == null)
            {
                return BadRequest();
            }

            _context.Employees.Add(employee);
            _context.SaveChanges();

            return RedirectToAction("GetEmployees");
        }

        [HttpPut("{id}")]
        public IActionResult UpdateEmployee(int id, Employee employee)
        {
            if (employee == null || id != employee.Id)
            {
                return BadRequest();
            }

            _context.Entry(employee).State = EntityState.Modified;
            _context.SaveChanges();

            return RedirectToAction("GetEmployees");
        }

        [HttpDelete("{id}")]
        public IActionResult DeleteEmployee(int id)
        {
            if (_context.Employees == null || !_context.Employees.Any(e => e.Id == id))
            {
                return NotFound();
            }
            Employee employee = _context.Employees.First(e => e.Id == id);

            _context.Employees.Remove(employee);
            _context.SaveChanges();

            return RedirectToAction("GetEmployees");
        }
    }   
}
