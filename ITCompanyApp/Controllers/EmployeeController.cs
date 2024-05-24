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

        [HttpPut("{id}")]
        public IActionResult UpdateEmployee(int id, EmployeeViewModel model)
        {
            if (model == null || !ModelState.IsValid)
            {
                return BadRequest("ModelState");
            }
            else if (!_context.Employees.Any(e => e.Id == id))
            {
                return NotFound();
            }
            else if (!_context.Departments.Any(d => d.DepartmentId == model.DepartmentId))
            {
                return BadRequest("No departments with such id");
            }
            else if (!_context.Jobs.Any(j => j.JobId == model.JobId))
            {
                return BadRequest("No jobs with such id");
            }

            Employee employee = _context.Employees.First(e => e.Id == id);
            employee.LastName = model.LastName;
            employee.FirstName = model.FirstName;
            employee.BirthDate = model.BirthDate;
            employee.PhoneNumber = model.PhoneNumber;
            employee.Email = model.Email;
            employee.HireDate = DateTime.Now;
            employee.PhotoFile = model.PhotoFile;
            employee.Salary = model.Salary;
            employee.Department = _context.Departments.First(d => d.DepartmentId == model.DepartmentId);
            employee.Job = _context.Jobs.First(j => j.JobId == model.JobId);

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
            User user = _context.Users.First(u => u.Id == employee.Id);

            _context.Employees.Remove(employee);
            _context.Users.Remove(user);
            _context.SaveChanges();

            return RedirectToAction("GetEmployees");
        }
        [HttpPost]
        [Route("fire/{id}")]
        public IActionResult FireEmployee(int id)
        {
            if (_context.Employees == null || !_context.Employees.Any(e => e.Id == id))
            {
                return NotFound();
            }
            Employee employee = _context.Employees.First(e => e.Id == id);
            employee.FireDate = DateTime.Now;
            _context.Entry(employee).State = EntityState.Modified;
            _context.SaveChanges();
            return RedirectToAction("GetEmployees");
        }
        [HttpPost]
        [Route("appoint/{id}")]
       public IActionResult AppointEmployee(int id)
        {
            if (_context.Employees == null || !_context.Employees.Any(e => e.Id == id))
            {
                return NotFound();
            }
            Employee employee = _context.Employees.First(e => e.Id == id);
            employee.FireDate = null;
            _context.Entry(employee).State = EntityState.Modified;
            _context.SaveChanges();
            return RedirectToAction("GetEmployees");
        }


    }   
}
